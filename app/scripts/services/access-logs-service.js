'use strict';

window.app.factory('accessLogs', function () {

    var accessLogs = [
        {
            id: 'accessLog1',
            type: 'doorMode',
            door: 'door1',
            doorString: 'R101',
            user: 1,
            userString: 'สุนิสา จุลรัตน์',
            message: 'Successfully configuration',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'accessLog2',
            type: 'doorStatus',
            door: 'door1',
            doorString: 'R101',
            user: 1,
            userString: 'สุนิสา จุลรัตน์',
            message: 'Door opened',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'accessLog3',
            type: 'lockStatus',
            door: 'door1',
            doorString: 'R101',
            user: 1,
            userString: 'สุนิสา จุลรัตน์',
            message: 'Successfully locked',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'accessLog4',
            type: 'cardAuth',
            door: 'door1',
            doorString: 'R101',
            user: 1,
            userString: 'สุนิสา จุลรัตน์',
            message: 'Successfully authenticated',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'accessLog5',
            type: 'nfcAuth',
            door: 'door1',
            doorString: 'R101',
            user: 1,
            userString: 'สุนิสา จุลรัตน์',
            message: 'Successfully authenticated',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'accessLog6',
            type: 'passcodeAuth',
            door: 'door1',
            doorString: 'R101',
            user: 1,
            userString: 'สุนิสา จุลรัตน์',
            message: 'Successfully authenticated',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'accessLog7',
            type: 'remote',
            door: 'door1',
            doorString: 'R101',
            user: 1,
            userString: 'สุนิสา จุลรัตน์',
            message: 'Successfully remote access',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        }
    ];

    // transform calendars to obj
    var accessLogsObj = {};
    angular.forEach(accessLogs, function(value){
        accessLogsObj[value.id] = {};
        accessLogsObj[value.id].type = value.type;
        accessLogsObj[value.id].door = value.door;
        accessLogsObj[value.id].doorString = value.doorString;
        accessLogsObj[value.id].user = value.user;
        accessLogsObj[value.id].userString = value.userString;
        accessLogsObj[value.id].message = value.message;
        accessLogsObj[value.id].createdAt = value.createdAt;
        accessLogsObj[value.id].updatedAt = value.updatedAt;
    });

    return function(data){

        if(data === 'object'){
            return accessLogsObj;
        }
        else if (data === 'array') {
            return accessLogs;
        }
    };
});