import { Helmet } from 'react-helmet-async';
// @mui

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// components
import { useEffect } from 'react';
import useUserProfileContract from 'src/hooks/useUserProfileContract';
import {  loadUserProfileData} from 'src/redux/slices/contracts';
import { dispatch, useSelector } from 'src/redux/store';
import { useNetwork, useProvider, useSigner } from 'wagmi';
import AuthGuard from 'src/components/AuthGuard';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import { useRouter } from 'next/router';
import AuthorizersList from 'src/sections/@dashboard/authorizers/AuthorizerList';
import { ProfileHeader } from 'src/sections/@dashboard/profile/ProfileHeader';
import { MakePost } from 'src/sections/@dashboard/profile/MakePost';
import { PostList } from 'src/sections/@dashboard/profile/PostList';

// ----------------------------------------------------------------------
// have to require import of JSON files 

export default function ProfilePage() {
  console.log('ProfilePage')
  const { data: signer, isError, isLoading, status, isIdle } = useSigner();
  const provider = useProvider();
  console.log('signer status', signer, isError, isLoading, status, isIdle);
  const profileContract = useUserProfileContract();
  const contract = profileContract?.contract;
  const profile = useSelector((state) => state.contracts.userProfile);
  const router = useRouter();
  const chainId = router.query.chainId;
  const contractAddress = router.query.contractAddress as string;

  useEffect(() => {
  if (chainId && contractAddress && provider) {
      dispatch(loadUserProfileData(contractAddress, chainId, provider));
    }
  }, [chainId, contractAddress, provider]);

 

  const refreshChainData = async () => {
    if (contract) {
      dispatch(loadUserProfileData(contract.address, chainId, provider));
    }
  }

  return (
    <>
      <AuthGuard>
        <DashboardLayout>
          <Helmet>
            <title> Abrey | Own your reputation. </title>
          </Helmet>
      <ProfileHeader />

          <Container maxWidth="xl">
            {profile && profile.authorizers.length === 0 ? (
              <AuthorizersList />
            ) : (
              <>
                <MakePost />
              <Grid item xs={12} sm={12} md={12}>
                <PostList />
              </Grid>
              </>
            )}
            <AuthorizersList />
          </Container>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
}
