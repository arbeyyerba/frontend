import {Box, Typography, Avatar} from '@mui/material';
import { Stack } from '@mui/system';
import { useSelector } from 'src/redux/store';
/* import { useNetwork } from 'wagmi'; */



export function ProfileHeader() {
    const profile = useSelector((state) => state.contracts.userProfile);
    /* const { chain } = useNetwork(); */
    const name = profile?.name || 'No Name';
    const address = profile?.address || 'No Address';
    /* const chainName = chain?.name || 'No Chain'; */
    const avatar = profile?.avatar || 'https://media.discordapp.net/attachments/1078756217855414412/1081745570382762024/Abrey_Logo_only_pic.png?width=327&height=363'

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
