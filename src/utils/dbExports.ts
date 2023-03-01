import { Attestation } from 'src/schemas/Attestation'
import { Profile } from 'src/schemas/Profile'
import { Authorizer } from 'src/schemas/Authorizer'
import { getModelForClass } from '@typegoose/typegoose'

export const AuthorizerModel = getModelForClass(Authorizer);
export const ProfileModel = getModelForClass(Profile);
export const AttestationModel = getModelForClass(Attestation);