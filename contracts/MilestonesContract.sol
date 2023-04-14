// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import './PartyContract.sol';
import './BidContract.sol';

enum ProjectStatus{ ONGOING, COMPLETED, HALTED } //bid selected - ONGOING, project completed - COMPLETED, project suspended - HALTED

contract MilestonesContract {
    PartyContract public partyRef;
    TenderContract public tenderRef;
    BidContract public bidRef;

    struct Projects {
        uint256 tenderId;
        address issuerAddress;
        address bidderAddress;
        uint[] milestoneTimePeriods;
        uint[] completedMilestoneTimePeriods;
        int[] workScore;
        bool approvalFromIssuer;
        ProjectStatus projectStatus;
    }

    constructor(PartyContract _partyRef, TenderContract _tenderRef, BidContract _bidRef){
        partyRef = _partyRef;
        tenderRef = _tenderRef;
        bidRef = _bidRef;
    }
    mapping (uint256 => Projects) projects;

    function setMilestoneTimeline(uint[] memory _milestoneTimePeriods, uint256 _bidId, uint256 _tenderId) public {
        address issuerAddress = tenderRef.getIssuerAddress(_tenderId);
        require(issuerAddress == msg.sender, "You're not authorized to perform this function.");
        Projects storage newProject = projects[_tenderId];
        address _bidderAddress = bidRef.getBidderAddress(_bidId);
        newProject.milestoneTimePeriods = _milestoneTimePeriods;
        newProject.issuerAddress = msg.sender;
        newProject.bidderAddress = _bidderAddress;
        newProject.tenderId = _tenderId;
        newProject.approvalFromIssuer = false;
        newProject.projectStatus = ProjectStatus.ONGOING;
        projects[_tenderId] = newProject;
    }

    function markMilestoneComplete(uint256 _tenderId, uint _milestoneNumber, uint _days) public {
        Projects storage project = projects[_tenderId];
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
        address issuerAddress = tenderRef.getIssuerAddress(_tenderId);
        require(issuerAddress == msg.sender, "You're not authorized to perform this action.");
        Projects storage project = projects[_tenderId];
        project.approvalFromIssuer = approval;
    }

    function projectCompleted(uint256 _tenderId) public {
        address issuerAddress = tenderRef.getIssuerAddress(_tenderId);
        require(issuerAddress == msg.sender, "You're not authorized to perform this action.");
        Projects storage project = projects[_tenderId];
        project.projectStatus = ProjectStatus.COMPLETED;
        // Party memory bidder = PC.getPartyDetails(project.bidderAddress);
        uint256 trustScore = partyRef.getTrustScore(project.bidderAddress);
        int oldTrustScore = int(trustScore);
        uint len = project.workScore.length;
        int sum = 0;
        for(uint i=0; i < len; i++) {
            sum = sum + project.workScore[i];
        }
        int avgWorkScore = sum/int(len);
        uint256 newTrustScore = uint(oldTrustScore + avgWorkScore);

        if(newTrustScore > 5) {
            trustScore = 5;
        }
        else if(newTrustScore < 0) {
            trustScore = 0;
        }
        else {
            trustScore = newTrustScore;
        }
        partyRef.setTrustScore(project.bidderAddress, trustScore);
    }

    function projectHalt(uint256 _tenderId) public {
        address issuerAddress = tenderRef.getIssuerAddress(_tenderId);
        require(issuerAddress == msg.sender, "You're not authorized to perform this action.");
        Projects storage project = projects[_tenderId];
        project.projectStatus = ProjectStatus.HALTED;
    }
}
