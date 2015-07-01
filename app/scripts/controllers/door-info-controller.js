'use strict';

window.app.controller('DoorInfoController', function ($scope, $ionicPopup, $stateParams, doorsAccess, passcodeUnlock, $timeout) {

    var groupId = $stateParams.groupId;
    var doorId = $stateParams.doorId;
    var doorsAccessObj = doorsAccess('object');
    $scope.groupName = doorsAccessObj[groupId].name;
    $scope.doorData = doorsAccessObj[groupId].doorsAccess[doorId];

    // Set Default Menu (Menu contains are 'doorInfo', 'configDoor', 'log' and 'manageAccess')
    $scope.doorMenu = {
        name: 'doorInfo'
    };

    // About Config Door
    $scope.pinRequired = { load: false };
    $scope.autoRelock = { load: false };

    $scope.pinRequiredChecked = function(){
        $scope.pinRequired.load = true;
        var valueBeforeChanged = !$scope.doorData.configDoor.pinRequired.status;

        // if pinRequired status changed;
        $scope.doorData.configDoor.pinRequired.status = !(valueBeforeChanged);

        $timeout( function(){
            if($scope.doorData.configDoor.pinRequired.status == !(valueBeforeChanged)) {
                $scope.pinRequired.load = false;
            }
        }, 1500);
    };
    $scope.autoRelockChecked = function(){
        $scope.autoRelock.load = true;
        var valueBeforeChanged = !$scope.doorData.configDoor.autoRelock.status;

        // if autoRelock status changed;
        $scope.doorData.configDoor.autoRelock.status = !(valueBeforeChanged);

        $timeout( function(){
            if($scope.doorData.configDoor.autoRelock.status == !(valueBeforeChanged)) {
                $scope.autoRelock.load = false;
            }
        }, 1500);
    };

    // About Manage Access

    // About Passcode Unlock
    $scope.passcodeUnlockArr = passcodeUnlock(doorId, '', 'array');

    var passcodeUnlockId = $stateParams.passcodeUnlockId;
    $scope.passcodeUnlockSelected = passcodeUnlock('', passcodeUnlockId, 'object');

    $scope.enableEditPasscode = {
        value: false
    };
    $scope.passcodeReadOnly = {
        value: true
    };


});
