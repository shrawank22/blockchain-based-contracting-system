const TenderContract = artifacts.require("TenderContract");
const {expectRevert} = require("@openzeppelin/test-helpers");

contract("TenderContract",(accounts)=>{
    let tender=null;
    before(async()=>{ 
        tender = await TenderContract.deployed();
    //    console.log(tender.address);
    })
    

    it("Smart contract should deployed successfully", async() => {
        console.log(tender.address);
        assert(tender !== '')
    })

    it("If party creator address(metamask address) and party address(which we add while creating party) does not match", async()=>{
        await expectRevert(
            tender.createTender(accounts[2],200,"Project1","Description1",123456,4, {from: accounts[1]}), //Address are not same 
            "Caller is not owner"
        )

    });

    // it("Party does not have sufficient fund to create tender", async() => {
    //     await expectRevert(
    //         tender.createTender(accounts[1],50,"Project1","Description1",123456,4, {from: accounts[1]}), 
    //         "insufficient funds to create a tender"
    //     )
    // })

    it("Creating new tender successfully...", async() => {
        await tender.createTender(accounts[1],200,"Project1","Description1",123456,4, {from: accounts[1]});
        await tender.createTender(accounts[2],200,"Project2","Description2",123456,4, {from: accounts[2]});
        await tender.createTender(accounts[3],200,"Project3","Description3",123456,4, {from: accounts[3]});
        await tender.createTender(accounts[4],200,"Project4","Description4",123456,4, {from: accounts[4]});
        await tender.createTender(accounts[5],200,"Project5","Description5",123456,4, {from: accounts[5]});
        await tender.createTender(accounts[6],200,"Project6","Description6",123456,4, {from: accounts[6]});

        const newtender = await tender.getTenderDetails(0,{from: accounts[1]});
        // console.log(typeof newtender);
        // console.log(newtender);
        // assert(newtender[2]==="Project1");
    })


    it("Only owner of tender can delete the tender ", async()=>{
        await expectRevert(
            tender.deleteTender(accounts[2],0, {from: accounts[1]}), //Address are not same 
            "you're not authorized to perform this action"
        )

    });

    // it("You can delete tender only if tender is exist ", async()=>{
    //     await expectRevert(
    //         tender.deleteTender(accounts[10],0, {from: accounts[10]}), //2 is tender ID
    //         "No tenders exists"
    //     )

    // });

    // it("You can delete tender if there status is NEW ", async()=>{
    //     await expectRevert(
    //         tender.deleteTender(accounts[1],0, {from: accounts[1]}), 
    //         "tender cannot be deleted"
    //     )

    // });



    it("Updating tender successfully...", async() => {
        await tender.updateTender(accounts[1],0,200000,"Project11111","Description11111",123450256,40, {from: accounts[1]});
    })


    

it("Delete tender successfully...", async() => {
        await tender.deleteTender(accounts[1],0, {from: accounts[1]});

})
});
