'use strict';

window.app.controller('CalendarController', function ($scope, $stateParams, calendars, $ionicModal, $ionicPopup, calendarEvents, usersCalendars, users, RRule, uiCalendarConfig) {

    var calendarId = $stateParams.calendarId;
    $scope.calendarName = 'myCalendar';
    $scope.calendarData = calendars[calendarId];
    $scope.calendarAccessRole = $stateParams.accessRole;
    // Login User Id
    var userId = 1;
    $scope.userId = 1;

    // -------------------------------------------------------------------------
    // About calendar management -----------------------------------------------
    // -------------------------------------------------------------------------

    // Get all events to show in ui-calendar -----------------------------------
    $scope.calendarEventsData = calendarEvents('', '', calendarId,'calendarEvents');
    $scope.dateSelected = moment();

    $scope.transformDate = function(date){
        return moment(date).format('HH:mm');
    };

    // Reference month & weekday -----------------------------------------------
    $scope.month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    $scope.weekDay = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];

    // Calendar UI Configuration -----------------------------------------------
    $scope.uiCalendarEvents = {
        events: $scope.calendarEventsData,
        color: 'rgba(0, 201, 13, 0.2)',
        textColor: '#333333'
    };

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
        angular.forEach($scope.calendarEventsData, function (event) {
            if($scope.dateSelected.isSame(event.startDate, 'd')){
                $scope.selectedDateEvents.push(event);
            }
        });
    };

    function selectToday(element) {
        uiCalendarConfig.calendars[$scope.calendarName].fullCalendar('today');
        selectDate(moment(), element);
    }

    $scope.uiConfig = {
        calendar:{
            header:{
                right: 'today prev,next'
            },
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
            eventClick: function(event, element) {

                // When select event -------------------------------------------
                if($scope.calendarAccessRole != 'reader'){
                    $scope.openEditEvent(event);
                }else{
                    console.log('read only');
                }
            },
            dayRender: function (date, cell) {
                if(date.isSame($scope.dateSelected, 'd')){
                    selectDate(date, cell);
                }
            }
        }
    };

    // bind my today button with ui-calendar -----------------------------------
    $scope.todayClick = function() {
        selectToday();
    };

    // Delete Calendar ---------------------------------------------------------
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
    // Week Month Year & about Repeat value Default ----------------------------
    // -------------------------------------------------------------------------

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
        status: false, // when on/off repeat toggle
        endRepeat: 'never', // 'never', 'after', 'date' (on date)
        repeatBy: '', // use with monthly value is 'each' or 'on'(On the)
        onThe : {
            checked: false, // use with yearly when check 'On the'
            sequent: 'first', // 'first', 'second', 'third', 'fourth', 'fifth' and 'last'
            day: 'day' // 'day', 'weekday', 'weekend', 'monday', ..., 'sunday'
        }
    };
    // Calculate date now to set date input default
    var dateNow = new Date();
    var dateNow2 = dateNow.getFullYear() +'-'+ ((dateNow.getMonth() < 10 )? '0'+dateNow.getMonth():dateNow.getMonth()) +'-'+ ((dateNow.getDate() < 10 )? '0'+dateNow.getDate():dateNow.getDate());
    $scope.dateUntil = new Date(dateNow2);



    // -------------------------------------------------------------------------
    // Toggle when select day month or year Input on create & edit modal -------
    // -------------------------------------------------------------------------

    $scope.toggleWeekDaySelect = function (weekDay){
        $scope.eventWeekDay[weekDay] = !$scope.eventWeekDay[weekDay];
    };

    $scope.toggleMonthDaySelect = function (monthDay){
        var i = 0;
        var trueNumber = 0;
        var trueIndex = 0;
        angular.forEach($scope.eventMonthDay, function(value){
            if(value == true){
                trueNumber++;
                trueIndex = i;
            } i++;
        });
        if(trueNumber == 1 && trueIndex==monthDay){
            console.log('Select at least 1');
        }else{
            $scope.eventMonthDay[monthDay] = !$scope.eventMonthDay[monthDay];
        }
    };

    $scope.toggleMonthSelect = function (month){
        var i = 0;
        var trueNumber = 0;
        var trueIndex = 0;
        angular.forEach($scope.eventMonth, function(value){
            if(value == true){
                trueNumber++;
                trueIndex = i;
            } i++;
        });
        if(trueNumber == 1 && trueIndex==month){
            console.log('Select at least 1');
        }else{
            $scope.eventMonth[month] = !$scope.eventMonth[month];
        }
    };



    // -------------------------------------------------------------------------
    // Calculate function send to RRule set summary ----------------------------
    // -------------------------------------------------------------------------

    // Set byweekday RRule
    var setByWeekDay = function(){
        var byweekday = [];

        if($scope.eventWeekDay['MO'] == true) {
            byweekday.push(RRule.MO);
        }
        if($scope.eventWeekDay['TU'] == true) {
            byweekday.push(RRule.TU);
        }
        if($scope.eventWeekDay['WE'] == true) {
            byweekday.push(RRule.WE);
        }
        if($scope.eventWeekDay['TH'] == true) {
            byweekday.push(RRule.TH);
        }
        if($scope.eventWeekDay['FR'] == true) {
            byweekday.push(RRule.FR);
        }
        if($scope.eventWeekDay['SA'] == true) {
            byweekday.push(RRule.SA);
        }
        if($scope.eventWeekDay['SU'] == true) {
            byweekday.push(RRule.SU);
        }

        return byweekday;
    };

    // Set bymonthday RRule
    var setByMonthDay = function(){
        var bymonthday = [];
        var i = 1;
        angular.forEach($scope.eventMonthDay, function(value){
            if(value == true) {
                bymonthday.push(i);
            }
            i++;
        });

        return bymonthday;
    };

    // Set bymonth RRule
    var setByMonth = function(){
        var bymonth = [];
        var i = 1;
        angular.forEach($scope.eventMonth, function(value){
            if(value == true) {
                bymonth.push(i);
            }
            i++;
        });

        return bymonth;
    };

    // Convert 'On the' sequent from sting to number for bySetPos RRule
    var setBySetPos = function(sequent){
        if(sequent == 'first'){
            return [1];
        }else if(sequent == 'second'){
            return [2];
        }else if(sequent == 'third'){
            return [3];
        }else if(sequent == 'fourth'){
            return [4];
        }else if(sequent == 'fifth'){
            return [5];
        }else if(sequent == 'last'){
            return [-1];
        }
    };

    // Set on the to rRule for Create Event Modal
    var setOntheRrule = function(){
        if($scope.repeat.onThe.day == 'day'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'weekday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'weekend'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'monday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'tuesday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'wednesday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'thursday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'friday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'saturday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'sunday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
    };
    var setOntheRruleYearly = function(){
        if($scope.repeat.onThe.day == 'day'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'weekday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'weekend'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'monday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'tuesday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'wednesday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'thursday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'friday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'saturday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'sunday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    until: new Date($scope.createEventData.rRule.until),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    count: $scope.createEventData.rRule.count,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
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

    // Calculate Repeat Summary (by RRule Module) for Create Event Modal ------
    $scope.calculateRrule = function() {

        if($scope.repeat.status == true) {
            if ($scope.createEventData.rRule.frequency == 'DAILY') {

                if ($scope.repeat.endRepeat == 'date') {
                    $scope.createDataRrule = new RRule({
                        freq: RRule.DAILY,
                        interval: $scope.createEventData.rRule.interval,
                        dtstart: new Date($scope.createEventData.startDate),
                        until: new Date($scope.createEventData.rRule.until)
                    });
                }
                else if ($scope.repeat.endRepeat == 'after') {
                    $scope.createDataRrule = new RRule({
                        freq: RRule.DAILY,
                        interval: $scope.createEventData.rRule.interval,
                        count: $scope.createEventData.rRule.count,
                        dtstart: new Date($scope.createEventData.startDate)
                    });
                }
                else if ($scope.repeat.endRepeat == 'never') {
                    $scope.createDataRrule = new RRule({
                        freq: RRule.DAILY,
                        interval: $scope.createEventData.rRule.interval,
                        dtstart: new Date($scope.createEventData.startDate)
                    });
                }
            }
            else if ($scope.createEventData.rRule.frequency == 'WEEKLY') {

                var byweekday = setByWeekDay();

                if ($scope.repeat.endRepeat == 'date') {
                    $scope.createDataRrule = new RRule({
                        freq: RRule.WEEKLY,
                        interval: $scope.createEventData.rRule.interval,
                        dtstart: new Date($scope.createEventData.startDate),
                        until: new Date($scope.createEventData.rRule.until),
                        byweekday: byweekday
                    });
                }
                else if ($scope.repeat.endRepeat == 'after') {
                    $scope.createDataRrule = new RRule({
                        freq: RRule.WEEKLY,
                        interval: $scope.createEventData.rRule.interval,
                        count: $scope.createEventData.rRule.count,
                        dtstart: new Date($scope.createEventData.startDate),
                        byweekday: byweekday
                    });
                }
                else if ($scope.repeat.endRepeat == 'never') {
                    $scope.createDataRrule = new RRule({
                        freq: RRule.WEEKLY,
                        interval: $scope.createEventData.rRule.interval,
                        dtstart: new Date($scope.createEventData.startDate),
                        byweekday: byweekday
                    });
                }
            }
            else if ($scope.createEventData.rRule.frequency == 'MONTHLY') {
                var bymonthday = [];
                var bymonthday = setByMonthDay();

                $scope.createDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate)
                });

                if($scope.repeat.repeatBy=='each'){
                    if(bymonthday.length > 0){
                        if ($scope.repeat.endRepeat == 'date') {
                            $scope.createDataRrule = new RRule({
                                freq: RRule.MONTHLY,
                                interval: $scope.createEventData.rRule.interval,
                                dtstart: new Date($scope.createEventData.startDate),
                                until: new Date($scope.createEventData.rRule.until),
                                bymonthday: bymonthday
                            });
                        }
                        else if ($scope.repeat.endRepeat == 'after') {
                            $scope.createDataRrule = new RRule({
                                freq: RRule.MONTHLY,
                                interval: $scope.createEventData.rRule.interval,
                                count: $scope.createEventData.rRule.count,
                                dtstart: new Date($scope.createEventData.startDate),
                                bymonthday: bymonthday
                            });
                        }
                        else if ($scope.repeat.endRepeat == 'never') {
                            $scope.createDataRrule = new RRule({
                                freq: RRule.MONTHLY,
                                interval: $scope.createEventData.rRule.interval,
                                dtstart: new Date($scope.createEventData.startDate),
                                bymonthday: bymonthday
                            });
                        }
                    }else{
                        $scope.createDataRrule = new RRule({
                            freq: RRule.MONTHLY,
                            interval: $scope.createEventData.rRule.interval,
                            dtstart: new Date($scope.createEventData.startDate)
                        });
                    }
                }
                else if($scope.repeat.repeatBy=='on'){
                    setOntheRrule();
                }
            }
            else if ($scope.createEventData.rRule.frequency == 'YEARLY') {
                var bymonth = [];
                var bymonth = setByMonth();

                $scope.createDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.createEventData.rRule.interval,
                    dtstart: new Date($scope.createEventData.startDate)
                });

                if ($scope.repeat.endRepeat == 'date') {
                    $scope.createDataRrule = new RRule({
                        freq: RRule.YEARLY,
                        interval: $scope.createEventData.rRule.interval,
                        dtstart: new Date($scope.createEventData.startDate),
                        until: new Date($scope.createEventData.rRule.until),
                        bymonth: bymonth
                    });
                }
                else if ($scope.repeat.endRepeat == 'after') {
                    $scope.createDataRrule = new RRule({
                        freq: RRule.YEARLY,
                        interval: $scope.createEventData.rRule.interval,
                        count: $scope.createEventData.rRule.count,
                        dtstart: new Date($scope.createEventData.startDate),
                        bymonth: bymonth
                    });
                }
                else if ($scope.repeat.endRepeat == 'never') {
                    $scope.createDataRrule = new RRule({
                        freq: RRule.YEARLY,
                        interval: $scope.createEventData.rRule.interval,
                        dtstart: new Date($scope.createEventData.startDate),
                        bymonth: bymonth
                    });
                }


                if($scope.repeat.onThe.checked==true){
                    setOntheRruleYearly();
                }
            }
        }

        console.log($scope.createDataRrule);
    };

    $scope.openCreateEvent = function(){

        // Set startDate & endDate to date -------------------------------------
        $scope.createEventData.startDate = new Date($scope.createEventData.startDate);
        $scope.createEventData.endDate = new Date($scope.createEventData.endDate);
        $scope.repeat.status = false;

        $scope.createEventModal.show();
    };

    // When on/off repeat on create event modal --------------------------------
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

        $scope.calculateRrule();
    };

    // Calculate 'On the' for save to db ---------------------------------------
    var setOnSequentToSave = function() {

        if($scope.repeat.onThe.sequent == 'first') {
            $scope.createEventData.rRule.bySetPos = [1];
        }
        else if($scope.repeat.onThe.sequent == 'second') {
            $scope.createEventData.rRule.bySetPos = [2];
        }
        else if($scope.repeat.onThe.sequent == 'third') {
            $scope.createEventData.rRule.bySetPos = [3];
        }
        else if($scope.repeat.onThe.sequent == 'fourth') {
            $scope.createEventData.rRule.bySetPos = [4];
        }
        else if($scope.repeat.onThe.sequent == 'fifth') {
            $scope.createEventData.rRule.bySetPos = [5];
        }
        else if($scope.repeat.onThe.sequent == 'last') {
            $scope.createEventData.rRule.bySetPos = [-1];
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
            // delete bySetPos (if any)
            if($scope.createEventData.rRule.bySetPos) {
                delete $scope.createEventData.rRule.bySetPos;
            }
            var byMonthDayValue = setBySetPos($scope.repeat.onThe.sequent);
            $scope.createEventData.rRule.byMonthDay = byMonthDayValue;
        }
    };

    // Create event ------------------------------------------------------------
    var reportSaveEventData = function(){
        var myPopup = $ionicPopup.confirm({
            title: 'Save Status',
            template: 'Save Success',
            buttons: [
                {
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-close-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Close</span>' +
                    '</div>',
                    type: 'button-outline button-stable',
                    onTap: function() {
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if(res){
                $scope.createEventModal.hide();
            }
        });
    };
    $scope.saveEvent = function () {

        if($scope.repeat.status == true) {

            $scope.createEventData.rRule.dateStart = $scope.createEventData.startDate;

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

        console.log('Save Event Data: ', $scope.createEventData);

        // if save success
        reportSaveEventData();
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

    // Set on the to rRule for Edit event modal
    var setEditOntheRrule = function(){
        if($scope.repeat.onThe.day == 'day'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'weekday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'weekend'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'monday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'tuesday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'wednesday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'thursday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'friday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'saturday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day == 'sunday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
    };
    var setEditOntheRruleYearly = function(){
        if($scope.repeat.onThe.day == 'day'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'weekday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'weekend'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'monday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'tuesday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'wednesday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'thursday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'friday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'saturday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day == 'sunday'){
            if ($scope.repeat.endRepeat == 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat == 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: getBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
    };

    // Calculate Repeat Summary (by RRule Module) for Edit Event Modal ---------
    $scope.editEventRrule = function() {

        if($scope.repeat.status == true) {
            if ($scope.editEventData.rRule && $scope.editEventData.rRule.frequency == 'DAILY') {

                if ($scope.repeat.endRepeat == 'date') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.DAILY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate),
                        until: new Date($scope.editEventData.rRule.until)
                    });
                }
                else if ($scope.repeat.endRepeat == 'after') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.DAILY,
                        interval: $scope.editEventData.rRule.interval,
                        count: $scope.editEventData.rRule.count,
                        dtstart: new Date($scope.editEventData.startDate)
                    });
                }
                else if ($scope.repeat.endRepeat == 'never') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.DAILY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate)
                    });
                }
            }
            else if ($scope.editEventData.rRule && $scope.editEventData.rRule.frequency == 'WEEKLY') {

                var byweekday = setByWeekDay();

                if ($scope.repeat.endRepeat == 'date') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.WEEKLY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate),
                        until: new Date($scope.editEventData.rRule.until),
                        byweekday: byweekday
                    });
                }
                else if ($scope.repeat.endRepeat == 'after') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.WEEKLY,
                        interval: $scope.editEventData.rRule.interval,
                        count: $scope.editEventData.rRule.count,
                        dtstart: new Date($scope.editEventData.startDate),
                        byweekday: byweekday
                    });
                }
                else if ($scope.repeat.endRepeat == 'never') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.WEEKLY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate),
                        byweekday: byweekday
                    });
                }
            }
            else if ($scope.editEventData.rRule && $scope.editEventData.rRule.frequency == 'MONTHLY') {
                var bymonthday = [];
                var bymonthday = setByMonthDay();

                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate)
                });

                if($scope.repeat.repeatBy=='each'){
                    if(bymonthday.length > 0){
                        if ($scope.repeat.endRepeat == 'date') {
                            $scope.editDataRrule = new RRule({
                                freq: RRule.MONTHLY,
                                interval: $scope.editEventData.rRule.interval,
                                dtstart: new Date($scope.editEventData.startDate),
                                until: new Date($scope.editEventData.rRule.until),
                                bymonthday: bymonthday
                            });
                        }
                        else if ($scope.repeat.endRepeat == 'after') {
                            $scope.editDataRrule = new RRule({
                                freq: RRule.MONTHLY,
                                interval: $scope.editEventData.rRule.interval,
                                count: $scope.editEventData.rRule.count,
                                dtstart: new Date($scope.editEventData.startDate),
                                bymonthday: bymonthday
                            });
                        }
                        else if ($scope.repeat.endRepeat == 'never') {
                            $scope.editDataRrule = new RRule({
                                freq: RRule.MONTHLY,
                                interval: $scope.editEventData.rRule.interval,
                                dtstart: new Date($scope.editEventData.startDate),
                                bymonthday: bymonthday
                            });
                        }
                    }else{
                        $scope.editDataRrule = new RRule({
                            freq: RRule.MONTHLY,
                            interval: $scope.editEventData.rRule.interval,
                            dtstart: new Date($scope.editEventData.startDate)
                        });
                    }
                }
                else if($scope.repeat.repeatBy=='on'){
                    setEditOntheRrule();
                }
            }
            else if ($scope.editEventData.rRule && $scope.editEventData.rRule.frequency == 'YEARLY') {
                var bymonth = [];
                var bymonth = setByMonth();

                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate)
                });

                if ($scope.repeat.endRepeat == 'date') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.YEARLY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate),
                        until: new Date($scope.editEventData.rRule.until),
                        bymonth: bymonth
                    });
                }
                else if ($scope.repeat.endRepeat == 'after') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.YEARLY,
                        interval: $scope.editEventData.rRule.interval,
                        count: $scope.editEventData.rRule.count,
                        dtstart: new Date($scope.editEventData.startDate),
                        bymonth: bymonth
                    });
                }
                else if ($scope.repeat.endRepeat == 'never') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.YEARLY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate),
                        bymonth: bymonth
                    });
                }


                if($scope.repeat.onThe.checked==true){
                    setEditOntheRruleYearly();
                }
            }
        }

        console.log('rRule Data: ', $scope.editDataRrule);
    };

    // Calculate value in 'On the' ---------------------------------------------
    var setOnSequent = function() {
        if($scope.editEventData.rRule.bySetPos){
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
        }
        else if($scope.editEventData.rRule.byMonthDay) {
            if($scope.editEventData.rRule.byMonthDay[0] == 1) {
                $scope.repeat.onThe.sequent = 'first';
            }
            else if($scope.editEventData.rRule.byMonthDay[0] == 2) {
                $scope.repeat.onThe.sequent = 'second';
            }
            else if($scope.editEventData.rRule.byMonthDay[0] == 3) {
                $scope.repeat.onThe.sequent = 'third';
            }
            else if($scope.editEventData.rRule.byMonthDay[0] == 4) {
                $scope.repeat.onThe.sequent = 'fourth';
            }
            else if($scope.editEventData.rRule.byMonthDay[0] == 5) {
                $scope.repeat.onThe.sequent = 'fifth';
            }
            else if($scope.editEventData.rRule.byMonthDay[0] == -1) {
                $scope.repeat.onThe.sequent = 'last';
            }
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
    var storeOldEventData = {}; // when user cancel edit or close modal return value before

    // Transform event data to show in edit event modal ------------------------
    $scope.openEditEvent = function(event){
        storeOldEventData = event;
        $scope.editEventData = event;

        if(!$scope.editEventData.rRule){
            $scope.repeat.status = false;
        }

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

        $scope.editEventRrule();

        $scope.editEventModal.show();
    };

    // Delete Event ------------------------------------------------------------
    $scope.deleteEvent = function (eventId){

        if($scope.editEventData.rRule) {
            var myPopup = $ionicPopup.confirm({
                title: 'Confirm',
                template: 'Do you want to delete all occurrences of this event, or only the selected occurrence ?',
                buttons: [
                    {
                        text: '<div class="flex align-items-center">' +
                        '<span class="flex-1">Cancel</span>' +
                        '</div>',
                        type: 'button-outline button-stable button-small',
                        onTap: function() {
                            return false;
                        }
                    },
                    {
                        text: '<div class="flex align-items-center">' +
                        '<span class="flex-1">Delete All</span>' +
                        '</div>',
                        type: 'button-outline button-assertive button-small',
                        onTap: function() {
                            return 'delete all';
                        }
                    },
                    {
                        text: '<div class="flex align-items-center">' +
                        '<span class="flex-1">Delete Only This Event</span>' +
                        '</div>',
                        type: 'button-outline button-assertive button-small',
                        onTap: function() {
                            return 'delete once';
                        }
                    }
                ]
            });
            myPopup.then(function(res) {
                if(res == 'delete once') {
                    console.log('Delete Only This Event: ', eventId);
                }
                else if(res == 'delete all') {
                    console.log('Delete All: ', $scope.editEventData.recurringEvent);
                }
                else {
                    console.log('Cancel');
                }
            });
        }else {
            var myPopup = $ionicPopup.confirm({
                title: 'Confirm',
                template: 'Do you want to delete this event "' + $scope.editEventData.name + '" ?',
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
                    },
                    {
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
                    console.log('Delete Event: ', eventId);
                }
                else {
                    console.log('Cancel');
                }
            });
        }
    };

    // When on/off repeat on edit event modal ----------------------------------
    $scope.editEventOnOffRepeat = function(){
        // if frequency toggle value is true
        if($scope.repeat.status == true){
            $scope.editEventData.rRule = {
                frequency: 'DAILY',
                interval: 1
            };

        }else if($scope.repeat.status == false){
            if($scope.editEventData.rRule){

                delete $scope.editEventData.rRule;
                console.log($scope.editEventData.rRule);
            }
        }

        $scope.editEventRrule();
    };

    // Calculate 'On the' for save to db ---------------------------------------
    var setEditOnSequentToSave = function() {

        if($scope.repeat.onThe.sequent == 'first') {
            $scope.editEventData.rRule.bySetPos = [1];
        }
        else if($scope.repeat.onThe.sequent == 'second') {
            $scope.editEventData.rRule.bySetPos = [2];
        }
        else if($scope.repeat.onThe.sequent == 'third') {
            $scope.editEventData.rRule.bySetPos = [3];
        }
        else if($scope.repeat.onThe.sequent == 'fourth') {
            $scope.editEventData.rRule.bySetPos = [4];
        }
        else if($scope.repeat.onThe.sequent == 'fifth') {
            $scope.editEventData.rRule.bySetPos = [5];
        }
        else if($scope.repeat.onThe.sequent == 'last') {
            $scope.editEventData.rRule.bySetPos = [-1];
        }
    };
    var setEditOnDayToSave = function(){
        $scope.editEventData.rRule.byWeekDay = [];

        if($scope.repeat.onThe.day == 'monday') {
            $scope.editEventData.rRule.byWeekDay.push('MO');
        }
        else if($scope.repeat.onThe.day == 'tuesday') {
            $scope.editEventData.rRule.byWeekDay.push('TU');
        }
        else if($scope.repeat.onThe.day == 'wednesday') {
            $scope.editEventData.rRule.byWeekDay.push('WE');
        }
        else if($scope.repeat.onThe.day == 'thursday') {
            $scope.editEventData.rRule.byWeekDay.push('TH');
        }
        else if($scope.repeat.onThe.day == 'friday') {
            $scope.editEventData.rRule.byWeekDay.push('FR');
        }
        else if($scope.repeat.onThe.day == 'saturday') {
            $scope.editEventData.rRule.byWeekDay.push('SA');
        }
        else if($scope.repeat.onThe.day == 'sunday') {
            $scope.editEventData.rRule.byWeekDay.push('SU');
        }
        else if($scope.repeat.onThe.day == 'weekday') {
            $scope.editEventData.rRule.byWeekDay = ['MO', 'TU', 'WE', 'TH', 'FR'];
        }
        else if($scope.repeat.onThe.day == 'weekend') {
            $scope.editEventData.rRule.byWeekDay = ['SA', 'SU'];
        }
        else if($scope.repeat.onThe.day == 'day') {
            // delete byWeekDay (if any)
            if($scope.editEventData.rRule.byWeekDay) {
                delete $scope.editEventData.rRule.byWeekDay;
            }
            // delete bySetPos (if any)
            if($scope.editEventData.rRule.bySetPos) {
                delete $scope.editEventData.rRule.bySetPos;
            }
            var byMonthDayValue = setBySetPos($scope.repeat.onThe.sequent);
            $scope.editEventData.rRule.byMonthDay = byMonthDayValue;
        }
    };

    // Edit Event -------------------------------------------------------------
    var reportSaveEditEventData = function(){
        var myPopup = $ionicPopup.confirm({
            title: 'Save Status',
            template: 'Save Success',
            buttons: [
                {
                    text: '<div class="flex align-items-center">' +
                    '<span class="flex-basis-30">' +
                    '<i class="button-icon-size ion-ios-close-outline"></i>' +
                    '</span>' +
                    '<span class="flex-1">Close</span>' +
                    '</div>',
                    type: 'button-outline button-stable',
                    onTap: function() {
                        return true;
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            if(res){
                $scope.editEventModal.hide();
            }
        });
    };
    $scope.saveEditEvent = function () {

        if($scope.repeat.status == true) {

            $scope.editEventData.rRule.dateStart = $scope.editEventData.startDate;

            if($scope.editEventData.rRule.frequency == 'DAILY'){

                // delete byWeekDay (if any)
                if($scope.editEventData.rRule.byWeekDay) {
                    delete $scope.editEventData.rRule.byWeekDay;
                }
                // delete byMonthDay (if any)
                if($scope.editEventData.rRule.byMonthDay) {
                    delete $scope.editEventData.rRule.byMonthDay;
                }
                // delete bySetPos (if any)
                if($scope.editEventData.rRule.bySetPos) {
                    delete $scope.editEventData.rRule.bySetPos;
                }
                // delete byMonth (if any)
                if($scope.editEventData.rRule.byMonth) {
                    delete $scope.editEventData.rRule.byMonth;
                }
            }
            else if($scope.editEventData.rRule.frequency == 'WEEKLY') {

                // delete byMonthDay (if any)
                if($scope.editEventData.rRule.byMonthDay) {
                    delete $scope.editEventData.rRule.byMonthDay;
                }
                // delete bySetPos (if any)
                if($scope.editEventData.rRule.bySetPos) {
                    delete $scope.editEventData.rRule.bySetPos;
                }
                // delete byMonth (if any)
                if($scope.editEventData.rRule.byMonth) {
                    delete $scope.editEventData.rRule.byMonth;
                }

                // Set byWeekDay
                $scope.editEventData.rRule.byWeekDay = [];
                angular.forEach($scope.eventWeekDay, function(value, key){
                    if(value == true){
                        $scope.editEventData.rRule.byWeekDay.push(key);
                    }
                });
            }
            else if ($scope.editEventData.rRule.frequency == 'MONTHLY'){

                // delete byMonth (if any)
                if($scope.editEventData.rRule.byMonth) {
                    delete $scope.editEventData.rRule.byMonth;
                }

                if($scope.repeat.repeatBy == 'each') {
                    // delete byWeekDay (if any)
                    if($scope.editEventData.rRule.byWeekDay) {
                        delete $scope.editEventData.rRule.byWeekDay;
                    }
                    // delete bySetPos (if any)
                    if($scope.editEventData.rRule.bySetPos) {
                        delete $scope.editEventData.rRule.bySetPos;
                    }

                    // Set byMonthDay
                    $scope.editEventData.rRule.byMonthDay = [];
                    angular.forEach($scope.eventMonthDay, function(value, key){
                        if(value == true){
                            $scope.editEventData.rRule.byMonthDay.push(key+1);
                        }
                    });
                }
                else if ($scope.repeat.repeatBy == 'on'){

                    // delete byMonthDay (if any)
                    if($scope.editEventData.rRule.byMonthDay) {
                        delete $scope.editEventData.rRule.byMonthDay;
                    }

                    // Set bySetPos , byMonthDay or byWeekDay
                    setEditOnSequentToSave();
                    setEditOnDayToSave();
                }
            }
            else if ($scope.editEventData.rRule.frequency == 'YEARLY'){

                // Set byMonth
                $scope.editEventData.rRule.byMonth = [];
                angular.forEach($scope.eventMonth, function(value, key){
                    if(value == true){
                        $scope.editEventData.rRule.byMonth.push(key+1);
                    }
                });

                // Check 'On the' Status
                if($scope.repeat.onThe.checked) {

                    // delete byMonthDay (if any)
                    if($scope.editEventData.rRule.byMonthDay) {
                        delete $scope.editEventData.rRule.byMonthDay;
                    }

                    // Set bySetPos , byMonthDay or byWeekDay
                    setEditOnSequentToSave();
                    setEditOnDayToSave();
                }
                else {
                    // delete byWeekDay (if any)
                    if($scope.editEventData.rRule.byWeekDay) {
                        delete $scope.editEventData.rRule.byWeekDay;
                    }
                    // delete bySetPos (if any)
                    if($scope.editEventData.rRule.bySetPos) {
                        delete $scope.editEventData.rRule.bySetPos;
                    }
                    // delete byMonthDay (if any)
                    if($scope.editEventData.rRule.byMonthDay) {
                        delete $scope.editEventData.rRule.byMonthDay;
                    }

                }
            }
        }

        // get end repeat value (never, after, on date) for save to db ---------
        if($scope.repeat.endRepeat == 'never') {
            if ($scope.editEventData.rRule.until) {
                delete $scope.editEventData.rRule.until;
            }
            if ($scope.editEventData.rRule.count) {
                delete $scope.editEventData.rRule.count;
            }
        }
        else if($scope.repeat.endRepeat == 'date') {
            if ($scope.editEventData.rRule.count) {
                delete $scope.editEventData.rRule.count;
            }
        }
        else if ($scope.repeat.endRepeat == 'after'){
            if ($scope.editEventData.rRule.until) {
                delete $scope.editEventData.rRule.until;
            }
        }

        storeOldEventData = $scope.editEventData;
        console.log('Save Event Data: ', $scope.editEventData);

        // if save success
        reportSaveEditEventData();
    };



    // -------------------------------------------------------------------------
    // Share Calendar ----------------------------------------------------------
    // -------------------------------------------------------------------------

    // Modal for add user to share this calendar
    $ionicModal.fromTemplateUrl('templates/add-user-share-calendar-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
    }).then(function(modal) {
        $scope.addUserModal = modal;
    });

    // Get all user who have permission to manage calendar ---------------------
    $scope.getUsersCalendar = function(){
        $scope.usersCalendar = usersCalendars('','','','','', calendarId, 'calendarUsers');

        // Get Access Role of Login User
        $scope.loginUserAccessRole = { role: '' };
        angular.forEach($scope.usersCalendar, function(value){
            if(value.user.id == userId) {
                $scope.loginUserAccessRole.role = value.accessRole;
            }
        });
    };
    $scope.getUsersCalendar();

    // Search user ready to add ------------------------------------------------
    var usersData = users('array');
    $scope.searchUserForAdd = function(req) {
        $scope.usersRes = [];
        $scope.load = true;

        if(req != '') {
            // finding req user
            angular.forEach(usersData, function(user){
                var employeeNumber = user.employeeNumber;
                var name = (user.name);
                var res = employeeNumber.match(req);
                var res2 = name.match(req);

                if(res == req){
                    $scope.usersRes.push(user);
                }
                else if(res2 == req){
                    $scope.usersRes.push(user);
                }
            });

            if($scope.usersRes.length == 0) {
                console.log('no user match');
            }
            else {
                // found user(s) match then check not added in this door
                var index = 0;
                angular.forEach($scope.usersRes, function(userRes){
                    $scope.usersRes[index].addedStatus = false;

                    angular.forEach($scope.usersCalendarData, function(userCalendar){
                        if(userCalendar.user.employeeNumber == userRes.employeeNumber) {
                            $scope.usersRes[index].addedStatus = true;
                        }
                    });
                    index++;
                });
            }
            $scope.load = false;

        }else{
            $scope.load = false;
            $scope.usersRes = [];
        }
    };

    // Confirm to add selected user --------------------------------------------
    $scope.confirmAddUser = function(userId, employeeNumber) {

        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Do you want to share "' + $scope.calendarData.name + '" with <span class="balanced">' + employeeNumber + '</span> ?',
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
                addNewUser(userId);
            } else {
                console.log('Canceled');
            }
        });
    };

    // Add user do you want to share this calendar -----------------------------
    var addNewUser = function(userId) {
        console.log('Go to set accessRole for this user: ' + userId + ' to usersCalendars');
    };

    // Delete User (remove out of usersCalendars) ------------------------------
    $scope.confirmDeleteUser = function(userCalendarId) {

        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Do you want to delete "' + $scope.editUser.user.employeeNumber + '" out of '+ $scope.calendarData.name +' ?',
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
                console.log('Delete This User: ' + userCalendarId + ' out of usersCalendars');
            } else {
                console.log('cancel');
            }
        });
    };

    // Modal for edit access role for selected user
    $ionicModal.fromTemplateUrl('templates/edit-user-share-calendar-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
    }).then(function(modal) {
        $scope.editUserModal = modal;
    });

    $scope.editUser = {};
    $scope.selectedUser = { latestAccessRole: '' };

    // Edit Access Role for Selected User --------------------------------------
    $scope.editAccessRole = function(userCalendarId, thisUserId, event){

        if(thisUserId == userId){
            event.stopPropagation();
        } else {

            $scope.editUser = usersCalendars('', '', '', '', '', '', 'object')[userCalendarId];
            $scope.editUser.id = userCalendarId;
            $scope.selectedUser.latestAccessRole = $scope.editUser.accessRole;

            if ($scope.editUser.accessRole == 'owner') {
                $scope.editUser.accessRole = 'owner';
            }
            else if ($scope.editUser.accessRole == 'writer') {
                $scope.editUser.accessRole = 'writer';
            }
            else if ($scope.editUser.accessRole == 'reader') {
                $scope.editUser.accessRole = 'reader';
            } else {
                $scope.editUser.accessRole = null;
            }

            $scope.editUserModal.show();
        }
    };

    // Save Access Role for Edit User ------------------------------------------
    $scope.saveAccessRole = function(){
        console.log('Edit Access Role to "' + $scope.editUser.accessRole + '" of User ID is ' + $scope.editUser.user.id);

        // When save success then refresh data
        $scope.selectedUser.latestAccessRole = $scope.editUser.accessRole;
        console.log('Selected User Latest Access Role: "' + $scope.selectedUser.latestAccessRole + '" of User ID is ' + $scope.editUser.user.id);
        $scope.getUsersCalendar();
    };

    $scope.cancelEditAccessRole = function(){
        $scope.editUser.accessRole = $scope.selectedUser.latestAccessRole;
        console.log('Selected User Latest Access Role: "' + $scope.editUser.accessRole + '" of User ID is ' + $scope.editUser.user.id);

        // Refresh data
        $scope.getUsersCalendar();
    };
});
