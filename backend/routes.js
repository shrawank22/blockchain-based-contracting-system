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
            if(err.message === "Returned error: VM Exception while processing transaction: revert No tenders exists")
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
            if(err.message === "Returned error: VM Exception while processing transaction: revert No tenders exists")
                res.status(400).send({"status":"error","message" : "No tenders exists"})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })

    app.get("/api/my-bids", async(req,res,next) => {
        var bid = await Bid.deployed();
        bid.getMyBids( req.query.address, {from:req.query.address})
        .then((data)=>{
            bidResponse = []
            data[0].slice(0, data[1]).map( bid => {
                bidResponse.push({
                    "BidClause": bid[1],
                    "QuoteAmount" : bid[2],
                    "TenderId": bid[4],
                    "BidId": bid[0],
                    "Status": bid[5],
                })

            })
            
            res.json({"status":"success","response" : bidResponse})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert No tenders exists")
                res.status(400).send({"status":"error","message" : "No tenders exists"})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })

    app.get("/api/my-bids/tenders", async(req,res,next) => {
        var tender = await Tender.deployed();
        tender.getTenderDetails( req.query.tenderId, {from:req.query.address})
        .then((data)=>{
            res.json({"status":"success","response" : {
                "Title" : data[0],
                "Description": data[1],
                "Budget": data[2],
                "Status": data[4],
                "Milestones": data[7],
                "Deadline": (new Date(parseInt(data[6]))).toString()
            }})
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
            if(err.message === "Returned error: VM Exception while processing transaction: revert Tender is not open for bids -- Reason given: Tender is not open for bids.")
                res.status(400).send({"status":"error","message" : "Tender is not open for bids."})
            else if(err.message === "Returned error: VM Exception while processing tran…ing has ended -- Reason given: Bidding has ended.")
                res.status(400).send({"status":"error","message" : "Bidding has ended"})
            else if(err.message === "Returned error: VM Exception while processing transaction: revert Owner cannot bid on their own tender -- Reason given: Owner cannot bid on their own tender.")
                res.status(400).send({"status":"error","message" : " Owner cannot bid on their own tender."})
            else
                res.status(500).send({"status":"error","response" : err.message})
        })
    })

    app.get("/api/tenders/bids-details", async(req,res,next) => {
        var bid = await Bid.deployed();
        bid.getAllBids(req.query.address, req.query.tenderId, {from:req.query.address})
        .then((data)=>{
            bidsList = []
            data.map( bid => {
                bidsList.push({
                    "BidClause": bid[1],
                    "QuoteAmount" : bid[2],
                    "TenderId": bid[4],
                    "BidId": bid[0],
                    "Status": bid[5],
                })
            })
            console.log(data);
            res.json({"status":"success","response" : bidsList})
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
            console.log(data)
            res.json({"status":"success","response" : data})
        })
        .catch(err=>{
            if(err.message === "Returned error: VM Exception while processing transaction: revert No bids exists")
                res.status(400).send({"status":"error","message" : "No bids exists"})
            else if(err.message === "Returned error: VM Exception while processing transaction: revert bid with address doesn't exists")
                res.status(400).send({"status":"error","message" : "Bid doesn't exists"})
            else if(err.message === "Returned error: VM Exception while processing transaction: revert bid cannot be deleted")
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

    app.post("/api/tender/update-status",async(req, res, next) => {
        var tender = await Tender.deployed();
        const {issuerAddress, tenderId, tenderStatus} = req.body;
        tender.updateTenderStatus(tenderId, tenderStatus,{from:issuerAddress})
        .then((data)=>{
            res.json({"status":"success","response" : data})
        })
        .catch(err=>{
            res.status(500).send({"status":"error","response" : err.message})
        })
        
    })
    
}

module.exports = routes