'use strict';

window.app.controller('AccessTimeController', function ($scope, $stateParams, $timeout, $ionicActionSheet, passcodePolicies) {

    var doorId = $stateParams.doorId;
    var passcodeUnlockId = $stateParams.passcodeUnlockId;

    //Get access time of title informaiton
    $scope.passcodePoliciesData = passcodePolicies(passcodeUnlockId, 'array');

    // when click delete calendar
    $scope.deleteCalendar = function (id) {
        console.log('delete ' + id);
    };

    // action sheet for select calendar type
    $scope.selectCalendarType = function() {

        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<i class="ion-ios-calendar-outline balanced"></i>Normal' },
                { text: '<i class="ion-ios-calendar-outline energized"></i>Holiday' }
            ],
            //destructiveText: 'Delete',
            titleText: 'Select Access Policy',
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                if(index === 0) {
                    $scope.gotoAddCalendars('normal');

                }
                else if(index === 1) {
                    $scope.gotoAddCalendars('holiday');
                }
                return true;
            }
        });
        //$timeout(function() {
        //    hideSheet();
        //}, 4000);
    };

    $scope.gotoAddCalendars = function (type) {
        if(type == 'normal') {
            console.log('select normal access time');
        }
        else if(type == 'holiday') {
            console.log('select holiday access time');
        }
    };


});