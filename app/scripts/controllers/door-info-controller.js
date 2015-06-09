'use strict';

window.app.controller('DoorInfoController', function ($scope, $ionicPopup) {

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
        console.log("deleted");
    };

    // Confirm Delete Box
    $scope.confirmDelBox = function() {

        var myPopup = $ionicPopup.show({
            title: "Confirm",
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
                    '<i class="button-icon-size ion-ios-checkmark-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Confirm</span>' +
                    '</div>',
                    type: 'button-outline button-balanced',
                    onTap: function() {
                        $scope.deleteSelected();
                    }
                }
            ]
        });
    }
});
