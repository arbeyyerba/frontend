import { Contract } from 'ethers';
import Profile from 'src/contracts/Profile.json';


export function getProfileContract(address: string) {
    return new Contract(address, Profile.abi);
}
