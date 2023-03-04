// social media posts on my profile
import { Paper, Typography } from '@mui/material';
import { useSelector } from 'src/redux/store';


export function PostList() {
    interface Posts {
        authorizer: string, posts: string[]
    }

    const profile = useSelector((state) => state.contracts.userProfile);


    return (
     <>
        <Typography variant="h2">
            Posts on your profile:
        </Typography>
        {profile && profile.authorizers.map((authorizer) => (
        <Paper>
        <Typography variant='h5'>
            {authorizer?.address} : {authorizer?.description}
        </Typography>
        {profile && profile.attestations[authorizer?.address].map((attestation) => (
        
        <Typography>
            {attestation?.message}
        </Typography>
        ))}
        </Paper>))}
    </>
    )
}