'use strict';

window.app.controller('UserAccessTimeController', function ($scope, $stateParams, $ionicActionSheet, RRule, moment, $ionicPopup, $ionicModal, usersCalendars, userAccessPolicies, doorsUsers, calendarEvents, uiCalendarConfig) {

    var doorUserId = $stateParams.doorUserId;
    var doorUser = doorsUsers('', 'object')[doorUserId];
    $scope.acccessPolicyType = { value:''};
    var userId = 1; // Login User Id
    $scope.userCalendars = usersCalendars(userId, doorUser.door, 'userAccessPolicies', '', doorUserId, '', 'array'); // Selected calendars this user can access

    //Get access time of title informaiton
    $scope.userPoliciesData = userAccessPolicies(doorUserId, 'array');

    // when click delete calendar
    $scope.deleteCalendar = function (id) {
        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Do you want to remove this calendar ?',
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
                console.log('delete ' + id);
            } else {
                console.log('cancel');
            }
        });
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

        $ionicActionSheet.show({
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

                if($scope.calendarCheckbox[value.calendar.id] === true) {
                    var calendarId = value.calendar.id;
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

    // -------------------------------------------------------------------------
    // Select calendars events -------------------------------------------------
    // -------------------------------------------------------------------------

    // Variable Default, Set Value for Show Event Data ('myAccessTime', 'autoRelease', 'passcodeUnlock', 'userAccess')
    $scope.showEventsDataName = { value: 'userAccess' };
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

        if($scope.showEventsDataName.value === 'userAccess'){
            var userPolicyData = userAccessPolicies(doorUserId, 'object');
            var calendarEventsData = calendarEvents('', '', '','object');
            var calendarsSelected = [];

            // Get calendarsSelected for Auto Release Time
            angular.forEach(userPolicyData, function(value){
                var tmp = {};
                tmp.calendar = value.calendar.id;
                tmp.type = value.type;

                calendarsSelected.push(tmp);
            });

            // Get Events from calendarsSelected to show when click 'View Access Time' button
            angular.forEach(calendarEventsData, function(event){
                angular.forEach(calendarsSelected, function(calendar){
                    if(event.calendar === calendar.calendar){
                        eventsData.value.push(event);

                        if(calendar.type === 'normal'){
                            normalEvents.value.push(event);
                        }
                        else if(calendar.type === 'holiday'){
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



    // -------------------------------------------------------------------------
    // Calculate function send to RRule set summary ----------------------------
    // -------------------------------------------------------------------------

    // Set byweekday RRule
    var setByWeekDay = function(){
        var byweekday = [];

        if($scope.eventWeekDay.MO === true) {
            byweekday.push(RRule.MO);
        }
        if($scope.eventWeekDay.TU === true) {
            byweekday.push(RRule.TU);
        }
        if($scope.eventWeekDay.WE === true) {
            byweekday.push(RRule.WE);
        }
        if($scope.eventWeekDay.TH === true) {
            byweekday.push(RRule.TH);
        }
        if($scope.eventWeekDay.FR === true) {
            byweekday.push(RRule.FR);
        }
        if($scope.eventWeekDay.SA === true) {
            byweekday.push(RRule.SA);
        }
        if($scope.eventWeekDay.SU === true) {
            byweekday.push(RRule.SU);
        }

        return byweekday;
    };

    // Set bymonthday RRule
    var setByMonthDay = function(){
        var bymonthday = [];
        var i = 1;
        angular.forEach($scope.eventMonthDay, function(value){
            if(value === true) {
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
            if(value === true) {
                bymonth.push(i);
            }
            i++;
        });

        return bymonth;
    };

    // Convert 'On the' sequent from sting to number for bySetPos RRule
    var setBySetPos = function(sequent){
        if(sequent === 'first'){
            return [1];
        }else if(sequent === 'second'){
            return [2];
        }else if(sequent === 'third'){
            return [3];
        }else if(sequent === 'fourth'){
            return [4];
        }else if(sequent === 'fifth'){
            return [5];
        }else if(sequent === 'last'){
            return [-1];
        }
    };

    // Calculate value in 'On the' ---------------------------------------------
    var setOnSequent = function() {
        if($scope.editEventData.rRule.bySetPos){
            if($scope.editEventData.rRule.bySetPos[0] === 1) {
                $scope.repeat.onThe.sequent = 'first';
            }
            else if($scope.editEventData.rRule.bySetPos[0] === 2) {
                $scope.repeat.onThe.sequent = 'second';
            }
            else if($scope.editEventData.rRule.bySetPos[0] === 3) {
                $scope.repeat.onThe.sequent = 'third';
            }
            else if($scope.editEventData.rRule.bySetPos[0] === 4) {
                $scope.repeat.onThe.sequent = 'fourth';
            }
            else if($scope.editEventData.rRule.bySetPos[0] === 5) {
                $scope.repeat.onThe.sequent = 'fifth';
            }
            else if($scope.editEventData.rRule.bySetPos[0] === -1) {
                $scope.repeat.onThe.sequent = 'last';
            }
        }
        else if($scope.editEventData.rRule.byMonthDay) {
            if($scope.editEventData.rRule.byMonthDay[0] === 1) {
                $scope.repeat.onThe.sequent = 'first';
            }
            else if($scope.editEventData.rRule.byMonthDay[0] === 2) {
                $scope.repeat.onThe.sequent = 'second';
            }
            else if($scope.editEventData.rRule.byMonthDay[0] === 3) {
                $scope.repeat.onThe.sequent = 'third';
            }
            else if($scope.editEventData.rRule.byMonthDay[0] === 4) {
                $scope.repeat.onThe.sequent = 'fourth';
            }
            else if($scope.editEventData.rRule.byMonthDay[0] === 5) {
                $scope.repeat.onThe.sequent = 'fifth';
            }
            else if($scope.editEventData.rRule.byMonthDay[0] === -1) {
                $scope.repeat.onThe.sequent = 'last';
            }
        }
    };
    var setOnDay = function(){
        if($scope.editEventData.rRule.byWeekDay.length === 1 && $scope.editEventData.rRule.byWeekDay[0] === 'MO') {
            $scope.repeat.onThe.day = 'monday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length === 1 && $scope.editEventData.rRule.byWeekDay[0] === 'TU') {
            $scope.repeat.onThe.day = 'tuesday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length === 1 && $scope.editEventData.rRule.byWeekDay[0] === 'WE') {
            $scope.repeat.onThe.day = 'wednesday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length === 1 && $scope.editEventData.rRule.byWeekDay[0] === 'TH') {
            $scope.repeat.onThe.day = 'thursday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length === 1 && $scope.editEventData.rRule.byWeekDay[0] === 'FR') {
            $scope.repeat.onThe.day = 'friday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length === 1 && $scope.editEventData.rRule.byWeekDay[0] === 'SA') {
            $scope.repeat.onThe.day = 'saturday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length === 1 && $scope.editEventData.rRule.byWeekDay[0] === 'SU') {
            $scope.repeat.onThe.day = 'sunday';
        }
        else if($scope.editEventData.rRule.byWeekDay.length === 5) {
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
                    if(value === weekday){
                        weekdayValue[weekday] = true;
                    }
                });
            });
            if(weekdayValue.MO===true && weekdayValue.TU===true && weekdayValue.WE===true && weekdayValue.TH===true && weekdayValue.FR===true){
                $scope.repeat.onThe.day = 'weekday';
            }
        }
        else if($scope.editEventData.rRule.byWeekDay.length === 2) {
            var weekend = ['SA', 'SU'];
            var weekendValue = {
                'MO': false,
                'TU': false
            };
            angular.forEach(weekend, function(weekend){
                angular.forEach($scope.editEventData.rRule.byWeekDay, function(value){
                    if(value === weekend){
                        weekendValue[weekend] = true;
                    }
                });
            });
            if(weekendValue.SA===true && weekendValue.SU===true){
                $scope.repeat.onThe.day = 'weekend';
            }
        }
    };

    // Set on the to rRule for Edit event modal --------------------------------
    var setEditOntheRrule = function(){
        if($scope.repeat.onThe.day === 'day'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day === 'weekday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day === 'weekend'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day === 'monday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day === 'tuesday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day === 'wednesday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day === 'thursday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day === 'friday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day === 'saturday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
        else if($scope.repeat.onThe.day === 'sunday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent)
                });
            }
        }
    };
    var setEditOntheRruleYearly = function(){
        if($scope.repeat.onThe.day === 'day'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    bymonthday: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day === 'weekday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day === 'weekend'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA, RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day === 'monday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.MO],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day === 'tuesday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day === 'wednesday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.WE],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day === 'thursday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.TH],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day === 'friday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.FR],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day === 'saturday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SA],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
        else if($scope.repeat.onThe.day === 'sunday'){
            if ($scope.repeat.endRepeat === 'date') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    until: new Date($scope.editEventData.rRule.until),
                    byweekday: [RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'after') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    count: $scope.editEventData.rRule.count,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
            else if ($scope.repeat.endRepeat === 'never') {
                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate),
                    byweekday: [RRule.SU],
                    bysetpos: setBySetPos($scope.repeat.onThe.sequent),
                    bymonth: setByMonth()
                });
            }
        }
    };

    // Calculate Repeat Summary (by RRule Module) for Edit Event Modal ---------
    $scope.editEventRrule = function() {

        if($scope.repeat.status === true) {
            if ($scope.editEventData.rRule && $scope.editEventData.rRule.frequency === 'DAILY') {

                if ($scope.repeat.endRepeat === 'date') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.DAILY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate),
                        until: new Date($scope.editEventData.rRule.until)
                    });
                }
                else if ($scope.repeat.endRepeat === 'after') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.DAILY,
                        interval: $scope.editEventData.rRule.interval,
                        count: $scope.editEventData.rRule.count,
                        dtstart: new Date($scope.editEventData.startDate)
                    });
                }
                else if ($scope.repeat.endRepeat === 'never') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.DAILY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate)
                    });
                }
            }
            else if ($scope.editEventData.rRule && $scope.editEventData.rRule.frequency === 'WEEKLY') {

                var byWeekDay = setByWeekDay();

                if ($scope.repeat.endRepeat === 'date') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.WEEKLY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate),
                        until: new Date($scope.editEventData.rRule.until),
                        byweekday: byWeekDay
                    });
                }
                else if ($scope.repeat.endRepeat === 'after') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.WEEKLY,
                        interval: $scope.editEventData.rRule.interval,
                        count: $scope.editEventData.rRule.count,
                        dtstart: new Date($scope.editEventData.startDate),
                        byweekday: byWeekDay
                    });
                }
                else if ($scope.repeat.endRepeat === 'never') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.WEEKLY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate),
                        byweekday: byWeekDay
                    });
                }
            }
            else if ($scope.editEventData.rRule && $scope.editEventData.rRule.frequency === 'MONTHLY') {
                var byMonthDay = setByMonthDay();

                $scope.editDataRrule = new RRule({
                    freq: RRule.MONTHLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate)
                });

                if($scope.repeat.repeatBy==='each'){
                    if(byMonthDay.length > 0){
                        if ($scope.repeat.endRepeat === 'date') {
                            $scope.editDataRrule = new RRule({
                                freq: RRule.MONTHLY,
                                interval: $scope.editEventData.rRule.interval,
                                dtstart: new Date($scope.editEventData.startDate),
                                until: new Date($scope.editEventData.rRule.until),
                                bymonthday: byMonthDay
                            });
                        }
                        else if ($scope.repeat.endRepeat === 'after') {
                            $scope.editDataRrule = new RRule({
                                freq: RRule.MONTHLY,
                                interval: $scope.editEventData.rRule.interval,
                                count: $scope.editEventData.rRule.count,
                                dtstart: new Date($scope.editEventData.startDate),
                                bymonthday: byMonthDay
                            });
                        }
                        else if ($scope.repeat.endRepeat === 'never') {
                            $scope.editDataRrule = new RRule({
                                freq: RRule.MONTHLY,
                                interval: $scope.editEventData.rRule.interval,
                                dtstart: new Date($scope.editEventData.startDate),
                                bymonthday: byMonthDay
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
                else if($scope.repeat.repeatBy==='on'){
                    setEditOntheRrule();
                }
            }
            else if ($scope.editEventData.rRule && $scope.editEventData.rRule.frequency === 'YEARLY') {
                var byMonth = setByMonth();

                $scope.editDataRrule = new RRule({
                    freq: RRule.YEARLY,
                    interval: $scope.editEventData.rRule.interval,
                    dtstart: new Date($scope.editEventData.startDate)
                });

                if ($scope.repeat.endRepeat === 'date') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.YEARLY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate),
                        until: new Date($scope.editEventData.rRule.until),
                        bymonth: byMonth
                    });
                }
                else if ($scope.repeat.endRepeat === 'after') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.YEARLY,
                        interval: $scope.editEventData.rRule.interval,
                        count: $scope.editEventData.rRule.count,
                        dtstart: new Date($scope.editEventData.startDate),
                        bymonth: byMonth
                    });
                }
                else if ($scope.repeat.endRepeat === 'never') {
                    $scope.editDataRrule = new RRule({
                        freq: RRule.YEARLY,
                        interval: $scope.editEventData.rRule.interval,
                        dtstart: new Date($scope.editEventData.startDate),
                        bymonth: byMonth
                    });
                }


                if($scope.repeat.onThe.checked===true){
                    setEditOntheRruleYearly();
                }
            }

            //console.log('rRule Data: ', $scope.editDataRrule);
        }
    };

    // -------------------------------------------------------------------------
    // View Event --------------------------------------------------------------
    // -------------------------------------------------------------------------

    $ionicModal.fromTemplateUrl('templates/view-event-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.viewEventModal = modal;

    });

    // Set $scope.editEventData to show in edit & view modal -------------------
    var setEventDataSelected = function(event){
        $scope.editEventData = angular.copy(event);
        $scope.repeat.repeatBy = '';
        $scope.repeat.onThe.checked = false;

        // Set startDate & endDate to date -------------------------------------
        $scope.editEventData.startDate = new Date($scope.editEventData.startDate);
        $scope.editEventData.endDate = new Date($scope.editEventData.endDate);

        // Set on/off repeat ---------------------------------------------------
        if($scope.editEventData.rRule) {
            $scope.repeat.status = true;
        }else{
            $scope.repeat.status = false;
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
        if($scope.editEventData.rRule && $scope.editEventData.rRule.frequency === 'MONTHLY'){
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
        else if($scope.editEventData.rRule && $scope.editEventData.rRule.frequency === 'YEARLY'){
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
                $scope.repeat.onThe.checked = true;
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
        else if($scope.editEventData.rRule && $scope.editEventData.rRule.frequency === 'WEEKLY') {
            $scope.repeat.repeatBy = '';
            angular.forEach($scope.editEventData.rRule.byWeekDay, function(weekday){
                if(weekday === 'MO') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday === 'TU') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday === 'WE') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday === 'TH') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday === 'FR') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday === 'SA') { $scope.eventWeekDay[weekday] = true; }
                else if(weekday === 'SU') { $scope.eventWeekDay[weekday] = true; }
            });
        }else if($scope.editEventData.rRule && $scope.editEventData.rRule.frequency === 'DAILY'){
            $scope.repeat.repeatBy = '';
        }

        if ($scope.editEventData.rRule){
            $scope.editEventRrule();
        }

    };

    // Transform event data to show in view event modal ------------------------
    $scope.openViewEvent = function(event){

        setEventDataSelected(event);

        $scope.viewEventModal.show();
    };



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
                day = parent.find('td.fc-day-number[data-date=' + dataDate + ']');
            }
            else {
                day = angular.element('td.fc-day-number[data-date=' + dataDate + ']');
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
    }

    function selectToday(element) {
        uiCalendarConfig.calendars.calendarsEventsSelected.fullCalendar('today');
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
            dayRender: function (date, cell) {
                if(date.isSame($scope.dateSelected, 'd')){
                    selectDate(date, cell);
                }
            },
            viewRender: function(view, element){

                element.addTouch();
            },
            eventClick: function(event) {
                $scope.openViewEvent(event);
            }
        }
    };

    // bind my today button with ui-calendar ----------------------------------
    $scope.todayClick = function() {
        selectToday();
    };

});