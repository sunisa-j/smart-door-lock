'use strict';

window.app.controller('PasscodeAccessTimeController', function ($scope, $stateParams, $ionicActionSheet, $ionicModal, passcodePolicies, usersCalendars, calendarEvents, passcodeUnlock) {

    var doorId = $stateParams.doorId;
    var passcodeUnlockId = $stateParams.passcodeUnlockId;
    $scope.acccessPolicyType = { value:''};
    var userId = 1; // Login User Id
    $scope.userCalendars = usersCalendars(userId, '','passcodePolicies', passcodeUnlockId, ''); // Selected calendars this user can access

    // Get access time of title informaition
    $scope.passcodePoliciesData = passcodePolicies(passcodeUnlockId, 'array', '');

    // Get passcode unlock name
    $scope.passcodeUnlockSelected = passcodeUnlock(doorId, passcodeUnlockId, 'selected');

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

    // -------------------------------------------------------------------------
    // Select calendars events -------------------------------------------------
    // -------------------------------------------------------------------------

    // Variable Default, Set Value for Show Event Data ('myAccessTime', 'autoRelease', 'passcodeUnlock', 'userAccess')
    $scope.showEventsDataName = { value: 'passcodeUnlock' };
    var eventsData = { value: [] };
    var normalEvents = { value: [] };
    var holidayEvents = { value: [] };
    var color = {
        normal: 'rgba(0, 201, 13, 0.2)',
        holiday: 'rgba(255, 213, 0, 0.2)',
        text: '#333333'
    };

    // Get all events to show in ui-calendar -----------------------------------
    $scope.selectEventsData = function () {

        eventsData.value = [];
        normalEvents.value = [];
        holidayEvents.value = [];

        if($scope.showEventsDataName.value == 'passcodeUnlock'){
            var passcodePoliciesData = passcodePolicies(passcodeUnlockId, 'object', '');
            var calendarEventsData = calendarEvents('', '', '','object');
            var calendarsSelected = [];

            // Get calendarsSelected for Auto Release Time
            angular.forEach(passcodePoliciesData, function(value){
                var tmp = {};
                tmp.calendar = value.calendar.id;
                tmp.type = value.type;

                calendarsSelected.push(tmp);
            });

            // Get Events from calendarsSelected to show when click 'View Access Time' button
            angular.forEach(calendarEventsData, function(event){
                angular.forEach(calendarsSelected, function(calendar){
                    if(event.calendar == calendar.calendar){
                        eventsData.value.push(event);

                        if(calendar.type == 'normal'){
                            normalEvents.value.push(event);
                        }
                        else if(calendar.type == 'holiday'){
                            holidayEvents.value.push(event);
                        }
                    }
                });
            });

        }
        console.log(eventsData.value);
        console.log(normalEvents.value);
        console.log(holidayEvents.value);
    };
    $scope.selectEventsData();

    // -------------------------------------------------------------------------
    // About calendar management -----------------------------------------------
    // -------------------------------------------------------------------------

    // Calendar modal for show all events --------------------------------------
    $ionicModal.fromTemplateUrl('templates/calendar-events-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.calendarEventsModal = modal;
    });
    $scope.$on('modal.shown', function() {
        $scope.selectEventsData();
    });

    $scope.dateSelected = new Date();
    $scope.transformDate = function(date){
        var dateNew;
        if(date == ''){
            dateNew = new Date();
        } else {
            dateNew = new Date(date);
        }
        return dateNew;
    };


    // Get events from date selected -------------------------------------------
    $scope.getEventsDateSelected = function (dateUserSelected) {
        $scope.dateSelected = new Date(dateUserSelected.setHours(0, 0, 0, 0));

        var calendarEventsDateSelected = [];
        var events = angular.copy(eventsData.value);

        angular.forEach(events, function(value){
            var startDate = $scope.transformDate(value.startDate);
            var startDate2 = new Date(startDate.setHours(0, 0, 0, 0));

            if(($scope.dateSelected).getTime() === startDate2.getTime()){
                calendarEventsDateSelected.push(value);
            }
        });
        $scope.calendarEventsDateSelected2 = calendarEventsDateSelected;
    };
    $scope.getEventsDateSelected($scope.dateSelected);

    // Reference month & weekday -----------------------------------------------
    $scope.month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    $scope.weekDay = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];

    // Calendar UI Configuration -----------------------------------------------

    $scope.uiCalendarEvents = [
        {
            events: normalEvents.value,
            color: color.normal,
            textColor: color.text
        },
        {
            events: holidayEvents.value,
            color: color.holiday,
            textColor: color.text
        }
    ];
    var setDayRedBg = function(dataDate) {
        angular.element("td.fc-day-number.fc-other-month").css('opacity', 0.3);
        angular.element("td.fc-day-number div").removeClass('number-circle-bg');

        var isOtherMonth = angular.element("td.fc-day-number[data-date=" + dataDate + "]").hasClass('fc-other-month').toString();
        if(isOtherMonth) {
            angular.element("td.fc-day-number[data-date=" + dataDate + "]").css('opacity', 1);
        }
        angular.element("td.fc-day-number.fc-today[data-date=" + dataDate + "] div").addClass('today-number-circle-bg');
    };
    var setDayBlackBg = function(dataDate) {
        angular.element("td.fc-day-number.fc-other-month").css('opacity', 0.3);
        angular.element("td.fc-day-number.fc-today div").removeClass('today-number-circle-bg');
        angular.element("td.fc-day-number div").removeClass('number-circle-bg');

        var isOtherMonth = angular.element("td.fc-day-number[data-date=" + dataDate + "]").hasClass('fc-other-month').toString();
        if(isOtherMonth) {
            angular.element("td.fc-day-number[data-date=" + dataDate + "]").css('opacity', 1);
        }
        angular.element("td.fc-day-number[data-date=" + dataDate + "] div").addClass('number-circle-bg');
    };
    $scope.uiConfig = {
        calendar:{
            header:{
                right: 'today prev,next'
            },
            editable: false,
            height: 480,
            dayClick: function(date, jsEvent, view) {

                // When select day ---------------------------------------------
                var dateSelected = new Date(date._d);
                $scope.dateSelected = dateSelected;
                $scope.getEventsDateSelected(dateSelected);

                var dataMonth = dateSelected.getMonth()+1;
                var dataDay = dateSelected.getDate();
                var dataDate = dateSelected.getFullYear() + '-' + ((dataMonth < 10)? ('0'+dataMonth):dataMonth) + '-' + ((dataDay < 10)? ('0'+dataDay):dataDay);
                var dateNow = new Date();

                // change the day's background
                if(dateSelected.setHours(0,0,0,0) == dateNow.setHours(0,0,0,0)) {
                    setDayRedBg(dataDate);
                }else {
                    setDayBlackBg(dataDate);
                }
            },
            viewRender: function(view, element) {

                // When change month (click prev,next button), focus day selected
                $scope.getEventsDateSelected($scope.dateSelected);

                var dataMonth = $scope.dateSelected.getMonth()+1;
                var dataDay = $scope.dateSelected.getDate();
                var dataDate = $scope.dateSelected.getFullYear() + '-' + ((dataMonth < 10)? ('0'+dataMonth):dataMonth) + '-' + ((dataDay < 10)? ('0'+dataDay):dataDay);
                var dateNow = new Date();

                // change the day's background
                if($scope.dateSelected.setHours(0,0,0,0) == dateNow.setHours(0,0,0,0)) {
                    setDayRedBg(dataDate);
                }else {
                    setDayBlackBg(dataDate);
                }
            }
        }
    };

    // bind my today button with ui-calendar ----------------------------------
    $scope.todayActive = function() {
        angular.element('.fc-today-button').click();
        angular.element('#calendar').fullCalendar('today');

        var dateNow = new Date();
        var dateNow2 = new Date(dateNow.setHours(0,0,0,0));

        $scope.dateSelected = dateNow;
        $scope.getEventsDateSelected(dateNow);

        var dataMonth = dateNow2.getMonth()+1;
        var dataDay = dateNow2.getDate();
        var dataDate = dateNow2.getFullYear() + '-' + ((dataMonth < 10)? ('0'+dataMonth):dataMonth) + '-' + ((dataDay < 10)? ('0'+dataDay):dataDay);

        angular.element("td.fc-day-number.fc-other-month").css('opacity', 0.3);
        angular.element("td.fc-day-number div").removeClass('number-circle-bg');

        var isOtherMonth = angular.element("td.fc-day-number[data-date=" + dataDate + "]").hasClass('fc-other-month').toString();
        if(isOtherMonth) {
            angular.element("td.fc-day-number[data-date=" + dataDate + "]").css('opacity', 1);
        }
        angular.element("td.fc-day-number.fc-today[data-date=" + dataDate + "] div").addClass('today-number-circle-bg');
    };

});