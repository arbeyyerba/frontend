import PropTypes from 'prop-types';
// @mui
import { Box, Card, Link, Typography, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useSigner } from 'wagmi';
import useUserProfileContractState from 'src/hooks/useUserProfileContractState';
import { dispatch } from 'src/redux/store';
import { addAuthorizerAddressToProfile, removeAuthorizerAddressFromProfile} from 'src/redux/slices/contracts';
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
  leave: PropTypes.bool,
  authorizer: PropTypes.object,
  onComplete: PropTypes.func,
};

export default  function AuthorizerCard({ authorizer, onComplete, leave }) {
  const { name, avatar, address } = authorizer;

  console.log(authorizer);

  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const { data: signer } = useSigner();
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

  const removeAuthorizer = async () => {
    setLoadingSpinner(true);
    console.log('deploying dummy authorizer contract...')
    if (signer && profileContract) {
      const txn = await profileContract.removeAuthorizer(signer, authorizer.address);
      console.log('txn', txn);
      dispatch(removeAuthorizerAddressFromProfile(address));
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
        <StyledProductImg alt={name} src={avatar} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover">
          <Typography variant="subtitle2" align='center' noWrap>
            {name}
          </Typography>
        </Link>
        {onComplete && (currentAuthorizers.find(authorizer => authorizer.address.toLocaleLowerCase() === address.toLocaleLowerCase()) ?
                        leave ? (
            <Button variant="contained" color="error" size="large" onClick={removeAuthorizer} >
              Leave Group
            </Button>
                        ) : (
            <Button variant="contained" color="success" size="large">
              Joined
            </Button>
            ) : (
        <LoadingButton onClick={addAuthorizer} variant="contained" color="primary" size="large" loading={loadingSpinner}>
          Join Group
        </LoadingButton>
            ))}
      </Stack>
    </Card>
  );
}
