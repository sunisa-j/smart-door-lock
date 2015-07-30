'use strict';

window.app.controller('DoorInfoController', function ($scope, $ionicPopup, $stateParams, doorsAccess, passcodeUnlock, $timeout, $ionicModal, calendarEvents, doorsUsers, _) {

    var groupId = $stateParams.groupId;
    var doorId = $stateParams.doorId;
    $scope.doorId = doorId;

    var userId = 1; // Login user id

    var doorsAccessObj = doorsAccess(userId, 'object');
    $scope.groupName = doorsAccessObj[groupId].name;

    $scope.doorData = doorsAccessObj[groupId].doorsAccess[doorId];

    // Set Default Menu (Menu contains are 'doorInfo', 'configDoor', 'log' and 'manageAccess')
    $scope.doorMenu = {
        name: 'doorInfo'
    };

    // Get Members of This Door
    $scope.doorUsers = doorsUsers(doorId, 'array');

    // -------------------------------------------------------------------------
    // Select calendars events -------------------------------------------------
    // -------------------------------------------------------------------------

    // Variable Default, Set Value for Show Event Data ('myAccessTime', 'autoRelease', 'passcodeUnlock', 'userAccess')
    $scope.showEventsDataName = { value: 'myAccessTime' };
    var eventsData = { value: [] };

    // Get all events to show in ui-calendar -----------------------------------
    $scope.selectEventsData = function () {

        eventsData.value = [];

        if($scope.showEventsDataName.value == 'myAccessTime'){
            eventsData.value = calendarEvents(userId, doorId, '','doorUserEvents');
        }
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

    $scope.uiCalendarEvents = {
        events: eventsData.value,
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

    // -------------------------------------------------------------------------
    // About Door Info ---------------------------------------------------------
    // -------------------------------------------------------------------------

    $scope.statusLoad = { value: false };

    $scope.changeLockStatus = function (latestLockStatus) {

        $scope.statusLoad.value = true;

        if(latestLockStatus == 'locked') {
            $scope.doorData.status.lockState = 'unlocked';
            $timeout(function () {
                if ($scope.doorData.status.lockState == 'unlocked') {
                    $scope.statusLoad.value = false;
                }
            }, 1500);
        }
        else if(latestLockStatus == 'unlocked') {
            $scope.doorData.status.lockState = 'locked';
            $timeout(function () {
                if ($scope.doorData.status.lockState == 'locked') {
                    $scope.statusLoad.value = false;
                }
            }, 1500);
        }
    };

    // My Access Time ----------------------------------------------------------
    var calcMyAccessTime = {};
    var myAccessTime3Latest = [];
    $scope.myAccessTime = [];

    var dateNow1 = new Date();
    var dateNow = dateNow1.setDate(dateNow1.getDate() - 1);
    var runForEach = true;

    // Set variable type default is array for events (startDate >= dateNow)
    angular.forEach(eventsData.value, function(event){
        var newStartDate = new Date(event.startDate);
        var startDate = new Date(newStartDate.setHours(0, 0, 0, 0));
        if(startDate >= dateNow) {
            calcMyAccessTime[startDate] = [];
        }
    });

    // Push events group by startDate
    angular.forEach(eventsData.value, function(event){
        var newStartDate = new Date(event.startDate);
        var startDate = new Date(newStartDate.setHours(0, 0, 0, 0));

        if(startDate >= dateNow) {
            var tmp = angular.copy(event);
            calcMyAccessTime[startDate].push(tmp);
        }
    });

    // Get latest 3 events
    if(calcMyAccessTime.length != 0){
        angular.forEach(calcMyAccessTime, function(value, key){
            if(runForEach) {
                var tmp = angular.copy(value);
                tmp.startDate = key;
                myAccessTime3Latest.push(tmp);


                if(myAccessTime3Latest.length == 3){
                    runForEach = false;
                }
            }
        });
    }

    // Sort by startDate (ASC)
    if(myAccessTime3Latest.length != 0) {

        $scope.myAccessTime = _.sortBy(myAccessTime3Latest, function (events) {
            return (new Date(events[0].startDate)).getTime();
        });

        //var startDateFirst = {value: myAccessTime3Latest[0]};
        //var i = 0;
        //
        //angular.forEach(myAccessTime3Latest, function (value) {
        //    if (value.startDate > startDateFirst.value.startDate) {
        //        startDateFirst.value = value;
        //    }
        //    //console.log(new Date(value.startDate).getTime());
        //    //console.log(new Date(startDateFirst.value.startDate).getTime() + '\n');
        //});
        //$scope.myAccessTime[0] = startDateFirst.value;
        //angular.forEach(myAccessTime3Latest, function (value) {
        //    if (value.startDate == startDateFirst.value.startDate) {
        //        myAccessTime3Latest.splice(i, 1);
        //    }
        //    i++;
        //});
        //
        //if(myAccessTime3Latest.length == 1) {
        //    $scope.myAccessTime[1] = myAccessTime3Latest[0];
        //}
        //else if (myAccessTime3Latest.length == 2) {
        //    if (myAccessTime3Latest[0].startDate > myAccessTime3Latest[1].startDate) {
        //        $scope.myAccessTime[1] = myAccessTime3Latest[0];
        //        $scope.myAccessTime[2] = myAccessTime3Latest[1];
        //    } else {
        //        $scope.myAccessTime[1] = myAccessTime3Latest[1];
        //        $scope.myAccessTime[2] = myAccessTime3Latest[0];
        //    }
        //}
    }


    // -------------------------------------------------------------------------
    // About Config Door -------------------------------------------------------
    // -------------------------------------------------------------------------

    $scope.pinRequired = { load: false };
    $scope.autoRelock = { load: false };

    $scope.pinRequiredChecked = function(){
        $scope.pinRequired.load = true;
        var valueBeforeChanged = !$scope.doorData.setting.pinRequired;
        // if pinRequired status changed;
        $scope.doorData.setting.pinRequired = !(valueBeforeChanged);

        $timeout( function(){
            if($scope.doorData.setting.pinRequired == !(valueBeforeChanged)) {
                $scope.pinRequired.load = false;
            }
        }, 1500);
    };
    $scope.autoRelockChecked = function(){
        $scope.autoRelock.load = true;
        var valueBeforeChanged = !$scope.doorData.setting.autoRelock;
        // if autoRelock status changed;
        $scope.doorData.setting.autoRelock = !(valueBeforeChanged);

        $timeout( function(){
            if($scope.doorData.setting.autoRelock == !(valueBeforeChanged)) {
                $scope.autoRelock.load = false;
            }
        }, 1500);
    };

    // -------------------------------------------------------------------------
    // About Manage Access -----------------------------------------------------
    // -------------------------------------------------------------------------

    // About Passcode Unlock ---------------------------------------------------
    $scope.passcodeUnlockObj = passcodeUnlock(doorId, '', 'object');
    var passcodeUnlockId = $stateParams.passcodeUnlockId;
    $scope.passcodeDoorArray = passcodeUnlock(doorId, '', 'passcodeDoorArray');
    $scope.passcodeUnlockId = passcodeUnlockId;
    $scope.passcodeUnlockSelected = passcodeUnlock('', passcodeUnlockId, 'selected');
    $scope.enableEditPasscode = { value: false };
    $scope.passcodeReadOnly = { value: true };

    $ionicModal.fromTemplateUrl('templates/create-passcode-unlock-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.createPasscodeModal = modal;
    });

    $scope.createPasscodeUnlock = function () {
        console.log('create passcode');
    };

    $scope.changeStatusPasscode = function(passcodeId, latestStatus){
        $scope.passcodeUnlockObj[passcodeId].load = true;

        if(latestStatus == 'Enabled') {
            $scope.passcodeUnlockObj[passcodeId].status = 'Disabled';
            $timeout(function () {
                if ($scope.passcodeUnlockObj[passcodeId].status == 'Disabled') {
                    $scope.passcodeUnlockObj[passcodeId].load = false;
                }
            }, 1500);
        }
        else if(latestStatus == 'Disabled') {
            $scope.passcodeUnlockObj[passcodeId].status = 'Enabled';
            $timeout(function () {
                if ($scope.passcodeUnlockObj[passcodeId].status == 'Enabled') {
                    $scope.passcodeUnlockObj[passcodeId].load = false;
                }
            }, 1500);
        }
    };

    $scope.confirmDeletePasscode = function() {

        var myPopup = $ionicPopup.confirm({
            title: 'Confirm',
            template: 'Are you sure to delete "' + $scope.passcodeUnlockSelected.name + '" passcode ?',
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
                console.log('delete passcode');
            } else {
                console.log('cancel');
            }
        });
    };

});
