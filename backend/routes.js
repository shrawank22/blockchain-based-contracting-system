function routes(app, web3, Party, Tender){

    app.get('/', (req,res)=>{
        res.json({"status":"success"})
    });

    app.get("/api/party", async(req,res,next) => {
        var party = await Party.deployed();
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
        party.getPartyDetails(walletId, {from:walletId})
        .then((data)=>{
            console.log(data)
            if(data["5"] === password){
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

    app.get("/api/tenders", async(req,res,next) => {
        var tender = await Tender.deployed();
        tender.getMyTenders(req.query.address, {from:req.query.address})
        .then((data)=>{
            tenderResponse = []
            data.map( tender => {
                console.log(parseInt(tender[6]))
                tenderResponse.push({
                    "Id": tender[8],
                    "Title" : tender[0],
                    "Description": tender[1],
                    "Budget": tender[2],
                    "Status": tender[4],
                    "Milestones": tender[7],
                    "Deadline": (new Date(parseInt(tender[6]))).toString()
                })

            })
            res.json({"status":"success","response" : tenderResponse})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert No tenders exists")
                res.status(400).send({"status":"error","message" : "No tenders exists"})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })

    app.post("/api/tenders", async(req,res,next) => {
        var tender = await Tender.deployed();
        const {title, description, budget, issuerAddress, deadline, totalMilestones} = req.body;
        tender.createTender(issuerAddress, budget, title, description, deadline, totalMilestones, {from:issuerAddress})
        .then((data)=>{
            console.log(data)
            res.json({"status":"success","response" : data})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert Party already exists -- Reason given: Party already exists.")
                res.status(400).send({"status":"error","message" : "Party already exists please try login"})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })

    app.get("/api/active-tenders", async(req,res,next) => {
        var tender = await Tender.deployed();
        tender.getAllActiveTenders(req.query.id, {from:req.query.id})
        .then((data)=>{
            tenderResponse = []
            data.map( tender => {
                console.log(parseInt(tender[6]))
                tenderResponse.push({
                    "title" : tender[0],
                    "description": tender[1],
                    "budget": tender[2],
                    "status": tender[4],
                    "milestones": tender[7],
                    "deadline": (new Date(parseInt(tender[6]))).toString()
                })

            })
            res.json({"status":"success","response" : tenderResponse})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert No tenders exists")
                res.status(400).send({"status":"error","message" : "No tenders exists"})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })
    
}

module.exports = routes