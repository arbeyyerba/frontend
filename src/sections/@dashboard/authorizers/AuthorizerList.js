import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import {AuthorizerCard} from './index';
import authorizersMock from 'src/_mock/authorizers';
import {useNetwork} from 'wagmi';
// ----------------------------------------------------------------------

AuthorizersList.propTypes = {
  onComplete: PropTypes.func
};

export default  function AuthorizersList({ onComplete }) {
  
  const {chain} = useNetwork();
  console.log('chain', chain);
  const authorizers = authorizersMock[chain.id];
  console.log('authorizers', authorizers);
  return (
    <Grid container
      spacing={3}
      alignItems="center"
      justifyContent="center"
      style={{ paddingTop: '4em'}}>
      {authorizers.map((authorizer) => (
        <Grid key={authorizer.address} item xs={12} sm={6} md={3}>
          <AuthorizerCard onComplete={onComplete || (()=>{}) } leave={true} authorizer={authorizer} />
        </Grid>
      ))}
    </Grid>
  );
}
