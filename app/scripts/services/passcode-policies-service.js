'use strict';

window.app.factory('passcodePolicies', function (calendars) {

    var passcodePolicies = [
        {
            id: 'passcodePolicy1',
            type: 'normal',
            passcode: 'passcode1',
            calendar: 'calendar1'
        },
        {
            id: 'passcodePolicy2',
            type: 'holiday',
            passcode: 'passcode1',
            calendar: 'calendar2'
        },
        {
            id: 'passcodePolicy3',
            type: 'normal',
            passcode: 'passcode2',
            calendar: 'calendar1'
        }
    ];

    // transform passcodePolicies to obj
    var passcodePoliciesObj = {};
    angular.forEach(passcodePolicies, function(value){
        passcodePoliciesObj[value.id] = {};
        passcodePoliciesObj[value.id].type = value.type;
        passcodePoliciesObj[value.id].passcode = value.passcode;
        passcodePoliciesObj[value.id].calendar = value.calendar;
    });

    // Get Calendars Data
    var calendarsData = calendars;

    return function(passcodeUnlockId, data, addObj){

        // group follow passcode policy type
        var passcodePoliciesArr = [];
        passcodePoliciesArr[0] = []; // Store Normal Access Time
        passcodePoliciesArr[1] = []; // Store Holiday Access Time

        angular.forEach(passcodePoliciesObj, function(passcodePolicy, key){

            var passcodePolicyTmp = angular.copy(passcodePolicy);
            var calendarsTmp = angular.copy(calendarsData);

            if(passcodePolicyTmp.type == 'normal' && passcodePolicyTmp.passcode == passcodeUnlockId) {
                var normalObj = {};
                normalObj.id = key;
                normalObj.type = 'normal',
                normalObj.calendar = {
                    id: passcodePolicy.calendar,
                    public: calendarsTmp[passcodePolicyTmp.calendar].public,
                    name: calendarsTmp[passcodePolicyTmp.calendar].name,
                    description: calendarsTmp[passcodePolicyTmp.calendar].description
                };

                passcodePoliciesArr[0].push(normalObj);
            }
            else if(passcodePolicyTmp.type == 'holiday' && passcodePolicyTmp.passcode == passcodeUnlockId) {
                var holidayObj = {};
                holidayObj.id = key;
                holidayObj.type = 'holiday',
                holidayObj.calendar = {
                    id: passcodePolicy.calendar,
                    public: calendarsTmp[passcodePolicyTmp.calendar].public,
                    name: calendarsTmp[passcodePolicyTmp.calendar].name,
                    description: calendarsTmp[passcodePolicyTmp.calendar].description
                };

                passcodePoliciesArr[1].push(holidayObj);
            }
        });

        // select objects (passcode: passcodeUnlockId)
        var passcodePoliciesSelectedObj = {};
        angular.forEach(passcodePoliciesObj, function(passcodePolicy, key){

            var passcodePolicyTmp = angular.copy(passcodePolicy);
            var calendarsTmp = angular.copy(calendarsData);

            if(passcodePolicyTmp.passcode == passcodeUnlockId) {
                passcodePoliciesSelectedObj[key] = {};
                passcodePoliciesSelectedObj[key].passcode = passcodeUnlockId;
                passcodePoliciesSelectedObj[key].type = passcodePolicyTmp.type;
                passcodePoliciesSelectedObj[key].calendar = {
                    id: passcodePolicy.calendar,
                    public: calendarsTmp[passcodePolicyTmp.calendar].public,
                    name: calendarsTmp[passcodePolicyTmp.calendar].name,
                    description: calendarsTmp[passcodePolicyTmp.calendar].description
                };
            }
        });

        if(data === 'object') {
            return passcodePoliciesSelectedObj;
        }
        else if(data === 'array') {
            return passcodePoliciesArr;
        }
        else if(data === 'add') {
            console.log('add passcode unlock');
        }
    };
});