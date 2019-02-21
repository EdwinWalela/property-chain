import web3 from './web3'
import compiledBank from '../compiledContracts/Bank.json'

const address = '0x1751FAb2c7Fe783c5f858E270B51EE036E674510';
const abi = JSON.parse(compiledBank.interface);

export default new web3.eth.Contract(abi,address);