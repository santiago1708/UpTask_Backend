import mongoose from "mongoose"
import colors from 'colors'
import { exit } from 'node:process';

export const connectDB = async () => {
    try {
        const {connection} = await mongoose.connect(process.env.DATABASE_URL)
        const url = `${connection.host}:${connection.port}`
        console.log(colors.magenta.bold(`MongoDB connection: ${url}`));
    } catch (error) {
        console.log(error);
        console.log(colors.bgRed.bold(`Error al conectar a MONGODB`))
        exit(1);
    }
}