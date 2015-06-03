'use strict';

window.app.controller('MainMenuController', function ($scope) {

    // get login name
    $scope.loginName = "สุนิสา จุลรัตน์";

    // get count of unread message (notification)
    $scope.unreadMsg = 20;

    // if this user is approver. get count of approve msg number
    $scope.approveMsg = 32;

});
