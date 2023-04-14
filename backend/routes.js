function routes(app, web3, Party, Tender, Bid){

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
        tender.getAllActiveTenders( {from:req.query.address})
        .then((data)=>{
            tenderResponse = []
            data.map( tender => {
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

    app.get("/api/my-bids", async(req,res,next) => {
        var bid = await Bid.deployed();
        bid.getMyBids( req.query.address, {from:req.query.address})
        .then((data)=>{
            //write list and splice it
            
            res.json({"status":"success","response" : data})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert No tenders exists")
                res.status(400).send({"status":"error","message" : "No tenders exists"})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })

    app.post("/api/active-tenders/addBid", async(req,res,next) => {
        var bid = await Bid.deployed();
        const {tenderId, clause, quoteAmount, bidderAddress} = req.body;
        bid.createBid(bidderAddress, tenderId, clause, quoteAmount, {from: bidderAddress})
        .then((data)=>{
            console.log(data)
            res.json({"status":"success","response" : data})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert Party already exists -- Reason given: Party already exists.")
                res.status(400).send({"status":"error","message" : "Party already exists please try login"}) //change errors
            else if(err.message === "Returned error: VM Exception while processing transaction: revert Tender is not open for bids -- Reason given: Tender is not open for bids.")
                res.status(400).send({"status":"error","message" : "Tender is not open for bids."})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })

    app.get("/api/tenders/bids-details", async(req,res,next) => {
        var bid = await Bid.deployed();
        bid.getAllBids(req.query.address, req.query.tenderId, {from:req.query.address})
        .then((data)=>{
            bidsList = []
            // data.map( bid => {
            //     bidsList.push({
            //         "Id": tender[8],
            //         "BidClause" : tender[0],
            //         "QuoteAmount": tender[1],
            //         "Status": tender[4],
            //     })
            // })
            console.log(data);
            res.json({"status":"success","response" : data})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert No bids exists")
                res.status(400).send({"status":"error","message" : "No bids exists"})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })

    app.delete("/api/tenders/", async(req, res, next) => {
        var tender = await Tender.deployed();
        tender.deleteTender(req.query.address, req.query.tenderId, {from:req.query.address})
        .then((data)=>{
            res.json({"status":"success","response" : data})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert No tenders exists")
                res.status(400).send({"status":"error","message" : "No tenders exists"})
            else if(rr.message === "Returned error: VM Exception while processing transaction: revert tender with address doesn't exists")
                res.status(400).send({"status":"error","message" : "Tender with address doesn't exists"})
            else if(rr.message === "Returned error: VM Exception while processing transaction: revert tender cannot be deleted")
                res.status(400).send({"status":"error","message" : "Tender cannot be deleted"})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })

    app.delete("/api/my-bids/", async(req, res, next) => {
        var bid = await Bid.deployed();
        bid.deleteBid(req.query.address, req.query.tenderId, req.query.bidId, {from:req.query.address})
        .then((data)=>{
            res.json({"status":"success","response" : data})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert No bids exists")
                res.status(400).send({"status":"error","message" : "No bids exists"})
            else if(rr.message === "Returned error: VM Exception while processing transaction: revert bid with address doesn't exists")
                res.status(400).send({"status":"error","message" : "Bid doesn't exists"})
            else if(rr.message === "Returned error: VM Exception while processing transaction: revert bid cannot be deleted")
                res.status(400).send({"status":"error","message" : "Bid cannot be deleted"})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })

    app.post("/api/tenders/edit", async(req, res, next) => {
        var tender = await Tender.deployed();
        const {title, description, budget, issuerAddress, deadline, totalMilestones} = req.body;
        tender.updateTender(issuerAddress, req.query.tenderId, budget, title, description, deadline, totalMilestones, {from:issuerAddress})
        .then((data)=>{
            res.json({"status":"success","response" : data})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert No tenders exists")
                res.status(400).send({"status":"error","message" : "No tenders exists"})
            else if(rr.message === "Returned error: VM Exception while processing transaction: revert tender with address doesn't exists")
                res.status(400).send({"status":"error","message" : "Tender with address doesn't exists"})
            else if(rr.message === "Returned error: VM Exception while processing transaction: revert tender cannot be updated")
                res.status(400).send({"status":"error","message" : "Tender cannot be updated"})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })
    
}

module.exports = routes