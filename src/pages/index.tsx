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
import { P } from '@wagmi/core/dist/index-35b6525c';
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
      render: ({}: SetupSectionProps) => {
        return (
          <>
          <Stack spacing={2} alignItems='center'>
          <Typography variant="h2" align='center'>
            Join a Group
          </Typography>
          <AuthorizerList/>
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
  
  useEffect(() => {
    if (profile) {
        router.push(`/profile/${chainId}/${profile.address}`);
    } else if(account.address !== undefined) {
        console.log('initalizeUserProfile', account.address, chainId, provider);
        dispatch(initializeUserProfile(account.address, chainId, provider));
    }
    }, [profile, account, chainId, provider]);
  
  const completeStep = (index: number) => {
    const nextCompleted = [...completed]
    nextCompleted[index] = true;
    setCompleted(nextCompleted)
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