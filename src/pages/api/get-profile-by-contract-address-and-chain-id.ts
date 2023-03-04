import { dbConnect } from "src/lib/dbUtils";

async function getProfileByContractAddressAndChainId(req: any, res: any) {
    console.log("getProfileByContractAddressAndChainId");
    const { contractAddress, chainId } = req.body;
    const { ProfileModel } = await dbConnect();
    const profile = await ProfileModel.getProfileByContractAddressAndChainId(contractAddress, chainId);
    return res.json({ profile });
}

export default getProfileByContractAddressAndChainId;