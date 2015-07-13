'use strict';

window.app.controller('DoorsController', function ($scope, doorsAccess, $timeout) {

    // Login user id
    var userId = 1;

    //Get doors user can access informaiton
    $scope.doorsAccessData = doorsAccess(userId, 'object');
    $scope.doorsAccessArr = doorsAccess(userId, 'array');
    //console.log($scope.doorsAccessData);

    $scope.load = {};

    $scope.changeLockStatus = function (e, groupKey, doorKey, latestLockStatus) {
        e.stopPropagation();
        $scope.load[doorKey] = true;

        if(latestLockStatus == 'locked') {
            $scope.doorsAccessData[groupKey].doorsAccess[doorKey].status.lockState = 'unlocked';
            $timeout(function () {
                if ($scope.doorsAccessData[groupKey].doorsAccess[doorKey].status.lockState == 'unlocked') {
                    $scope.load[doorKey] = false;
                }
            }, 1500);
        }
        else if(latestLockStatus == 'unlocked') {
            $scope.doorsAccessData[groupKey].doorsAccess[doorKey].status.lockState = 'locked';
            $timeout(function () {
                if ($scope.doorsAccessData[groupKey].doorsAccess[doorKey].status.lockState == 'locked') {
                    $scope.load[doorKey] = false;
                }
            }, 1500);
        }
    };

});
