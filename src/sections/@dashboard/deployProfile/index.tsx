import { ThemeProvider } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useTheme, Stack, Paper, FormHelperText } from '@mui/material';
import { ContractFactory } from 'ethers';
import { useForm } from 'react-hook-form';
import { FormProvider,  RHFTextField } from 'src/components/hook-form';
import useUserProfileContract from 'src/hooks/useUserProfileContract';
import * as Yup from 'yup';
import { dispatch, useSelector } from 'src/redux/store';
import { useProvider, useSigner } from 'wagmi';
import { useEffect } from 'react';
import { loadUserProfileData } from 'src/redux/slices/contracts';
import { useCookies } from 'react-cookie';
const Profile = require('../../../contracts/Profile.json');


interface NewProfile {
  name: string;
}

interface NewProfileProps {
  completeCurrentStep?: () => void;
}

export default function NewProfile({completeCurrentStep}: NewProfileProps) {
  const theme = useTheme();

  const FormSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    });

  const defaultValues = {
    name: '',
  };

  const methods = useForm<NewProfile>({
    mode: 'onTouched',
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
  } = methods;
   const { data: signer, isError, isLoading, status, isIdle } = useSigner();
   const provider = useProvider();
    console.log('signer status', signer, isError, isLoading, status, isIdle);
    const profileContract = useUserProfileContract();
    const contract = profileContract?.contract;

  const [cookies, setCookie] = useCookies(['profile_address']);

  useEffect(() => {
    if (cookies['profile_address']) {
      dispatch(loadUserProfileData(cookies['profile_address'], provider));
    }
  }, [cookies]);

  const onSubmit = async (data: NewProfile) => {
    console.log('deploying contract...')
    if (signer) {
      const contractFactory = new ContractFactory(Profile.abi, Profile.bytecode, signer);
      const instance = await contractFactory.connect(signer).deploy();
      console.log('instance', instance);
      await instance.deployTransaction.wait(1);
      setCookie('profile_address', instance.address);
      dispatch(loadUserProfileData(instance.address, provider));
        console.log('done.');
        if (completeCurrentStep) {
         completeCurrentStep();
        }
    } else {
      console.log('no signer??');
    }
  }


  const showLoadingSpinner = isSubmitting;

  return (
      <Paper sx={{ backgroundColor: theme.palette.background.paper, minWidth: '40em', padding:'2em' }}>
      
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack direction='column' spacing={2}>
          <RHFTextField name='name' label='Profile Name' />
          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
    loading={showLoadingSpinner}
          >
            Deploy Profile
          </LoadingButton>
          {Object.keys(errors).length != 0 && (
            <FormHelperText error>
              Please fill out all required fields
            </FormHelperText>
          )}
          </Stack>
        </FormProvider>
      </Paper>
  );
}


