import {  Stack, Step, StepButton, Stepper, Typography } from '@mui/material';
import { useState } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { useEffect } from 'react';
import { dispatch, useSelector } from 'src/redux/store';
import { useAccount, useNetwork, useProvider } from 'wagmi';
import AuthGuard from '../components/AuthGuard';
import DashboardLayout from 'src/layouts/dashboard';
import { AuthorizerList } from 'src/sections/@dashboard/authorizers';
import NewProfile from 'src/sections/@dashboard/deployProfile';
import { useRouter } from 'next/router';
import { initializeUserProfile } from 'src/redux/slices/contracts';


interface SetupSectionProps {
  onComplete: ()=>void,
}

  const steps = [
    {
      label: 'Deploy Your Profile',
      render: ({onComplete}: SetupSectionProps) => {
        return (
          <>
            <Stack spacing={2} alignItems='center'>
            <Typography variant="h2" align='center' sx={{mt:'2em'}}>
              Deploy Your Profile
            </Typography>
            <NewProfile complete={onComplete}/>
            </Stack>
          </>
        )
    }
    },
    {
      label: 'Join a Group',
      render: ({onComplete}: SetupSectionProps) => {
        return (
          <>
          <Stack spacing={2} alignItems='center'>
          <Typography variant="h2" align='center'>
            Join a Group
          </Typography>
            <AuthorizerList onComplete={onComplete} />
          </Stack>
          </>
        )
      },
    }
  ]

export default function DemoPage() {
  const [completed, setCompleted] = useState(steps.map(()=>false));
  const [currentStep, setCurrentStep] = useState(0);
  const provider = useProvider();
  const router = useRouter();

  const account = useAccount();
  const { chain } = useNetwork();
  const chainId = chain?.id.toString() || '';
  const profile = useSelector((state) => state.contracts.userProfile);
  const profileLoaded = useSelector((state) => state.contracts.loadedProfileFromDb);

  useEffect(() => {
    if (!profileLoaded && account?.address && chainId && provider) {
        dispatch(initializeUserProfile(account.address, chainId, provider));
    }
  }, [account, chainId, provider]);

  useEffect(() => {
    console.log('checking if we can reroute');
    if (profileLoaded && profile) {
          router.push(`/profile/${chainId}/${profile.address}`);
    }
  }, [profileLoaded])

  const allStepsCompleted = (nextCompleted: boolean[]): boolean => {
      return nextCompleted.every((item) => item);
  }

  const completeStep = (index: number) => {
    const nextCompleted = [...completed]
    nextCompleted[index] = true;
    setCompleted(nextCompleted)
    if (allStepsCompleted(nextCompleted) && profile) {
      console.log('all steps completed');
      router.push(`/profile/${chainId}/${profile.address}`);
    }
  }


  const completeCurrentStep = () => {
    console.log('completing step', currentStep);
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
            <Stack spacing={2} alignItems='center'>
              <Stepper nonLinear activeStep={currentStep} sx={{width: '50%'}}>
              {steps.map((step, index) => {return (
                <Step key={step.label} completed={completed[index]}>
                  <StepButton onClick={handleStep(index)}>{step.label}</StepButton>
                </Step>
              )})}
              </Stepper>
            </Stack>
             {steps[currentStep].render({onComplete: completeCurrentStep})}
        </DashboardLayout>
      </AuthGuard>
    </>
  );
}
