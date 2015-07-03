'use strict';

window.app.controller('DoorInfoController', function ($scope, $ionicPopup, $stateParams, doorsAccess, passcodeUnlock, $timeout, $ionicModal) {

    var groupId = $stateParams.groupId;
    var doorId = $stateParams.doorId;
    $scope.doorId = doorId;

    var doorsAccessObj = doorsAccess('object');
    $scope.groupName = doorsAccessObj[groupId].name;

    $scope.doorData = doorsAccessObj[groupId].doorsAccess[doorId];

    // Set Default Menu (Menu contains are 'doorInfo', 'configDoor', 'log' and 'manageAccess')
    $scope.doorMenu = {
        name: 'doorInfo'
    };

    // -------------------------------------------------------------------------
    // About Door Info -------------------------------------------------------
    // -------------------------------------------------------------------------

    $scope.statusLoad = { value: false };

    $scope.changeLockStatus = function (latestLockStatus) {

        $scope.statusLoad.value = true;

        if(latestLockStatus == 'locked') {
            $scope.doorData.status.lock = 'unlocked';
            $timeout(function () {
                if ($scope.doorData.status.lock == 'unlocked') {
                    $scope.statusLoad.value = false;
                }
            }, 1500);
        }
        else if(latestLockStatus == 'unlocked') {
            $scope.doorData.status.lock = 'locked';
            $timeout(function () {
                if ($scope.doorData.status.lock == 'locked') {
                    $scope.statusLoad.value = false;
                }
            }, 1500);
        }
    };

    // -------------------------------------------------------------------------
    // About Config Door -------------------------------------------------------
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // About Manage Access -----------------------------------------------------
    // -------------------------------------------------------------------------

    // About Passcode Unlock ---------------------------------------------------
    $scope.passcodeUnlockObj = passcodeUnlock(doorId, '', 'object');
    var passcodeUnlockId = $stateParams.passcodeUnlockId;
    $scope.passcodeUnlockId = passcodeUnlockId;
    $scope.passcodeUnlockSelected = passcodeUnlock('', passcodeUnlockId, 'selected');
    $scope.enableEditPasscode = { value: false };
    $scope.passcodeReadOnly = { value: true };

    $ionicModal.fromTemplateUrl('templates/create-passcode-unlock-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.createPasscodeModal = modal;
    });

    $scope.createPasscodeUnlock = function () {
        console.log('create passcode');
    };

    $scope.changeStatusPasscode = function(passcodeId, latestStatus){
        $scope.passcodeUnlockObj[passcodeId].load = true;

        if(latestStatus == 'Enabled') {
            $scope.passcodeUnlockObj[passcodeId].status = 'Disabled';
            $timeout(function () {
                if ($scope.passcodeUnlockObj[passcodeId].status == 'Disabled') {
                    $scope.passcodeUnlockObj[passcodeId].load = false;
                }
            }, 1500);
        }
        else if(latestStatus == 'Disabled') {
            $scope.passcodeUnlockObj[passcodeId].status = 'Enabled';
            $timeout(function () {
                if ($scope.passcodeUnlockObj[passcodeId].status == 'Enabled') {
                    $scope.passcodeUnlockObj[passcodeId].load = false;
                }
            }, 1500);
        }
    };

    $scope.confirmDeletePasscode = function() {

        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure to delete "' + $scope.passcodeUnlockSelected.name + '" passcode ?',
            buttons: [
                {
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-close-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Cancel</span>' +
                    '</div>',
                    type: 'button-outline button-stable',
                    onTap: function(e) {
                        //e.preventDefault();
                        return false;
                    }
                },{
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-minus-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Delete</span>' +
                    '</div>',
                    type: 'button-outline button-assertive',
                    onTap: function(e) {
                        //e.preventDefault();
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if(res) {
                console.log('delete passcode');
            } else {
                console.log('cancel');
            }
        });
    };

});
