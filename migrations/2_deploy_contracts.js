// var Entities = artifacts.require("./interfaces.");
var Party = artifacts.require("PartyContract");
var Tender = artifacts.require("TenderContract");
var Bid = artifacts.require("BidContract");
var Tokens = artifacts.require("Token");

module.exports = function(deployer, network, accounts) {
    deployer.then(async () => {
        await deployer.deploy(Tokens, 100000000000);
        await deployer.deploy(Party);
        await deployer.deploy(Tender);
        await deployer.deploy(Bid, Tender.address);
    });
};