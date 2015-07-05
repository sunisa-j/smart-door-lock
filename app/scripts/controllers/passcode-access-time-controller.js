'use strict';

window.app.controller('PasscodeAccessTimeController', function ($scope, $stateParams, $timeout, $ionicActionSheet, $ionicModal, passcodePolicies, usersCalendars) {

    var doorId = $stateParams.doorId;
    var passcodeUnlockId = $stateParams.passcodeUnlockId;
    $scope.acccessPolicyType = { value:''};
    var userId = 1;
    $scope.userCalendars = usersCalendars(userId, '','passcodePolicies', passcodeUnlockId);

    //Get access time of title informaiton
    $scope.passcodePoliciesData = passcodePolicies(passcodeUnlockId, 'array');

    // when click delete calendar
    $scope.deleteCalendar = function (id) {
        console.log('delete ' + id);
    };

    // add calendars modal
    $ionicModal.fromTemplateUrl('templates/add-access-time-calendar.html' , {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.addCalendarsModal = modal;
    });

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
                    $scope.acccessPolicyType.value = 'Normal';
                }
                else if(index === 1) {
                    $scope.acccessPolicyType.value = 'Holiday';
                }
                $scope.addCalendarsModal.show();

                return true;
            }
        });
        //$timeout(function() {
        //    hideSheet();
        //}, 4000);
    };

    $scope.addCalendarsSelected = function () {
        console.log("add calendar");
    };


});