// var BigNumber = require('bignumber');
// var Entities = artifacts.require("./interfaces.");
var Party = artifacts.require("PartyContract");
var Tender = artifacts.require("TenderContract");
var Bid = artifacts.require("BidContract");
var Milestone = artifacts.require("MilestonesContract");
var Tokens = artifacts.require("Token");

module.exports = function(deployer, network, accounts) {
    deployer.then(async () => {
        await deployer.deploy(Tokens, "1000000000");
        await deployer.deploy(Party);
        await deployer.deploy(Tender);
        await deployer.deploy(Bid, Tender.address);
        await deployer.deploy(Milestone, Party.address, Tender.address, Bid.address);
    });
};