'use strict';

window.app.controller('CalendarController', function ($scope, $stateParams, calendars, $ionicModal, $ionicPopup, calendarEvents) {

    var calendarId = $stateParams.calendarId;
    $scope.calendarData = calendars[calendarId];

    // -------------------------------------------------------------------------
    // About calendar management -----------------------------------------------
    // -------------------------------------------------------------------------

    // Get all events to show in ui-calendar -----------------------------------
    $scope.calendarEventsData = calendarEvents('', '', calendarId,'calendarEvents');
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
        var events = angular.copy($scope.calendarEventsData);

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
    $scope.uiCalendarEvents = {
        events: $scope.calendarEventsData,
        color: 'rgba(0, 201, 13, 0.2)',
        textColor: '#333333'
    };
    $scope.uiConfig = {
        calendar:{
            header:{
                right: 'today prev,next'
            },
            height: 480,
            dayClick: function(date, jsEvent, view) { // When select day

                var dateSelected = new Date(date._d);
                $scope.dateSelected = dateSelected;
                $scope.getEventsDateSelected(dateSelected);

                var dataMonth = dateSelected.getMonth()+1;
                var dataDay = dateSelected.getDate();
                var dataDate = dateSelected.getFullYear() + '-' + ((dataMonth < 10)? ('0'+dataMonth):dataMonth) + '-' + ((dataDay < 10)? ('0'+dataDay):dataDay);

                // change the day's background
                var dateNow = new Date();
                if(dateSelected.setHours(0,0,0,0) == dateNow.setHours(0,0,0,0)) {
                    angular.element("td.fc-day-number.fc-other-month").css('opacity', 0.3);
                    angular.element("td.fc-day-number div").removeClass('number-circle-bg');

                    var isOtherMonth = angular.element("td.fc-day-number[data-date=" + dataDate + "]").hasClass('fc-other-month').toString();
                    if(isOtherMonth) {
                        angular.element("td.fc-day-number[data-date=" + dataDate + "]").css('opacity', 1);
                    }
                    angular.element("td.fc-day-number.fc-today[data-date=" + dataDate + "] div").addClass('today-number-circle-bg');

                }else {
                    angular.element("td.fc-day-number.fc-other-month").css('opacity', 0.3);
                    angular.element("td.fc-day-number.fc-today div").removeClass('today-number-circle-bg');
                    angular.element("td.fc-day-number div").removeClass('number-circle-bg');

                    var isOtherMonth = angular.element("td.fc-day-number[data-date=" + dataDate + "]").hasClass('fc-other-month').toString();
                    if(isOtherMonth) {
                        angular.element("td.fc-day-number[data-date=" + dataDate + "]").css('opacity', 1);
                    }
                    angular.element("td.fc-day-number[data-date=" + dataDate + "] div").addClass('number-circle-bg');
                }
            },
            eventClick: function(event, element) { // When select event
                $scope.openEditEvent(event);
            },
            viewRender: function(view, element) { // When change month (click prev,next button), focus day selected
                $scope.getEventsDateSelected($scope.dateSelected);

                var dataMonth = $scope.dateSelected.getMonth()+1;
                var dataDay = $scope.dateSelected.getDate();
                var dataDate = $scope.dateSelected.getFullYear() + '-' + ((dataMonth < 10)? ('0'+dataMonth):dataMonth) + '-' + ((dataDay < 10)? ('0'+dataDay):dataDay);

                // change the day's background
                var dateNow = new Date();
                if($scope.dateSelected.setHours(0,0,0,0) == dateNow.setHours(0,0,0,0)) {
                    angular.element("td.fc-day-number.fc-other-month").css('opacity', 0.3);
                    angular.element("td.fc-day-number div").removeClass('number-circle-bg');

                    var isOtherMonth = angular.element("td.fc-day-number[data-date=" + dataDate + "]").hasClass('fc-other-month').toString();
                    if(isOtherMonth) {
                        angular.element("td.fc-day-number[data-date=" + dataDate + "]").css('opacity', 1);
                    }
                    angular.element("td.fc-day-number.fc-today[data-date=" + dataDate + "] div").addClass('today-number-circle-bg');

                }else {
                    angular.element("td.fc-day-number.fc-other-month").css('opacity', 0.3);
                    angular.element("td.fc-day-number.fc-today div").removeClass('today-number-circle-bg');
                    angular.element("td.fc-day-number div").removeClass('number-circle-bg');

                    var isOtherMonth = angular.element("td.fc-day-number[data-date=" + dataDate + "]").hasClass('fc-other-month').toString();
                    if(isOtherMonth) {
                        angular.element("td.fc-day-number[data-date=" + dataDate + "]").css('opacity', 1);
                    }
                    angular.element("td.fc-day-number[data-date=" + dataDate + "] div").addClass('number-circle-bg');
                }
                //console.log("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
            }
        }
    };

    // bind my today button with ui-calendar -----------------------------------
    $scope.runTodayActiveFirst = { value: true};
    $scope.todayActive = function() {

        $scope.runTodayActiveFirst.value = false;

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

    // -------------------------------------------------------------------------
    // Calendar Settings -------------------------------------------------------
    // -------------------------------------------------------------------------
    $ionicModal.fromTemplateUrl('templates/calendar-settings-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
    }).then(function(modal) {
        $scope.calendarSettingsModal = modal;
    });
    $scope.deleteCalendar = function() {

        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure to delete "' + $scope.calendarData.name + '" ?',
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
                    '<i class="button-icon-size ion-ios-minus-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Delete</span>' +
                    '</div>',
                    type: 'button-outline button-assertive',
                    onTap: function(e) {
                        //e.preventDefault();
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if(res) {
                console.log('delete: ', calendarId);
            } else {
                console.log('cancel');
            }
        });
    };

    // -------------------------------------------------------------------------
    // Toggle when select day month or year Input on create & edit modal -------
    // -------------------------------------------------------------------------
    $scope.toggleWeekDaySelect = function (weekDay){
        $scope.eventWeekDay[weekDay] = !$scope.eventWeekDay[weekDay];
    };
    $scope.toggleMonthDaySelect = function (monthDay){
        $scope.eventMonthDay[monthDay] = !$scope.eventMonthDay[monthDay];
    };
    $scope.toggleMonthSelect = function (month){
        $scope.eventMonth[month] = !$scope.eventMonth[month];
    };

    // -------------------------------------------------------------------------
    // Week Month Year & about Repeat value Default ----------------------------
    // -------------------------------------------------------------------------
    $scope.eventWeekDay = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    };
    $scope.eventMonthDay = [
        false,false,false,false,false,false,false,
        false,false,false,false,false,false,false,
        false,false,false,false,false,false,false,
        false,false,false,false,false,false,false,
        false,false,false
    ];
    $scope.eventMonth = [false,false,false,false,false,false,false,false,false,false,false,false];
    $scope.repeat = {
        status: false,
        endRepeat: 'never', // 'never', 'after', 'date' (on date)
        repeatBy: '', // 'each', 'on' (on the)
        onThe : {
            checked: false,
            sequent: 'first',
            day: 'day'
        }
    };

    // -------------------------------------------------------------------------
    // Create Event ------------------------------------------------------------
    // -------------------------------------------------------------------------
    $scope.createEventData = {
        name: 'Event Name',
        description: '',
        startDate: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        repeat: {
            status: false,
            recurring: 'monthly',
            daily: {
                every: 1
            },
            weekly: {
                every: 1,
                days: {
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: true,
                    friday: true,
                    saturday: false,
                    sunday: false
                }
            },
            monthly: {
                every: 1,
                select: 'each',
                months: [
                    false,false,false,false,false,false,false,
                    false,false,false,false,false,false,false,
                    false,false,false,false,false,false,false,
                    false,false,false,false,false,false,false,
                    false,false,false
                ]
            },
            yearly: {
                every: 1,
                onThe: false,
                years: [false,false,false,false,false,false,true,false,false,false,false,false]
            },
            endRepeat: {
                value: 'never',
                after: 1,
                onDate: new Date()
            },
            onThe : {
                sequent: 'first',
                day: 'day'
            }
        }
    };

    $ionicModal.fromTemplateUrl('templates/create-event-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
    }).then(function(modal) {
        $scope.createEventModal = modal;
    });
    $scope.openCreateEvent = function(){
        $scope.createEventModal.show();
    };

    // -------------------------------------------------------------------------
    // Edit Event --------------------------------------------------------------
    // -------------------------------------------------------------------------
    $ionicModal.fromTemplateUrl('templates/edit-event-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
    }).then(function(modal) {
        $scope.editEventModal = modal;
    });

    // Calculate value in 'On the' ---------------------------------------------
    $scope.setOnSequent = function() {
        if($scope.editEventData.rRule.bySetPos == 1) {
            $scope.repeat.onThe.sequent = 'first';
        }
        else if($scope.editEventData.rRule.bySetPos == 2) {
            $scope.repeat.onThe.sequent = 'second';
        }
        else if($scope.editEventData.rRule.bySetPos == 3) {
            $scope.repeat.onThe.sequent = 'third';
        }
        else if($scope.editEventData.rRule.bySetPos == 4) {
            $scope.repeat.onThe.sequent = 'fourth';
        }
        else if($scope.editEventData.rRule.bySetPos == 5) {
            $scope.repeat.onThe.sequent = 'fifth';
        }
        else if($scope.editEventData.rRule.bySetPos == -1) {
            $scope.repeat.onThe.sequent = 'last';
        }
    };
    $scope.setOnDay = function(){
        if($scope.editEventData.rRule.byWeekDay.length == 1 && $scope.editEventData.rRule.byWeekDay[0] == 'MO') {
            $scope.repeat.onThe.day = 'monday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length == 1 && $scope.editEventData.rRule.byWeekDay[0] == 'TU') {
            $scope.repeat.onThe.day = 'tuesday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length == 1 && $scope.editEventData.rRule.byWeekDay[0] == 'WE') {
            $scope.repeat.onThe.day = 'wednesday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length == 1 && $scope.editEventData.rRule.byWeekDay[0] == 'TH') {
            $scope.repeat.onThe.day = 'thursday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length == 1 && $scope.editEventData.rRule.byWeekDay[0] == 'FR') {
            $scope.repeat.onThe.day = 'friday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length == 1 && $scope.editEventData.rRule.byWeekDay[0] == 'SA') {
            $scope.repeat.onThe.day = 'saturday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length == 1 && $scope.editEventData.rRule.byWeekDay[0] == 'SU') {
            $scope.repeat.onThe.day = 'sunday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length == 5) {
            var weekday = ['MO', 'TU', 'WE', 'TH', 'FR'];
            var weekdayValue = {
                'MO': false,
                'TU': false,
                'WE': false,
                'TH': false,
                'FR': false
            };
            angular.forEach(weekday, function(weekday){
                angular.forEach($scope.editEventData.rRule.byWeekDay, function(value){
                    if(value == weekday){
                        weekdayValue[weekday] = true;
                    }
                });
            });
            if(weekdayValue['MO']==true && weekdayValue['TU']==true && weekdayValue['WE']==true && weekdayValue['TH']==true && weekdayValue['FR']==true){
                $scope.repeat.onThe.day = 'weekday';
            }
        }
        else if($scope.editEventData.rRule.byWeekDay.length == 2) {
            var weekend = ['SA', 'SU'];
            var weekendValue = {
                'MO': false,
                'TU': false
            };
            angular.forEach(weekend, function(weekend){
                angular.forEach($scope.editEventData.rRule.byWeekDay, function(value){
                    if(value == weekend){
                        weekendValue[weekend] = true;
                    }
                });
            });
            if(weekendValue['SA']==true && weekendValue['SU']==true){
                $scope.repeat.onThe.day = 'weekend';
            }
        }
    };

    $scope.openEditEvent = function(event){
        $scope.editEventData = event;

        // Set startDate & endDate to date -------------------------------------
        $scope.editEventData.startDate = new Date($scope.editEventData.startDate);
        $scope.editEventData.endDate = new Date($scope.editEventData.endDate);

        // Set on/off repeat ---------------------------------------------------
        if($scope.editEventData.rRule) {
            $scope.repeat.status = true;
        }

        // Set end repeat value (never, after, on date) ------------------------
        if($scope.editEventData.rRule && !$scope.editEventData.rRule.until) {
            $scope.repeat.endRepeat = 'never';
        }
        else if($scope.editEventData.rRule && $scope.editEventData.rRule.until && !$scope.editEventData.rRule.count) {
            $scope.repeat.endRepeat = 'date';
            $scope.editEventData.rRule.until = new Date($scope.editEventData.rRule.until);
        }
        else if ($scope.editEventData.rRule && $scope.editEventData.rRule.until && $scope.editEventData.rRule.count){
            $scope.repeat.endRepeat = 'after';
        }

        // Set value 'each' or 'on' ---------------------------------------------
        if($scope.editEventData.rRule && $scope.editEventData.rRule.frequency == 'MONTHLY'){  // for monthly
            if($scope.editEventData.rRule.bySetPos){
                $scope.repeat.repeatBy = 'on';
                // Set 'on the' sequent to 'first', 'second', 'third', 'fourth', 'fifth' or 'last'
                $scope.setOnSequent();

                // Set 'on the' day to 'day', 'weekday', 'weekend', 'monday'...'sunday'
                if($scope.editEventData.rRule.byMonthDay){
                    $scope.repeat.onThe.day = 'day';
                }
                else if($scope.editEventData.rRule.byWeekDay){
                    $scope.setOnDay();
                }
            } else {
                $scope.repeat.repeatBy = 'each';
                if($scope.editEventData.rRule.byMonthDay){
                    angular.forEach($scope.editEventData.rRule.byMonthDay, function(value){
                        var monthDay = parseInt(value);
                        if(monthDay > 0){
                            $scope.eventMonthDay[monthDay-1] = true;
                        }
                    });
                }
            }
        }
        else if($scope.editEventData.rRule && $scope.editEventData.rRule.byMonth){ // for yearly
            if($scope.editEventData.rRule.byMonth){
                angular.forEach($scope.editEventData.rRule.byMonth, function(value){
                    var month = parseInt(value);
                    if(month > 0){
                        $scope.eventMonth[month-1] = true;
                    }
                });
            }
            if($scope.editEventData.rRule.bySetPos){
                $scope.repeat.repeatBy = 'on';
                // Set 'on the' sequent to 'first', 'second', 'third', 'fourth', 'fifth' or 'last'
                $scope.setOnSequent();

                // Set 'on the' day to 'day', 'weekday', 'weekend', 'monday'...'sunday'
                if($scope.editEventData.rRule.byMonthDay){
                    $scope.repeat.onThe.day = 'day';
                    $scope.repeat.checked = true;
                }
                else if($scope.editEventData.rRule.byWeekDay){
                    $scope.repeat.checked = true;
                    $scope.setOnDay();
                }
            }
        }

        $scope.editEventModal.show();
    };

});
