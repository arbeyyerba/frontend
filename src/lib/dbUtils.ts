import mongoose from 'mongoose';
import { Authorizer } from 'src/models/Authorizer';
import { Profile } from 'src/models/Profile';
import { Attestation } from 'src/models/Attestation';
import { getModelForClass } from '@typegoose/typegoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

const dbConnect = async () => {
  const connection = await mongoose.connect(MONGODB_URI).catch((err) => {
    throw new Error(`Error connecting to db ${err}`);
  });

  console.log(`connected to ${mongoose.connection.db.databaseName}`);

  const AuthorizerModel = getModelForClass(Authorizer);
  const ProfileModel = getModelForClass(Profile);
  const AttestationModel = getModelForClass(Attestation);

  return { connection, AuthorizerModel, ProfileModel, AttestationModel };
};

export { dbConnect };
