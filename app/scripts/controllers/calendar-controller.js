'use strict';

window.app.controller('CalendarController', function ($scope, $stateParams, calendars, $ionicModal, $ionicPopup) {

    var calendarId = $stateParams.calendarId;
    $scope.calendarData = calendars[calendarId];

    $scope.createEventData = {
        name: 'Event Name',
        description: '',
        startDate: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        repeat: {
            status: false,
            recurring: 'weekly',
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
                every: 1
            },
            yearly: {
                every: 1
            },
            endRepeat: {
                value: 'never',
                after: null,
                onDate: null
            }
        }
    };

    $scope.toggleDaySelect = function (day){
        $scope.createEventData.repeat.weekly.days[day] = !$scope.createEventData.repeat.weekly.days[day];
    };

    // Calenar Settings
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

    // Create Event
    $ionicModal.fromTemplateUrl('templates/create-event-modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false
    }).then(function(modal) {
        $scope.createEventModal = modal;
    });

});
