{
  /* global APP_NAME, angular */
  angular.module(APP_NAME).controller('eventsManageCtrl', eventsManageCtrl);

  eventsManageCtrl.$inject = ['$filter', '$state', '$stateParams', 'eventsService', 'usersService', 'playersService', 'venuesService', 'historyService'];

  function eventsManageCtrl($filter, $state, $stateParams, eventsService, usersService, playersService, venuesService, historyService) {

    var vm = this;

    vm.forms = {};

    vm.event = {};
    vm.directors = [];

    vm.getDirectors = function() {
      vm.directors = playersService.api().findBy({
        isTd: true
      });
    }

    vm.getVenues = function() {
      vm.venues = venuesService.api().query();
    }

    vm.resetEvent = function() {
      vm.event = {};
    }

    vm.save = function() {
      eventsService.api().save(vm.event, function() {
        $state.transitionTo('events.list')
      });
    }

    vm.cancel = function() {
      historyService.goPrevious();
    }

    vm.getEvent = function(id) {
      eventsService.api(id).get(function(event) {
        event.date = new Date(event.date);
        vm.event = event;
      });
    }

    vm.removeEvent = function(event) {
      eventsService.api(event._id).remove(function() {
        $state.transitionTo('events.list')
      });
    }

    function initialize() {
      vm.getDirectors();
      vm.getVenues();
      if ($stateParams.id) {
        vm.getEvent($stateParams.id);
      }
    }

    initialize();

  }

}
