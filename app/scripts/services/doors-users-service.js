'use strict';

window.app.factory('doorsUsers', function (users) {

    var doorsUsers = [
        {
            id: 'doorUser11',
            door: 'door1',
            user: 1,
            permission: {
                viewLog: true,
                viewStatus: true,
                remoteAccess: true,
                configuration: true,
                policies: true,
                grant: true
            },
            createdBy: 1,
            createdAt: "2015-06-18T08:47:09.000Z",
            updatedBy: 1,
            updatedAt: "2015-06-18T08:47:09.000Z"
        },
        {
            id: 'doorUser12',
            door: 'door2',
            user: 1,
            permission: {
                viewLog: true,
                viewStatus: true,
                remoteAccess: true,
                configuration: true,
                policies: true,
                grant: true
            },
            createdBy: 1,
            createdAt: "2015-06-18T08:47:09.000Z",
            updatedBy: 1,
            updatedAt: "2015-06-18T08:47:09.000Z"
        },
        {
            id: 'doorUser13',
            door: 'door3',
            user: 1,
            permission: {
                viewLog: true,
                viewStatus: true,
                remoteAccess: true,
                configuration: true,
                policies: true,
                grant: true
            },
            createdBy: 1,
            createdAt: "2015-06-18T08:47:09.000Z",
            updatedBy: 1,
            updatedAt: "2015-06-18T08:47:09.000Z"
        },
        {
            id: 'doorUser14',
            door: 'door4',
            user: 1,
            permission: {
                viewLog: true,
                viewStatus: true,
                remoteAccess: true,
                configuration: true,
                policies: true,
                grant: true
            },
            createdBy: 1,
            createdAt: "2015-06-18T08:47:09.000Z",
            updatedBy: 1,
            updatedAt: "2015-06-18T08:47:09.000Z"
        },
        {
            id: 'doorUser15',
            door: 'door5',
            user: 1,
            permission: {
                viewLog: true,
                viewStatus: true,
                remoteAccess: true,
                configuration: true,
                policies: true,
                grant: true
            },
            createdBy: 1,
            createdAt: "2015-06-18T08:47:09.000Z",
            updatedBy: 1,
            updatedAt: "2015-06-18T08:47:09.000Z"
        },
        {
            id: 'doorUser16',
            door: 'door6',
            user: 1,
            permission: {
                viewLog: true,
                viewStatus: true,
                remoteAccess: true,
                configuration: true,
                policies: true,
                grant: true
            },
            createdBy: 1,
            createdAt: "2015-06-18T08:47:09.000Z",
            updatedBy: 1,
            updatedAt: "2015-06-18T08:47:09.000Z"
        },
        {
            id: 'doorUser17',
            door: 'door7',
            user: 1,
            permission: {
                viewLog: true,
                viewStatus: true,
                remoteAccess: true,
                configuration: true,
                policies: true,
                grant: true
            },
            createdBy: 1,
            createdAt: "2015-06-18T08:47:09.000Z",
            updatedBy: 1,
            updatedAt: "2015-06-18T08:47:09.000Z"
        },
        {
            id: 'doorUser2',
            door: 'door1',
            user: 2,
            permission: {
                viewLog: true,
                viewStatus: true,
                remoteAccess: true,
                configuration: true,
                policies: true,
                grant: true
            },
            createdBy: 1,
            createdAt: "2015-06-18T08:47:09.000Z",
            updatedBy: 1,
            updatedAt: "2015-06-18T08:47:09.000Z"
        },
        {
            id: 'doorUser22',
            door: 'door2',
            user: 2,
            permission: {
                viewLog: true,
                viewStatus: true,
                remoteAccess: true,
                configuration: true,
                policies: true,
                grant: true
            },
            createdBy: 2,
            createdAt: "2015-06-18T08:47:09.000Z",
            updatedBy: 2,
            updatedAt: "2015-06-18T08:47:09.000Z"
        },
        {
            id: 'doorUser3',
            door: 'door2',
            user: 3,
            permission: {
                viewLog: true,
                viewStatus: true,
                remoteAccess: true,
                configuration: true,
                policies: true,
                grant: true
            },
            createdBy: 3,
            createdAt: "2015-06-18T08:47:09.000Z",
            updatedBy: 3,
            updatedAt: "2015-06-18T08:47:09.000Z"
        }
    ];

    var usersData = users('object');

    return function(doorId, data){

        var doorUsersObj = {};
        var doorUsersArr = [];

        if(doorId == '') {
            angular.forEach(doorsUsers, function(value){

                doorUsersObj[value.id] = {};
                doorUsersObj[value.id].id = value.id;
                doorUsersObj[value.id].door = value.door;
                doorUsersObj[value.id].user = {
                    id: value.user,
                    employeeNumber: usersData[value.user].employeeNumber,
                    firstName: usersData[value.user].firstName,
                    lastName: usersData[value.user].lastName
                };
                doorUsersObj[value.id].permission = {
                    viewLog: value.permission.viewLog,
                    viewStatus: value.permission.viewStatus,
                    remoteAccess: value.permission.remoteAccess,
                    configuration: value.permission.configuration,
                    policies: value.permission.policies,
                    grant: value.permission.grant
                };
                doorUsersObj[value.id].createdBy = value.createdBy;
                doorUsersObj[value.id].createdAt = value.createdAt;
                doorUsersObj[value.id].updatedBy = value.updatedBy;
                doorUsersObj[value.id].updatedAt = value.updatedAt;

                // push in doorsUserArr
                var objTemp = angular.copy(value);
                objTemp.user = {
                    id: value.user,
                    employeeNumber: usersData[value.user].employeeNumber,
                    firstName: usersData[value.user].firstName,
                    lastName: usersData[value.user].lastName
                };
                doorUsersArr.push(objTemp);

            });
        }else {
            angular.forEach(doorsUsers, function (value) {
                if (value.door == doorId) {
                    doorUsersObj[value.id] = {};
                    doorUsersObj[value.id].id = value.id;
                    doorUsersObj[value.id].door = value.door;
                    doorUsersObj[value.id].user = {
                        id: value.user,
                        employeeNumber: usersData[value.user].employeeNumber,
                        firstName: usersData[value.user].firstName,
                        lastName: usersData[value.user].lastName
                    };
                    doorUsersObj[value.id].permission = {
                        viewLog: value.permission.viewLog,
                        viewStatus: value.permission.viewStatus,
                        remoteAccess: value.permission.remoteAccess,
                        configuration: value.permission.configuration,
                        policies: value.permission.policies,
                        grant: value.permission.grant
                    };
                    doorUsersObj[value.id].createdBy = value.createdBy;
                    doorUsersObj[value.id].createdAt = value.createdAt;
                    doorUsersObj[value.id].updatedBy = value.updatedBy;
                    doorUsersObj[value.id].updatedAt = value.updatedAt;

                    // push in doorsUserArr
                    var objTemp = angular.copy(value);
                    objTemp.user = {
                        id: value.user,
                        employeeNumber: usersData[value.user].employeeNumber,
                        firstName: usersData[value.user].firstName,
                        lastName: usersData[value.user].lastName
                    };
                    doorUsersArr.push(objTemp);
                }
            });
        }

        if(data === 'object') {
            return doorUsersObj;
        }
        else if(data === 'array') {
            return doorUsersArr;
        }
    };

});