// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract ContractingPlatform {

    //Bidding Struct
    struct Bid {
        string message;
        uint256 amount;
        address bidder;
    }
    
    // Project Structure
    struct Project {
        string title;
        string description;
        uint256 budget;
        bool isOpen;
        uint256[] bidIds;
        mapping(uint256 => Bid) bids;
        address payable creator; 
        uint256 deadline;
        address payable lowestBidder;
        uint256 lowestBid;
    }

    // Party Structure
    struct Party {
        string name;
        address partyAddress;
        uint256[] projectIds;
        mapping(uint256 => Project) projects;
    }
    
    mapping (address => Party) public parties;
    address[] public partyAddresses;
    
    uint256 public projectCount;
    
    address public admin;
    
    constructor() {
        admin = msg.sender;
    }
    
    // Function for creating party
    function createParty(string memory _name, address _partyAddress) public {
        require(msg.sender == admin, "Only admin can create a party");
        require(parties[_partyAddress].partyAddress == address(0), "Party already exists");

        Party storage newParty = parties[_partyAddress];
        newParty.name = _name;
        newParty.partyAddress = _partyAddress;
        newParty.projectIds = new uint256[](0);
        partyAddresses.push(_partyAddress);
    }

    //Function for updating party
    function updateParty(string memory _name, address _partyAddress) public {
        require(parties[_partyAddress].partyAddress != address(0), "Party does not exist");
        // require(msg.sender == admin, "Only admin can update/delete party details.");
        require(msg.sender == parties[_partyAddress].partyAddress, "Only party owner can update/delete party details.");
        Party storage updatedParty = parties[_partyAddress];
        updatedParty.name  = _name;
    }
    
    //Function for deleting a party on platform
    function deleteParty(address _partyAddress) public {
        require(parties[_partyAddress].partyAddress != address(0), "Party does not exist");
        require(msg.sender == parties[_partyAddress].partyAddress, "Only party owner can update/delete party details.");
        delete parties[_partyAddress];
        for (uint256 i = 0; i < partyAddresses.length; i++) {
            if (partyAddresses[i] == msg.sender) {
                partyAddresses[i] = partyAddresses[partyAddresses.length - 1];
                partyAddresses.pop();
                break;
            }
        }
    }
    
    // Function for creating a project
    function createProject(uint256 _budget, string memory _title, string memory _description, uint256 _deadline) public returns (uint256) {
        require(parties[msg.sender].partyAddress != address(0), "Party does not exist");
        uint256 projectId = projectCount;
        Project storage newProject = parties[msg.sender].projects[projectId];
        newProject.title = _title;
        newProject.description = _description;
        newProject.budget = _budget;
        newProject.isOpen = true;
        newProject.bidIds = new uint256[](0);
        newProject.creator = payable(msg.sender);
        newProject.deadline = _deadline;
        newProject.lowestBidder = payable(address(0));
        newProject.lowestBid = 0;
        parties[msg.sender].projectIds.push(projectId);
        projectCount++;
        return projectId;
    }

    // Function for updating projects
    function updateProject(uint256 _projectId, uint256 _newBudget, string memory _newTitle, string memory _newDescription, uint256 _newDeadline) public {
        require(parties[msg.sender].projects[_projectId].budget > 0, "Project does not exist");
        require(parties[msg.sender].projects[_projectId].creator == msg.sender, "Only the creator of the project can update it");
        require(parties[msg.sender].projects[_projectId].isOpen, "Project is closed and cannot be updated");
        parties[msg.sender].projects[_projectId].budget = _newBudget;
        parties[msg.sender].projects[_projectId].title = _newTitle;
        parties[msg.sender].projects[_projectId].description = _newDescription;
        parties[msg.sender].projects[_projectId].deadline = _newDeadline;
    }
    
    // Function for closing projects
    function closeProject(uint256 _projectId) public {
        Project storage project = parties[msg.sender].projects[_projectId];
        require(project.budget > 0, "Project does not exist");
        require(msg.sender == project.creator, "Only the owner can end the project");
        require(block.timestamp >= project.deadline, "Bidding has not yet ended");
        require(project.isOpen, "Project is already closed");
        project.isOpen = false;
        project.lowestBidder.transfer(parties[msg.sender].projects[_projectId].lowestBid);
    }

    // Function for getting details of a particular party
    function getPartyDetails(address _partyAddress) public view returns (string memory, address) {
        require(parties[_partyAddress].partyAddress != address(0), "Party does not exist");
        return (parties[_partyAddress].name, parties[_partyAddress].partyAddress);
    }

    // Function for getting project counts
    function getProjectCount(address _partyAddress) public view returns (uint256) {
	 require(parties[_partyAddress].partyAddress != address(0), "Party does not exist");
	 return parties[_partyAddress].projectIds.length;
    }

    // Function for getting all the projects ids associated with a particular party
    function getProjectIds(address _partyAddress) public view returns (uint256[] memory) {
	require(parties[_partyAddress].partyAddress != address(0), "Party does not exist");
	return parties[_partyAddress].projectIds;
    }

    // Function for getting details of a project
    function getProjectDetails(address _partyAddress, uint256 _projectId) public view returns (string memory, string memory, uint256, bool) {
	require(parties[_partyAddress].projects[_projectId].budget > 0, "Project does not exist");
	return (
            parties[_partyAddress].projects[_projectId].title,
            parties[_partyAddress].projects[_projectId].description,
            parties[_partyAddress].projects[_projectId].budget,
            parties[_partyAddress].projects[_projectId].isOpen
	);
    }
}




