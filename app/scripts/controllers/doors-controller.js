'use strict';

window.app.controller('DoorsController', function ($scope, doorsAccess, $timeout) {

    //Get doors user can access informaiton
    $scope.doorsAccessData = doorsAccess('object');

    $scope.load = {};

    $scope.changeLockStatus = function (e, groupKey, doorKey, latestLockStatus) {
        e.stopPropagation();
        $scope.load[doorKey] = true;

        if(latestLockStatus == 'locked') {
            $scope.doorsAccessData[groupKey].doorsAccess[doorKey].status.lock = 'unlocked';
            $timeout(function () {
                if ($scope.doorsAccessData[groupKey].doorsAccess[doorKey].status.lock == 'unlocked') {
                    $scope.load[doorKey] = false;
                }
            }, 1500);
        }
        else if(latestLockStatus == 'unlocked') {
            $scope.doorsAccessData[groupKey].doorsAccess[doorKey].status.lock = 'locked';
            $timeout(function () {
                if ($scope.doorsAccessData[groupKey].doorsAccess[doorKey].status.lock == 'locked') {
                    $scope.load[doorKey] = false;
                }
            }, 1500);
        }
    };

});
