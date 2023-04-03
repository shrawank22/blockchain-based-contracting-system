var Bid = artifacts.require("bid");
var Main = artifacts.require("ContractingPlatform");
module.exports = function(deployer) {
    deployer.deploy(Main);
    deployer.deploy(Bid, Main.address);
    // Additional contracts can be deployed here
};