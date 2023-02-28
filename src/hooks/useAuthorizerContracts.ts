import { Contract } from 'ethers';
import { useMemo } from 'react';
import { RootState, useSelector } from 'src/redux/store';
import AuthorizerContract from 'src/contracts/Authorizer.json';
import { Authorizer } from 'src/redux/slices/contracts';


export default function useAuthorizerContracts() {
  const authorizerState = useSelector((state: RootState)=>state.contracts);
  const contract = useMemo(()=>{
    return authorizerState.wellKnownAuthorizers.map((authorizer: Authorizer)=>{
    return new Contract(authorizer.address, AuthorizerContract.abi);
    })
  }, [authorizerState.wellKnownAuthorizers]);

  return contract;
}
