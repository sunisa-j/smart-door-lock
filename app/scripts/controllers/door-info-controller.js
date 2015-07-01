'use strict';

window.app.controller('DoorInfoController', function ($scope, $ionicPopup, $stateParams, doorsAccess, $timeout) {

    var groupId = $stateParams.groupId;
    var doorId = $stateParams.doorId;
    var doorsAccessObj = doorsAccess('object');
    $scope.groupName = doorsAccessObj[groupId].name;
    $scope.doorData = doorsAccessObj[groupId].doorsAccess[doorId];

    $scope.pinRequired = { value: false, load: false };
    $scope.pinRequiredChecked = function(){
        $scope.pinRequired.load = true;
        var valueBeforeChanged = !$scope.pinRequired.value;

        // if pinRequired status changed;
        $scope.pinRequired.value = !(valueBeforeChanged);

        $timeout( function(){
            if($scope.pinRequired.value == !(valueBeforeChanged)) {
                $scope.pinRequired.load = false;
            }
        }, 1500);
    };

    $scope.autoRelock = { value: false, load: false };
    $scope.autoRelockChecked = function(){
        $scope.autoRelock.load = true;
        var valueBeforeChanged = !$scope.autoRelock.value;

        // if autoRelock status changed;
        $scope.autoRelock.value = !(valueBeforeChanged);

        $timeout( function(){
            if($scope.autoRelock.value == !(valueBeforeChanged)) {
                $scope.autoRelock.load = false;
            }
        }, 1500);
    }

    // Set Default Menu (Menu contains are 'doorInfo', 'configDoor', 'log' and 'manageAccess')
    $scope.doorMenu = {
        name: 'doorInfo'
    };

    // Set Default Display Delete Button
    $scope.showDelButton = {
        value: false
    };

    $scope.deleteSelected = function() {
        $scope.showDelButton.value = false;
        console.log('deleted');
    };

    // Confirm Delete Box
    $scope.confirmDelBox = function() {

        $ionicPopup.show({
            title: 'Confirm',
            template: 'Do you confirm to delete all user you selected ?',
            buttons: [
                {
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-close-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Cancel</span>' +
                    '</div>',
                    type: 'button-outline button-stable'
                },{
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-minus-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Delete</span>' +
                    '</div>',
                    type: 'button-outline button-assertive',
                    onTap: function() {
                        $scope.deleteSelected();
                    }
                }
            ]
        });
    };
});
