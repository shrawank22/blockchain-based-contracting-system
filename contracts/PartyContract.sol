// SPDX-License-Identifier: UNLICENSED

//the version of solidity that is compatible

pragma solidity ^0.8.0;
contract PartyContract {
    
    string public message;
    address[] public partyAddresses;
    struct Party {
        string name;
        string contactNumber;
        string email;
        string password;
        uint256 trustScore;
        uint256 createdAt;
        address partyAddress;
        uint256[] tenderIds;
    }

    modifier isOwner(address owner) {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    mapping (address => Party) public parties;

    function createParty(string memory _name, string memory _contactNumber, string memory _email, string memory _password, address _partyAddress) public{
        require(parties[_partyAddress].partyAddress == address(0), "Party already exists"); //
        Party storage newParty = parties[_partyAddress];
        newParty.name = _name;
        newParty.contactNumber = _contactNumber;
        newParty.email = _email;
        newParty.password = _password;
        newParty.trustScore = 0;
        newParty.createdAt = block.timestamp;
        newParty.partyAddress = _partyAddress;
        partyAddresses.push(_partyAddress);
    }

    function getPartyDetails(address _partyAddress) public view isOwner(_partyAddress)  returns (string memory, string memory, string memory, address, uint256) {
        return (parties[_partyAddress].name, parties[_partyAddress].contactNumber, parties[_partyAddress].email, parties[_partyAddress].partyAddress, parties[_partyAddress].trustScore);
    }

    constructor() {
    }
}