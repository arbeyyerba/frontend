import {
  index,
  prop,
  ReturnModelType,
  modelOptions,
} from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";
import { ensureDocument } from 'src/lib/schemaUtils';


@index({ address: "hashed" })
@modelOptions({ schemaOptions: { collection: "authorizers", autoCreate: true } })
export class Authorizer extends TimeStamps {
  @prop({ required: true })
  public name: string;
  @prop({ required: true })
  public contractAddress: string;
  @prop({ required: true })
  public chainId: string
  @prop({ required: true })
  public transactionHash: string;

    public static async getAuthorizerByAddress(
        this: ReturnModelType<typeof Authorizer>,
        address: string
        ) {
        return await ensureDocument<Authorizer>(
            this.findOne({ address }));
        }

    public static async createAuthorizer(
        this: ReturnModelType<typeof Authorizer>,
        name: string,
        address: string,
        transaction: string
        ) {
        return await ensureDocument<Authorizer>(
            await this.create({
                _id: new Types.ObjectId(),
                name,
                address,
                transaction
            })
        );
    }

}
