import { Button } from '@mui/material';
import { Web3Button } from '@web3modal/react';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { useAccount } from 'wagmi';



// ----------------------------------------------------------------------

export function DynamicAuthGuard({children}: PropsWithChildren) {
  const {isConnected, address} = useAccount();

  return (
    <div suppressHydrationWarning>
      {isConnected?
       children
      :(
          <Web3Button />
       )}
    </div>
  )
}

const AuthGuard = dynamic(() => Promise.resolve(DynamicAuthGuard), {ssr: false});
export default AuthGuard
