// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import './PartyContract.sol';
import './BidContract.sol';

enum ProjectStatus{ ONGOING, COMPLETED, HALTED } //bid selected - ONGOING, project completed - COMPLETED, project suspended - HALTED

contract MilestonesContract is BidContract {
    PartyContract PC;

    struct Projects {
    address tenderAddress;
    address issuerAddress;
    address bidderAddress;
    uint[] milestoneTimePeriods;
    uint[] completedMilestoneTimePeriods;
    int[] workScore;
    bool approvalFromIssuer;
    ProjectStatus projectStatus;
    }

    mapping (address => Projects) projects;

    function setMilestoneTimeline(uint[] memory _milestoneTimePeriods, uint256 _bidId, uint256 _tenderId) public {
        Tender memory tender = PC.getTenderDetails(_tenderId);
        require(tender.issuerAddress == msg.sender, "You're not authorized to perform this function.");
        Projects storage newProject = projects[tender.tenderAddress];
        Bid memory bid = bids[_bidId];
        address _bidderAddress = bid.bidderAddress;
        newProject.milestoneTimePeriods = _milestoneTimePeriods;
        newProject.issuerAddress = msg.sender;
        newProject.bidderAddress = _bidderAddress;
        newProject.tenderAddress = tender.tenderAddress;
        newProject.approvalFromIssuer = false;
        newProject.projectStatus = ProjectStatus.ONGOING;
        projects[tender.tenderAddress] = newProject;
    }

    function markMilestoneComplete(uint256 _tenderId, uint _milestoneNumber, uint _days) public {
        Tender memory tender = PC.getTenderDetails(_tenderId);
        Projects storage project = projects[tender.tenderAddress];
        require(project.bidderAddress == msg.sender, "You're not authorized to perform this action.");
        require(project.completedMilestoneTimePeriods[_milestoneNumber-1] == 0, "Milestone already completed.");
        //modify trustscore
        //save days in milestoneCompletion[milestoneNumber-1] after getting approval from issuer
        bool approval = project.approvalFromIssuer;
        if(approval) {
            project.completedMilestoneTimePeriods[_milestoneNumber-1] = _days;
            int decidedDays = int(project.milestoneTimePeriods[_milestoneNumber-1]);
            project.workScore[_milestoneNumber-1] = int((decidedDays - int(_days)) / decidedDays);
            project.approvalFromIssuer = false;
        }
    }

    function approveMilestoneCompletion(uint256 _tenderId, bool approval) public {
        Tender memory tender = PC.getTenderDetails(_tenderId);
        require(tender.issuerAddress == msg.sender, "You're not authorized to perform this action.");
        Projects storage project = projects[tender.tenderAddress];
        project.approvalFromIssuer = approval;
    }

    function projectCompleted(uint256 _tenderId) public {
        Tender memory tender = PC.getTenderDetails(_tenderId);
        require(tender.issuerAddress == msg.sender, "You're not authorized to perform this action.");
        Projects storage project = projects[tender.tenderAddress];
        project.projectStatus = ProjectStatus.COMPLETED;
        Party memory bidder = PC.getPartyDetails(project.bidderAddress);
        int oldTrustScore = int(bidder.trustScore);
        uint len = project.workScore.length;
        int sum = 0;
        for(uint i=0; i < len; i++) {
            sum = sum + project.workScore[i];
        }
        int avgWorkScore = sum/int(len);
        uint256 newTrustScore = uint(oldTrustScore + avgWorkScore);

        if(newTrustScore > 5) {
            bidder.trustScore = 5;
        }
        else if(newTrustScore < 0) {
            bidder.trustScore = 0;
        }
        else {
            bidder.trustScore = newTrustScore;
        }
    }

    function projectHalt(uint256 _tenderId) public {
        Tender memory tender = PC.getTenderDetails(_tenderId);
        require(tender.issuerAddress == msg.sender, "You're not authorized to perform this action.");
        Projects storage project = projects[tender.tenderAddress];
        project.projectStatus = ProjectStatus.HALTED;
    }
}
