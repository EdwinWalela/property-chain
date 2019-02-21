import web3 from './web3'
import compiledDeed from '../compiledBank/Deed.json'

const abi = JSON.parse(compiledBank.interface);


export default new web3.eth.Contract(abi,address);