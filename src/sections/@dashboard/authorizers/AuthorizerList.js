import PropTypes from 'prop-types';
// @mui
import { Grid } from '@mui/material';
import {AuthorizerCard} from './index';
// ----------------------------------------------------------------------

ProductList.propTypes = {
  authorizers: PropTypes.array.isRequired,
};

export default function ProductList({ authorizers, ...other }) {
  return (
    <Grid container spacing={3} {...other}>
      {authorizers.map((authorizer) => (
        <Grid key={authorizer.id} item xs={12} sm={6} md={3}>
          <AuthorizerCard authorizer={authorizer} />
        </Grid>
      ))}
    </Grid>
  );
}
