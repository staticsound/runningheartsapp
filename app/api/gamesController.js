var express = require('express'),
    api     = express.Router();

var Venues  = require('../models/venue'),
    Users   = require('../models/user'),
    Players = require('../models/player'),
    Event   = require('../models/event'),
    Game    = require('../models/game');

api.get('/', function(req, res) {
  var pOptions = [
    { 
      path : 'event',
      select : 'venue td date',
      populate: [
        {
          path : 'venue', 
          select : 'name day'
        },
        { 
          path : 'td', 
          select : 'name user', 
          populate : { 
            path : 'user', 
            model : 'User', 
            select : 'local.username' 
          } 
        }
      ]
    }
  ];
  Game
    .find({ statusId : 1 })
    .populate(pOptions)
    .select('-statusId')
    .exec(function(err, games) {
      if (err)
        res.send(err);
      res.send(games);
    })
});

api.get('/:id', function(req, res) {
  var pOptions = [
    { 
      path : 'event',
      populate: [
        {
          path : 'venue', 
          select : 'name day'
        },
        { 
          path : 'td', 
          select : 'name user', 
          populate : { 
            path : 'user', 
            model : 'User', 
            select : 'local.username' 
          } 
        },
        {
          path : 'games',
          select : 'event number'
        }
      ]
    },
    {
      path : 'players',
      populate : {
        path : 'player', 
        select : 'name isTd'
      }
    }
  ];
  Game
    .findById(req.params.id)
    .populate(pOptions)
    .select('-statusId')
    .exec(function(err, games) {
      if (err)
        res.send(err);
      res.send(games);
    })
});

api.post('/', function(req, res) {
  if (req.body._id) {
    Game
      .findOneAndUpdate({ _id : req.body._id }, req.body, { "new" : true })
      .select('-statusId')
      .exec(function (err, game) {
          if (err)
            res.send(err);
          res.send(game);
      })
  } else {
    Game.create(req.body, function(err, game) {
      if (err) {
        console.log(err.stack);
        res.status(500).send()
      } else {
        Event
          .findOne({ _id : game['event'] })
          .exec(function(err, e) {
            if (err)
              console.log(err.stack);
            e.games.push(game._id);
            e.save();
            res.send(game);
          })
      }
    })
  }
});

api.put('/', function(req, res) {
  Game
    .findOneAndUpdate({ _id : req.body._id }, req.body, { "new" : true })
    .exec(function (err, game) {
        if (err)
          res.send(err);
        res.send(game);
    })
});

api.delete('/:id', function(req, res) {
  req.body.statusId = 2;
  Game
    .findByIdAndUpdate(req.params.id, req.body)
    .exec(function (err) {
      if (err) {
        console.log(err.stack);
        res.send(500, err.stack);
      }
      res.send();
    })
})

module.exports = api;