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
import { addAuthorizerAddressToProfile, loadUserProfileData} from 'src/redux/slices/contracts';
import { dispatch, useSelector } from 'src/redux/store';
import { useProvider, useSigner } from 'wagmi';
import AuthGuard from '../components/AuthGuard';
import useAuthorizerContracts from '../hooks/useAuthorizerContracts';
import DashboardLayout from '../layouts/dashboard/DashboardLayout';
import { useCookies } from 'react-cookie';
import dbConnect from 'src/utils/dbUtils';
import { AuthorizerModel, ProfileModel } from 'src/utils/dbExports';
// ----------------------------------------------------------------------
// have to require import of JSON files 
const Authorizer = require('../contracts/Authorizer.json');
const Profile = require('../contracts/Profile.json');

export default function DashboardAppPage() {
  const { data: signer, isError, isLoading, status, isIdle } = useSigner();
  const provider = useProvider();
  console.log('signer status', signer, isError, isLoading, status, isIdle);
  const profileContract = useUserProfileContract();
  const contract = profileContract?.contract;
  const wellKnownAuthorizers = useAuthorizerContracts();
  const profile = useSelector((state) => state.contracts.userProfile);
  const [cookies, setCookie] = useCookies(['profile_address']);

  useEffect(() => {
    if (cookies['profile_address']) {
      dispatch(loadUserProfileData(cookies['profile_address'], provider));
    }
  }, [cookies]);



  const deployContract = async () => {
    console.log('deploying contract...')
    if (signer) {
      const contractFactory = new ContractFactory(Profile.abi, Profile.bytecode, signer);
      const instance = await contractFactory.connect(signer).deploy();
      console.log('instance', instance);
      await instance.deployTransaction.wait(1);
      setCookie('profile_address', instance.address);
      dispatch(loadUserProfileData(instance.address, provider));
      await dbConnect();
      await ProfileModel.create({address: instance.address});
      console.log('done.');
    } else {
      console.log('no signer??');
    }
  };

  const addAuthorizer = async () => {
    console.log('deploying dummy authorizer contract...')
    if (signer && contract) {
      const contractFactory = new ContractFactory(Authorizer.abi, Authorizer.bytecode, signer);
      const instance = await contractFactory.connect(signer).deploy();
      // TODO make the user click another button to 'add' the new authorizer..
      const txn = profileContract.addAuthorizer(signer, instance.address);
      await instance.deployTransaction.wait(1);
      console.log('txn', txn);
      dispatch(addAuthorizerAddressToProfile(instance.address));
      console.log('done.');
      await dbConnect();
      await AuthorizerModel.create({address: instance.address, 
        transaction: txn, name: 'dummy authorizer'});
    } else {
      console.log('no signer/contract?', signer, contract);
    }
  };

  const addAttestation = async () => {
    console.log('attesting on contract...')
    if (signer && contract && profile && profile.authorizers.length > 0) {
      await profileContract.attest(signer, profile.authorizers[0].address, "this is me, making a statement.")
      console.log('done.');
    } else {
      console.log('no signer/contract/authorizer??', signer,contract,wellKnownAuthorizers);
    }
  };

  const funcArray = [deployContract, addAuthorizer, addAttestation];


  const refreshChainData = async () => {
    if (contract) {
      dispatch(loadUserProfileData(contract.address, provider));
    }
  }

  return (
    <>
      <AuthGuard>
        <DashboardLayout>
          <Helmet>
            <title> Abrey | Own your reputation. </title>
          </Helmet>

          <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 5 }}>
              Hi, Welcome to Arbey
            </Typography>


            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12}>
                <Paper>
                  <Stack alignItems="center">

                    <Button onClick={deployContract} variant='outlined' sx={{m:1}}>
                      Deploy my Contract
                    </Button>
                    <Button onClick={refreshChainData} variant='outlined' sx={{m:1}}>
                      Refresh Data from Chain
                    </Button>
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
                    <></>
                    }
                  </Stack>

                </Paper>
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
                <Paper>
                    <Typography variant="h2">
                      Authorizers on your profile:
                    </Typography>
                  {profile && profile.authorizers.map((authorizer) => (<>
                    <Typography>
                      {authorizer.address} : {authorizer.description}
                    </Typography>
                </>))}
                </Paper>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Paper>
                    <Typography variant="h2">
                      Attestations on your profile:
                    </Typography>
                  {profile && profile.authorizers.map((authorizer) => (<>
                    <Typography variant="h3">
                      authorizer: {authorizer.address}
                    </Typography>
                  {profile && profile.attestations[authorizer.address].map((attestation) => (
                    <Typography>
                      message: {attestation.message}
                    </Typography>
                  ))}
                  </>))}
                </Paper>
              </Grid>

            </Grid>
          </Container>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
}
