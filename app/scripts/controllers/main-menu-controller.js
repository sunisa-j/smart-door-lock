'use strict';

window.app.controller('MainMenuController', function ($scope, users) {

    // Login user id
    var userId = 1;

    // get login name
    var userData = users('object');
    $scope.loginName = userData[userId].firstName + ' ' + userData[userId].lastName;

    // get count of unread message (notification)
    $scope.unreadMsg = 2;

    // if this user is approver. get count of approve msg number
    //$scope.approveMsg = 32;

});
