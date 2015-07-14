'use strict';

window.app.factory('doorsAccess', function (doorGroups, doorsUsers) {

    // Get doorGroups
    var doorGroupsData = doorGroups;

    // Get doorsUsers
    //var doorsUsersData = doorsUsers('','array');

    // Get doors ----------------------------------------------------
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

    // transform doors array to object
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

    return function(userId, data){

        // doors object (group by doorGroups) ---------------------------
        var doorsAccess2 = {};

        angular.forEach(doorGroupsData, function(group){
            doorsAccess2[group.id] = {};
            doorsAccess2[group.id].name = group.name;
            doorsAccess2[group.id].description = group.description;
            doorsAccess2[group.id].doorsAccess = {};

            angular.forEach(doors, function(door){
                var doorsUsersData = doorsUsers(door.id, 'object');

                angular.forEach(doorsUsersData, function (doorUser, doorUserKey){

                    if((group.id == door.group) && (doorUser.user.id == userId)){

                        doorsAccess2[group.id].doorsAccess[door.id] = {};
                        doorsAccess2[group.id].doorsAccess[door.id].name = door.name;
                        doorsAccess2[group.id].doorsAccess[door.id].description = door.description;
                        doorsAccess2[group.id].doorsAccess[door.id].status = {
                            lockState: door.status.lockState,
                            doorState: door.status.doorState
                        };
                        doorsAccess2[group.id].doorsAccess[door.id].setting = {
                            lockType: door.setting.lockType,
                            pinRequired: door.setting.pinRequired,
                            autoRelock: door.setting.autoRelock,
                            autoRelockTime: door.setting.autoRelockTime,
                            operatingMode: door.setting.operatingMode,
                            wrongCodeEntryLimit: door.setting.wrongCodeEntryLimit,
                            userCodeTemporaryDisableTime: door.setting.userCodeTemporaryDisableTime
                        };
                        doorsAccess2[group.id].doorsAccess[door.id].permission = {
                            doorUserId: doorUserKey,
                            user: doorUser.user.id,
                            viewLog: doorUser.permission.viewLog,
                            viewStatus: doorUser.permission.viewStatus,
                            remoteAccess: doorUser.permission.remoteAccess,
                            configuration: doorUser.permission.configuration,
                            policies: doorUser.permission.policies,
                            grant: doorUser.permission.grant
                        };
                        doorsAccess2[group.id].doorsAccess[door.id].deviceUpdatedAt = door.deviceUpdatedAt;
                        doorsAccess2[group.id].doorsAccess[door.id].createdAt = door.createdAt;
                        doorsAccess2[group.id].doorsAccess[door.id].updatedAt = door.updatedAt;
                    }
                });
            });
        });

        // convert doorsAccess2 to array
        var doorsAccess2Arr = [];
        var numberOfGroups = 0;
        var numberOfDoors = 0;

        angular.forEach(doorsAccess2, function(value, key){
            var group = angular.copy(value);
            var doorsInGroup = group.doorsAccess;
            group.id = key;

            group.doorsAccess = [];
            var doorsEachGroup = 0;

            angular.forEach(doorsInGroup, function(door, key){
                var tmp = angular.copy(door);
                tmp.id = key;
                group.doorsAccess.push(tmp);

                doorsEachGroup++;
            });
            group.numberOfDoors = doorsEachGroup;
            numberOfGroups++;

            group.doorsEachGroup = doorsEachGroup;
            numberOfDoors = numberOfDoors + doorsEachGroup;

            doorsAccess2Arr.push(group);
        });
        doorsAccess2Arr.numberOfGroups = numberOfGroups;
        doorsAccess2Arr.numberOfDoors = numberOfDoors;


        if(data === 'object'){
            return doorsAccess2;
        }
        else if (data === 'array') {
            return doorsAccess2Arr;
        }
        else if (data === 'count') {
            return numberOfDoors;

        }else if (data === 'doors') {
            return doorsObj;
        }
    };
});