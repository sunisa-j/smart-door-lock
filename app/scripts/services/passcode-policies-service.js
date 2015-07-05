'use strict';

window.app.factory('passcodePolicies', function () {

    var passcodePolicies = {
        1: {
            type: 'normal',
            passcode: 'passcode1',
            calendar: 'calendar1'
        },
        2: {
            type: 'holiday',
            passcode: 'passcode1',
            calendar: 'calendar2'
        },
        3: {
            type: 'normal',
            passcode: 'passcode2',
            calendar: 'calendar1'
        }
    };

    return function(passcodeUnlockId, data){

        // group follow passcode policy type
        var passcodePoliciesArr = [];
        passcodePoliciesArr[0] = [];
        passcodePoliciesArr[1] = [];

        angular.forEach(passcodePolicies, function(passcodePolicy, key){
            var tmp = angular.copy(passcodePolicy);

            if(tmp.type == 'normal' && tmp.passcode == passcodeUnlockId) {
                var normalObj = {};
                normalObj.$id = key;
                normalObj.type = 'normal',
                normalObj.calendar = tmp.calendar

                passcodePoliciesArr[0].push(normalObj);
            }
            else if(tmp.type == 'holiday' && tmp.passcode == passcodeUnlockId) {
                var holidayObj = {};
                holidayObj.$id = key;
                holidayObj.type = 'holiday',
                holidayObj.calendar = tmp.calendar

                passcodePoliciesArr[1].push(holidayObj);
            }
        });

        // select objects (passcode: passcodeUnlockId)
        var passcodePoliciesObj = {};
        angular.forEach(passcodePolicies, function(passcodePolicy, key){
            var tmp = angular.copy(passcodePolicy);
            if(tmp.passcode == passcodeUnlockId) {
                passcodePoliciesObj[key] = {};
                passcodePoliciesObj[key].type = tmp.type;
                passcodePoliciesObj[key].calendar = tmp.calendar;
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