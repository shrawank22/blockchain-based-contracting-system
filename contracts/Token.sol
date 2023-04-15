// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol" ;

contract Token is ERC20 ("ASKS Token", "ASKS" ){

    constructor(uint256 initialSupply) {
        _mint(msg.sender, initialSupply*(10**18));
    }

    function balanceOf(address account) public override view returns (uint256) {
        return super.balanceOf(account);
    }

    function transfer(address recipient, uint256 amount) public override returns(bool) {
        return super.transfer(recipient,amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount, uint256 senderFreezedBalanace) public returns(bool) {
        require((balanceOf(sender) - senderFreezedBalanace) >= amount, "Insufficient funds");
        return super.transferFrom(sender, recipient, amount);
    }
}