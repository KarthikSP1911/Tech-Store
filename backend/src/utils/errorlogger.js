import chalk from "chalk";

const errorLogger = (err, req, res, next) => {
  const labelColor = chalk.hex("#FFD700").bold;
  const errorColor = chalk.hex("#FF073A").bold;

  console.error(
    `\n${labelColor("[ERROR MESSAGE:")} ${errorColor(err.message)}${labelColor("]")}\n` +
    `${labelColor("[STACK:")} ${errorColor(err.stack || "No stack trace available")}${labelColor("]")}\n`
  );

  next(err); // Pass the error to the next middleware (like error handlers)
};

export default errorLogger;
