'use strict';

window.app.controller('ProfileController', function ($scope, $ionicPopup) {

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
                    onTap: function(e) {
                        //e.preventDefault();
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
                    onTap: function(e) {
                        //e.preventDefault();
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
            idCard: 4710110123,
            status: 'Void'
        }
    };
    $scope.cardInfo = [
        {
            $id: 'card1',
            idCard: 4910110547,
            status: 'Enabled'
        },
        {
            $id: 'card2',
            idCard: 4710110123,
            status: 'Void'
        }
    ];
    $scope.confirmEnableCard = function(idCard, reqStatus) {

        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure to ' + reqStatus + ' this card ?',
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
                    '<i class="button-icon-size ion-ios-checkmark-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Confirm</span>' +
                    '</div>',
                    type: 'button-outline button-balanced',
                    onTap: function(e) {
                        //e.preventDefault();
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            //console.log($scope.cardInfoObj[idCard].status);
            if(res) {
                if(reqStatus == 'disable') {
                    $scope.cardInfoObj[idCard].status = 'Disabled';
                }
                if(reqStatus == 'enable') {
                    $scope.cardInfoObj[idCard].status = 'Enabled';
                }
            } else {
                console.log('Changing status cancled');
            }
            console.log($scope.cardInfoObj[idCard].status);
        });
    };

});