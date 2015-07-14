'use strict';

window.app.controller('PasscodeAccessTimeController', function ($scope, $stateParams, $ionicActionSheet, $ionicModal, passcodePolicies, usersCalendars) {

    var doorId = $stateParams.doorId;
    var passcodeUnlockId = $stateParams.passcodeUnlockId;
    $scope.acccessPolicyType = { value:''};
    var userId = 1; // Login User Id
    $scope.userCalendars = usersCalendars(userId, '','passcodePolicies', passcodeUnlockId, ''); // Selected calendars this user can access

    //Get access time of title informaiton
    $scope.passcodePoliciesData = passcodePolicies(passcodeUnlockId, 'array', '');

    // when click delete calendar
    $scope.deleteCalendar = function (id) {
        console.log('delete ' + id);
    };

    // add calendars modal
    $ionicModal.fromTemplateUrl('templates/add-access-time-calendar.html' , {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
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
    };

    // Store Checkbox Input Value
    $scope.calendarCheckbox = {};

    $scope.addCalendarsSelected = function () {
        var type = ($scope.acccessPolicyType.value).toLowerCase();
        var passcode = passcodeUnlockId;

        angular.forEach($scope.userCalendars, function(group){
            angular.forEach(group, function(value){

                if($scope.calendarCheckbox[value.calendar.id] == true) {
                    var calendarId = value.calendar.id;
                    //console.log("Selected: " + $scope.calendarCheckbox[calendarId]);
                    var dataAddtoPasscodePolicies = {
                        type: type,
                        passcode: passcode,
                        calendar: calendarId
                    };
                    console.log('Call function add: ' + dataAddtoPasscodePolicies.calendar);
                }
            });
        });
        $scope.calendarCheckbox = {};
        $scope.addCalendarsModal.hide();
    };

    $scope.cancelAddCalendars = function () {
        $scope.calendarCheckbox = {};
        $scope.addCalendarsModal.hide();
    };


});