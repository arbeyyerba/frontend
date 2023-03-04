import {Box, Typography, Avatar} from '@mui/material';
import { useSelector } from 'src/redux/store';
import { useNetwork } from 'wagmi';



export function ProfileHeader() {
    const profile = useSelector((state) => state.contracts.userProfile);
    const { chain } = useNetwork();
    const name = profile?.name || 'No Name';
    const address = profile?.address || 'No Address';
    const chainName = chain?.name || 'No Chain';
    const avatar = 'https://cdn.discordapp.com/attachments/1078756217855414412/1081336417910800475/Abrey_Logo.png'
    return (
        <Box>
            <Box display='flex' alignItems='center' justifyContent='space-between'>
                <Box display='flex' alignItems='center'>
                    <Avatar src={avatar} />
                    <Box ml={2}>
                        <Typography variant='h2'>{name}</Typography>
                        <Typography variant='h4'>{address}</Typography>
                    </Box>
                </Box>
                <Box>
                    <Typography variant='h4'>{chainName}</Typography>
                </Box>
            </Box>
        </Box>
    )
}