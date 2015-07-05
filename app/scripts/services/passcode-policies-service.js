'use strict';

window.app.factory('passcodePolicies', function (calendars) {

    var passcodePolicies = {
        'passcodePolicy1': {
            type: 'normal',
            passcode: 'passcode1',
            calendar: 'calendar1'
        },
        'passcodePolicy2': {
            type: 'holiday',
            passcode: 'passcode1',
            calendar: 'calendar2'
        },
        'passcodePolicy3': {
            type: 'normal',
            passcode: 'passcode2',
            calendar: 'calendar1'
        }
    };

    var calendarsData = calendars;

    return function(passcodeUnlockId, data){

        // group follow passcode policy type
        var passcodePoliciesArr = [];
        passcodePoliciesArr[0] = [];
        passcodePoliciesArr[1] = [];

        angular.forEach(passcodePolicies, function(passcodePolicy, key){

            var passcodePolicyTmp = angular.copy(passcodePolicy);
            var calendarsTmp = angular.copy(calendarsData);

            if(passcodePolicyTmp.type == 'normal' && passcodePolicyTmp.passcode == passcodeUnlockId) {
                var normalObj = {};
                normalObj.$id = key;
                normalObj.type = 'normal',
                normalObj.calendar = {
                    $id: passcodePolicy.calendar,
                    public: calendarsTmp[passcodePolicyTmp.calendar].public,
                    name: calendarsTmp[passcodePolicyTmp.calendar].name,
                    description: calendarsTmp[passcodePolicyTmp.calendar].description
                };

                passcodePoliciesArr[0].push(normalObj);
            }
            else if(passcodePolicyTmp.type == 'holiday' && passcodePolicyTmp.passcode == passcodeUnlockId) {
                var holidayObj = {};
                holidayObj.$id = key;
                holidayObj.type = 'holiday',
                holidayObj.calendar = {
                    $id: passcodePolicy.calendar,
                    public: calendarsTmp[passcodePolicyTmp.calendar].public,
                    name: calendarsTmp[passcodePolicyTmp.calendar].name,
                    description: calendarsTmp[passcodePolicyTmp.calendar].description
                };

                passcodePoliciesArr[1].push(holidayObj);
            }
        });

        // select objects (passcode: passcodeUnlockId)
        var passcodePoliciesObj = {};
        angular.forEach(passcodePolicies, function(passcodePolicy, key){

            var passcodePolicyTmp = angular.copy(passcodePolicy);
            var calendarsTmp = angular.copy(calendarsData);

            if(passcodePolicyTmp.passcode == passcodeUnlockId) {
                passcodePoliciesObj[key] = {};
                passcodePoliciesObj[key].passcode = passcodeUnlockId;
                passcodePoliciesObj[key].type = passcodePolicyTmp.type;
                passcodePoliciesObj[key].calendar = {
                    $id: passcodePolicy.calendar,
                    public: calendarsTmp[passcodePolicyTmp.calendar].public,
                    name: calendarsTmp[passcodePolicyTmp.calendar].name,
                    description: calendarsTmp[passcodePolicyTmp.calendar].description
                };
            }
        });

        if(data == 'object') {
            return passcodePoliciesObj;
        }
        else if(data == 'array') {
            return passcodePoliciesArr;
        }
    };
});