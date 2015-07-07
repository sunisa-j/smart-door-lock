'use strict';

window.app.factory('autoReleasePolicies', function (calendars) {

    var autoReleasePolicies = {
        'autoReleasePolicy1': {
            type: 'normal',
            door: 'door1',
            calendar: 'calendar1'
        },
        'autoReleasePolicy2': {
            type: 'holiday',
            door: 'door1',
            calendar: 'calendar2'
        },
        'autoReleasePolicy3': {
            type: 'normal',
            door: 'door1',
            calendar: 'calendar3'
        },
        'autoReleasePolicy4': {
            type: 'normal',
            door: 'door2',
            calendar: 'calendar5'
        }
    };

    var calendarsData = calendars;

    return function(doorId, data) {

        // group follow passcode policy type
        var autoReleasePoliciesArr = [];
        autoReleasePoliciesArr[0] = []; // Store Normal Access Time
        autoReleasePoliciesArr[1] = []; // Store Holiday Access Time

        angular.forEach(autoReleasePolicies, function(autoRelease, key){

            var autoReleaseTmp = angular.copy(autoRelease);
            var calendarsTmp = angular.copy(calendarsData);

            if(autoReleaseTmp.type == 'normal' && autoReleaseTmp.door == doorId) {
                var normalObj = {};
                normalObj.$id = key;
                normalObj.type = 'normal',
                normalObj.calendar = {
                    $id: autoRelease.calendar,
                    public: calendarsTmp[autoReleaseTmp.calendar].public,
                    name: calendarsTmp[autoReleaseTmp.calendar].name,
                    description: calendarsTmp[autoReleaseTmp.calendar].description
                };

                autoReleasePoliciesArr[0].push(normalObj);
            }
            else if(autoReleaseTmp.type == 'holiday' && autoReleaseTmp.door == doorId) {
                var holidayObj = {};
                holidayObj.$id = key;
                holidayObj.type = 'holiday',
                holidayObj.calendar = {
                    $id: autoRelease.calendar,
                    public: calendarsTmp[autoReleaseTmp.calendar].public,
                    name: calendarsTmp[autoReleaseTmp.calendar].name,
                    description: calendarsTmp[autoReleaseTmp.calendar].description
                };

                autoReleasePoliciesArr[1].push(holidayObj);
            }
        });

        var autoReleasePoliciesObj = {};
        angular.forEach(autoReleasePolicies, function(value, key){
            if(value.door == doorId){
                autoReleasePoliciesObj[key] = {};
                autoReleasePoliciesObj[key].type = value.type;
                autoReleasePoliciesObj[key].door = value.door;
                autoReleasePoliciesObj[key].calendar = {
                    $id: value.calendar,
                    public: calendarsData[value.calendar].public,
                    name: calendarsData[value.calendar].name,
                    description: calendarsData[value.calendar].description
                };
            }
        });

        if(data == 'object') {
            return autoReleasePoliciesObj;
        }else if(data == 'array') {
            return autoReleasePoliciesArr;
        }
    };
});