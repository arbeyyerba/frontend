import { RootState, useSelector } from 'src/redux/store';


export default function useUserProfileContractState() {
  const contractState = useSelector((state: RootState)=>state.contracts);

  return contractState.userProfile;
}