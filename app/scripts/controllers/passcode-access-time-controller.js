'use strict';

window.app.controller('PasscodeAccessTimeController', function ($scope, $stateParams, $ionicActionSheet, $ionicModal, passcodePolicies, usersCalendars, calendarEvents, passcodeUnlock, uiCalendarConfig) {

    var doorId = $stateParams.doorId;
    var passcodeUnlockId = $stateParams.passcodeUnlockId;
    $scope.acccessPolicyType = { value:''};
    var userId = 1; // Login User Id
    $scope.userCalendars = usersCalendars(userId, '','passcodePolicies', passcodeUnlockId, '', '', 'array'); // Selected calendars this user can access

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
        //console.log(eventsData.value);
        //console.log(normalEvents.value);
        //console.log(holidayEvents.value);
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

    $scope.dateSelected = moment();

    $scope.transformDate = function(date){
        return moment(date).format('HH:mm');
    };

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

    var lastClickedDay;

    function markDate(date, element){
        // Set day bg --------------------------------------------------
        var day;
        var current = angular.element(element);
        var dataDate = date.format('YYYY-MM-DD');

        if(current.hasClass('fc-day-number')){
            day = current;
        }
        else {
            var parent = current.parents('.fc-week');
            if(parent.context) {
                day = parent.find("td.fc-day-number[data-date=" + dataDate + "]");
            }
            else {
                day = angular.element("td.fc-day-number[data-date=" + dataDate + "]");
            }
        }

        if(lastClickedDay){
            lastClickedDay.find('div').removeAttr('class');
        }
        lastClickedDay = day;

        if (date.isSame(new Date(), 'd')) {
            day.html('<div class="today-number-circle-bg">' + date.date() + '</div>');
        }
        else {
            day.html('<div class="number-circle-bg">' + date.date() + '</div>');
        }
    }

    function selectDate(date, element) {
        // When select day ---------------------------------------------
        $scope.dateSelected = date;
        markDate(date, element);

        $scope.selectedDateEvents = [];
        angular.forEach(eventsData.value, function (event) {
            if($scope.dateSelected.isSame(event.startDate, 'd')){
                $scope.selectedDateEvents.push(event);
            }
        });
    };

    function selectToday(element) {
        uiCalendarConfig.calendars['calendarsEventsSelected'].fullCalendar('today');
        selectDate(moment(), element);
    }

    $scope.uiConfig = {
        calendar:{
            header:{
                right: 'today prev,next'
            },
            editable: false,
            height: 480,
            columnFormat: 'dd',
            eventRender: function (event, element) {

                var date = moment(event.start._d);
                var eventTime = date.format('HH:mm');

                angular.element(element).children().html('<span class="fc-time">' + eventTime + '</span> <span class="fc-title">' + event.title + '</span>');
            },
            dayClick: function(date, jsEvent) {
                selectDate(date, jsEvent.target);
            },
            dayRender: function (date, cell) {
                if(date.isSame($scope.dateSelected, 'd')){
                    selectDate(date, cell);
                }
            }
        }
    };

    // bind my today button with ui-calendar ----------------------------------
    $scope.todayClick = function() {
        selectToday();
    };

});