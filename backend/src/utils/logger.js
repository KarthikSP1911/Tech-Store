import morgan from "morgan";
import chalk from "chalk";

const labelColor = chalk.hex("#FFD700").bold; // Bright yellow for labels and brackets

const logger = morgan((tokens, req, res) => {
  // METHOD
  let methodColor;
  switch (req.method) {
    case "GET":
      methodColor = `${labelColor("[METHOD:")} ${chalk.hex("#39FF14").bold(req.method)}${labelColor("]")}`;
      break;
    case "POST":
      methodColor = `${labelColor("[METHOD:")} ${chalk.hex("#FFFF33").bold(req.method)}${labelColor("]")}`;
      break;
    case "DELETE":
    case "PATCH":
    case "PUT":
      methodColor = `${labelColor("[METHOD:")} ${chalk.hex("#FF073A").bold(req.method)}${labelColor("]")}`;
      break;
    default:
      methodColor = `${labelColor("[METHOD:")} ${chalk.white.bold(req.method)}${labelColor("]")}`;
  }

  // URL
  const urlColor = `${labelColor("[URL:")} ${chalk.cyan.bold(req.originalUrl)}${labelColor("]")}`;

  // STATUS
  const status = tokens.status(req, res);
  let statusColor;
  if (status >= 200 && status < 300) {
    statusColor = `${labelColor("[STATUS:")} ${chalk.hex("#39FF14").bold(status)}${labelColor("]")}`;
  } else if (status >= 400) {
    statusColor = `${labelColor("[STATUS:")} ${chalk.hex("#FF073A").bold(status)}${labelColor("]")}`;
  } else {
    statusColor = `${labelColor("[STATUS:")} ${chalk.white.bold(status)}${labelColor("]")}`;
  }

  // TIME (Pitch white)
  const timeColor = `${labelColor("[TIME:")} ${chalk.hex("#FFFFFF").bold(tokens['response-time'](req, res) + " ms")}${labelColor("]")}`;

  return `\n        ${methodColor}   ${urlColor}   ${statusColor}   ${timeColor}  \n`;
});

export default logger;
