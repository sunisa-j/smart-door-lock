'use strict';

window.app.factory('userAccessPolicies', function (calendars) {

    var userPolicies = [
        {
            id: 'userPolicy1',
            type: 'normal',
            doorUser: 'doorUser1',
            calendar: 'calendar1',
            createdBy: 1,
            createdAt: '2015-06-18T08:47:09.000Z',
            updatedBy: 1,
            updatedAt: '2015-06-18T08:47:09.000Z'
        },
        {
            id: 'userPolicy2',
            type: 'holiday',
            doorUser: 'doorUser1',
            calendar: 'calendar2',
            createdBy: 1,
            createdAt: '2015-06-18T08:47:09.000Z',
            updatedBy: 1,
            updatedAt: '2015-06-18T08:47:09.000Z'
        },
        {
            id: 'userPolicy3',
            type: 'normal',
            doorUser: 'doorUser1',
            calendar: 'calendar3',
            createdBy: 1,
            createdAt: '2015-06-18T08:47:09.000Z',
            updatedBy: 1,
            updatedAt: '2015-06-18T08:47:09.000Z'
        },
        {
            id: 'userPolicy4',
            type: 'normal',
            doorUser: 'doorUser2',
            calendar: 'calendar5',
            createdBy: 1,
            createdAt: '2015-06-18T08:47:09.000Z',
            updatedBy: 1,
            updatedAt: '2015-06-18T08:47:09.000Z'
        },
        {
            id: 'userPolicy5',
            type: 'normal',
            doorUser: 'doorUser3',
            calendar: 'calendar7',
            createdBy: 1,
            createdAt: '2015-06-18T08:47:09.000Z',
            updatedBy: 1,
            updatedAt: '2015-06-18T08:47:09.000Z'
        }
    ];

    // transform calendars to obj
    var userPoliciesObj = {};
    angular.forEach(userPolicies, function(userPolicy){
        userPoliciesObj[userPolicy.id] = {};
        userPoliciesObj[userPolicy.id].type = userPolicy.type;
        userPoliciesObj[userPolicy.id].doorUser = userPolicy.doorUser;
        userPoliciesObj[userPolicy.id].calendar = userPolicy.calendar;
    });

    // Get Calendars Data
    var calendarsData = calendars;

    return function(doorUserId, data) {

        // group follow passcode policy type
        var userPoliciesArr = [];
        userPoliciesArr[0] = []; // Store Normal Access Time
        userPoliciesArr[1] = []; // Store Holiday Access Time

        angular.forEach(userPoliciesObj, function(user, key){

            var userTmp = angular.copy(user);
            var calendarsTmp = angular.copy(calendarsData);

            if(userTmp.type == 'normal' && userTmp.doorUser == doorUserId) {
                var normalObj = {};
                normalObj.id = key;
                normalObj.type = 'normal',
                    normalObj.calendar = {
                        id: user.calendar,
                        public: calendarsTmp[userTmp.calendar].public,
                        name: calendarsTmp[userTmp.calendar].name,
                        description: calendarsTmp[userTmp.calendar].description
                    };

                userPoliciesArr[0].push(normalObj);
            }
            else if(userTmp.type == 'holiday' && userTmp.doorUser == doorUserId) {
                var holidayObj = {};
                holidayObj.id = key;
                holidayObj.type = 'holiday',
                holidayObj.calendar = {
                    id: user.calendar,
                    public: calendarsTmp[userTmp.calendar].public,
                    name: calendarsTmp[userTmp.calendar].name,
                    description: calendarsTmp[userTmp.calendar].description
                };

                userPoliciesArr[1].push(holidayObj);
            }
        });

        var userPoliciesDoorSelectedObj = {};
        angular.forEach(userPoliciesObj, function(value, key){
            if(value.doorUser == doorUserId){
                userPoliciesDoorSelectedObj[key] = {};
                userPoliciesDoorSelectedObj[key].type = value.type;
                userPoliciesDoorSelectedObj[key].doorUser = value.doorUser;
                userPoliciesDoorSelectedObj[key].calendar = {
                    id: value.calendar,
                    public: calendarsData[value.calendar].public,
                    name: calendarsData[value.calendar].name,
                    description: calendarsData[value.calendar].description
                };
            }
        });

        if(data == 'object') {
            return userPoliciesDoorSelectedObj;
        }else if(data == 'array') {
            return userPoliciesArr;
        }
    };
});