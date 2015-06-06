'use strict';

window.app.controller('SettingsController', function ($scope, $ionicPopup) {

    $scope.confirmEnableCard = function() {

        var myPopup = $ionicPopup.show({
            title: "Confirm",
            template: 'Are you sure to enable this card ?',
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
                    type: 'button-outline button-balanced'
                }
            ]
        })
    }

});