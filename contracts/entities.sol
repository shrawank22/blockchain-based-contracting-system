// SPDX-License-Identifier: UNLICENSED

//the version of solidity that is compatible

pragma solidity >=0.7.0 <0.9.0;
enum TenderStatus{ NEW, OPEN, CLOSED, SUSPENDED, ASSIGNED } //created---OPEN, deadline crosses---CLOSED, project is assigned ---- ASSIGNED

enum ProjectStatus{ ASSIGNED, ONGOING, COMPLEDTED }

enum BidStatus{PENDING, REJECTED, APPROVED}

// Bidding Struct
struct Bid {
    string bidClause;
    uint256 quotedAmount;
    address bidderAddress;
    uint256 tenderAddress;
    BidStatus bidStatus;
    uint256 createdAt;
}
    
// Project/Tender Structure
struct Tender {
    string title;
    string description;
    uint256 budget;
    address issuerAddress;
    TenderStatus tenderStatus; 
    uint256 createdAt;
    uint256 deadline;
    uint256 totalMilestones;
    address tenderAddress;
    address[] validatorsAddresses;
    uint256[] milestoneTimePeriods;
    uint256[] bidIds;
}

// Party Structure
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

    