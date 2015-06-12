'use strict';

window.app.factory('doorsAccess', function () {

    var doorsAccess = {
        'building1': {
            name: 'Robot',
            desc: 'Computer Engineering near reservoir',
            doorsAccess: {
                'door1': {
                    name: 'R101',
                    desc: '1st floor',
                    status: {
                        door: 'closed',
                        lock: 'unlocked'
                    }
                },
                'door2': {
                    name: 'R200',
                    desc: '2nd floor',
                    status: {
                        door: 'closed',
                        lock: 'locked'
                    }
                },
                'door3': {
                    name: 'WSN',
                    desc: '3rd floor',
                    status: {
                        door: 'opened',
                        lock: 'locked'
                    }
                },
                'door4': {
                    name: 'R300',
                    desc: '3rd floor',
                    status: {
                        door: 'opened',
                        lock: 'unlocked'
                    }
                }
            }
        },
        'building2': {
            name: 'Robot 2',
            desc: 'Computer Engineering 2',
            doorsAccess: {
                'door1': {
                    name: 'R2-101',
                    desc: '1st floor',
                    status: {
                        door: 'closed',
                        lock: 'unlocked'
                    }
                },
                'door2': {
                    name: 'R2-200',
                    desc: '2nd floor',
                    status: {
                        door: 'closed',
                        lock: 'locked'
                    }
                },
                'door3': {
                    name: 'R3-302',
                    desc: '3rd floor',
                    status: {
                        door: 'opened',
                        lock: 'locked'
                    }
                },
                'door4': {
                    name: 'R4-403',
                    desc: '3rd floor',
                    status: {
                        door: 'opened',
                        lock: 'unlocked'
                    }
                }
            }
        }
    };

    var doorsAccessArr = [];

    angular.forEach(doorsAccess, function(value, key){
        var building = angular.copy(value);
        var doorsInBuilding = building.doorsAccess;
        building.$id = key;

        building.doorsAccess = [];

        angular.forEach(doorsInBuilding, function(door, key){
            var tmp = angular.copy(door);
            tmp.$id = key;
            building.doorsAccess.push(tmp);
        });

        doorsAccessArr.push(building);
    });

    return function(isObject){
        if(isObject){
            return doorsAccess;
        }else{
            return doorsAccessArr;
        }
    };
});