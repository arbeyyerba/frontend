
import { dbConnect } from 'src/lib/dbUtils';

async function createProfile (req: any, res: any) {
    console.log('createProfile');
    const { 
        name,
        ownerAddress,
        contractAddress,
        chainId,
        transactionHash 
    } = req.body;
    const { ProfileModel } = await dbConnect();
    const profile = await ProfileModel.createProfile(
        name,
        ownerAddress,
        contractAddress,
        chainId,
        transactionHash
        );
    return res.json({profile});
}

export default createProfile;