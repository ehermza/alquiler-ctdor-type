import { Document, Schema, models, model } from "mongoose";
import { uuid } from "uuidv4";

export interface IClient extends Document {

};

const ClientSchema = new Schema ({

});

export default model<IClient>('client',ClientSchema);