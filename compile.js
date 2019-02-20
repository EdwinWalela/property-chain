const fs = require('fs-extra');
const path = require("path");
const solc = require("solc");

const buildPath = path.resolve(__dirname,"build");

// delete build folder
console.log('\n-Deleting build directory...')
fs.removeSync(buildPath);
console.log('\n-Build directory deleted...')

const BankPath = path.resolve(__dirname,"contracts","bank.sol");

console.log('\n-Reading source code from file...')
const source = fs.readFileSync(BankPath,'utf8');

console.log('\n-Compiling source code...')
const output = solc.compile(source,1).contracts;

console.log('\n-Creating build folder...')
fs.ensureDirSync(buildPath);

console.log('\n-Outputing compiled contracts...')
for (let contract in output) {
    fs.outputJSONSync(
		path.resolve(buildPath,contract.replace(":","")+".json"),
		output[contract]
	);
}
console.log('\n-Proccess comlete!')
