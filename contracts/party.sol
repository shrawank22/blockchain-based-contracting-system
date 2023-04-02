// SPDX-License-Identifier: UNLICENSED

//the version of solidity that is compatible
pragma solidity >=0.7.0 <0.9.0; 

import {Party, Tender, TenderStatus} from './entities.sol';

contract PartyContract{

    mapping (address => Party) public parties;
    address[] public partyAddresses;

    constructor() {
    }

    modifier isOwner(address owner) {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier isPartyExists(address _partyAddress) {
        require(parties[_partyAddress].partyAddress != address(0), "Party does not exist");
        _;
    }

    // Function for creating party
    function createParty(string memory _name, string memory _contactNumber, string memory _email, string memory _password, address _partyAddress) public isOwner(_partyAddress){
        require(parties[_partyAddress].partyAddress == address(0), "Party already exists"); //

        Party storage newParty = parties[_partyAddress];
        newParty.name = _name;
        newParty.contactNumber = _contactNumber;
        newParty.email = _email;
        newParty.password = _password;
        newParty.trustScore = 0;
        newParty.createdAt = block.timestamp;
        newParty.partyAddress = _partyAddress;
        // newParty.tenderIds = new address[](0);
        partyAddresses.push(_partyAddress);
    }

    //Function for updating party
    function updateParty(string memory _name, string memory _password, address _partyAddress) public isOwner(_partyAddress) isPartyExists(_partyAddress) {
        // require(msg.sender == parties[_partyAddress].partyAddress, "Only party owner can update/delete party details.");
        Party storage updatedParty = parties[_partyAddress];
        updatedParty.name  = _name;
        updatedParty.password = _password;
    }
    
    //Function for deleting a party on platform
    function deleteParty(address _partyAddress) public isOwner(_partyAddress) isPartyExists(_partyAddress) {
        // require(msg.sender == parties[_partyAddress].partyAddress, "Only party owner can update/delete party details.");
        delete parties[_partyAddress];
        for (uint256 i = 0; i < partyAddresses.length; i++) {
            if (partyAddresses[i] == msg.sender) {
                partyAddresses[i] = partyAddresses[partyAddresses.length - 1];
                partyAddresses.pop();
                break;
            }
        }
    }
 
    // Function for getting details of a particular party
    function getPartyDetails(address _partyAddress) public isOwner(_partyAddress) isPartyExists(_partyAddress) view returns (string memory, string memory, string memory, address, uint256) {
        return (parties[_partyAddress].name, parties[_partyAddress].contactNumber, parties[_partyAddress].email, parties[_partyAddress].partyAddress, parties[_partyAddress].trustScore);
    }

    //function to update party's trust score
    function updateTrustScore(address _partyAddress, uint256 _trustScore) public isOwner(_partyAddress) isPartyExists(_partyAddress) {
        Party storage updatedParty = parties[_partyAddress];
        updatedParty.trustScore = _trustScore;
    }

    
    // Function for getting total no of parties
    // function getPartyCount() public view returns (uint256) {
    //     return partyAddresses.length;
    // }
    
    // Function for getting the address of a particular party.
    // function getPartyAddress(uint256 index) public view returns (address) {
    //     return partyAddresses[index];
    // }

    // Function for creating a tender
    function createTender(address _partyAddress, uint256 _budget, string memory _title, string memory _description, uint256 _deadline, uint256 _totalMilestones) isOwner(_partyAddress) public {
        Tender storage newTender = parties[_partyAddress].tenders[address(this)];
        newTender.title = _title;
        newTender.description = _description;
        newTender.budget = _budget;
        newTender.tenderStatus = TenderStatus.NEW;
        newTender.createdAt = block.timestamp;
        newTender.deadline = _deadline;
        newTender.issuerAddress = _partyAddress;
        newTender.tenderAddress = address(this);
        newTender.totalMilestones = _totalMilestones;
        parties[_partyAddress].tenderIds.push(address(this));
    }

    function getAllTenders() public view returns (Tender[] memory){
        require(partyAddresses.length > 0, "No parties exists");
        uint count = 0;
        for(uint i = 0; i< partyAddresses.length ; i++){
            count += parties[partyAddresses[i]].tenderIds.length;
        }
        Tender[] memory tenderList  = new Tender[](count);
        uint k = 0;
        for(uint i = 0; i < partyAddresses.length ; i++){
            address[] memory partyTenders = parties[partyAddresses[i]].tenderIds;
            for(uint j = 0; j< partyTenders.length; j++){
                Tender memory tempTender = parties[partyAddresses[i]].tenders[partyTenders[j]];
                if(tempTender.tenderStatus == TenderStatus.OPEN)
                    tenderList[k++] = tempTender;
            }
        }
        return(tenderList);
    }

    function getMyTenders(address _partyAddress) public view returns ( Tender[] memory){
        require(parties[_partyAddress].tenderIds.length > 0, "No tenders exists");
        address[] memory partyTenders = parties[_partyAddress].tenderIds;
        Tender[] memory tenderList  = new Tender[](partyTenders.length);
        for(uint i = 0; i< partyTenders.length; i++){
            tenderList[i] = parties[_partyAddress].tenders[partyTenders[i]];
        }
        return(tenderList);
    }

    function getTenderDetails(address _partyAddress, address _tenderAddress) public view returns ( Tender memory){
        require(parties[_partyAddress].tenderIds.length > 0, "No tenders exists");
        require(parties[_partyAddress].tenders[_tenderAddress].budget > 0 , "tender with address doesn't exists");
        return(parties[_partyAddress].tenders[_tenderAddress]);
    }

    function updateTenderStatus(address _partyAddress, address _tenderAddress, TenderStatus _tenderStatus) public {
        Tender storage updatedTender = parties[_partyAddress].tenders[_tenderAddress];
        updatedTender.tenderStatus = _tenderStatus;
    }

    function updateTender(address _partyAddress, address _tenderAddress, uint256 _budget, string memory _title, string memory _description, uint256 _deadline, uint256 _totalMilestones) public {
        Tender storage updatedTender = parties[_partyAddress].tenders[_tenderAddress];
        updatedTender.budget = _budget;
        updatedTender.title = _title;
        updatedTender.description = _description;
        updatedTender.deadline = _deadline;
        updatedTender.totalMilestones = _totalMilestones;
    }

    function deleteTender(address _partyAddress, address _tenderAddress) public{
        require(parties[_partyAddress].tenderIds.length > 0, "No tenders exists");
        require(parties[_partyAddress].tenders[_tenderAddress].budget > 0 , "tender with address doesn't exists");
        require(parties[_partyAddress].tenders[_tenderAddress].tenderStatus == TenderStatus.NEW ||
                parties[_partyAddress].tenders[_tenderAddress].tenderStatus == TenderStatus.SUSPENDED , "tender cannot be deleted");
        delete parties[_partyAddress].tenders[_tenderAddress];
        for (uint i = 0; i < parties[_partyAddress].tenderIds.length; i++){
            if(parties[_partyAddress].tenderIds[i] == _tenderAddress){
                parties[_partyAddress].tenderIds[i] = parties[_partyAddress].tenderIds[i++];
            }
        }
    }

    // @todo - add modifer for above functions

}
