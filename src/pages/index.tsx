import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  // AppNewsUpdate,
  // AppOrderTimeline,
  // AppCurrentVisits,
  // AppWebsiteVisits,
  // AppTrafficBySite,
  AppWidgetSummary,
  // AppCurrentSubject,
  // AppConversionRates,
} from '../sections/@dashboard/app';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import AuthGuard from 'src/components/AuthGuard';
import useWalletAddress from 'src/hooks/useWallet';
import { ContractFactory, ethers } from 'ethers';
import { useSigner } from 'wagmi';
import Profile from '../contracts/Profile.json';
import Authorizer from '../contracts/Authorizer.json';
import { dispatch, useSelector } from 'src/redux/store';
import { addAuthorizerAddress, loadUserProfileContractAddress, addWellKnownAuthorizer } from 'src/redux/slices/contracts';
import useUserProfileContract from 'src/hooks/useUserProfileContract';
import useAuthorizerContracts from 'src/hooks/useAuthorizerContracts';
import { useEffect } from 'react'
import { parseAnvilChainData } from 'src/utils/parseAnvilState'



// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const { data: signer, isError, isLoading, status, isIdle } = useSigner();
  console.log('signer status', signer, isError, isLoading, status, isIdle);
  const contract = useUserProfileContract();
  const authorizers = useAuthorizerContracts();
  const profile = useSelector((state) => state.contracts.userProfile);

  useEffect(() => {
    const data = parseAnvilChainData();
    data.authorizers.forEach(authorizer => {
      dispatch(addWellKnownAuthorizer(authorizer));
    })
  }, [contract]);


  const deployContract = async () => {
    console.log('deploying contract...')
    if (signer) {
      const contractFactory = new ContractFactory(Profile.abi, Profile.bytecode, signer);
      const instance = await contractFactory.connect(signer).deploy();
      dispatch(loadUserProfileContractAddress(instance.address));
    } else {
      console.log('no signer??');
    }
  };

  const addAuthorizer = async () => {
    console.log('deploying dummy authorizer contract...')
    if (signer && contract) {
      const contractFactory = new ContractFactory(Authorizer.abi, Authorizer.bytecode, signer);
      const instance = await contractFactory.connect(signer).deploy(true);
      // TODO make the user click another button to 'add' the new authorizer..
      await contract.connect(signer).addAuthorizer(instance.address);
      dispatch(addAuthorizerAddress(instance.address));
    } else {
      console.log('no signer/contract?', signer, contract);
    }
  };

  const addAttestation = async () => {
    console.log('attesting on contract...')
    if (signer && contract && profile.authorizers.length > 0) {
        await contract.connect(signer).attest(profile.authorizers[0].address, "this is me, making a statement.")
    } else {
      console.log('no signer/contract/authorizer??', signer,contract,authorizers);
    }
  };

  return (
    <>
      <AuthGuard>
      <DashboardLayout>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>


        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <Paper>
              <Stack alignItems="center">
        {contract ?
           authorizers.length > 0 ?
        <Button onClick={addAttestation} variant='outlined' sx={{m:1}}>
          Make an attestation
        </Button>
                                :
        <Button onClick={addAuthorizer} variant='outlined' sx={{m:1}}>
          Deploy a new authorizer
        </Button>
         :
        <Button onClick={deployContract} variant='outlined' sx={{m:1}}>
          Deploy my Contract
        </Button>
        }
              </Stack>

            </Paper>

          </Grid>

        </Grid>
      </Container>
    </DashboardLayout>
      </AuthGuard>
    </>
  );
}
