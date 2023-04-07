function routes(app, web3, Party){

    app.get('/', (req,res)=>{
        res.json({"status":"success"})
    });

    app.get("/api/party", async(req,res,next) => {
        var party = await Party.deployed();
        var accounts = await web3.eth.getAccounts();
        party.getPartyDetails(req.query.id, {from:req.query.id})
        .then((data)=>{
            res.json({"status":"success","respone" : data})
        })
        .catch(err=>{
            res.json({"status":"error","respone" : err.message})

        })

    })

    app.post("/api/party/register/", async (req,res,next) => {
        const {email, password, user_name, wallet_id, contact_number} = req.body;
        var party = await Party.deployed();
        var accounts = await web3.eth.getAccounts();
        party.createParty(user_name, contact_number, email, password, wallet_id, {from: wallet_id})
        .then((data)=>{
            res.json({"status":"success","respone" : data})
        })
        .catch(err=>{
            res.json({"status":"error","respone" : err.message})
        })
    })
    
}

module.exports = routes