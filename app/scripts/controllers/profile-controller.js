'use strict';

window.app.controller('ProfileController', function ($scope, $ionicPopup, $timeout) {

    // Change PIN

    $scope.pin = 123456;
    $scope.myPin = angular.copy($scope.pin);
    var saveNewPin = function(newPin) {
        $scope.pin = newPin;
        //console.log($scope.pin);
        console.log('New PIN is ' + newPin);
    };
    $scope.confirmChangePin = function(newPin) {

        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure to change PIN ?',
            buttons: [
                {
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-close-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Cancel</span>' +
                    '</div>',
                    type: 'button-outline button-stable',
                    onTap: function() {
                        return false;
                    }
                },{
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-checkmark-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Confirm</span>' +
                    '</div>',
                    type: 'button-outline button-balanced',
                    onTap: function() {
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if(res) {
                saveNewPin(newPin);
            } else {
                console.log('Changing PIN cancled');
            }
        });
    };


    // Manage Card

    $scope.cardInfoObj = {
        'card1' : {
            idCard: 4910110547,
            status: 'Enabled'
        },
        'card2': {
            idCard: 4910110547,
            status: 'Void'
        }
    };
    $scope.confirmEnableCard = function(idCard, latestStatus) {

        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure to ' + latestStatus + ' this card ?',
            buttons: [
                {
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-close-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Cancel</span>' +
                    '</div>',
                    type: 'button-outline button-stable',
                    onTap: function() {
                        return false;
                    }
                },{
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-checkmark-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Confirm</span>' +
                    '</div>',
                    type: 'button-outline button-balanced',
                    onTap: function() {
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            //console.log($scope.cardInfoObj[idCard].status);
            if(res) {
                $scope.cardInfoObj[idCard].load = true;

                if(latestStatus === 'Enabled') {

                    $scope.cardInfoObj[idCard].status = 'Disabled';

                    $timeout( function (){
                        if($scope.cardInfoObj[idCard].status === 'Disabled') {
                            $scope.cardInfoObj[idCard].load = false;
                        }
                    }, 1500);
                }
                else if(latestStatus === 'Disabled') {
                    $scope.cardInfoObj[idCard].status = 'Enabled';

                    $timeout( function (){
                        if($scope.cardInfoObj[idCard].status === 'Enabled') {
                            $scope.cardInfoObj[idCard].load = false;
                        }
                    }, 1500);
                }
            } else {
                console.log('Changing status cancled');
            }
            console.log($scope.cardInfoObj[idCard].status);
        });
    };

});