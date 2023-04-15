// SPDX-License-Identifier: UNLICENSED

//the version of solidity that is compatible
import "./PartyContract.sol";
enum TenderStatus{ NEW, OPEN, CLOSED, SUSPENDED, ASSIGNED } //created---OPEN, deadline crosses---CLOSED, project is assigned ---- ASSIGNED
import "./Token.sol";

pragma solidity ^0.8.0;
contract TenderContract is PartyContract {
    // Tender Structure
    struct Tender {
        string title;
        string description;
        uint256 budget;
        address issuerAddress;
        TenderStatus tenderStatus; 
        uint256 createdAt;
        uint256 deadline;
        uint256 totalMilestones;
        uint256 tenderId;
        address[] validatorsAddresses;
        bool[] validationVotes;
        uint256[] milestoneTimePeriods;
        uint256[] bidIds;
        uint256 balance;
    }

    // Token public tokenRef;

    constructor() PartyContract(){
        // tokenRef = _tokenRef;
    }

    mapping (uint256 => Tender) public tenders;
    uint256 tenderCount = 0;

    //setters and getter functions
    function getTenderCount() public view returns(uint256){
        return tenderCount;
    }
    
    function getValidators(uint256 _tenderId) public view returns(address[] memory) {
        return tenders[_tenderId].validatorsAddresses;
    }
    
    function getTotalProjectDays(uint256 _tenderId) public view returns(uint256) {
        uint256 sum = 0;
        uint256[] memory milestoneTimePeriods = tenders[_tenderId].milestoneTimePeriods;
        uint256 len = milestoneTimePeriods.length;
        for(uint256 i=0; i < len; i++) {
            sum += milestoneTimePeriods[i];
        }
        return sum;
    }

    function getBudget(uint256 _tenderId) public view returns(uint256){
        return tenders[_tenderId].budget;
    }

    function getTenderStatus(uint256 _tenderId) public view returns(TenderStatus){
        return tenders[_tenderId].tenderStatus;
    }

    function getDeadline(uint256 _tenderId) public view returns(uint256){
            return tenders[_tenderId].deadline;
    }

    function getBidIds(uint256 _tenderId) public view returns(uint256[] memory){
        return tenders[_tenderId].bidIds;
    }

    function getIssuerAddress(uint256 _tenderId) public view returns(address){
        return tenders[_tenderId].issuerAddress;
    }

    function getTotalMilestones(uint256 _tenderId) public view returns(uint256){
            return tenders[_tenderId].totalMilestones;
    }

    function getBidsCount(uint256 _tenderId) public view returns(uint256){
            return tenders[_tenderId].bidIds.length;
    }

    function addBidId(uint256 _tenderId, uint256 bidId) public {
        tenders[_tenderId].bidIds.push(bidId);
    }

    function setBidIds(uint256[] memory _tenderBidIds, uint256 _tenderId) public{
        tenders[_tenderId].bidIds = _tenderBidIds;
        tenders[_tenderId].bidIds.pop();
    }

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
        newTender.tenderId = tenderCount;
        newTender.totalMilestones = _totalMilestones;
        //Sort all the parties by their trust scores
        address[] memory sortedlist = sortByTrustScore();
        uint len = sortedlist.length;
        uint count = 0;
        //If there are less than 10 parties then set number to parties to len
        len = (len < 10)?len:10;
        //Add the validator addresses to validatorsAddresses array, also add tenderId to tenderIdsToValidate array
        while(count < len)
        {
            if(sortedlist[len-count-1] != parties[msg.sender].partyAddress)
            {
            newTender.validatorsAddresses.push(sortedlist[len-count-1]);
            parties[sortedlist[len-count-1]].tenderIdsToValidate.push(tenderCount);
            count ++;
            }
        }
        parties[_partyAddress].tenderIds.push(tenderCount);
        tenderCount++;
    }

    //Function to sort all the parties by their trust score
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
    
    //Function using which validators can validate tenders
    function validate(uint256 _tenderId, bool _vote) public {
        bool valid = false;
        Tender storage newTender = tenders[_tenderId];
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
            if(_vote) {
                newTender.validationVotes.push(_vote); // adds vote only if transaction is successful
                
            }
        }
        else
        {
            revert("You're not authorized to validate this tender.");
        }
    }
    
    //Check if the tender is ongoing
    function checkTenderValidation(uint256 _tenderId) public {
        Tender storage newTender = tenders[_tenderId];
        if(isValid(newTender.validationVotes)) {
            updateTenderStatus(_tenderId, TenderStatus.OPEN);
        }
    }
    
    //Check if a tender is valid or not i.e., it got minimum 6 positive votes
    function isValid(bool[] memory _validationVotes) public pure returns (bool) {
        uint voteCount = 0;
        uint256 totalValidators = _validationVotes.length;
        for(uint i=0; i<totalValidators; i++)
        {
            if(_validationVotes[i])
            {
                voteCount++;
            }
        }

        if(voteCount > (totalValidators/2))
        {
            return true;
        }
        return false;
    }

    function getTendersToValidate(address _partyAddress) public isOwner(_partyAddress) view returns(uint256[] memory){
        return(parties[_partyAddress].tenderIdsToValidate);
    }

    function getAllActiveTenders() public view returns (Tender[] memory, uint256){
        require(tenderCount > 0, "No tenders exists");
        uint256 count=0;
        Tender[] memory tendersList = new Tender[](tenderCount);
        for (uint256 i = 0; i < tenderCount; i++) {
            if(tenders[i].tenderStatus == TenderStatus.OPEN){
                 tendersList[i] = tenders[i];
                 count++;
            }
        }
        return(tendersList, count);
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

    function getTenderDetails(uint256 _tenderId) public view returns ( Tender memory){
        require(tenders[_tenderId].budget > 0 , "tender with address doesn't exists");
        return(tenders[_tenderId]);
    }

    function updateTenderStatus(uint256 _tenderId, TenderStatus _tenderStatus) public {
        Tender storage updatedTender = tenders[_tenderId];
        updatedTender.tenderStatus = _tenderStatus;
    }

    function updateTender(address _partyAddress, uint256 _tenderId, uint256 _budget, string memory _title, string memory _description, uint256 _deadline, uint256 _totalMilestones) public isTenderOwner(_partyAddress, _tenderId){
        require(parties[_partyAddress].tenderIds.length > 0, "No tenders exists");
        require(tenders[_tenderId].budget > 0 , "tender with address doesn't exists");
        require(tenders[_tenderId].tenderStatus == TenderStatus.NEW ||
                tenders[_tenderId].tenderStatus == TenderStatus.SUSPENDED , "tender cannot be updated");
        Tender storage updatedTender = tenders[_tenderId];
        updatedTender.budget = _budget;
        updatedTender.title = _title;
        updatedTender.description = _description;
        updatedTender.deadline = _deadline;
        updatedTender.totalMilestones = _totalMilestones;
    }

    function deleteTender(address _partyAddress, uint256 _tenderId) public isTenderOwner(_partyAddress, _tenderId){ 
        require(parties[_partyAddress].tenderIds.length > 0, "No tenders exists");
        require(tenders[_tenderId].budget > 0 , "tender with address doesn't exists");
        require(tenders[_tenderId].tenderStatus == TenderStatus.NEW , "tender cannot be deleted");
        uint256[] storage _tenderIds = parties[_partyAddress].tenderIds;
        for (uint i = 0; i < _tenderIds.length; i++){
            if(_tenderIds[i] == _tenderId){
                delete tenders[_tenderId];
                _tenderIds[i] = _tenderIds[_tenderIds.length - 1];
                _tenderIds.pop();
                break;
            }
        }
    }

    // @todo - add modifer for above functions

    modifier isTenderOwner(address _partyAddress, uint256 _tenderId) {
        require(tenders[_tenderId].issuerAddress == _partyAddress, "you're not authorized to perform this action");
        _;
    }

    
}
