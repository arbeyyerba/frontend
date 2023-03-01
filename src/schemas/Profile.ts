import {
  index,
  modelOptions,
  prop,
  Ref,
  ReturnModelType,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";
import { ensureDocumentArray, ensureDocument } from 'src/utils/schemaUtils';
import { Authorizer } from './Authorizer';


@index({ address: "hashed" })
@modelOptions({ schemaOptions: { collection: "profiles", autoCreate: true } })
export class Profile extends TimeStamps {
  @prop({ required: true })
  public address: string;
  @prop({ required: true })
  public transaction: string;
  @prop({ required: true, ref: () => Authorizer })
  public authorizers: Ref<Authorizer>[];

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
        address: string,
        transaction: string
        ) {
            return await ensureDocument<Profile>(
                await this.create({
                    _id: new Types.ObjectId(),
                    address,
                    transaction
                })
            );
        }
}
