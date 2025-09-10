import mongoose from "mongoose";
import chalk from "chalk";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    const mongoURI = `${process.env.MONGODB_URI}/${DB_NAME}`;

    console.log();
    console.log(
      "         " +
        chalk.bgHex("#39FF14").hex("#000000").bold(" MongoDB Connected ") +
        chalk.hex("#39FF14").bold("   To connect via shell, run:  ") +
        chalk.cyanBright.underline.bold(`mongosh "${mongoURI}"`)
    );
    console.log();
  } catch (error) {
    console.log();
    console.log(
      "         " +
        chalk.bgRed.hex("#000000").bold(" MongoDB Connection FAILED ") +
        chalk.red.underline("   Error:  ") +
        chalk.yellow(error.message)
    );
    console.log();
    process.exit(1);
  }
};

export default connectDB;
