'use strict';

window.app.factory('doorsAccess', function () {

    var doorsAccess = {
        'group1': {
            name: 'Classroom',
            desc: 'Computer Engineering, PSU',
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
                        manageAccess: true,
                        adminPrivillage: true
                    },
                    configDoor: {
                        autoRelock: {
                            status: false
                        },
                        pinRequired: {
                            status: false
                        }
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
                        manageAccess: true,
                        adminPrivillage: true
                    },
                    configDoor: {
                        autoRelock: {
                            status: false
                        },
                        pinRequired: {
                            status: false
                        }
                    }
                },
                'door3': {
                    name: 'R201',
                    desc: '2nd floor',
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
                        manageAccess: false,
                        adminPrivillage: false
                    },
                    configDoor: {
                        autoRelock: {
                            status: false
                        },
                        pinRequired: {
                            status: false
                        }
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
                        manageAccess: false,
                        adminPrivillage: false
                    },
                    configDoor: {
                        autoRelock: {
                            status: false
                        },
                        pinRequired: {
                            status: false
                        }
                    }
                }
            }
        },
        'group2': {
            name: 'Laboratory',
            desc: 'Computer Engineering, PSU',
            doorsAccess: {
                'door5': {
                    name: 'WSN',
                    desc: '3rd floor',
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
                        manageAccess: false,
                        adminPrivillage: false
                    },
                    configDoor: {
                        autoRelock: {
                            status: false
                        },
                        pinRequired: {
                            status: false
                        }
                    }
                },
                'door6': {
                    name: 'CNR',
                    desc: '3rd floor',
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
                        manageAccess: false,
                        adminPrivillage: false
                    },
                    configDoor: {
                        autoRelock: {
                            status: false
                        },
                        pinRequired: {
                            status: false
                        }
                    }
                },
                'door7': {
                    name: 'Robotic',
                    desc: '4th floor',
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
                        manageAccess: false,
                        adminPrivillage: false
                    },
                    configDoor: {
                        autoRelock: {
                            status: false
                        },
                        pinRequired: {
                            status: false
                        }
                    }
                }
            }
        }
    };

    // convert object to array
    var doorsAccessArr = [];
    var numberOfGroups = 0;

    angular.forEach(doorsAccess, function(value, key){
        var group = angular.copy(value);
        var doorsInGroup = group.doorsAccess;
        group.$id = key;

        group.doorsAccess = [];
        var doorsEachGroup = 0;

        angular.forEach(doorsInGroup, function(door, key){
            var tmp = angular.copy(door);
            tmp.$id = key;
            group.doorsAccess.push(tmp);

            doorsEachGroup++;
        });
        group.numberOfDoors = doorsEachGroup;
        numberOfGroups++;

        doorsAccessArr.push(group);
    });
    doorsAccessArr.numberOfGroups = numberOfGroups;

    // Get number of doors
    var doorsCount = [];
    for(var i=0; i < numberOfGroups; i++) {
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