import dotenv from "dotenv";
import chalk from "chalk";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

try{
    await connectDB();
}
catch(err){
    console.log();
  console.log(
    "         " +
      chalk.bgRed.hex("#000000").bold(" MongoDB Connection FAILED ") +
      chalk.red.underline(" Error: ") +
      chalk.yellow(err.message)
  );
  console.log();
  process.exit(1); 
}

app.listen(PORT, () => {
    console.log();
    console.log(
        "         " +
        chalk.bgCyan.hex("#000000").bold(` Server is running `) +
        chalk.blue(`   on port  `) +
        chalk.cyan(PORT)
    );
    console.log(
        "         " +
        chalk.hex("#39FF14").bold("URL:  ") +
        chalk.cyan.underline(`http://localhost:${PORT}`)
    );
    console.log();
});


                    
