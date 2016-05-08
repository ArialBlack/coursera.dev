var express = require('express');
var router = express.Router();

router.route('/')
    .all(writeHeaders)
    .get(getLeaders)
    .post(addLeaders)
    .delete(deleteLeaders);

router.route('/:leaderId')
    .all(writeHeaders)
    .get(getLeader)
    .put(updateLeader)
    .delete(deleteLeader);

function writeHeaders(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    next();
}

function getLeaders(req,res,next){
    res.end('Will send all the leaders to you!');
}

function addLeaders(req, res, next){
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
}

function deleteLeaders(req, res, next){
    res.end('Deleting all leaders');
}

function getLeader(req,res,next){
    res.end('Will send details of the leader: ' + req.params.leaderId +' to you!');
}

function updateLeader(req, res, next){
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name +
            ' with details: ' + req.body.description);
}

function deleteLeader(req, res, next){
    res.end('Deleting leader: ' + req.params.leaderId);
}

module.exports = router;
