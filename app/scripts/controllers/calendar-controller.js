'use strict';

window.app.controller('CalendarController', function ($scope, $stateParams, calendars) {

    var calendarId = $stateParams.calendarId;
    $scope.calendarData = calendars[calendarId];

});
