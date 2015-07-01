'use strict';

window.app.controller('NotificationsController', function ($scope, $stateParams) {

    $scope.notifId = $stateParams.notificationId;
    $scope.dateNow = new Date();
    $scope.notifications = [
        {
            $id: 1,
            action: 'removed',
            door : {
                id: 100,
                name: 'R101'
            },
            handler: {
                id: 1,
                name: 'Wimon Khamchan'
            },
            status: 'unread',
            createTime: new Date('June 30, 2015 13:30:00')
        },
        {
            $id: 2,
            action: 'added',
            door : {
                id: 101,
                name: 'WSN'
            },
            handler: {
                id: 2,
                name: 'Prof. Wannarat Santiamorntat'
            },
            status: 'unread',
            createTime: new Date('June 29, 2015 17:50:00')
        }
    ];
    $scope.notificationsObj = {
        1: {
            action: 'removed',
            door: {
                id: 100,
                name: 'R101'
            },
            handler: {
                id: 1,
                name: 'Wimon Khamchan'
            },
            status: 'unread',
            createTime: new Date('June 30, 2015 13:30:00')
        },
        2: {
            action : 'added',
            door: {
                id: 101,
                name: 'WSN'
            },
            handler: {
                id: 2,
                name: 'Prof. Wannarat Santiamorntat'
            },
            status: 'unread',
            createTime: new Date('June 29, 2015 17:50:00')
        }
    };

    $scope.calcDate = function(timeDuration) {
        var days = (timeDuration/ (24*3600*1000)).toFixed(0);
        var hours = (timeDuration/ (3600*1000)).toFixed(0);
        var minutes = (timeDuration/ (60*1000)).toFixed(0);

        // Calculate timeDuration to Days
        var daysReturn = '';
        if(days > 1) {
            daysReturn = days + ' days ';
        }else if (days == 1) {
            daysReturn = days + ' day ';
        }

        // Calculate timeDuration to Hours
        var hoursReturn = '';
        var daysToHours = days * 24;
        var calcHours = hours-daysToHours;
        if(calcHours > 1) {
            hoursReturn = calcHours + ' hours ';
        }else if (calcHours == 1) {
            hoursReturn = calcHours + ' hour ';
        }

        // Calculate timeDuration to Minutes
        var minutesReturn = '';
        var hoursToMinutes = hours * 60;
        var calcMinutes = minutes-hoursToMinutes;
        if(calcMinutes > 1) {
            minutesReturn = calcMinutes + ' minutes ';
        }else if (calcHours == 1) {
            minutesReturn = calcMinutes + ' minute ';
        }

        var pastMsg = 'ago';
        var valueReturn = daysReturn + hoursReturn + minutesReturn + pastMsg;

        if((days == 0 && calcHours == 0 && calcMinutes == 0) || (days == 0 && calcHours == 0 && calcMinutes == 1)) {
            valueReturn = 'Just now';
        }

        return valueReturn;
    };

});