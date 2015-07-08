'use strict';

window.app.factory('userAccessPolicies', function (calendars) {

    var userPolicies = {
        'userPolicy1': {
            type: 'normal',
            doorUser: 'doorUser1',
            calendar: 'calendar1'
        },
        'userPolicy2': {
            type: 'holiday',
            doorUser: 'doorUser1',
            calendar: 'calendar2'
        },
        'userPolicy3': {
            type: 'normal',
            doorUser: 'doorUser1',
            calendar: 'calendar3'
        },
        'userPolicy4': {
            type: 'normal',
            doorUser: 'doorUser2',
            calendar: 'calendar5'
        },
        'userPolicy5': {
            type: 'normal',
            doorUser: 'doorUser3',
            calendar: 'calendar7'
        }
    };

    var calendarsData = calendars;

    return function(doorUserId, data) {

        // group follow passcode policy type
        var userPoliciesArr = [];
        userPoliciesArr[0] = []; // Store Normal Access Time
        userPoliciesArr[1] = []; // Store Holiday Access Time

        angular.forEach(userPolicies, function(user, key){

            var userTmp = angular.copy(user);
            var calendarsTmp = angular.copy(calendarsData);

            if(userTmp.type == 'normal' && userTmp.doorUser == doorUserId) {
                var normalObj = {};
                normalObj.$id = key;
                normalObj.type = 'normal',
                    normalObj.calendar = {
                        $id: user.calendar,
                        public: calendarsTmp[userTmp.calendar].public,
                        name: calendarsTmp[userTmp.calendar].name,
                        description: calendarsTmp[userTmp.calendar].description
                    };

                userPoliciesArr[0].push(normalObj);
            }
            else if(userTmp.type == 'holiday' && userTmp.doorUser == doorUserId) {
                var holidayObj = {};
                holidayObj.$id = key;
                holidayObj.type = 'holiday',
                holidayObj.calendar = {
                    $id: user.calendar,
                    public: calendarsTmp[userTmp.calendar].public,
                    name: calendarsTmp[userTmp.calendar].name,
                    description: calendarsTmp[userTmp.calendar].description
                };

                userPoliciesArr[1].push(holidayObj);
            }
        });

        var userPoliciesObj = {};
        angular.forEach(userPolicies, function(value, key){
            if(value.doorUser == doorUserId){
                userPoliciesObj[key] = {};
                userPoliciesObj[key].type = value.type;
                userPoliciesObj[key].doorUser = value.doorUser;
                userPoliciesObj[key].calendar = {
                    $id: value.calendar,
                    public: calendarsData[value.calendar].public,
                    name: calendarsData[value.calendar].name,
                    description: calendarsData[value.calendar].description
                };
            }
        });

        if(data == 'object') {
            return userPoliciesObj;
        }else if(data == 'array') {
            return userPoliciesArr;
        }
    };
});