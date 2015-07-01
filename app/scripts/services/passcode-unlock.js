'use strict';

window.app.factory('passcodeUnlock', function () {

    var passcodeUnlock = {
        'passcode1': {
            name: 'Chinese Student',
            passcode: '123456',
            door: 'door1'
        },
        'passcode2': {
            name: 'Trainee',
            passcode: '555555',
            door: 'door1'
        },
        'passcode3': {
            name: 'Trainee',
            passcode: '767676',
            door: 'door2'
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

        // get passcode unlock
        var passcodeUnlockSelected = passcodeUnlock[passcodeUnlockId];

        if(data === 'object'){
            return passcodeUnlockSelected;
        }else if (data === 'array') {
            return passcodeUnlockArr;
        }
    };
});