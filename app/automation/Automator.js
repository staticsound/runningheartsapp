{
  function exports() {
    var venuesService = require('../api/venuesService')(),
      eventsService = require('../api/eventsService')(),
      eventsCreator = require('./eventsCreator')(),
      eventsCompleter = require('./eventsCompleter')();

    var service = {
      createNewEvents,
      completeEvents
    };

    function createNewEvents() {
      venuesService.getAllVenues().then((venues) => {
        eventsCreator.generateNewEvents(venues);
      });
    }

    function completeEvents() {
      eventsService.getPastEvents().then((events) => {
        eventsCompleter.markEventsCompleted(events);
      });
    }

    return service;
  }
  module.exports = exports;
}
