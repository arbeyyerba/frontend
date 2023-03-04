import {Box, Typography, Avatar} from '@mui/material';
import { Stack } from '@mui/system';
import { useSelector } from 'src/redux/store';
import { useNetwork } from 'wagmi';



export function ProfileHeader() {
    const profile = useSelector((state) => state.contracts.userProfile);
    const { chain } = useNetwork();
    const name = profile?.name || 'No Name';
    const address = profile?.address || 'No Address';
    const chainName = chain?.name || 'No Chain';
    const avatar = profile?.avatar || 'https://cdn.discordapp.com/attachments/1078756217855414412/1081336417910800475/Abrey_Logo.png'

    return (
        <Box sx={{py: '3em'}}>
            <Stack alignItems={'center'}>
                <Avatar src={avatar} sx={{width: 256, height: 256}}/>
                <Box ml={2}>
                    <Typography variant='h2' align='center'>{name}</Typography>
                    <Typography variant='h4' align='center'>{address}</Typography>
                </Box>
            </Stack >
        </Box>
    )
}
