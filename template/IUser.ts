import { Document, Model } from "mongoose";

export interface IUser {
  givenName: string;
  familyName: string;
  name: string;
  email: string;
  imageUrl: string;
}

export interface UserDoc extends IUser, Document {
  generateAuthToken(): string;
}

export interface UserModelInterface extends Model<UserDoc> {
  createDocument(user: IUser): UserDoc;
}
