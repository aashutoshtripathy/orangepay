import mongoose from "mongoose";
import { Schema } from "mongoose";


const sbSchema = new Schema({
    ConsumerId:{
        type:String
    }
  });


  export const Sb = mongoose.model("Sb", sbSchema);
