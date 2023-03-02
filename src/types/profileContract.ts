import { Contract, ethers, Signer } from 'ethers';
import { Attestation, Authorizer } from 'src/redux/slices/contracts';
import { Provider } from '@ethersproject/abstract-provider'
import { arrayify, hexValue, hexZeroPad, keccak256, toUtf8Bytes } from 'ethers/lib/utils.js';
import Profile from 'src/contracts/Profile.json';
import AuthorizerContract from 'src/contracts/Authorizer.json';


function bitwiseXor(bytesA: Uint8Array, bytesB : Uint8Array): Uint8Array {
  const bytesXor: Uint8Array = new Uint8Array(bytesA.length);

  for (let i=0; i<bytesA.length;i++) {
    bytesXor[i] = bytesA[i] ^ bytesB[i]
  }

  return bytesXor;
}

function calculateHash(attestations: Attestation[]): string {
  // define a string the same length as a hash, that
  // only contains the value 0 at every byte.
  // TODO: I'm not entirely sure why we need 66 bytes.. the hex string ends up being 66 chars??
  // const zero = toUtf8String(new Uint8Array(66).fill(0));
  const zero = new Uint8Array(32).fill(0);

  const finalHash: Uint8Array = attestations.reduce((hash: Uint8Array, attestation: Attestation) : Uint8Array => {
    if (attestation.deleted) {
      // in the case of a deletion, we can continue recreating the hash
      // if the contract put the current hash at this point as the message.
      return toUtf8Bytes(attestation.message); // TODO what is the encoding like for contract strings??
    } else {
      const bytes = toUtf8Bytes(attestation.message);
      console.log('hashing bytes', bytes.length, bytes);
      const hashedBytes = arrayify(keccak256(bytes));
      console.log('hashed bytes', keccak256(bytes), hashedBytes)
      hash = bitwiseXor(hash, hashedBytes);
      console.log('hashi', hash.length, hash);
      return hash;
    }
  }, zero);

  return hexZeroPad(hexValue(finalHash), 32);
}

export class ProfileContract {
  public address: string;
  public contract: Contract;

  constructor(address: string) {
    this.address = address;
    this.contract = new Contract(address, Profile.abi);
  }

  async addAuthorizer(signer: Signer, address: string): Promise<void> {
    this.contract.connect(signer).addAuthorizer(address);
  }

  async attest(signer: Signer, authorizer: string, message: string): Promise<void> {
    console.log('attesting:', authorizer, message);
    this.contract.connect(signer).attest(authorizer, message);
  }

  async getAllAuthorizers(signer: Provider): Promise<Authorizer[]> {
    const addresses = await this.contract.connect(signer).getAuthorizerList();
    console.log('authorizers:', addresses);
    return addresses.map((address: string) => {
      return {
        address,
        description: 'unknown authorizer',
      }
    });
  }

  async isValidMessages(provider: Provider, address: string, messages: Attestation[]): Promise<boolean> {
    const authorizerContract = new Contract(address, AuthorizerContract.abi).connect(provider);
    const contractHash = await authorizerContract.getLatestValidatedHash(this.contract.address)
    const hash = calculateHash(messages);
    console.log('hashes', hash, contractHash);
    if (hash == contractHash) {
      console.log('suspicious profile: hashes do not match up!')
    }
    return hash == contractHash;
  }



  async getAllAttestations(provider: Provider): Promise<Record<string, Attestation[]>> {
    //const id = await this.contract
    const connectedContract = this.contract.connect(provider);
    const authorizers = await connectedContract.getAuthorizerList();
    console.log('attestation authorizers:', authorizers);
    const attestations = await Promise.all(authorizers.map(async (address: string) => {
      const bigNumLength = await connectedContract.getAttestLength(address)
      const length: number = ethers.BigNumber.from(bigNumLength).toNumber();
      console.log('length:', length);
      const rawMessages: [string, string][] = await Promise.all(Array(length).fill(0).map(async (_, index)=>{
        return await connectedContract.getAttestation(address, index) as [string, string];
      }));
      console.log('messages', rawMessages);
      const messages: Attestation[] = rawMessages.map(([sender, message]: [string, string], index) => {
        let deleted = false;
      console.log('sender / contract addr', sender, this.contract.address);
        if (sender == this.contract.address) {
          deleted = true
        }
        return {
          id: index,
          message,
          senderAddress: sender,
          authorizerAddress: address,
          deleted,
        }
      })

      return [address, messages]
    }));
    console.log('attestations', attestations);

    const attestationRecords: Record<string, Attestation[]> = {}
    attestations.forEach(([address, messages]: [string, Attestation[]]) => {
      attestationRecords[address] = messages
    })
    return attestationRecords;
    // TODO this should work??
    // return attestations.reduce((record, [address, messages]) => {
    //   record[address] = messages
    // }, {});
  }
}
