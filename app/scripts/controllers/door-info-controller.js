'use strict';

window.app.controller('DoorInfoController', function ($scope) {

    // Set Default Menu (Menu contains are 'doorInfo', 'configDoor', 'log' and 'manageUser')
    $scope.doorMenu = {
        name: 'doorInfo'
    };

    // Set Default Display Delete Button
    $scope.showDelButton = {
        value: false
    };

});
