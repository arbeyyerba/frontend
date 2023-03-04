import { dbConnect } from "src/lib/dbUtils";

export async function getProfileByOwnerAddressAndChainId(req: any, res: any) {
  console.log("getProfileByOwnerAddressAndChainId");
  const { ownerAddress, chainId } = req.body;
  const { ProfileModel } = await dbConnect();
  const profile = await ProfileModel.getProfileByOwnerAddressAndChainId(ownerAddress, chainId);
  console.log('profile', profile);
  if (!profile) {
    return res.json({ profile: null });
  }
  return res.json({ profile });
}

export default getProfileByOwnerAddressAndChainId;