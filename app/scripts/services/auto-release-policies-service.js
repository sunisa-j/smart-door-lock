'use strict';

window.app.factory('autoReleasePolicies', function (calendars) {

    var autoReleasePolicies = [
        {
            id: 'autoReleasePolicy1',
            type: 'normal',
            door: 'door1',
            calendar: 'calendar1'
        },
        {
            id: 'autoReleasePolicy2',
            type: 'holiday',
            door: 'door1',
            calendar: 'calendar2'
        },
        {
            id: 'autoReleasePolicy3',
            type: 'normal',
            door: 'door1',
            calendar: 'calendar3'
        },
        {
            id: 'autoReleasePolicy4',
            type: 'normal',
            door: 'door2',
            calendar: 'calendar5'
        }
    ];

    // transform autoReleasePolicies to obj
    var autoReleasePoliciesObj = {};
    angular.forEach(autoReleasePolicies, function(value){
        autoReleasePoliciesObj[value.id] = {};
        autoReleasePoliciesObj[value.id].type = value.type;
        autoReleasePoliciesObj[value.id].door = value.door;
        autoReleasePoliciesObj[value.id].calendar = value.calendar;
    });

    var calendarsData = calendars;

    return function(doorId, data) {

        // group follow passcode policy type
        var autoReleasePoliciesArr = [];
        autoReleasePoliciesArr[0] = []; // Store Normal Access Time
        autoReleasePoliciesArr[1] = []; // Store Holiday Access Time

        angular.forEach(autoReleasePoliciesObj, function(autoRelease, key){

            var autoReleaseTmp = angular.copy(autoRelease);
            var calendarsTmp = angular.copy(calendarsData);

            if(autoReleaseTmp.type == 'normal' && autoReleaseTmp.door == doorId) {
                var normalObj = {};
                normalObj.id = key;
                normalObj.type = 'normal',
                normalObj.calendar = {
                    id: autoRelease.calendar,
                    public: calendarsTmp[autoReleaseTmp.calendar].public,
                    name: calendarsTmp[autoReleaseTmp.calendar].name,
                    description: calendarsTmp[autoReleaseTmp.calendar].description
                };

                autoReleasePoliciesArr[0].push(normalObj);
            }
            else if(autoReleaseTmp.type == 'holiday' && autoReleaseTmp.door == doorId) {
                var holidayObj = {};
                holidayObj.id = key;
                holidayObj.type = 'holiday',
                holidayObj.calendar = {
                    id: autoRelease.calendar,
                    public: calendarsTmp[autoReleaseTmp.calendar].public,
                    name: calendarsTmp[autoReleaseTmp.calendar].name,
                    description: calendarsTmp[autoReleaseTmp.calendar].description
                };

                autoReleasePoliciesArr[1].push(holidayObj);
            }
        });

        var autoReleasePoliciesDoorSelectedObj = {};
        angular.forEach(autoReleasePoliciesObj, function(value, key){
            if(value.door == doorId){
                autoReleasePoliciesDoorSelectedObj[key] = {};
                autoReleasePoliciesDoorSelectedObj[key].type = value.type;
                autoReleasePoliciesDoorSelectedObj[key].door = value.door;
                autoReleasePoliciesDoorSelectedObj[key].calendar = {
                    id: value.calendar,
                    public: calendarsData[value.calendar].public,
                    name: calendarsData[value.calendar].name,
                    description: calendarsData[value.calendar].description
                };
            }
        });

        if(data === 'object') {
            return autoReleasePoliciesDoorSelectedObj;
        }
        else if(data === 'array') {
            return autoReleasePoliciesArr;
        }
    };
});