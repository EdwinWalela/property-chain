const HDWalletProvider = require('truffle-hdwallet-provider');
const compiledFactory = require("./build/Bank.json");
const Web3 = require("web3");
const fs = require('fs-extra');
const path = require("path");

const provider = new HDWalletProvider(
    'believe odor road reduce anxiety avocado dinosaur gloom rescue allow canoe moon',
    'https://rinkeby.infura.io/v3/cc26814c66a44066a854bde9cb095aaf'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('attempting to deploy Bank from account: ',accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                    .deploy({data:compiledFactory.bytecode,arguments:[]})
                    .send({gas:'1000000',from:accounts[0]});

        console.log('Contract successfuly deployed at :',result.options.address);
        const addressPath = path.resolve(__dirname,"bank_address.txt");
        fs.writeFileSync(addressPath,result.options.address,'utf8');
}   

deploy();