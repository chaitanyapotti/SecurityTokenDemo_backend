const fs = require("fs");
const path = require("path");
const defaultPath = path.resolve(__dirname, "../contractData");

module.exports = name => {
  return new Promise((resolve, reject) => {
    const contractPath = path.resolve(defaultPath, name + ".json");
    if (!fs.existsSync(contractPath)) reject(new Error("Contract ABI doesn't exist"));
    const fileData = fs.readFileSync(contractPath, "utf8");
    const parsedFile = JSON.parse(fileData);
    resolve({ abi: parsedFile.abi, bytecode: parsedFile.bytecode });
  });
};
