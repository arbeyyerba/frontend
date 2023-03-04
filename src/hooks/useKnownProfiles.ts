import { RootState, useSelector } from 'src/redux/store';


export default function useKnownProfiles() {
  return useSelector((state: RootState)=>state.contracts.knownProfiles);
}
