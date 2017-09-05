{
  var express = require('express'),
    api = express.Router();

  var statsService = require('./statsService')(),
    seasonsService = require('./seasonsService')();

  api.get('/players', function(req, res) {
    statsService.getAllPlayerStats().then((players) => {
      res.send(players);
    });
  });

  api.get('/players/:id', function(req, res) {
    statsService.getPlayerStats(req.params.id).then((player) => {
      res.send(player);
    });
  });

  api.get('/players/:id/season', function(req, res) {
    seasonsService.getLatestSeason().then((season) => {
      statsService.getPlayerStats(req.params.id, season).then((player) => {
        res.send(player);
      });
    });
  });

  api.get('/players/:id/season/:seasonNumber', function(req, res) {
    seasonsService.getSeason(req.params.seasonNumber).then((season) => {
      statsService.getPlayerStats(req.params.id, season).then((player) => {
        res.send(player);
      });
    });
  });

  api.get('/seasons/:seasonNumber', (req, res) => {
    statsService.getSeasonStats(req.params.seasonNumber).then((season) => {
      res.send(season);
    });
  });

  api.get('/seasons/:seasonNumber/players', function(req, res) {
    statsService.getSeasonPlayerStats(req.params.seasonNumber).then((players) => {
      res.send(players);
    });
  });

  api.get('/seasons/winners/current', function(req, res) {
    seasonsService.getLatestSeason().then((season) => {
      statsService.getWinners(season).then((winners) => {
        res.send(winners);
      });
    });
  });

  api.get('/seasons/:seasonNumber/winners', function(req, res) {
    seasonsService.getSeason(req.params.seasonNumber).then((season) => {
      statsService.getWinners(season).then((winners) => {
        res.send(winners);
      });
    });
  });

  api.get('/winners', function(req, res) {
    statsService.getWinners().then((winners) => {
      res.send(winners);
    });
  });

  module.exports = api;
}
