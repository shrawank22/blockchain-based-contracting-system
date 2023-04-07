// var Entities = artifacts.require("./interfaces.");
var Party = artifacts.require("PartyContract");
module.exports = function(deployer) {
    deployer.deploy(Party);
    // deployer.deploy(Bid, Main.address);
    // Additional contracts can be deployed here
};