import { Helmet } from 'react-helmet-async';
// @mui

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// components
import { ContractFactory } from 'ethers';
import { useEffect } from 'react';
import useUserProfileContract from 'src/hooks/useUserProfileContract';
import { addAuthorizerAddressToProfile, addWellKnownAuthorizer, newUserProfile } from 'src/redux/slices/contracts';
import { dispatch, useSelector } from 'src/redux/store';
import { useSigner } from 'wagmi';
import AuthGuard from '../components/AuthGuard';
import useAuthorizerContracts from '../hooks/useAuthorizerContracts';
import DashboardLayout from '../layouts/dashboard/DashboardLayout';
import { parseAnvilChainData } from '../utils/parseAnvilState';
// ----------------------------------------------------------------------
// have to require import of JSON files 
const Authorizer = require('../contracts/Authorizer.json');
const Profile = require('../contracts/Profile.json');

export default function DashboardAppPage() {
  const { data: signer, isError, isLoading, status, isIdle } = useSigner();
  const state = useSelector(state => state)
  console.log('signer status', signer, isError, isLoading, status, isIdle);
  const contract = useUserProfileContract();
  const authorizers = useAuthorizerContracts();
  const profile = useSelector((state) => state.contracts.userProfile);
  console.log(state, 'contract:', contract)

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
      dispatch(newUserProfile(instance.address));
      console.log('done.');
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
      dispatch(addAuthorizerAddressToProfile(instance.address));
      console.log('done.');
    } else {
      console.log('no signer/contract?', signer, contract);
    }
  };

  const addAttestation = async () => {
    console.log('attesting on contract...')
    if (signer && contract && profile && profile.authorizers.length > 0) {
        await contract.connect(signer).attest(profile.authorizers[0].address, "this is me, making a statement.")
      console.log('done.');
    } else {
      console.log('no signer/contract/authorizer??', signer,contract,authorizers);
    }
  };

  return (
    <>
      <AuthGuard>
        <DashboardLayout>
          <Helmet>
            <title> Arbery | Own your reputation. </title>
          </Helmet>

          <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 5 }}>
              Hi, Welcome to Arbey
            </Typography>


            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12}>
                <Paper>
                  <Stack alignItems="center">
                    {contract ?
                      profile && profile.authorizers.length > 0 ?
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
