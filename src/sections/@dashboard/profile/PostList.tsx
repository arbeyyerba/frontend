// social media posts on my profile
import { Grid, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useSelector } from 'src/redux/store';
import { AuthorizerCard } from '../authorizers';
import { Post } from './Post';


export function PostList() {
    /* interface Posts {
*     authorizer: string, posts: string[]
* } */

    const profile = useSelector((state) => state.contracts.userProfile);

    console.log('profile data', profile);


    return (
     <>
         <Box sx={{p: '2em', paddingTop: '5em'}}>
        <Typography variant="h2" align='center' color='secondary'>
            Posts on your profile
        </Typography>
         </Box>
        {profile && profile.authorizers.map((authorizer) => (
            <Grid container spacing={2}>
            <Grid item xs={3} sm={3} md={3} sx={{py: '3em'}}>
                <AuthorizerCard authorizer={authorizer} />
            </Grid>

            <Grid item xs={12} sm={9} md={9}>
            <Stack spacing={2}>
        {profile && profile.attestations[authorizer?.address] && profile.attestations[authorizer?.address].map((attestation) => (
            <Post post={attestation} />

        ))}
            {profile && profile.attestations && profile.attestations[authorizer?.address] && profile.attestations[authorizer?.address]?.length == 0 && (
                <Box sx={{p: '1em'}}>
                    <Typography variant="subtitle1" align='center'>
                        you don't have any posts here yet.
                    </Typography>
                </Box>
            )}
            </Stack>
            </Grid>
            </Grid>
        ))}
    </>
    )
}
