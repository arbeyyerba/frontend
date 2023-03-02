import { Card, Container, Link, ThemeProvider, useTheme } from '@mui/material';
import { Box, Button, Popover, Stack, Step, StepButton, StepLabel, Stepper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

import authorizersMock from '../_mock/authorizers';
import { Helmet } from 'react-helmet-async';
// @mui
import { ContractFactory } from 'ethers';
import { useEffect } from 'react';
import useUserProfileContract from 'src/hooks/useUserProfileContract';
import contracts, { addAuthorizerAddressToProfile, loadUserProfileData} from 'src/redux/slices/contracts';
import { dispatch, useSelector } from 'src/redux/store';
import { useProvider, useSigner } from 'wagmi';
import AuthGuard from '../components/AuthGuard';
import useAuthorizerContracts from '../hooks/useAuthorizerContracts';
import { useCookies } from 'react-cookie';
import DashboardLayout from 'src/layouts/dashboard';
import { AuthorizerList } from 'src/sections/@dashboard/authorizers';
import NewProfile from 'src/sections/@dashboard/deployProfile';
const Authorizer = require('../contracts/Authorizer.json');
const Profile = require('../contracts/Profile.json');


interface SetupSectionProps {
  action: ()=>void,
}

  const steps = [
    {
      label: 'Deploy Your Profile',
      render: ({action}: SetupSectionProps) => {
        return (
          <>
            <Stack spacing={2} alignItems='center'>
            <Typography variant="h2" align='center' sx={{mt:'2em'}}>
              Deploy Your Profile
            </Typography>
            <NewProfile />
            </Stack>
          </>
        )
    }
    },
    {
      label: 'Join a Group',
      render: ({action}: SetupSectionProps) => {
        return (
          <>
          <Stack spacing={2} alignItems='center'>
          <Typography variant="h2" align='center'>
            Join a Group
          </Typography>
          <AuthorizerList authorizers={authorizersMock} />
          </Stack>
          </>
        )
      },
    },
     {
      label: 'Share Your Profile',
      render: ({action}: SetupSectionProps) => {
          <>
          <Stack spacing={2} alignItems='center'>
          <Typography variant="h2" align='center' sx={{paddingTop:'8px'}}>
            Share Your Profile
          </Typography>
            <Button sx={{mt: '1em', width:'20%' }} size='large' variant="outlined"  onClick={action}> Next Step</Button>
          </Stack>
          </>
      },
    }
  ]

export default function DemoPage() {
  const [completed, setCompleted] = useState(steps.map(()=>false));
  const [currentStep, setCurrentStep] = useState(0);
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
        console.log('done.');
        completeCurrentStep();
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
      completeCurrentStep();
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
  
  const completeStep = (index: number) => {
    const nextCompleted = [...completed]
    nextCompleted[index] = true;
    setCompleted(nextCompleted)
  }


  const completeCurrentStep = () => {
    completeStep(currentStep)
    handleStep(currentStep+1)()
  }

  const handleStep = (index: number) => () => {
    if (index >= steps.length) {
      index = 0;
    }
    setCurrentStep(index);
  }

  return (
    <>
      <AuthGuard>
        <DashboardLayout>
          <Helmet>
            <title> Abrey | Own your reputation. </title>
          </Helmet>
          <Stack>
              <Stepper nonLinear activeStep={currentStep}>
              {steps.map((step, index) => {return (
                <Step key={step.label} completed={completed[index]}>
                  <StepButton onClick={handleStep(index)}>{step.label}</StepButton>
                </Step>
              )})}
              </Stepper>
             {steps[currentStep].render({action: funcArray[currentStep]})}
          </Stack>
        </DashboardLayout>
      </AuthGuard>
    </>
  );
}