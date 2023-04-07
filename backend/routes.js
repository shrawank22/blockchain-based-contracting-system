function routes(app, web3, Party){

    app.get('/', (req,res)=>{
        res.json({"status":"success"})
    });

    app.get("/party", async(req,res,next) => {
        var party = await Party.deployed();
        var accounts = await web3.eth.getAccounts();
        party.getPartyDetails(accounts[0], {from:accounts[0]})
        .then((data)=>{
            console.log(data)
            res.json({"status":"success","respone" : data})
        })
        .catch(err=>{
            console.log(err)
            res.json({"status":"error","respone" : err})

        })

    })

    app.post("/party", async (req,res,next) => {
        var party = await Party.deployed();
        var accounts = await web3.eth.getAccounts();
        party.createParty("sdasd","sds","Dsd","DSad", accounts[0], {from: accounts[0]})
        .then((data)=>{
            console.log(data)
            res.json({"status":"success","respone" : data})
        })
        .catch(err=>{
            console.log(err)
        })
    })
    
}

module.exports = routes