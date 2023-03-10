import { Contract, Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider'
const Lens = require('src/contracts/Lens.json');

export interface LensData {
  handle: string,
  avatar: string,
}

const lensAddress = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d';
const lensContract = new Contract(lensAddress, Lens.abi);

export class LensContract {

  static async getLensData(provider: Provider, address: string): Promise<LensData | undefined> {
    const connectedLensContract = lensContract.connect(provider);
    const profileId = await connectedLensContract.defaultProfile(address);
    console.log('profileId', profileId);
    try {
      if (profileId) {
        const [handle, uri] = await Promise.all([
          connectedLensContract.getHandle(profileId),
          connectedLensContract.tokenURI(profileId),
        ]);
        console.log('metadata');
        let json;
        if (uri.startsWith('data:application/json;base64,')) {
          const jsonBlob = atob(uri.substring(29));
          console.log('json', jsonBlob);
          json = JSON.parse(jsonBlob);
        }

        return {
          handle: json.name || handle,
          avatar: json.image,
        };
      } else {
        return undefined;
      }
    } catch (e) {
      console.log('error looking up lens error', e)
      return undefined;
    }
  }

  static async followOnLens(signer: Signer, address: string): Promise<void> {
    const connectedLensContract = lensContract.connect(signer);
    const profileId = await connectedLensContract.defaultProfile(address);
    if (profileId) {
      await connectedLensContract.follow([profileId], [[]]);
    } else {
      return undefined;
    }
  }

  // static async shareOnLens(signer: Signer, message: string): Promise<void> {
  //   // const connectedLensContract = lensContract.connect(signer);
  //   // const profileId = await connectedLensContract.defaultProfile(address);
  //   // if (profileId) {
  //   //   // wtf does 'post' take
  //   //   //await connectedLensContract.post(message);
  //   // } else {
  //   //   return undefined;
  //   // }
  // }
}
