'use strict';

window.app.factory('doorsAccess', function () {

    var doors = [
        {
            id: 'door1',
            group: 'group1',
            name: 'R101',
            description: '1st floor',
            hardwareId: 'OA:28:66:C4:73:8D-1',
            status: {
                lockState: 'unlocked',
                doorState: 'closed'
            },
            setting: {
                lockType: 'magnetic',
                pinRequired: false,
                autoRelock: false,
                autoRelockTime: 10,
                operatingMode: 'normal',
                wrongCodeEntryLimit: 5,
                userCodeTemporaryDisableTime: 180
            },
            deviceUpdatedAt: "2015-05-17T14:49:18.000Z",
            createdAt: "2015-02-27T12:31:45.000Z",
            updatedAt: "2015-02-27T12:31:45.000Z"
        },
        {
            id: 'door2',
            group: 'group1',
            name: 'R200',
            description: '2nd floor',
            hardwareId: 'OA:28:66:C4:73:8D-2',
            status: {
                lockState: 'locked',
                doorState: 'closed'
            },
            setting: {
                lockType: 'magnetic',
                pinRequired: false,
                autoRelock: false,
                autoRelockTime: 10,
                operatingMode: 'normal',
                wrongCodeEntryLimit: 5,
                userCodeTemporaryDisableTime: 180
            },
            deviceUpdatedAt: "2015-05-17T14:49:18.000Z",
            createdAt: "2015-02-27T12:31:45.000Z",
            updatedAt: "2015-02-27T12:31:45.000Z"
        },
        {
            id: 'door3',
            group: 'group1',
            name: 'R201',
            description: '2nd floor',
            hardwareId: 'OA:28:66:C4:73:8D-3',
            status: {
                lockState: 'locked',
                doorState: 'opened'
            },
            setting: {
                lockType: 'magnetic',
                pinRequired: false,
                autoRelock: false,
                autoRelockTime: 10,
                operatingMode: 'normal',
                wrongCodeEntryLimit: 5,
                userCodeTemporaryDisableTime: 180
            },
            deviceUpdatedAt: "2015-05-17T14:49:18.000Z",
            createdAt: "2015-02-27T12:31:45.000Z",
            updatedAt: "2015-02-27T12:31:45.000Z"
        },
        {
            id: 'door4',
            group: 'group1',
            name: 'R300',
            description: '3rd floor',
            hardwareId: 'OA:28:66:C4:73:8D-4',
            status: {
                lockState: 'unlocked',
                doorState: 'opened'
            },
            setting: {
                lockType: 'magnetic',
                pinRequired: false,
                autoRelock: false,
                autoRelockTime: 10,
                operatingMode: 'normal',
                wrongCodeEntryLimit: 5,
                userCodeTemporaryDisableTime: 180
            },
            deviceUpdatedAt: "2015-05-17T14:49:18.000Z",
            createdAt: "2015-02-27T12:31:45.000Z",
            updatedAt: "2015-02-27T12:31:45.000Z"
        },
        {
            id: 'door5',
            group: 'group2',
            name: 'WSN',
            description: '3rd floor',
            hardwareId: 'OA:28:66:C4:73:8D-5',
            status: {
                lockState: 'unlocked',
                doorState: 'closed'
            },
            setting: {
                lockType: 'magnetic',
                pinRequired: false,
                autoRelock: false,
                autoRelockTime: 10,
                operatingMode: 'normal',
                wrongCodeEntryLimit: 5,
                userCodeTemporaryDisableTime: 180
            },
            deviceUpdatedAt: "2015-05-17T14:49:18.000Z",
            createdAt: "2015-02-27T12:31:45.000Z",
            updatedAt: "2015-02-27T12:31:45.000Z"
        },
        {
            id: 'door6',
            group: 'group2',
            name: 'CNR',
            description: '3rd floor',
            hardwareId: 'OA:28:66:C4:73:8D-6',
            status: {
                lockState: 'locked',
                doorState: 'closed'
            },
            setting: {
                lockType: 'magnetic',
                pinRequired: false,
                autoRelock: false,
                autoRelockTime: 10,
                operatingMode: 'normal',
                wrongCodeEntryLimit: 5,
                userCodeTemporaryDisableTime: 180
            },
            deviceUpdatedAt: "2015-05-17T14:49:18.000Z",
            createdAt: "2015-02-27T12:31:45.000Z",
            updatedAt: "2015-02-27T12:31:45.000Z"
        },
        {
            id: 'door7',
            group: 'group2',
            name: 'Robotic',
            description: '4th floor',
            hardwareId: 'OA:28:66:C4:73:8D-7',
            status: {
                lockState: 'unlocked',
                doorState: 'opened'
            },
            setting: {
                lockType: 'magnetic',
                pinRequired: false,
                autoRelock: false,
                autoRelockTime: 10,
                operatingMode: 'normal',
                wrongCodeEntryLimit: 5,
                userCodeTemporaryDisableTime: 180
            },
            deviceUpdatedAt: "2015-05-17T14:49:18.000Z",
            createdAt: "2015-02-27T12:31:45.000Z",
            updatedAt: "2015-02-27T12:31:45.000Z"
        }
    ];

    var doorsObj = {};
    angular.forEach(doors, function(value){
        doorsObj[value.id] = {};
        doorsObj[value.id].group = value.group;
        doorsObj[value.id].name = value.name;
        doorsObj[value.id].description = value.description;
        doorsObj[value.id].hardwareId = value.hardwareId;
        doorsObj[value.id].status = {
            lockState: value.lockState,
            doorState: value.doorState
        };
        doorsObj[value.id].setting = {
            lockType: value.lockType,
            pinRequired: value.pinRequired,
            autoRelock: value.autoRelock,
            autoRelockTime: value.autoRelockTime,
            operatingMode: value.operatingMode,
            wrongCodeEntryLimit: value.wrongCodeEntryLimit,
            userCodeTemporaryDisableTime: value.userCodeTemporaryDisableTime
        };
        doorsObj[value.id].deviceUpdatedAt = value.deviceUpdatedAt;
        doorsObj[value.id].createdAt = value.createdAt;
        doorsObj[value.id].updatedAt = value.updatedAt;
    });

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
                    expire: new Date('30 Dec 2015'),
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
                    expire: new Date('19 Dec 2015'),
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
                    expire: new Date('12 Dec 2015'),
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
                    expire: new Date('10 Dec 2015'),
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
                    expire: new Date('22 Dec 2015'),
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
                    expire: new Date('27 Dec 2015'),
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
                    expire: new Date('20 Dec 2014'),
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
    var numberOfDoors = 0;

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

        numberOfDoors = numberOfDoors + doorsEachGroup;

        doorsAccessArr.push(group);
    });
    doorsAccessArr.numberOfGroups = numberOfGroups;

    return function(data){
        if(data === 'object'){
            return doorsAccess;
        }else if (data === 'array') {
            return doorsAccessArr;
        }else if (data === 'count') {
            return numberOfDoors;
        }else if (data === 'doors') {
            return doorsObj;
        }
    };
});