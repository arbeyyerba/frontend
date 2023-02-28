import { Contract, ethers, Signer } from 'ethers';
import Profile from 'src/contracts/Profile.json';
import { Attestation, Authorizer } from 'src/redux/slices/contracts';
import { Provider } from '@ethersproject/abstract-provider'

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

  async getAllAttestations(provider: Provider): Promise<Attestation[]> {
    //const id = await this.contract
    const connectedContract = this.contract.connect(provider);
    const authorizers = await connectedContract.getAuthorizerList();
    console.log('authorizers:', authorizers);
    const attestations = await Promise.all(authorizers.map(async (address: string) => {
      const bigNumLength = await connectedContract.getAttestLength(address)
      const length: number = ethers.BigNumber.from(bigNumLength).toNumber();
      console.log('length:', length);
      const messages = await Promise.all(Array(length).fill(0).map(async (_, index)=>{
        return await connectedContract.getAttestation(address, index);
      }));
      console.log('messages', messages);
      return messages.map(message => {
        return {
          message: message.message,
          sender: message.sender,
          authorizerAddress: address
        }
      })
    }));
    console.log('attestations', attestations.flat());
    return attestations.flat();
  }
}
