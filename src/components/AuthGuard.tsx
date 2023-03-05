import { Paper, Stack, Typography } from '@mui/material';
import { Web3Button } from '@web3modal/react';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { useAccount } from 'wagmi';


// ----------------------------------------------------------------------

export function DynamicAuthGuard({children}: PropsWithChildren) {
  const {isConnected} = useAccount();


  return (
    <div suppressHydrationWarning>
      {isConnected?
       children
      :(
        <>
        <Paper sx={{
          width:'60%',
          height:'60%',
          position:'absolute',
          top:'50%',
          left:'50%',
          transform:'translate(-50%, -50%)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          flexDirection:'column',
          p:2,
        }}>
          <Stack alignItems='center' justifyContent='center' spacing={4} >
            <Typography variant='h2' align='center' sx={{mb:2}}>
              Connect Your Wallet to Abrey
            </Typography>
            <Web3Button />
          </Stack>
        </Paper>
        </>
       )}
    </div>
  )
}

const AuthGuard = dynamic(() => Promise.resolve(DynamicAuthGuard), {ssr: false});
export default AuthGuard
