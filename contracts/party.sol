// SPDX-License-Identifier: UNLICENSED

//the version of solidity that is compatible
pragma solidity >=0.7.0 <0.9.0; 

import {Party, Tender, TenderStatus, Bid, BidStatus} from './entities.sol';

contract PartyContract{

    mapping (address => Party) public parties;
    mapping (uint256 => Tender) public tenders;
    mapping (uint256 => Bid) public bids;
    uint256 tenderCount = 0;
    uint256 bidCount = 0;
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
        require(_partyAddress.balance >= _budget/2, "insufficient funds to create a tender");
        Tender storage newTender = tenders[tenderCount];
        newTender.title = _title;
        newTender.description = _description;
        newTender.budget = _budget;
        newTender.tenderStatus = TenderStatus.NEW;
        newTender.createdAt = block.timestamp;
        newTender.deadline = _deadline;
        newTender.issuerAddress = _partyAddress;
        newTender.tenderAddress = address(this);
        newTender.totalMilestones = _totalMilestones;
        address[] memory sortedlist = sortByTrustScore();
        uint len = sortedlist.length;
        if(len<=10)
        {
            newTender.validatorsAddresses = sortedlist;
        }
        else
        {
            for(uint i=0; i<10; i++)
            {
                if(sortedlist[len-i-1] != parties[msg.sender].partyAddress)
                {
                    newTender.validatorsAddresses.push(sortedlist[len-i-1]);
                }
            }
        }
        parties[_partyAddress].tenderIds.push(tenderCount);
        tenderCount++;
    }

    function sortByTrustScore() public view returns(address[] memory) {
    address[] memory _party = partyAddresses;
    for (uint i = 1; i < partyAddresses.length; i++)
        for (uint j = 0; j < i; j++)
            if (parties[_party[i]].trustScore < parties[_party[j]].trustScore) {
                address x = _party[i];
                _party[i] = _party[j];
                _party[j] = x;
            }

    return _party;
    }

    function validate(uint256 _tenderAddress, bool _vote) public {
        bool valid = false;
        Tender storage newTender = tenders[_tenderAddress];
        uint len = newTender.validatorsAddresses.length;
        for(uint i=0; i<len; i++)
        {
            if(newTender.validatorsAddresses[i] == msg.sender)
            {
                valid = true;
                break;
            }
        }
        if(valid)
        {
            newTender.validationVotes.push(_vote);
        }
        else
        {
            revert("You're not authorized to valid this tender.");
        }
    }

    function checkTenderValidation(uint256 _tenderAddress) public {
        Tender storage newTender = tenders[_tenderAddress];
        if(isValid(newTender.validationVotes)) {
            updateTenderStatus(_tenderAddress, TenderStatus.OPEN);
        }
    }
    
    function isValid(bool[] memory _validationVotes) public pure returns (bool) {
        uint voteCount = 0;
        for(uint i=0; i<_validationVotes.length; i++)
        {
            if(_validationVotes[i])
            {
                voteCount++;
            }
        }

        if(voteCount>=6)
        {
            return true;
        }
        return false;
    }

    function getAllTenders() public view returns (Tender[] memory){
        require(partyAddresses.length > 0, "No parties exists");
        Tender[] memory tendersList = new Tender[](tenderCount);
        for (uint256 i = 0; i < tenderCount; i++) {
            tendersList[i] = tenders[i];
        }
        return(tendersList);
    }

    function getMyTenders(address _partyAddress) public view returns ( Tender[] memory){
        require(parties[_partyAddress].tenderIds.length > 0, "No tenders exists");
        uint256[] memory partyTenderIds = parties[_partyAddress].tenderIds;
        Tender[] memory tendersList = new Tender[](partyTenderIds.length);
        for (uint256 i = 0; i < partyTenderIds.length; i++) {
            tendersList[i] = tenders[partyTenderIds[i]];
        }
        return(tendersList);
    }

    function getTenderDetails(uint256 _tenderAddress) public view returns ( Tender memory){
        require(tenders[_tenderAddress].budget > 0 , "tender with address doesn't exists");
        return(tenders[_tenderAddress]);
    }

    function updateTenderStatus(uint256 _tenderAddress, TenderStatus _tenderStatus) public {
        Tender storage updatedTender = tenders[_tenderAddress];
        updatedTender.tenderStatus = _tenderStatus;
    }

    function updateTender(address _partyAddress, uint256 _tenderAddress, uint256 _budget, string memory _title, string memory _description, uint256 _deadline, uint256 _totalMilestones) public isTenderOwner(_partyAddress, _tenderAddress){
        Tender storage updatedTender = tenders[_tenderAddress];
        updatedTender.budget = _budget;
        updatedTender.title = _title;
        updatedTender.description = _description;
        updatedTender.deadline = _deadline;
        updatedTender.totalMilestones = _totalMilestones;
    }

    function deleteTender(address _partyAddress, uint256 _tenderAddress) public isTenderOwner(_partyAddress, _tenderAddress){ 
        require(parties[_partyAddress].tenderIds.length > 0, "No tenders exists");
        require(tenders[_tenderAddress].budget > 0 , "tender with address doesn't exists");
        require(tenders[_tenderAddress].tenderStatus == TenderStatus.NEW ||
                tenders[_tenderAddress].tenderStatus == TenderStatus.SUSPENDED , "tender cannot be deleted");
        uint256[] storage _tenderIds = parties[_partyAddress].tenderIds;
        for (uint i = 0; i < _tenderIds.length; i++){
            if(_tenderIds[i] == _tenderAddress){
                delete tenders[_tenderAddress];
                _tenderIds[i] = _tenderIds[_tenderIds.length - 1];
                _tenderIds.pop();
                break;
            }
        }
    }

    // @todo - add modifer for above functions

    modifier isTenderOwner(address _partyAddress, uint256 _tenderAddress) {
        require(tenders[_tenderAddress].issuerAddress == _partyAddress, "you're not authorized to perform this action");
        _;
    }

    modifier isBidOwner(address _bidderAddress, uint256 _bidId) {
        require(bids[_bidId].bidderAddress == _bidderAddress, "you're not authorized to perform this action");
        _;
    }

    function createBid(address _bidderAddress, uint256 _tenderAddress, string memory _bidClause, uint256 _quotedAmount) public{
        Tender storage tender = tenders[_tenderAddress];
        require(tender.budget > 0, "Tender does not exist");
        require(tender.tenderStatus == TenderStatus.OPEN, "Tender is not open for bids");
        require(block.timestamp > tender.deadline, "Bidding has ended");
        require(_bidderAddress != tender.issuerAddress, "Owner cannot bid on their own tender");

        Bid storage newBid = bids[bidCount];
        newBid.bidClause = _bidClause;
        newBid.quotedAmount = _quotedAmount;
        newBid.bidderAddress = _bidderAddress;
        newBid.tenderAddress = _tenderAddress;
        newBid.bidStatus = BidStatus.PENDING;
        newBid.createdAt = block.timestamp;
        tenders[_tenderAddress].bidIds.push(bidCount);
        bidCount++;
    }

    modifier canViewBid(address _bidderAddress, address _issuerAddress ,uint256 _tenderId, uint256 _bidId){
        require(bids[_bidId].bidderAddress == _bidderAddress  && tenders[_tenderId].issuerAddress == _issuerAddress && (msg.sender == _issuerAddress || msg.sender == _bidderAddress), "Not authorized to view bid details");
        _;
    }

    // For getting bid details like message, amount, address of bidders 
    function getBidDetails(address _bidderAddress, address _issuerAddress ,uint256 _tenderId, uint256 _bidId) public view canViewBid(_bidderAddress, _issuerAddress, _tenderId, _bidId) returns (Bid memory) {
	    require(bids[_bidId].quotedAmount > 0, "Bid does not exist");
    	return (bids[_bidId]);
    }

    // For getting all bids of a tender
    function getAllBids(address _partyAddress, uint256 _tenderId) public view isTenderOwner(_partyAddress, _tenderId) returns(Bid[] memory){
        require(tenders[_tenderId].bidIds.length > 0, "No bids exists");
        uint256[] memory tenderBidIds = tenders[_tenderId].bidIds;
        Bid[] memory bidsList = new Bid[](tenderBidIds.length);
        for (uint256 i = 0; i < tenderBidIds.length; i++) {
            bidsList[i] = bids[tenderBidIds[i]];
        }
        return(bidsList);
    }

    function updateBidStatus(address _partyAddress, uint256 _tenderAddress, uint256 _bidAddress ,BidStatus _bidStatus) public isTenderOwner(_partyAddress, _tenderAddress) {
        Bid storage updatedBid = bids[_bidAddress];
        updatedBid.bidStatus = _bidStatus;
    }

    function updateBid(address _bidderAddress, uint256 _bidId, string memory _bidClause, uint256 _quotedAmount) public isBidOwner(_bidderAddress, _bidId) {
        Bid storage updatedBid = bids[_bidId];
        updatedBid.bidClause = _bidClause;
        updatedBid.quotedAmount = _quotedAmount;
    }

    function deleteBid(address _bidderAddress, uint256 _tenderId ,uint256 _bidId) public isBidOwner(_bidderAddress, _bidId){ 
        require(tenders[_tenderId].bidIds.length > 0, "No bids exists");
        require(bids[_bidId].quotedAmount > 0 , "bid with address doesn't exists");
        require(bids[_bidId].bidStatus != BidStatus.PENDING , "bid cannot be deleted");
        uint256[] storage _bidIds = tenders[_tenderId].bidIds;
        for (uint i = 0; i < _bidIds.length; i++){
            if(_bidIds[i] == _bidId){
                delete bids[_bidId];
                _bidIds[i] = _bidIds[_bidIds.length - 1];
                _bidIds.pop();
                break;
            }
        }
    }

    modifier isValidTender(uint256 tenderId) {
        require(block.timestamp >= tenders[tenderId].deadline && tenders[tenderId].tenderStatus == TenderStatus.CLOSED);
        _;
    }

    function selectTopBids(address _partyAddress, uint256 _tenderId ) public view isTenderOwner(_partyAddress, _tenderId) isValidTender(_tenderId) returns (Bid[] memory) {
        //invoke this function once deadline is crossed and can be invoked by project issue party, make sure this project is not assigned to anyone------modifier
        // get all the bids for pt
        Bid[] memory bidList = getAllBids(_partyAddress, _tenderId);
        require(bidList.length > 0, "No bids exists");
        // sort bids by price
        for (uint i = 1; i < bidList.length; i++){
            for (uint j = 0; j < i; j++){
                if (bidList[i].quotedAmount < bidList[j].quotedAmount) {
                    Bid memory tempBid = bidList[i];
                    bidList[i] = bidList[j];
                    bidList[j] = tempBid;
                }
            }
        }
        uint256 shortListedBidsCount = (bidList.length < 5) ? bidList.length : 5; 
        Bid[] memory shortListedBids = new Bid[](shortListedBidsCount);
        for (uint i = 0; i < shortListedBidsCount; i++){
            shortListedBids[i] = bidList[i];
        }

        return shortListedBids;
        //returns a list of top 5 bidders and history of bidders

        // - in case of a tie, the bidder with the largest "trust" is given the project. ( Trust in this context is measured in terms of the number of previous projects done and the token assets a party has.)
        // update the status of each bid to APPROVED / REJECTED from PENDING.
    }

    function finaliseWinnerBid(address _partyAddress, uint256 _tenderId, uint256 _bidId) public isTenderOwner(_partyAddress, _tenderId){
        for(uint256 i=0;i<tenders[_tenderId].bidIds.length ;i++){
            if(tenders[_tenderId].bidIds[i] == _bidId)
                updateBidStatus(_partyAddress, _tenderId, tenders[_tenderId].bidIds[i], BidStatus.APPROVED);
            else 
                updateBidStatus(_partyAddress, _tenderId, tenders[_tenderId].bidIds[i], BidStatus.REJECTED);
        }
        tenders[_tenderId].tenderStatus = TenderStatus.ASSIGNED;
    }

}
