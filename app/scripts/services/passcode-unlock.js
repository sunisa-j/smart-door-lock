'use strict';

window.app.factory('passcodeUnlock', function () {

    var passcodeUnlock = {
        'passcode1': {
            name: 'Chinese Student',
            passcode: '123456',
            door: 'door1',
            status: 'Enabled'
        },
        'passcode2': {
            name: 'Trainee',
            passcode: '555555',
            door: 'door1',
            status: 'Enabled'
        },
        'passcode3': {
            name: 'Trainee',
            passcode: '767676',
            door: 'door2',
            status: 'Enabled'
        }
    };

    return function(doorId, passcodeUnlockId, data){

        // convert object to array
        var passcodeUnlockArr = [];
        angular.forEach(passcodeUnlock, function(passcode, key){
            var tmp = angular.copy(passcode);
            if(tmp.door == doorId) {
                tmp.$id = key;
                passcodeUnlockArr.push(tmp);
            }
        });

        // select objects (door: doorId)
        var passcodeUnlockObj = {};
        angular.forEach(passcodeUnlock, function(passcode, key){
            var tmp = angular.copy(passcode);
            if(tmp.door == doorId) {
                passcodeUnlockObj[key] = {};
                passcodeUnlockObj[key].name = tmp.name;
                passcodeUnlockObj[key].passcode = tmp.passcode;
                passcodeUnlockObj[key].door = tmp.door;
                passcodeUnlockObj[key].status = tmp.status;
            }
        });

        // get passcode unlock
        var passcodeUnlockSelected = passcodeUnlock[passcodeUnlockId];

        if(data === 'object'){
            return passcodeUnlockObj;
        }
        else if (data === 'array') {
            return passcodeUnlockArr;
        }
        else if (data === 'selected') {
            return passcodeUnlockSelected;
        }
    };
});