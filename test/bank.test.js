const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3('http://localhost:8545');

const compiledBank = require('../build/Bank.json');
const compiledDeed = require('../build/Deed.json');


let accounts,bank,deed;
let admin,userA,userB,userC;

beforeEach(async function(){
	this.timeout(20000)
	accounts = await web3.eth.getAccounts();
	admin = accounts[0];
	userA = accounts[1];
	userB = accounts[2];
	userC = accounts[3];
	
	// deploy title deed bank
	bank = await new web3.eth.Contract((JSON.parse(compiledBank.interface)))
		.deploy({data:compiledBank.bytecode,arguments:[]})
		.send({from:admin , gas:'1000000'})
	// register a title deed
	await bank.methods.newDeed(userA,"36914130","A-1",10000)
		.send({ 
			from:admin,
			gas:'1000000'
		});
	//retrieve address of registered title deed
	 let deedAddress = await bank.methods.properties(0).call();
	//create new deed instance
	deed = await new web3.eth.Contract(
			(JSON.parse(compiledDeed.interface)),
			deedAddress
		);

})

describe('Bank',()=>{
    it('deploys a bank and a deed',()=>{
		assert.ok(bank.options.address && deed.options.address);
	})
	it('allows public to look-up property owner',async()=>{
		let owner = await bank.methods.getOwner("A-1").call();
		let expectedOwner = "36914130";
		assert.strictEqual(owner,expectedOwner);
	})
	it('allows owner to list property',async()=>{
		await deed.methods.listProperty(1000000).send({
			from:userA,
			gas:'1000000'
		});

		let forSale = await deed.methods.forSale().call();
		assert.ok(forSale);
	})
	it('prevents purchase of unlisted property',async()=>{
		try{
			await deed.methods.buyProperty("10000001").send({
				from:userB,
				value:web3.utils.toWei('10','ether') ,
				gas:'1000000'
			})
			assert(false);
		}catch(err){
			assert(err);
		}
	})
	it('allows purchace of listed property',async()=>{
		// owner lists property
		await deed.methods.listProperty(web3.utils.toWei('10','ether')).send({
			from:userA,
			gas:'1000000'
		});
		// buyer pays for property
		await deed.methods.buyProperty("JUSTGOTBOUGHT").send({
			from:userB,
			value:web3.utils.toWei('10','ether'),
			gas:'1000000'
		});

		let ownerId = await deed.methods.id().call();
		let expectedId = "JUSTGOTBOUGHT";

		assert.strictEqual(ownerId,expectedId);
	})
	it('prevents double selling of property',async()=>{
		// owner lists property
		await deed.methods.listProperty(web3.utils.toWei('10','ether')).send({
			from:userA,
			gas:'1000000'
		});
		// buyer pays for property
		await deed.methods.buyProperty("JUSTGOTBOUGHT").send({
			from:userB,
			value:web3.utils.toWei('10','ether'),
			gas:'1000000'
		});
		// another buyer tries to buy the same property
		try{
			await deed.methods.buyProperty("TRYNABUYITTWICE").send({
				from:userC,
				value:web3.utils.toWei('10','ether'),
				gas:'1000000'
			});
			assert(false);
		}catch(err){
			assert(err);
		}
		
	})
})