'use strict';

window.app.controller('DoorInfoController', function ($scope, $ionicPopup, $stateParams, doorsAccess) {

    var buildingId = $stateParams.buildingId;
    var doorId = $stateParams.doorId;
    var doorsAccessObj = doorsAccess('object');
    $scope.buildingName = doorsAccessObj[buildingId].name;
    $scope.doorData = doorsAccessObj[buildingId].doorsAccess[doorId];

    //$scope.permission = {
    //    unlock: false,
    //    viewLog: false,
    //    viewStatus: false,
    //    remoteControl: false,
    //    configuration: false,
    //    manageUser: false,
    //    adminPrivillage: false
    //};
    //var checkPermission = function() {
    //    angular.forEach($scope.doorData.permission, function(value){
    //        if(value === 'unlock') {
    //            $scope.permission.unlock = true;
    //
    //        } else if(value === 'viewLog') {
    //            $scope.permission.viewLog = true;
    //
    //        } else if(value === 'viewStatus') {
    //            $scope.permission.viewStatus = true;
    //
    //        } else if(value === 'remoteControl') {
    //            $scope.permission.remoteControl = true;
    //
    //        } else if(value === 'configuration') {
    //            $scope.permission.configuration = true;
    //
    //        } else if(value === 'manageUser') {
    //            $scope.permission.manageUser = true;
    //
    //        } else if(value === 'adminPrivillage') {
    //            $scope.permission.adminPrivillage = true;
    //        }
    //    });
    //};
    //checkPermission();

    // Set Default Menu (Menu contains are 'doorInfo', 'configDoor', 'log' and 'manageUser')
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
