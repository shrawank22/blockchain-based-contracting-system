function routes(app, web3, Party){

    app.get('/', (req,res)=>{
        res.json({"status":"success"})
    });

    app.get("/api/party", async(req,res,next) => {
        var party = await Party.deployed();
        var accounts = await web3.eth.getAccounts();
        party.getPartyDetails(req.query.id, {from:req.query.id})
        .then((data)=>{
            res.json({"status":"success","response" : data})
        })
        .catch(err=>{
            res.json({"status":"error","response" : err.message})

        })

    })

    app.post("/api/party/register/", async (req,res,next) => {
        const {email, password, user_name, wallet_id, contact_number} = req.body;
        var party = await Party.deployed();
        var accounts = await web3.eth.getAccounts();
        party.createParty(user_name, contact_number, email, password, wallet_id, {from: wallet_id})
        .then((data)=>{
            res.json({"status":"success","response" : data})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert Party already exists -- Reason given: Party already exists.")
                res.status(400).send({"status":"error","message" : "Party already exists please try login"})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })

    app.post("/api/login/", async (req,res,next) => {
        const {walletId, password} = req.body;
        var party = await Party.deployed();
        var accounts = await web3.eth.getAccounts();
        party.getPassword(walletId, {from:walletId})
        .then((data)=>{
            if(data["0"] === password){
                res.json({"status":"success","name" : data["0"]})
            }
            else {
                res.send(401, 'Invalid credentials');
            }
        })
        .catch(err=>{
            res.json({"status":"error","response" : err.message})

        })


    })
    
}

module.exports = routes