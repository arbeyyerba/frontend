import { Contract } from 'ethers';
import { useMemo } from 'react';
import { RootState, useSelector } from 'src/redux/store';
import AuthorizerContract from 'src/contracts/Authorizer.json';
import { Authorizer } from 'src/redux/slices/contracts';


export default function useAuthorizerContracts() {
  const state = useSelector((state: RootState)=>state.contracts);
  const contract = useMemo(()=>{
    return state.wellKnownAuthorizers.map((authorizer: Authorizer)=>{
    return new Contract(authorizer.address, AuthorizerContract.abi);
    })
  }, [state.authorizerAddresses]);

  return contract;
}
