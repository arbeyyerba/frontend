import mongoose from 'mongoose'
import { Connection } from 'mongoose'
/** 
Source : 
https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/utils/dbConnect.js 
**/


const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
export const dbConnect = async () => {
  const connection: void | Connection = await mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log(`connecting to '${process.env.NODE_ENV}' database successful`);
      return;
    })
    .catch((err) => {
      throw new Error(`Error connecting to db ${err}`);
    });

  console.log(`connected to ${mongoose.connection.db.databaseName}`);
  return connection;
};

import { Attestation } from 'src/schemas/Attestation'
import { Profile } from 'src/schemas/Profile'
import { Authorizer } from 'src/schemas/Authorizer'
import { getModelForClass } from '@typegoose/typegoose'

export const AuthorizerModel = getModelForClass(Authorizer);
export const ProfileModel = getModelForClass(Profile);
export const AttestationModel = getModelForClass(Attestation);