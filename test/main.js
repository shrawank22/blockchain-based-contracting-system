const { assert } = require("console");


const ContractingPlatform = artifacts.require("ContractingPlatform");

contract("ContractingPlatform", accounts => {
    let contractingPlatform = null;
    before(async() => {
        contractingPlatform = await ContractingPlatform.deployed();
    })

    it("Smart contract should deployed successfully", async() => {
        console.log(contractingPlatform.address);
        assert(contractingPlatform !== '')
    })

    // it("Smart contract should create a new party", async() => {
    //     await contractingPlatform.createParty("Shrawan1", "7870577237", "shrawan@yahoomail.com", "kuchV@1.0", accounts[1], {from: accounts[1]});
    //     await contractingPlatform.createParty("Shrawan2", "7870577237", "shrawan@yahoomail.com", "kuchV@1.0", accounts[2], {from: accounts[2]});
    //     await contractingPlatform.createParty("Shrawan3", "7870577237", "shrawan@yahoomail.com", "kuchV@1.0", accounts[3], {from: accounts[3]});
    //     await contractingPlatform.createParty("Shrawan4", "7870577237", "shrawan@yahoomail.com", "kuchV@1.0", accounts[4], {from: accounts[4]});
    //     await contractingPlatform.createParty("Shrawan5", "7870577237", "shrawan@yahoomail.com", "kuchV@1.0", accounts[5], {from: accounts[5]});
    //     await contractingPlatform.createParty("Shrawan6", "7870577237", "shrawan@yahoomail.com", "kuchV@1.0", accounts[6], {from: accounts[6]});

    //     const party = await contractingPlatform.getPartyDetails(accounts[1]);
    //     // console.log(party)

    //     assert(party[0] == 'Shrawan1')
    //     assert(party[1] == 'shrawan@yahoomail.com')
    //     assert(party[2] == '7870577237')
    //     assert(party[3] == 'kuchV@1.0')
    //     assert(party[4] == accounts[1])
    // })

    // it("Smart contract should return the number of parties created", async() => {
    //     const partyCount = await contractingPlatform.getPartyCount();  
    //     // console.log(partyCount.words[0]);

    //     assert(partyCount.words[0] == 6)
    // })

    // it("Smart contract should update party", async() => {
    //     await contractingPlatform.updateParty("Shrawan2U", "kuchV@2.0", accounts[2], {from: accounts[2]});
    //     const party = await contractingPlatform.getPartyDetails(accounts[2]);
    //     // console.log(party)
    //     assert(party[0] == 'Shrawan2U')
    //     assert(party[3] == 'kuchV@2.0')
    //     assert(party[4] == accounts[2])
    // })

    // it("Smart contract should delete the party", async() => { 
    //     await contractingPlatform.deleteParty(accounts[3], {from: accounts[3]});
    //     // const party = await contractingPlatform.getPartyDetails(accounts[3]);  // This will give error since party is deleted. 
    //     // console.log(party)  

    //     const partyCount = await contractingPlatform.getPartyCount();  
    //     assert(partyCount.words[0] == 5)
    // })

    // it("Smart contract return the adrress of a particular party", async() => { 
    //     const add0 = await contractingPlatform.getPartyAddress(0);
    //     const add1 = await contractingPlatform.getPartyAddress(1);
    //     const add2 = await contractingPlatform.getPartyAddress(2);
    //     const add3 = await contractingPlatform.getPartyAddress(3);
    //     const add4 = await contractingPlatform.getPartyAddress(4);
        
    //     // console.log(add0);
    //     // console.log(add1);
    //     // console.log(add2);
    //     // console.log(add3);
    //     // console.log(add4);

    //     assert(add0 == accounts[1])
    //     assert(add1 == accounts[2])
    //     assert(add2 == accounts[6])
    //     assert(add3 == accounts[4])
    //     assert(add4 == accounts[5])
        
    // })

})
