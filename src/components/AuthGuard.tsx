import { Button, Stack } from '@mui/material';
import { Web3Button } from '@web3modal/react';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { useAccount, useSwitchNetwork } from 'wagmi';


// ----------------------------------------------------------------------

export function DynamicAuthGuard({children}: PropsWithChildren) {
  const {isConnected} = useAccount();
  const { chains, switchNetwork } = useSwitchNetwork();

  console.log('chains?', chains)

  return (
    <div suppressHydrationWarning>
      {isConnected?
       children
      :(
        <>
          <Stack alignItems='center'>
          <Web3Button />
          {chains.map((x) => (
            <Button onClick={()=> switchNetwork?.(x.id)}>use {x.name}</Button>
          ))}
          </Stack>
        </>
       )}
    </div>
  )
}

const AuthGuard = dynamic(() => Promise.resolve(DynamicAuthGuard), {ssr: false});
export default AuthGuard
