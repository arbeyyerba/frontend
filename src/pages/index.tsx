import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Button } from '@mui/material';
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
import { dispatch } from 'src/redux/store';
import { addAuthorizerAddress, loadUserProfileContractAddress } from 'src/redux/slices/contracts';
import useUserProfileContract from 'src/hooks/useUserProfileContract';
import useAuthorizerContracts from 'src/hooks/useAuthorizerContracts';


// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const { data: signer, isError, isLoading, status, isIdle } = useSigner();
  console.log('signer status', signer, isError, isLoading, status, isIdle);
  const contract = useUserProfileContract();
  const authorizers = useAuthorizerContracts();

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
    if (signer && contract && authorizers.length > 0) {
        await contract.connect(signer).attest(authorizers[0].address, "this is me, making a statement.")
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

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly Sales" total={714000} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="New Users" total={1352831} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Item Orders" total={1723315} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Bug Reports" total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
      </AuthGuard>
    </>
  );
}
