// social media posts on my profile
import { Card, Link, Stack, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import useKnownProfiles from 'src/hooks/useKnownProfiles';
import { Attestation } from 'src/redux/slices/contracts';
import { LensContract } from 'src/types/lensContract';
import { useSigner } from 'wagmi';

export interface PostProps {
    post: Attestation,
    deletePost?: () => void,
}

export function Post({post} : PostProps) {
  const { data: signer } = useSigner();
    const knownProfiles = useKnownProfiles();

    const profile = knownProfiles[post?.senderAddress];
    const name = profile?.name || post?.senderAddress;

    /* const avatar = profile?.avatar; */

    /* const shareOnLens = () => {
*     console.log('NYI');
* } */

    const followOnLens = () => {
        if (signer) {
            LensContract.followOnLens(signer, post.senderAddress)
        } else {
            console.log('no signer??', signer);
        }
    }

    return (
    <Card>
        <Box sx={{p: '1em'}}>
            <Typography variant="body1">
                {post?.message}
            </Typography>
            <Stack>
                <Typography variant="body2" align='right'>
                    {"from "}
                    <Link color='inherit' href={`https://polygonscan.com/address/${post.senderAddress}`}>
                        {name}
                    </Link>
                </Typography>
                {profile?.lens  && (
                    <Stack direction="row">
                    <Button onClick={followOnLens}>
                        Follow on Lens
                    </Button>
                    </Stack>
                )
                }
            </Stack>
        </Box>
    </Card>
    )
}
