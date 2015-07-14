'use strict';

window.app.controller('NotificationsController', function ($scope, $stateParams, notifications) {

    $scope.notifId = $stateParams.notificationId;
    $scope.dateNow = new Date();
    $scope.notifications = notifications('array');
    $scope.notificationSelected = notifications('object')[$scope.notifId];

    $scope.getTimeCreated = function(createdAt){
        return (new Date(createdAt)).getTime()
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