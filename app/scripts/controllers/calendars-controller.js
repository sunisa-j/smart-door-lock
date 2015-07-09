'use strict';

window.app.controller('CalendarsController', function ($scope, usersCalendars) {

    var user = 1; // Login user id

    $scope.calendarsData = usersCalendars(user, '', '', '', '');
    console.log($scope.calendarsData);

});
