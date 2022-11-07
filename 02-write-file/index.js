const fs = require("fs");
const path = require("path");
const readline = require("readline")

const output = fs.createWriteStream(path.join(__dirname, "dest.txt"));
console.log("Input any text");

const rl = readline.createInterface(
  {
    input: process.stdin,
    output: output,
    terminal: false
  }
)

rl.on("line" , line => {
  if (line == "exit") process.exit(0);
  output.write(line);
  output.write("\n");
})

rl.on("SIGINT", () => {
  process.emit("SIGINT");
})

process.on('SIGINT', () => {
  process.exit(0);
}); 

process.on("exit", () => {
  console.log("Bye!");
})