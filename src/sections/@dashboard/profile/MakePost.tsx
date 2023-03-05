import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useTheme, Stack, Paper, FormHelperText, MenuItem, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FormProvider,  RHFSelect,  RHFTextField } from 'src/components/hook-form';
import * as Yup from 'yup';
import { dispatch, useSelector } from 'src/redux/store';
import {   useSigner } from 'wagmi';
import {  useState } from 'react';
import { addPost  } from 'src/redux/slices/contracts';
import useUserProfileContract from 'src/hooks/useUserProfileContract';
import useWalletAddress from 'src/hooks/useWallet';


interface NewPost {
    body: string;
    authorizer: string;
}

export function MakePost() {
    /// react hook form 
    const profileContract = useUserProfileContract();
    const contract = profileContract?.contract;
    const profile = useSelector((state) => state.contracts.userProfile);
    const authorizers = profile?.authorizers || [];
    const { data: signer } = useSigner();
    const address = useWalletAddress()
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const theme = useTheme();
    const [errorMessage, setMessage] = useState('');

    const authorizerOptions = authorizers.map((authorizer) => ({
        value: authorizer.address,
        label: authorizer?.name || authorizer.address,
    }));

    const FormSchema = Yup.object().shape({
        body: Yup.string().required('Body is required'),
        authorizer: Yup.string().required('Authorizer is required'),
    });
    console.log('profile contract', profileContract);

    const defaultValues = {
        body: 'Post something interesting!',
    };

    const methods = useForm<NewPost>({
        mode: 'onTouched',
        resolver: yupResolver(FormSchema),
        defaultValues,
    });

    const {
        formState: { errors },
        handleSubmit,
        setValue,
    } = methods;
    
    const onSubmit = async (data: NewPost) => {
        setLoadingSpinner(true);
        try {
            setMessage('');
            console.log('attesting on contract...')
            if (signer && contract && profile && profile.authorizers.length > 0) {
                const canAttest = await profileContract.canAttest(signer, data.authorizer, data.body)
                if (canAttest) {
                    await profileContract.attest(signer, data.authorizer, data.body)
                    console.log('done.');
                    setLoadingSpinner(false);
                    dispatch(addPost({group: data.authorizer, post: {
                        id: 0,
                        message: data.body,
                        senderAddress: address as string,
                        deleted: false,
                        authorizerAddress: data.authorizer,
                    }}));
                } else {
                    setMessage('you do not meet the requirements to post using that authorizer!')
                }
            } else {
            console.log('no signer/contract/authorizer??', signer,contract);
            }
        } catch (e) {
            setLoadingSpinner(false);
        }
    };

    const onSelectType = (event: any) => {
        setValue('authorizer', event.target.value as string);
    };
    
    return (
        <Paper sx={{ backgroundColor: theme.palette.background.paper, minWidth: '40em', padding:'2em' }}>
      
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack direction='column' spacing={2}>
          <RHFTextField name='body' label='Make a post' multiline />
          <RHFSelect name='authorizer' label='Authorizer' SelectProps={{
              onChange: onSelectType,
              sx: {width: '100%'}
            }}
            >
            {authorizerOptions.map((value, key) => {
                return (
                <MenuItem key={key} value={value.value}>
                    {value.label}
                </MenuItem>
                )
            })}
          </RHFSelect>
          {errorMessage && (
            <Alert>
                {errorMessage}
            </Alert>)
          }
          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={loadingSpinner}
          >
            Make a Post!
          </LoadingButton>
          {Object.keys(errors).length != 0 && (
            <FormHelperText error>
              Please fill out all required fields
            </FormHelperText>
          )}
          </Stack>
        </FormProvider>
      </Paper>
    )
}
