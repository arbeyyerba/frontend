import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import Label from '../../../components/label';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useSigner } from 'wagmi';
import useUserProfileContractState from 'src/hooks/useUserProfileContractState';
import { dispatch } from 'src/redux/store';
import { addAuthorizerAddressToProfile} from 'src/redux/slices/contracts';
import useUserProfileContract from 'src/hooks/useUserProfileContract';
const Authorizer = require('src/contracts/Authorizer.json');
// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

AuthorizerCard.propTypes = {
  authorizer: PropTypes.object,
  onComplete: PropTypes.func,
};

export default  function AuthorizerCard({ authorizer, onComplete }) {
  const { name, cover, address } = authorizer;

  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const { data: signer, isError, isLoading, status, isIdle } = useSigner();
  const profileContractState = useUserProfileContractState();
  
  const currentAuthorizers = profileContractState?.authorizers||[];
  console.log('currentAuthorizers', currentAuthorizers);
  const profileContract = useUserProfileContract();

  const addAuthorizer = async () => {
    setLoadingSpinner(true);
    console.log('deploying dummy authorizer contract...')
    if (signer && profileContract) {
      const txn = await profileContract.addAuthorizer(signer, authorizer.address);
      console.log('txn', txn);
      dispatch(addAuthorizerAddressToProfile(address));
      console.log('done.');
      setLoadingSpinner(false);
      onComplete();
      
    } else {
      console.log('no signer/contract?', signer, contract);
    }
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledProductImg alt={name} src={cover} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>
        { currentAuthorizers.find(authorizer => authorizer.address.toLocaleLowerCase() === address.toLocaleLowerCase()) ? (
            <Button variant="contained" color="success" size="large" onClick={()=>{}} >
              Joined
            </Button>
            ) : (
        <LoadingButton onClick={addAuthorizer} variant="contained" color="primary" size="large" loading={loadingSpinner}>
          Join Group
        </LoadingButton>
        )}
      </Stack>
    </Card>
  );
}
