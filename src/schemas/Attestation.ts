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
import { Profile } from './Profile';


@index({ authorizer: "hashed" })
@index({ profile: "hashed" })
@modelOptions({ schemaOptions: { collection: "attestations", autoCreate: true } })
export class Attestation extends TimeStamps {
  @prop({required: true, ref: () => Authorizer})
  public authorizer: Ref<Authorizer>;
  @prop({required: true, ref: () => Profile})
  public profile: Ref<Profile>;
  @prop({required: true})
  public attestor: string;
  @prop({ required: true })
  public transaction: string;

  public static async getAttestationsByAuthorizerAndProfile(
    this: ReturnModelType<typeof Attestation>,
    authorizer: string,
    profile: string
  ) {
    return await ensureDocumentArray<Attestation>(
      this.find({ authorizer, profile })
    );
  }

  public static async createAttestation(
    this: ReturnModelType<typeof Attestation>,
    authorizer: string,
    profile: string,
    attestor: string,
    transaction: string
    ) {
    return await ensureDocument<Attestation>(
        await this.create({
            _id: new Types.ObjectId(),
            authorizer,
            profile,
            attestor,
            transaction
        })
    );
    }
}
