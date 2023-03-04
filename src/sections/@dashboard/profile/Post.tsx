// social media posts on my profile
import { Card, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useKnownProfiles from 'src/hooks/useKnownProfiles';
import { Attestation } from 'src/redux/slices/contracts';

export interface PostProps {
    post: Attestation,
    deletePost?: () => void,
}

export function Post({post} : PostProps) {
    const knownProfiles = useKnownProfiles();

    const profile = knownProfiles[post?.senderAddress];
    const name = profile?.name || post?.senderAddress;
    /* const avatar = profile?.avatar; */

    return (
    <Card>
        <Box sx={{p: '1em'}}>
            <Typography variant="body1">
                {post?.message}
            </Typography>
                <Typography variant="body2" align='right'>
                    {"from "}
                    <Link color='inherit' href={`https://polygonscan.com/address/${post.senderAddress}`}>
                        {name}
                    </Link>
                </Typography>
        </Box>
    </Card>
    )
}
