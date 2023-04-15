
<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="./frontend/src/assets/images/smart-bidding-low-resolution-color-logo.png" alt="Project logo">
 </a>
 <h1 style="text-align:center;">Blockchain Based Online Contracting/Tendering System</h1>
</p>

<h3 align="center">test</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/shrawank22/blockchain-based-contracting-system/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/shrawank22/blockchain-based-contracting-system/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> The Blockchain Based Online Contracting/Tendering System is a multi-party blockchain system for recording, issuing and updating contracts for "M"
projects amongst "N" parties, each party start with a fixed number of tokens at start and gain/lose tokens as they get more projects or fail to deliver the same on time (duration "t" years). Our project uses blockchain technology which emphasis on the user security and anonymity, solidity programming language, and Truffle to deploy the contracts into Ganache local network. 
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)
- [References](#references)

## 🧐 About <a name = "about" id="about"></a>

This a blockchain based Online contracting DApp which for tender creation and bidding. This DApp gives better tender management than the existing DApp because it inovoles validators to validate the tenders before parties can bid on the tenders. Thus, this increases the trust of the platform and smooth functioning of online contracting. Also after the tender is assigned to a project, the platform also offers the managemnet of project by tracking milestones until its completion. The parties, validators, bidders, stakeholders receive rewards as each milestones are completed.

## 🏁 Getting Started <a name = "getting_started" id= "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

The softwares to install are:
- npm
```
https://www.npmjs.com/
```
- NodeJs
```
https://nodejs.org/
```
- Angular-cli
```
https://angular.io/cli
```
- Ganche test newtork
```
https://trufflesuite.com/ganache/
```
- Metamask wallet
```
https://metamask.io/download/
```
- Postman
```
https://www.postman.com/downloads/
```
- Visual Studio Code
```
https://code.visualstudio.com/download
```

### Installing

Follow the below steps to run the code in local environment:
1. Clone the project repository
    ```
    git clone https://github.com/shrawank22/blockchain-based-contracting-system.git

    ``` 
2. In the root directory of the project to install nodu=e module from package.json for contacts and backend
    ```
    npm install

    ```
3. Go the frontend directory of the project in another terminal to install nodu=e module from package.json for frontend angular app
    ```
    npm install

    ```
4. To compile and deploy the contracts into ganache test network
 - remote ganche network
  - add the following to truffle-config.js to
    ```
    networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" //Match any network id
     }
    },

    ```
  - add the following to server.js to listen to the remote ganche test netowrk
    ```
    const Web3 = require('web3');
    var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

    ```
  - Command to start ganche network
    ```
    ganche-cli

    ```
  - command to compile and deploy the contracts
    ```
    truffle compile
    truffle migrate

    ```

 - local ganche network
  - add the following to truffle-config.js to
    ```
    networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" //Match any network id
     }
    },

    ```
  - add the following to server.js to listen to the remote ganche test netowrk
    ```
    const Web3 = require('web3');
    var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))

    ```
  - To start local ganache network open the Ganache apllication in either quickstart or workspace

  - command to compile and deploy the contracts
    ```
    truffle compile
    truffle migrate

    ```
5. Start the NodeJs server using the following command:
    ```
    npm run satrt

    ```
    The server is started on http://127.0.0.1:8082 listening to ganache test network.

6. Now run the frontend angular app using the following command
    ```
    npm start

    ```
    The Angular app starts on http://localhost:4200

7. To run test files for smart contracts in truffle
   ```
   truffle test

   ```


## 🎈 Usage <a name="usage" id="usage"></a>

1. The http://localhost:4200/ lands you on login page. To register on the platform click on register link.
2. Once the user/party register , it asks you to login.
3. After logging in you can see you profile name on the navbar. You can find various pages on the dashboard.
4. The dashboard contains the tenders that need to be validated by party if any, then select the winner bid out of top 5 bids, if any of party tender.
5. Then active tenders contains the list of all ongoing tenders you can bid to as long as party are not owner or validator of the project.
6. The tenders tab contains all the tenders created by the tender. party can edit or delete only the newly created tenders and view the bids placed on it once the tender is accepting bids.
7. The Bids tab contains all the bids the party placed on various tenders. Party can edit/delete with the tender deadline only and view the tender details of each bid.
8. Finally, the project tab contains the project created by or assigned to party and milestones tracking.
9. The party logout from the app by clicking on profile -> logout.

### Steps to use the DApp
1. Visit the page http://localhost:4200/ after starting ganache, NodeJs server and angular app, then import the secong ganache account into metamsk wallet as the first address is where our contracts are deployed.
2. Now click on register and fill in the details. To fetched wallet id from metamask, click on the button next to it. It should automatically fill in your address and submit the form to register.
3. Once registration is successful , go to login page and connect to wallet same way as in above step, type your password and login. Voila, now you can access the DApp.
4. To get started, create a tender by going to tenders tab of dashboard. here you can place a tender by clicking on create tender and entering the tender details. On submiting it  tender is created. Now the tender is in new state , so it can be edited and deleted. But the tender is not open to bid.
5. The tender is then validated validators, which not implemented on UI but has written api and backend code to update the status on validation to new state. to update tender status use the following api in postman
    ```
    POST http://localhost:8082/api/tender/update-status

    body:
    {
      "tenderId": 0,
      "tenderStatus": 1,
      "issuerAddress": "0x132527dC4c9F39bD650F03d51D6217152AFe26Fa"
    }
    
    ```
6. Now the tender is in open state, then it is ready to accept bids. Click on place bids and enter details and click on save. This action cannot be done by owner of tender, so create another account as directed in step 1 and 2. Now from this account the active tender open for bids can be see and the party can place bids.
7. once the bid is created, you can view it in Bids tab along with the tender on which bid was placed. This bid can be viewed by tender owner and bidder but can edited/deleted by bidder only(restricted for security). Also the bid can be edited/ deleted in pending state i.e., before tender deadline.
8. Now there projects when the tenders after assigning to bidder will appear and milestones are tracked(incomplete on Ui, but written functionality in smart contracts )
9. Similarily, the validate tender and bid selection happens in dashboard tab(incomplete on Ui, but written functionality in smart contracts )
10. for all the token implementation, and the reward system, trustScore implementation (incomplete on Ui, but written functionality in smart contracts ).


## ⛏️ Built Using <a name = "built_using" id="built_using"></a>

- [Ganache](https://trufflesuite.com/ganache/) - Ethereun Test Network
- [Tuffle](https://trufflesuite.com/) - Ethereum compiler and deployer
- [Solidity](https://docs.soliditylang.org/) - Blockchain smart contracts framework
- [Express](https://expressjs.com/) - Server Framework
- [Angular](https://angular.io/) - Web Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors" id="authors"></a>

- [@shrawank22](https://github.com/shrawank22) 
- [@Kapil-K-Kathiriya](https://github.com/Kapil-K-Kathiriya) 
- [@asheejain](https://github.com/asheejain) 
- [@Srujana41](https://github.com/Srujana41) 

## 🎉 References <a name = "references" id="references"></a>

- https://dev.to/willkre/create-deploy-an-erc-20-token-in-15-minutes-truffle-openzeppelin-goerli-33lb
- https://github.com/agbanusi/Music-share-platform-through-Blockchain
- https://docs.openzeppelin.com/contracts/3.x/erc20
- https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol
- https://medium.com/coinmonks/5-minute-guide-to-deploying-smart-contracts-with-truffle-and-ropsten-b3e30d5ee1e
