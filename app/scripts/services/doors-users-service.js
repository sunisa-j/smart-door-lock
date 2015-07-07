'use strict';

window.app.factory('doorsUsers', function (users) {

    var doorsUsers = [
        {
            id: 'doorUser1',
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

        angular.forEach(doorsUsers, function(value){
            if(value.door == doorId) {
                doorUsersObj[value.id] = {};
                doorUsersObj[value.id].door = value.door;
                doorUsersObj[value.id].user = {
                    id: value.user,
                    employeeNumber: usersData[value.user].employeeNumber,
                    firstName: usersData[value.user].firstName,
                    lastName: usersData[value.user].lastName
                };
                doorUsersObj[value.id].permission = {
                    viewLog: value.viewLog,
                    viewStatus: value.viewStatus,
                    remoteAccess: value.remoteAccess,
                    configuration: value.configuration,
                    policies: value.policies,
                    grant: value.grant
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

        if(data == 'object') {
            return doorUsersObj;
        }
        else if(data == 'array') {
            return doorUsersArr;
        }
    };

});