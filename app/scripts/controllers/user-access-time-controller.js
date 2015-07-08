'use strict';

window.app.controller('UserAccessTimeController', function ($scope, $stateParams, $ionicActionSheet, $ionicModal, usersCalendars, userAccessPolicies, doorsUsers) {

    var doorUserId = $stateParams.doorUserId;
    var doorUser = doorsUsers('', 'object')[doorUserId];
    $scope.acccessPolicyType = { value:''};
    var userId = 1; // Login User Id
    $scope.userCalendars = usersCalendars(userId, doorUser.door, 'userAccessPolicies', '', doorUserId); // Selected calendars this user can access

    //Get access time of title informaiton
    $scope.userPoliciesData = userAccessPolicies(doorUserId, 'array');

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

        angular.forEach($scope.userCalendars, function(group){
            angular.forEach(group, function(value){

                if($scope.calendarCheckbox[value.calendar.$id] == true) {
                    var calendarId = value.calendar.$id;
                    //console.log("Selected: " + $scope.calendarCheckbox[calendarId]);
                    var dataAddtoUserAccessPolicies = {
                        type: type,
                        doorUser: doorUserId,
                        calendar: calendarId
                    };
                    console.log('Call function add: ' + dataAddtoUserAccessPolicies.calendar);
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