require('dotenv').config();
const express= require('express')
const app =express()
const routes = require('./routes')
const Web3 = require('web3');
const contract = require('truffle-contract');
const party_artifact= require('../build/PartyContract.json');

app.use(express.json())

if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
  } else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
}

const Party = contract(party_artifact)

Party.setProvider(web3.currentProvider)

const accounts = 
routes(app, web3 ,Party)

app.listen(process.env.PORT || 8082, () => {
    console.log('listening on port '+ (process.env.PORT || 8082));
})