'use strict';

window.app.factory('notifications', function () {

    var notifications = [
        {
            id: 1,
            action: 'removed',
            door : {
                id: 100,
                name: 'R101'
            },
            handler: {
                id: 1,
                name: 'Wimon Khamchan'
            },
            status: 'unread',
            createdAt: '2015-02-27T12:31:45.000Z',
            updatedAt: '2015-02-27T12:31:45.000Z'
        },
        {
            id: 2,
            action: 'added',
            door : {
                id: 101,
                name: 'WSN'
            },
            handler: {
                id: 2,
                name: 'Prof. Wannarat Santiamorntat'
            },
            status: 'unread',
            createdAt: '2015-03-27T12:31:45.000Z',
            updatedAt: '2015-03-27T12:31:45.000Z'
        }
    ];

    // transform calendars to obj
    var notificationsObj = {};
    angular.forEach(notifications, function(value){
        notificationsObj[value.id] = {};
        notificationsObj[value.id].action = value.action;
        notificationsObj[value.id].door = {
            id: value.door.id,
            name: value.door.name
        };
        notificationsObj[value.id].handler = {
            id: value.handler.id,
            name: value.handler.name
        };
        notificationsObj[value.id].status = value.status;
        notificationsObj[value.id].createdAt = value.createdAt;
        notificationsObj[value.id].updatedAt = value.updatedAt;
    });

    return function(data){
        if(data === 'object'){
            return notificationsObj;
        }
        else if (data === 'array') {
            return notifications;
        }
    };
});