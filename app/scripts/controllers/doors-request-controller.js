'use strict';

window.app.controller('DoorsRequestController', function ($scope) {

    // Set Default Menu (Menu contains are 'waitingApprove' and 'approved')
    $scope.doorReqMenu = {
        name: 'waitingApprove'
    };
});
