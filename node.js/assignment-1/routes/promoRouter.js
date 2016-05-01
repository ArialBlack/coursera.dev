var express = require('express');
var router = express.Router();

router.route('/')
    .all(writeHeaders)
    .get(getPromos)
    .post(addPromos)
    .delete(deletePromos);

router.route('/:promoId')
    .all(writeHeaders)
    .get(getPromo)
    .put(updatePromo)
    .delete(deletePromo);

function writeHeaders(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    next();
}

function getPromos(req,res,next){
    res.end('Will send all the promotions to you!');
}

function addPromos(req, res, next){
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
}

function deletePromos(req, res, next){
    res.end('Deleting all promotions');
}

function getPromo(req,res,next){
    res.end('Will send details of the promotion: ' + req.params.promoId +' to you!');
}

function updatePromo(req, res, next){
    res.write('Updating the promotion: ' + req.params.promoId + '\n');
    res.end('Will update the promotion: ' + req.body.name +
            ' with details: ' + req.body.description);
}

function deletePromo(req, res, next){
    res.end('Deleting promotion: ' + req.params.promoId);
}

module.exports = router;
