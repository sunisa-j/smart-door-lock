'use strict';

window.app.controller('CalendarController', function ($scope, $stateParams, calendars, $ionicModal, $ionicPopup, calendarEvents) {

    var calendarId = $stateParams.calendarId;
    $scope.calendarData = calendars[calendarId];

    // About calendar management -------------------------------------------
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

    // month
    $scope.month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // week days
    $scope.weekDay = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'];

    // Calendar UI
    $scope.uiCalendarEvents = {
        events: $scope.calendarEventsData,
        color: 'rgba(0, 201, 13, 0.2)',
        textColor: '#333333'
    };
    $scope.uiConfig = {
        calendar:{
            height: 480,
            dayClick: function(date, jsEvent, view) {

                //alert('Clicked on: ' + date.format());
                //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
                //alert('Current view: ' + view.name);

                var dateSelected = new Date(date._d);
                $scope.getEventsDateSelected(dateSelected);

                var dataMonth = dateSelected.getMonth()+1;
                var dataDate = dateSelected.getFullYear() + '-' + ((dataMonth < 10)? '0'+dataMonth:dataMonth) + '-' + dateSelected.getDate();

                // change the day's background color just for fun
                var dateNow = new Date();
                if(dateSelected.setHours(0,0,0,0) == dateNow.setHours(0,0,0,0)) {
                    angular.element("td.fc-day-number div").removeClass('number-circle-bg');
                    angular.element("td.fc-day-number.fc-today[data-date=" + dataDate + "] div").addClass('today-number-circle-bg');
                }else {
                    angular.element("td.fc-day-number.fc-today div").removeClass('today-number-circle-bg');
                    angular.element("td.fc-day-number div").removeClass('number-circle-bg');
                    angular.element("td.fc-day-number[data-date=" + dataDate + "] div").addClass('number-circle-bg');
                }
            },
            eventClick: function(event, element) {
                console.log('event: ', event);
                $scope.editEventData = event;
                $scope.editEventModal.show();
            }
        }
    };
    angular.element('.fc-today-button').on('click', function() {

        console.log('clicked today');

        //var dateNow = new Date();
        //var dateNow2 = new Date(dateNow.setHours(0,0,0,0));
        ////console.log(dateNow2);
        //$scope.getEventsDateSelected(dateNow);
        //
        //var dataMonth = dateNow2.getMonth()+1;
        //var dataDate = dateNow2.getFullYear() + '-' + ((dataMonth < 10)? '0'+dataMonth:dataMonth) + '-' + dateNow2.getDate();
        //
        //angular.element("td.fc-day-number[data-date=" + dataDate + "]").click();

        // change the day's background color just for fun
        //angular.element("td.fc-day-number div").removeClass('number-circle-bg');
        //angular.element("td.fc-day-number[data-date=" + dataDate + "] div").addClass('number-circle-bg');
    });


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
                    false,false,true,false,false,false,false,
                    false,false,false,false,false,true,false,
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

    $scope.toggleDaySelect = function (day){
        $scope.createEventData.repeat.weekly.days[day] = !$scope.createEventData.repeat.weekly.days[day];
    };
    $scope.toggleMonthSelect = function (month){
        $scope.createEventData.repeat.monthly.months[month] = !$scope.createEventData.repeat.monthly.months[month];
    };
    $scope.toggleYearSelect = function (year){
        $scope.createEventData.repeat.yearly.years[year] = !$scope.createEventData.repeat.yearly.years[year];
    };

    // Calendar Settings ---------------------------------------------------
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

    // Create Event ---------------------------------------------------
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

    // Edit Event -----------------------------------------------------
    $ionicModal.fromTemplateUrl('templates/edit-event-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
    }).then(function(modal) {
        $scope.editEventModal = modal;
    });
    $scope.openEditEvent = function(event){
        $scope.editEventData = event;
        $scope.editEventModal.show();
    };

});
