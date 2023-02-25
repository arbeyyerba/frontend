import { useAccount } from 'wagmi';
import { PropsWithChildren } from 'react';
import { Button } from '@mui/material';
import { Web3Button } from '@web3modal/react';



// ----------------------------------------------------------------------

export default function AuthGuard({children}: PropsWithChildren) {
  const {isConnected, address} = useAccount();

  if (isConnected) {
    return <>{children}</>
  } else {
    return (
    <>
    <Web3Button />
    </>);
  }
}
