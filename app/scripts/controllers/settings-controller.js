'use strict';

window.app.controller('SettingsController', function ($scope, $ionicPopup) {

    $scope.confirmEnableCard = function() {

        var myPopup = $ionicPopup.show({
            title: "Confirm",
            template: 'Are you sure to enable this card ?',
            buttons: [{
                text: 'Cancel',
                type: 'button-outline button-stable'
                },{
                text: 'Confirm',
                type: 'button-outline button-balanced'
            }
            ]
        })
    }

});