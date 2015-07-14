'use strict';

window.app.factory('calendars', function () {

    var calendars = [
        {
            id: 'calendar1',
            public: false,
            name: 'Working Time',
            description: 'My Working Access Time',
            createdAt: '2015-02-27T12:31:45.000Z',
            updatedAt: '2015-02-27T12:31:45.000Z'
        },
        {
            id: 'calendar2',
            public: true,
            name: 'Holiday Time',
            description: 'COE Holiday Time',
            createdAt: '2015-02-27T12:31:45.000Z',
            updatedAt: '2015-02-27T12:31:45.000Z'
        },
        {
            id: 'calendar3',
            public: true,
            name: 'Meeting Time',
            description: 'My Working Access Time',
            createdAt: '2015-02-27T12:31:45.000Z',
            updatedAt: '2015-02-27T12:31:45.000Z'
        },
        {
            id: 'calendar4',
            public: false,
            name: 'My Holiday Time',
            description: 'Private Holiday Time',
            createdAt: '2015-02-27T12:31:45.000Z',
            updatedAt: '2015-02-27T12:31:45.000Z'
        },
        {
            id: 'calendar5',
            public: false,
            name: 'My Meeting Time',
            description: 'Private Meeting Time',
            createdAt: '2015-02-27T12:31:45.000Z',
            updatedAt: '2015-02-27T12:31:45.000Z'
        }
    ];

    // transform calendars to obj
    var calendarsObj = {};
    angular.forEach(calendars, function(calendar){
        calendarsObj[calendar.id] = {};
        calendarsObj[calendar.id].public = calendar.public;
        calendarsObj[calendar.id].name = calendar.name;
        calendarsObj[calendar.id].description = calendar.description;
    });

    return calendarsObj;
});