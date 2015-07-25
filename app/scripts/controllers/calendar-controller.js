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
            eventClick: function(event, element) {

                // When select event -------------------------------------------
                $scope.openEditEvent(event);
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

    // bind my today button with ui-calendar -----------------------------------
    $scope.runTodayActiveFirst = { value: true };
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
                    onTap: function() {
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
                    onTap: function() {
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

    var setEventDataDefault = function () {
        $scope.eventWeekDay = {
            'MO': false,
            'TU': false,
            'WE': false,
            'TH': false,
            'FR': false,
            'SA': false,
            'SU': false
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
    };

    // -------------------------------------------------------------------------
    // Create Event ------------------------------------------------------------
    // -------------------------------------------------------------------------

    var createEventStartDate = new Date();
    createEventStartDate.setMinutes(0);
    createEventStartDate.setSeconds(0);
    createEventStartDate.setMilliseconds(0);

    var createEventEndDate = new Date();
    createEventEndDate.setMinutes(0);
    createEventEndDate.setSeconds(0);
    createEventEndDate.setMilliseconds(0);
    createEventEndDate.setHours(createEventEndDate.getHours() +1 );

    $scope.createEventData = {
        calendar: calendarId,
        name: 'Event name',
        description: 'Event description',
        startDate: createEventStartDate,
        endDate: createEventEndDate
    };

    $ionicModal.fromTemplateUrl('templates/create-event-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
    }).then(function(modal) {
        $scope.createEventModal = modal;
    });

    $scope.openCreateEvent = function(){
        setEventDataDefault();

        // Set startDate & endDate to date -------------------------------------
        $scope.createEventData.startDate = new Date($scope.createEventData.startDate);
        $scope.createEventData.endDate = new Date($scope.createEventData.endDate);

        $scope.createEventModal.show();
    };

    $scope.onOffRepeat = function(){
        // if frequency toggle value is true
        if($scope.repeat.status == true){
            $scope.createEventData.rRule = {
                frequency: 'DAILY',
                interval: 1
            };

        }else if($scope.repeat.status == false){
            if($scope.createEventData.rRule){

                delete $scope.createEventData.rRule;
                console.log($scope.createEventData.rRule);
            }
        }
    };

    // Calculate 'On the' for save to db ---------------------------------------
    var setOnSequentToSave = function() {
        $scope.createEventData.rRule.bySetPos = [];

        if($scope.repeat.onThe.sequent == 'first') {
            $scope.createEventData.rRule.bySetPos.push(1);
        }
        else if($scope.repeat.onThe.sequent == 'second') {
            $scope.createEventData.rRule.bySetPos.push(2);
        }
        else if($scope.repeat.onThe.sequent == 'third') {
            $scope.createEventData.rRule.bySetPos.push(3);
        }
        else if($scope.repeat.onThe.sequent == 'fourth') {
            $scope.createEventData.rRule.bySetPos.push(4);
        }
        else if($scope.repeat.onThe.sequent == 'fifth') {
            $scope.createEventData.rRule.bySetPos.push(5);
        }
        else if($scope.repeat.onThe.sequent == 'last') {
            $scope.createEventData.rRule.bySetPos.push(-1);
        }
    };
    var setOnDayToSave = function(){
        $scope.createEventData.rRule.byWeekDay = [];

        if($scope.repeat.onThe.day == 'monday') {
            $scope.createEventData.rRule.byWeekDay.push('MO');
        }
        else if($scope.repeat.onThe.day == 'tuesday') {
            $scope.createEventData.rRule.byWeekDay.push('TU');
        }
        else if($scope.repeat.onThe.day == 'wednesday') {
            $scope.createEventData.rRule.byWeekDay.push('WE');
        }
        else if($scope.repeat.onThe.day == 'thursday') {
            $scope.createEventData.rRule.byWeekDay.push('TH');
        }
        else if($scope.repeat.onThe.day == 'friday') {
            $scope.createEventData.rRule.byWeekDay.push('FR');
        }
        else if($scope.repeat.onThe.day == 'saturday') {
            $scope.createEventData.rRule.byWeekDay.push('SA');
        }
        else if($scope.repeat.onThe.day == 'sunday') {
            $scope.createEventData.rRule.byWeekDay.push('SU');
        }
        else if($scope.repeat.onThe.day == 'weekday') {
            $scope.createEventData.rRule.byWeekDay = ['MO', 'TU', 'WE', 'TH', 'FR'];
        }
        else if($scope.repeat.onThe.day == 'weekend') {
            $scope.createEventData.rRule.byWeekDay = ['SA', 'SU'];
        }
        else if($scope.repeat.onThe.day == 'day') {
            // delete byWeekDay (if any)
            if($scope.createEventData.rRule.byWeekDay) {
                delete $scope.createEventData.rRule.byWeekDay;
            }
            $scope.createEventData.rRule.byMonthDay = [];
        }
    };

    $scope.saveEvent = function () {

        if($scope.repeat.status == true) {

            if($scope.createEventData.rRule.frequency == 'DAILY'){

                // delete byWeekDay (if any)
                if($scope.createEventData.rRule.byWeekDay) {
                    delete $scope.createEventData.rRule.byWeekDay;
                }
                // delete byMonthDay (if any)
                if($scope.createEventData.rRule.byMonthDay) {
                    delete $scope.createEventData.rRule.byMonthDay;
                }
                // delete bySetPos (if any)
                if($scope.createEventData.rRule.bySetPos) {
                    delete $scope.createEventData.rRule.bySetPos;
                }
                // delete byMonth (if any)
                if($scope.createEventData.rRule.byMonth) {
                    delete $scope.createEventData.rRule.byMonth;
                }
            }
            else if($scope.createEventData.rRule.frequency == 'WEEKLY') {

                // delete byMonthDay (if any)
                if($scope.createEventData.rRule.byMonthDay) {
                    delete $scope.createEventData.rRule.byMonthDay;
                }
                // delete bySetPos (if any)
                if($scope.createEventData.rRule.bySetPos) {
                    delete $scope.createEventData.rRule.bySetPos;
                }
                // delete byMonth (if any)
                if($scope.createEventData.rRule.byMonth) {
                    delete $scope.createEventData.rRule.byMonth;
                }

                // Set byWeekDay
                $scope.createEventData.rRule.byWeekDay = [];
                angular.forEach($scope.eventWeekDay, function(value, key){
                    if(value == true){
                        $scope.createEventData.rRule.byWeekDay.push(key);
                    }
                });
            }
            else if ($scope.createEventData.rRule.frequency == 'MONTHLY'){

                // delete byMonth (if any)
                if($scope.createEventData.rRule.byMonth) {
                    delete $scope.createEventData.rRule.byMonth;
                }

                if($scope.repeat.repeatBy == 'each') {
                    // delete byWeekDay (if any)
                    if($scope.createEventData.rRule.byWeekDay) {
                        delete $scope.createEventData.rRule.byWeekDay;
                    }
                    // delete bySetPos (if any)
                    if($scope.createEventData.rRule.bySetPos) {
                        delete $scope.createEventData.rRule.bySetPos;
                    }

                    // Set byMonthDay
                    $scope.createEventData.rRule.byMonthDay = [];
                    angular.forEach($scope.eventMonthDay, function(value, key){
                        if(value == true){
                            $scope.createEventData.rRule.byMonthDay.push(key+1);
                        }
                    });
                }
                else if ($scope.repeat.repeatBy == 'on'){

                    // delete byMonthDay (if any)
                    if($scope.createEventData.rRule.byMonthDay) {
                        delete $scope.createEventData.rRule.byMonthDay;
                    }

                    // Set bySetPos , byMonthDay or byWeekDay
                    setOnSequentToSave();
                    setOnDayToSave();
                }
            }
            else if ($scope.createEventData.rRule.frequency == 'YEARLY'){

                // Set byMonth
                $scope.createEventData.rRule.byMonth = [];
                angular.forEach($scope.eventMonth, function(value, key){
                    if(value == true){
                        $scope.createEventData.rRule.byMonth.push(key+1);
                    }
                });

                // Check 'On the' Status
                if($scope.repeat.onThe.checked) {

                    // delete byMonthDay (if any)
                    if($scope.createEventData.rRule.byMonthDay) {
                        delete $scope.createEventData.rRule.byMonthDay;
                    }

                    // Set bySetPos , byMonthDay or byWeekDay
                    setOnSequentToSave();
                    setOnDayToSave();
                }
                else {
                    // delete byWeekDay (if any)
                    if($scope.createEventData.rRule.byWeekDay) {
                        delete $scope.createEventData.rRule.byWeekDay;
                    }
                    // delete bySetPos (if any)
                    if($scope.createEventData.rRule.bySetPos) {
                        delete $scope.createEventData.rRule.bySetPos;
                    }
                    // delete byMonthDay (if any)
                    if($scope.createEventData.rRule.byMonthDay) {
                        delete $scope.createEventData.rRule.byMonthDay;
                    }

                }
            }
        }

        // get end repeat value (never, after, on date) for save to db ---------
        if($scope.repeat.endRepeat == 'never') {
            if ($scope.createEventData.rRule.until) {
                delete $scope.createEventData.rRule.until;
            }
            if ($scope.createEventData.rRule.count) {
                delete $scope.createEventData.rRule.count;
            }
        }
        else if($scope.repeat.endRepeat == 'date') {
            if ($scope.createEventData.rRule.count) {
                delete $scope.createEventData.rRule.count;
            }
        }
        else if ($scope.repeat.endRepeat == 'after'){
            if ($scope.createEventData.rRule.until) {
                delete $scope.createEventData.rRule.until;
            }
        }

        console.log($scope.createEventData);
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

    // Calculate value in 'On the' --------------------------------------
    var setOnSequent = function() {
        if($scope.editEventData.rRule.bySetPos[0] == 1) {
            $scope.repeat.onThe.sequent = 'first';
        }
        else if($scope.editEventData.rRule.bySetPos[0] == 2) {
            $scope.repeat.onThe.sequent = 'second';
        }
        else if($scope.editEventData.rRule.bySetPos[0] == 3) {
            $scope.repeat.onThe.sequent = 'third';
        }
        else if($scope.editEventData.rRule.bySetPos[0] == 4) {
            $scope.repeat.onThe.sequent = 'fourth';
        }
        else if($scope.editEventData.rRule.bySetPos[0] == 5) {
            $scope.repeat.onThe.sequent = 'fifth';
        }
        else if($scope.editEventData.rRule.bySetPos[0] == -1) {
            $scope.repeat.onThe.sequent = 'last';
        }
    };
    var setOnDay = function(){
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

    // Transform event data to show in edit event modal -----------------
    $scope.openEditEvent = function(event){
        $scope.editEventData = event;
        setEventDataDefault();

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
        if($scope.editEventData.rRule && $scope.editEventData.rRule.frequency == 'MONTHLY'){
            if($scope.editEventData.rRule.bySetPos){
                $scope.repeat.repeatBy = 'on';
                // Set 'on the' sequent to 'first', 'second', 'third', 'fourth', 'fifth' or 'last'
                setOnSequent();

                // Set 'on the' day to 'day', 'weekday', 'weekend', 'monday'...'sunday'
                if($scope.editEventData.rRule.byMonthDay){
                    $scope.repeat.onThe.day = 'day';
                }
                else if($scope.editEventData.rRule.byWeekDay){
                    setOnDay();
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
        else if($scope.editEventData.rRule && $scope.editEventData.rRule.frequency == 'YEARLY'){
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
                setOnSequent();

                // Set 'on the' day to 'day', 'weekday', 'weekend', 'monday'...'sunday'
                if($scope.editEventData.rRule.byMonthDay){
                    $scope.repeat.onThe.day = 'day';
                    $scope.repeat.checked = true;
                }
                else if($scope.editEventData.rRule.byWeekDay){
                    $scope.repeat.checked = true;
                    setOnDay();
                }
            }
        }
        else if($scope.editEventData.rRule && $scope.editEventData.rRule.frequency == 'WEEKLY') {
            angular.forEach($scope.editEventData.rRule.byWeekDay, function(weekday){
                if(weekday == 'MO') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday == 'TU') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday == 'WE') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday == 'TH') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday == 'FR') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday == 'SA') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday == 'SU') { $scope.eventWeekDay[weekday] = true; }
            });
        }

        $scope.editEventModal.show();
    };

    // Save Event Data Edited --------------------------------------------------
    $scope.editEvent = function (eventId) {
        console.log($scope.editEventData);
    };

    // Delete Event -------------------------------------------------------------
    $scope.deleteEvent = function (eventId){

        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure to delete this "' + $scope.editEventData.name + '" event ?',
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
                    '<i class="button-icon-size ion-ios-minus-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Delete</span>' +
                    '</div>',
                    type: 'button-outline button-assertive',
                    onTap: function() {
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if(res) {
                console.log('delete: ', eventId);
            } else {
                console.log('cancel');
            }
        });
    };

});
