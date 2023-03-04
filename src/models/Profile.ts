import {
  index,
  modelOptions,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";
import {  ensureDocument } from 'src/lib/schemaUtils';

@index({ chainId: "hashed" })
@index({ ownerAddress: "hashed" })
@modelOptions({ schemaOptions: { collection: "profiles", autoCreate: true } })
export class Profile extends TimeStamps {
  @prop({ required: true })
  public chainId: string
  @prop({ required: true })
  public ownerAddress: string;
  @prop({ required: true})
  public contractAddress: string
  @prop({ required: true })
  public transactionHash: string;
  @prop({ required: true })
  public name: string;


    public static async getProfileByOwnerAddressAndChainId(
        this: ReturnModelType<typeof Profile>,
        ownerAddress: string,
        chainId: string
        ) {
            return await 
                this.findOne({ ownerAddress, chainId });
    }

    public static async getProfileByContractAddressAndChainId(
        this: ReturnModelType<typeof Profile>,
        contractAddress: string,
        chainId: string
    ) {
        return await ensureDocument<Profile>(
            this.findOne({ contractAddress, chainId }));
    }


    public static async getProfileByAddress(
        this: ReturnModelType<typeof Profile>,
        address: string
        ) {
            return await ensureDocument<Profile>(
                this.findOne({ address })
            );
    }

    public static async createProfile(
        this: ReturnModelType<typeof Profile>,
        name: string,
        ownerAddress: string,
        contractAddress: string,
        chainId: string,
        transactionHash: string
        ) {
            return await ensureDocument<Profile>(
                await this.create({
                    _id: new Types.ObjectId(),
                    name,
                    ownerAddress,
                    contractAddress,
                    chainId,
                    transactionHash
                })
            );
        }
}
