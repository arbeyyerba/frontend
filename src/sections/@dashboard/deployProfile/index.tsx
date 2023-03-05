import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useTheme, Stack, Paper, FormHelperText } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormProvider,  RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { dispatch } from 'src/redux/store';
import { useNetwork, useProvider, useSigner } from 'wagmi';
import {  useState } from 'react';
import { loadUserProfileData } from 'src/redux/slices/contracts';
import { createProfile } from 'src/lib/api';
import { ProfileContract } from 'src/types/profileContract';


interface NewProfile {
  name: string;
}

interface NewProfileProps {
  complete: () => void;
}

export default function NewProfile({complete}: NewProfileProps) {
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
    formState: { errors },
    handleSubmit,
  } = methods;
   const { data: signer, isError, isLoading, status, isIdle } = useSigner();
   const provider = useProvider();
    console.log('signer status', signer, isError, isLoading, status, isIdle);
    console.log('wtf');
  const {chain} = useNetwork();
  const chainId = chain?.id.toString() || '';
  
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const onSubmit = async (data: NewProfile) => {
    setLoadingSpinner(true);
    console.log('deploying contract...')
    if (signer) {
      try {
        const profile = await ProfileContract.deploy(signer, data.name, chainId);
        dispatch(loadUserProfileData(profile.address, chainId, provider));

        const signerAddress = await signer.getAddress();

        const res = await createProfile({name: data.name, ownerAddress: signerAddress, chainId: chainId.toString(), contractAddress: profile.address, transactionHash: profile.transactionHash as string});

        console.log('res', res);

        console.log('done.');
        complete();
        setLoadingSpinner(false);
      } catch (e) {
        setLoadingSpinner(false);
      }
    } else {
      console.log('no signer??');
    }
  }

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
            loading={loadingSpinner}
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


