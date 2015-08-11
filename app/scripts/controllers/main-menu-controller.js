'use strict';

window.app.controller('MainMenuController', function ($scope, users, notifications) {

    // Login user id
    var userId = 1;

    // get login name
    var userData = users('object');
    $scope.loginName = userData[userId].firstName + ' ' + userData[userId].lastName;

    // get count of unread message (notification)
    var notifData = notifications('array');
    $scope.unreadMsg = 0;

    angular.forEach(notifData, function(value){
        if(value.status === 'unread'){
            $scope.unreadMsg++;
        }
    });


});
