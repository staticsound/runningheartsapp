// global angular
(function(angular) {

  'use strict';

  angular.module(APP_NAME).controller('eventsViewCtrl', eventsViewCtrl);

  eventsViewCtrl.$inject = ['$filter', '$state', '$stateParams', 'eventsService', 'playersService', 'venuesService', 'gamesService'];

  function eventsViewCtrl($filter, $state, $stateParams, eventsService, playersService, venuesService, gamesService) {

    var vm = this;

    vm.getEvent = function(id) {
      vm.event = eventsService.api(id).get();
    }

    vm.removeEvent = function(event) {
      eventsService.api(event._id).remove(function() {
        vm.getEvents();
      });
    }

    vm.newGame = function() {
      vm.game = {
        event: vm.event,
        number: vm.event.games.length + 1
      }
      gamesService.api().create(vm.game, function(game) {
        vm.viewGame(game);
      })

    }

    vm.editEvent = function(event) {
      if (event) {
        $state.transitionTo('events.manage', {
          id: event._id
        });
      } else {
        $state.transitionTo('events.list');
      }

    }

    vm.viewGame = function(game) {
      $state.transitionTo('games.view', {
        id: game._id
      })
    }

    function initialize() {
      if ($stateParams.id) {
        vm.getEvent($stateParams.id)
      }
    }

    initialize();

  }

})(angular);
