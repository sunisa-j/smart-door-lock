'use strict';

window.app.factory('activityLogs', function () {

    var activityLogs = [
        {
            id: 'activityLog1',
            operation: 'AutoReleasePolicies.create',
            user: 1,
            userString: 'สุนิสา จุลรัตน์',
            message: 'Successfully created using normal calendar "Working 1/2015" and door "R101".',
            context: {
                params: {
                    door: 'door1',
                    calendar: 'calendar1',
                    type: 'normal'
                },
                response: {
                    status: 201,
                    id: '3ba9f80d-a78c-47db-996b-a6d4da528449'
                }
            },
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'activityLog2',
            operation: 'AutoReleasePolicies.create',
            user: 1,
            userString: 'สุนิสา จุลรัตน์',
            message: 'Successfully created using normal calendar "Meeting 1/2015" and door "R101".',
            context: {
                params: {
                    door: 'door1',
                    calendar: 'calendar5',
                    type: 'normal'
                },
                response: {
                    status: 201,
                    id: '3ba9f80d-a78c-47db-996b-a6d4da528449'
                }
            },
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        }
    ];

    // transform calendars to obj
    var activityLogsObj = {};
    angular.forEach(activityLogs, function(value){
        activityLogsObj[value.id] = {};
        activityLogsObj[value.id].operation = value.operation;
        activityLogsObj[value.id].user = value.user;
        activityLogsObj[value.id].userString = value.userString;
        activityLogsObj[value.id].message = value.message;
        activityLogsObj[value.id].context = {
            params: {
                door: value.context.params.door,
                calendar: value.context.params.calendar,
                type: value.context.params.type
            },
            response: {
                status: value.context.response.status,
                id: value.context.response.id
            }
        };
        activityLogsObj[value.id].createdAt = value.createdAt;
        activityLogsObj[value.id].updatedAt = value.updatedAt;
    });

    return function(data, msg, startDate, endDate){

        if(data === 'object'){
            return activityLogsObj;
        }
        else if (data === 'array') {
            return activityLogs;
        }
        else if (data === 'search'){

            // send msg, startDate, endDate to server
            // if success, return data

            return activityLogs;
        }
    };
});