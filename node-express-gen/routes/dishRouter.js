var express = require('express');
var router = express.Router();

router.route('/')
    .all(writeHeaders)
    .get(getDishes)
    .post(addDishes)
    .delete(deleteDishes);

router.route('/:dishId')
    .all(writeHeaders)
    .get(getDish)
    .put(updateDish)
    .delete(deleteDish);

function writeHeaders(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    next();
}

function getDishes(req,res,next){
    res.end('Will send all the dishes to you!');
}

function addDishes(req, res, next){
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
}

function deleteDishes(req, res, next){
    res.end('Deleting all dishes');
}

function getDish(req,res,next){
    res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
}

function updateDish(req, res, next){
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name +
            ' with details: ' + req.body.description);
}

function deleteDish(req, res, next){
    res.end('Deleting dish: ' + req.params.dishId);
}

module.exports = router;
