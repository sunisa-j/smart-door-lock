'use strict';

window.app.factory('doorsAccess', function () {

    var doorsAccess = {
        'group1': {
            name: 'Robot',
            desc: 'Computer Engineering near reservoir',
            doorsAccess: {
                'door1': {
                    name: 'R101',
                    desc: '1st floor',
                    status: {
                        door: 'closed',
                        lock: 'unlocked'
                    },
                    expire: new Date('30 Jun 2015'),
                    permission: {
                        unlock: true,
                        viewLog: true,
                        viewStatus: true,
                        remoteControl: true,
                        configuration: true,
                        manageUser: true,
                        adminPrivillage: true
                    }
                },
                'door2': {
                    name: 'R200',
                    desc: '2nd floor',
                    status: {
                        door: 'closed',
                        lock: 'locked'
                    },
                    expire: new Date('19 Jun 2015'),
                    permission: {
                        unlock: true,
                        viewLog: true,
                        viewStatus: true,
                        remoteControl: true,
                        configuration: true,
                        manageUser: true,
                        adminPrivillage: true
                    }
                },
                'door3': {
                    name: 'WSN',
                    desc: '3rd floor',
                    status: {
                        door: 'opened',
                        lock: 'locked'
                    },
                    expire: new Date('12 Jun 2015'),
                    permission: {
                        unlock: true,
                        viewLog: false,
                        viewStatus: true,
                        remoteControl: false,
                        configuration: false,
                        manageUser: false,
                        adminPrivillage: false
                    }
                },
                'door4': {
                    name: 'R300',
                    desc: '3rd floor',
                    status: {
                        door: 'opened',
                        lock: 'unlocked'
                    },
                    expire: new Date('10 Jun 2015'),
                    permission: {
                        unlock: true,
                        viewLog: false,
                        viewStatus: false,
                        remoteControl: false,
                        configuration: false,
                        manageUser: false,
                        adminPrivillage: false
                    }
                }
            }
        },
        'group2': {
            name: 'Robot 2',
            desc: 'Computer Engineering 2',
            doorsAccess: {
                'door1': {
                    name: 'R2-101',
                    desc: '1st floor',
                    status: {
                        door: 'closed',
                        lock: 'unlocked'
                    },
                    expire: new Date('22 Jun 2015'),
                    permission: {
                        unlock: true,
                        viewLog: false,
                        viewStatus: true,
                        remoteControl: false,
                        configuration: false,
                        manageUser: false,
                        adminPrivillage: false
                    }
                },
                'door2': {
                    name: 'R2-200',
                    desc: '2nd floor',
                    status: {
                        door: 'closed',
                        lock: 'locked'
                    },
                    expire: new Date('27 Jun 2015'),
                    permission: {
                        unlock: true,
                        viewLog: false,
                        viewStatus: true,
                        remoteControl: false,
                        configuration: false,
                        manageUser: false,
                        adminPrivillage: false
                    }
                },
                'door4': {
                    name: 'R4-403',
                    desc: '3rd floor',
                    status: {
                        door: 'opened',
                        lock: 'unlocked'
                    },
                    expire: new Date('20 Jun 2014'),
                    permission: {
                        unlock: true,
                        viewLog: false,
                        viewStatus: true,
                        remoteControl: false,
                        configuration: false,
                        manageUser: false,
                        adminPrivillage: false
                    }
                }
            }
        }
    };

    // convert object to array
    var doorsAccessArr = [];
    var numberOfBuildings = 0;

    angular.forEach(doorsAccess, function(value, key){
        var building = angular.copy(value);
        var doorsInBuilding = building.doorsAccess;
        building.$id = key;

        building.doorsAccess = [];
        var doorsEachBuilding = 0;

        angular.forEach(doorsInBuilding, function(door, key){
            var tmp = angular.copy(door);
            tmp.$id = key;
            building.doorsAccess.push(tmp);

            doorsEachBuilding++;
        });
        building.numberOfDoors = doorsEachBuilding;
        numberOfBuildings++;

        doorsAccessArr.push(building);
    });
    doorsAccessArr.numberOfBuildings = numberOfBuildings;

    // Get number of doors
    var doorsCount = [];
    for(var i=0; i < numberOfBuildings; i++) {
        var tmp = {
            'buildingId': doorsAccessArr[i].$id,
            'buildingName': doorsAccessArr[i].name,
            'doors': doorsAccessArr[i].numberOfDoors
        };
        doorsCount[i] = tmp;
    }

    return function(data){
        if(data === 'object'){
            return doorsAccess;
        }else if (data === 'array') {
            return doorsAccessArr;
        }else if (data === 'count') {
            return doorsCount;
        }
    };
});