// SPDX-License-Identifier: UNLICENSED

//the version of solidity that is compatible
pragma solidity >=0.7.0 <0.9.0; 

import {ProjectStatus, Tender, Bid} from './entities.sol';
import {PartyContract} from "./party.sol";
import {TenderContract} from "./tender.sol";

contract BidContract{

    address private owner;
    PartyContract public partyRef;
    TenderContract public tenderRef;

    constructor(PartyContract _partyRef, TenderContract _tenderRef) {
        partyRef = _partyRef;
        tenderRef = _tenderRef;
        owner = msg.sender; 
    }



    // Function for creating bids on tenders
    function createBid(address _partyAddress, address _tenderId, string memory _message, uint256 _amount, string memory status) public{
        Tender storage tender = partyRef.parties[_partyAddress].tenders[_tenderId];
        require(partyRef.parties[msg.sender].partyAddress != address(0), "Party does not exist");
        require(tender.budget > 0, "Tender does not exist");
        require(tender.isOpen, "Tender is not open for bids");
        require(block.timestamp < tender.deadline, "Bidding has ended");
        require(msg.sender != tender.creator, "Owner cannot bid on their own tender");

        Bid memory newBid = Bid({
            message: _message,
            amount: _amount,
            bidder: msg.sender,
            bidStatus: status
        });
        uint256 bidId = tender.bidIds.length;
        tender.bidIds.push(bidId);
        tender.bids[bidId] = newBid;
    }

   // For getting bid count on a particular tender
   function getBidCount(address _partyAddress, uint256 _tenderId) public view returns (uint256) {
    	require(partyRef.parties[_partyAddress].tenders[_tenderId].budget > 0, "Tender does not exist");
    	return partyRef.parties[_partyAddress].tenders[_tenderId].bidIds.length;
    }

    // For getting bid details like message, amount, address of bidders 
    function getBidDetails(address _partyAddress, uint256 _tenderId, uint256 _bidId) public view returns (string memory, uint256, address) {
    	Tender storage tender = partyRef.parties[_partyAddress].tenders[_tenderId];
	require(tender.bids[_bidId].amount > 0, "Bid does not exist");
    	return (
		tender.bids[_bidId].message,
		tender.bids[_bidId].amount,
		tender.bids[_bidId].bidder
    	);
    }

    function getAllBids(address _partyAddress, uint256 _tenderId) public view returns (Bid[] memory) {
        Tender storage tender = partyRef.parties[_partyAddress].tenders[_tenderId];
        require(tender.bidIds.length > 0, "No bids exists");
        Bid[] memory bids = new Bid[](tender.bidIds.length);
        for (uint256 i = 0; i < tender.bidIds.length; i++) {
            bids[i] = tender.bids[i];
        }
        return (bids);
    }

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier isValidTender(uint256 tenderId) {
        (string memory title, string memory description, uint256 budget, bool isOpen, uint256 deadline, ProjectStatus projectStatus) = tenderRef.getTenderDetails(msg.sender, tenderId);
        require(block.timestamp >= deadline && projectStatus == ProjectStatus.CLOSED);
        _;
    }

    function selectWinnerBid(address _partyAddress, uint256 projectId ) public view isOwner isValidTender(projectId) returns (Bid[] memory) {
        //invoke this function once deadline is crossed and can be invoked by project issue party, make sure this project is not assigned to anyone------modifier
        // get all the bids for pt
        Bid[] memory bids = getAllBids(_partyAddress, projectId);
        require(bids.length > 0, "No bids exists");
        // sort bids by price
        for (uint i = 1; i < bids.length; i++){
            for (uint j = 0; j < i; j++){
                if (bids[i].amount > bids[j].amount) {
                    Bid memory x = bids[i];
                    bids[i] = bids[j];
                    bids[j] = x;
                }
            }
        }
        uint256 shortListedBidsCount = (bids.length < 5) ? bids.length : 5; 
        Bid[] memory shortListedBids = new Bid[](shortListedBidsCount);
        for (uint i = 0; i < shortListedBidsCount; i++){
            shortListedBids[i] = bids[i];
        }

        return shortListedBids;
        //returns a list of top 5 bidders and history of bidders

        // - in case of a tie, the bidder with the largest "trust" is given the project. ( Trust in this context is measured in terms of the number of previous projects done and the token assets a party has.)
        // update the status of each bid to APPROVED / REJECTED from PENDING.
    }  

}