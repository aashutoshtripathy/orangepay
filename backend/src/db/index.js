import mongoose from 'mongoose';
import { Db_Name } from '../constant.js';


const ConnectDB = async() => {
    try {
        const connection = await mongoose.connect(`${process.env.MongoDB_URI}/${Db_Name}`)
        console.log(`The database has been connected Successfully. !! DB Host : ${connection.connection.host}`)
    } catch (error) {
        console.log(`Error in connecting the database`,error)
    }
}



export default ConnectDB;