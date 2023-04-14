require('dotenv').config();
const express= require('express')
var cors = require('cors');
const app =express()
app.use(cors())
const routes = require('./routes')
const Web3 = require('web3');
const contract = require('truffle-contract');
const party_artifact= require('../build/PartyContract.json');
const tender_artifact= require('../build/TenderContract.json');
const bid_artifact = require('../build/BidContract.json')

app.use(express.json())


if (typeof web3 !== 'undefined') {
    var web3 = new Web3(web3.currentProvider)
  } else {
    var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
}

const Party = contract(party_artifact)
const Tender = contract(tender_artifact)
const Bid = contract(bid_artifact)

Party.setProvider(web3.currentProvider)
Tender.setProvider(web3.currentProvider)
Bid.setProvider(web3.currentProvider)

routes(app, web3 ,Party, Tender, Bid)

app.listen(process.env.PORT || 8082, () => {
    console.log('listening on port '+ (process.env.PORT || 8082));
})