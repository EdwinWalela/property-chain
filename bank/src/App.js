import React, { Component } from 'react';
import web3 from './components/web3';
import bank from './components/bank';
import compiledDeed from './compiledContracts/Deed.json';

import './App.css';

class App extends Component {

  async componentDidMount(){
   
    //get accounts unlocked by our provider
    const accounts = await web3.eth.getAccounts();
    console.log(accounts)
    //let owner register new deed (if admin)
    console.log('registering new deed...')

    await bank.methods.newDeed(accounts[0],"36914130","A-1",10000)
		.send({ 
			from:accounts[0],
			gas:'1000000'
    });

    // look-up deed details (get owner of a particular deed)
    
    console.log('querying bank...')
    let owner = await bank.methods.getOwner("A-1").call();
    console.log(owner);

    // get address of deployed deed-contract
    let deedAddress = await bank.methods.properties(0).call();

    // create a local instance of the deployed deed
    let deed = await new web3.eth.Contract(JSON.parse(compiledDeed.interface),deedAddress);

  //-- Interact with the deed
    // let owner list his/her property for sale(ether)
    let forSale = await deed.methods.forSale().call();
    console.log(forSale)
    console.log('listing deed...')
    await deed.methods.listProperty(1000000).send({
			from:accounts[0],
			gas:'1000000'
		});
    forSale = await deed.methods.forSale().call();
    console.log(forSale);

  }
  
  render() {
    return (
      <divv>
        <p>LOL</p>
      </divv>
    );
  }
}

export default App;
