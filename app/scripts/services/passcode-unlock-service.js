'use strict';

window.app.factory('passcodeUnlock', function () {

    var passcodeUnlock = [
        {
            id: 'passcode1',
            name: 'Chinese Student',
            passcode: '123456',
            door: 'door1',
            status: 'Enabled',
            createdBy: 1,
            createdAt: '2015-06-18T08:47:09.000Z',
            updatedBy: 1,
            updatedAt: '2015-06-18T08:47:09.000Z'
        },
        {
            id: 'passcode2',
            name: 'Trainee',
            passcode: '555555',
            door: 'door1',
            status: 'Enabled',
            createdBy: 1,
            createdAt: '2015-06-18T08:47:09.000Z',
            updatedBy: 1,
            updatedAt: '2015-06-18T08:47:09.000Z'
        },
        {
            id: 'passcode3',
            name: 'Trainee',
            passcode: '767676',
            door: 'door2',
            status: 'Enabled',
            createdBy: 1,
            createdAt: '2015-06-18T08:47:09.000Z',
            updatedBy: 1,
            updatedAt: '2015-06-18T08:47:09.000Z'
        }
    ];

    // transform calendars to obj
    var passcodeUnlockObj = {};
    angular.forEach(passcodeUnlock, function(passcode){
        passcodeUnlockObj[passcode.id] = {};
        passcodeUnlockObj[passcode.id].name = passcode.name;
        passcodeUnlockObj[passcode.id].passcode = passcode.passcode;
        passcodeUnlockObj[passcode.id].door = passcode.door;
        passcodeUnlockObj[passcode.id].status = passcode.status;
    });

    return function(doorId, passcodeUnlockId, data){

        // select objects (door: doorId)
        var passcodeUnlockDoorSelectedObj = {};
        angular.forEach(passcodeUnlockObj, function(passcode, key){
            var tmp = angular.copy(passcode);
            if(tmp.door == doorId) {
                passcodeUnlockDoorSelectedObj[key] = {};
                passcodeUnlockDoorSelectedObj[key].name = tmp.name;
                passcodeUnlockDoorSelectedObj[key].passcode = tmp.passcode;
                passcodeUnlockDoorSelectedObj[key].door = tmp.door;
                passcodeUnlockDoorSelectedObj[key].status = tmp.status;
            }
        });

        // get passcode unlock
        var passcodeUnlockSelected = passcodeUnlockObj[passcodeUnlockId];


        if(data === 'object'){
            return passcodeUnlockDoorSelectedObj;
        }
        else if (data === 'array') {
            return passcodeUnlock;
        }
        else if (data === 'selected') {
            return passcodeUnlockSelected;
        }
        else if (data === 'passcodeDoorArray') {
            var passcodeDoorArray = []
            if(doorId != ''){
                angular.forEach(passcodeUnlock, function(passcode){
                    if(passcode.door == doorId){
                        passcodeDoorArray.push(passcode);
                    }
                });
            }
            return passcodeDoorArray;
        }
    };
});