// social media posts on my profile
import { Card, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Link from 'next/link';
import { Attestation } from 'src/redux/slices/contracts';

export interface PostProps {
    post: Attestation,
}

export function Post({post} : PostProps) {
    return (
    <Card>
        <Box sx={{p: '1em'}}>
            <Typography variant="body1">
                {post?.message}
            </Typography>
            <Link href={`https://polygonscan.com/address/${post.senderAddress}`}>
                <Typography variant="body2" align='right'>
                    {post?.senderAddress}
                </Typography>
            </Link>
        </Box>
    </Card>
    )
}
