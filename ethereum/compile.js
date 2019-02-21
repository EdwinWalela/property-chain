const fs = require('fs-extra');
const path = require("path");
const solc = require("solc");

const buildPath = path.resolve(__dirname,"build");

// delete build folder
fs.removeSync(buildPath);

const BankPath = path.resolve(__dirname,"contracts","bank.sol");
const source = fs.readFileSync(BankPath,'utf8');
const output = solc.compile(source,1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJSONSync(
		path.resolve(buildPath,contract.replace(":","")+".json"),
		output[contract]
	);
}
