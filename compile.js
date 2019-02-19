const fs = require('fs-extra');
const path = require("path");
const solc = require("solc");

const buildPath = path.resolve(__dirname,"build");

// delete build folder
fs.removeSync(buildPath);

const BankPath = path.resolve(__dirname,"contracts","bank.sol");

const Source = fs.readFileSync(BankPath,'utf8');

var input = {
	language: 'Solidity',
	sources: {
		'bank.sol': {
			content: Source
		}
	},
	settings: {
		outputSelection: {
			'*': {
				'*': [ '*' ]
			}
		}
	}
}

var output = JSON.parse(solc.compile(JSON.stringify(input)))

fs.ensureDirSync(buildPath);

for (let contract in output.contracts['bank.sol']) {
    fs.outputJsonSync(
        buildPath+"/"+contract+".json",
        output.contracts['bank.sol'][contract]
    );
    
}

// for( let contract in output){
//     console.log(contract)
//     fs.outputJSONSync(
//         path.resolve(buildPath,contract.replace(":","")+".json"),
//         output[contract]
//     );
// }


