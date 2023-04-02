// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.9.0;

import {Party, Tender, TenderStatus} from './entities.sol';
import {PartyContract} from "./party.sol";

contract TenderContract {    
    address public owner;
    PartyContract public partyRef;
    mapping (address => Tender) public tenders;
    address[] tenderIds;
 
    constructor(PartyContract _partyRef) {
        partyRef = _partyRef;
        owner = msg.sender; 
    }

    modifier isOwner(address _partyAddress) {
        require(msg.sender == _partyAddress, "Caller is not owner");
        _;
    }

    // Function for creating a project
    function createTender(address _partyAddress, uint256 _budget, string memory _title, string memory _description, uint256 _deadline, uint256 _totalMilestones) isOwner(_partyAddress) public {
        Tender storage newTender = tenders[address(this)];
        newTender.title = _title;
        newTender.description = _description;
        newTender.budget = _budget;
        newTender.tenderStatus = TenderStatus.NEW;
        newTender.createdAt = block.timestamp;
        newTender.deadline = _deadline;
        newTender.issuerAddress = _partyAddress;
        newTender.tenderAddress = address(this);
        newTender.totalMilestones = _totalMilestones;
        partyRef.parties(_partyAddress);
    }

    function updateTenderStatus(address _tenderAddress, TenderStatus _tenderStatus) public {
        Tender storage updatedTender = tenders[_tenderAddress];
        updatedTender.tenderStatus = _tenderStatus;
    }

    function updateTender(address _tenderAddress, uint256 _budget, string memory _title, string memory _description, uint256 _deadline, uint256 _totalMilestones) public {
        Tender storage updatedTender = tenders[_tenderAddress];
        updatedTender.budget = _budget;
        updatedTender.title = _title;
        updatedTender.description = _description;
        updatedTender.deadline = _deadline;
        updatedTender.totalMilestones = _totalMilestones;
    }

    function getTenderDetails(address _tenderAddress) public  view returns (uint256, string memory _title, string memory, uint256, uint256){
        return (tenders[_tenderAddress].budget, 
                tenders[_tenderAddress].title, 
                tenders[_tenderAddress].description,
                tenders[_tenderAddress].deadline,
                tenders[_tenderAddress].totalMilestones) ;
    }

    function getAllTenders() public view returns (address[] memory){
    
    }


}