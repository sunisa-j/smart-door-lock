'use strict';

window.app.controller('CalendarsController', function ($scope, usersCalendars, $ionicModal) {

    var user = 1; // Login user id
    $scope.createData = {};

    $scope.calendarsData = usersCalendars(user, '', '', '', '');

    $ionicModal.fromTemplateUrl('templates/create-calendar-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.createCalendarModal = modal;
    });

    $scope.createCalendar = function () {
        console.log('Create calendar: ', $scope.createData);
    };
    $scope.cancelCreateCalendar = function () {
        $scope.createData={};
        $scope.createCalendarModal.hide();
    };

});
