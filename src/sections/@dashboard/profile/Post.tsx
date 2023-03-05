// social media posts on my profile
import { Card, Link, Stack, Typography, Button } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
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
    const [followPending, setFollowPending] = useState(false);
    const [following, setFollowing] = useState(false);

    const profile = knownProfiles[post?.senderAddress];
    const name = profile?.name || post?.senderAddress;

    /* const avatar = profile?.avatar; */

    /* const shareOnLens = () => {
*     console.log('NYI');
* } */

    const followOnLens = async () => {
        if (signer) {
            setFollowPending(true);
            await LensContract.followOnLens(signer, post.senderAddress)
            setFollowing(true);
            setFollowPending(false);
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
                    <Button onClick={followOnLens} disabled={!following}>
                        {followPending ?
                         "Loading..."
                        :
                         following ?
                         "You are already following"
                         :
                         "Follow on Lens"
                        }
                    </Button>
                    </Stack>
                )
                }
            </Stack>
        </Box>
    </Card>
    )
}
