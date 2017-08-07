{
  /* global angular, APP_NAME */

  angular.module(APP_NAME).controller('statsSeasonCtrl', statsSeasonCtrl);

  statsSeasonCtrl.$inject = ['$filter', '$state', '$stateParams', 'statsService', 'usersService', 'playersService', 'venuesService'];

  function statsSeasonCtrl($filter, $state, $stateParams, statsService, usersService, playersService, venuesService) {

    var vm = this;

    vm.shoutOut = function(id) {
      playersService.api(id).shoutOut(function(data) {
        vm.player.shoutOuts = data.shoutOuts;
      })
    }

    function initialize() {
      if ($stateParams.id) {
        vm.seasonNumber = $stateParams.id;
        vm.playerStats = statsService.api($stateParams.id).seasons();
      } else {
        vm.playerStats = statsService.api().players();
      }
    }

    initialize();

  }

}