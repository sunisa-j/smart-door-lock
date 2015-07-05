'use strict';

window.app.factory('calendars', function () {

    var calendars = {
        'calendar1': {
            public: false,
            name: 'Working Time',
            description: 'My Working Access Time'
        },
        'calendar2': {
            public: true,
            name: 'Holiday Time',
            description: 'COE Holiday Time'
        },
        'calendar3': {
            public: true,
            name: 'Meeting Time',
            description: 'My Working Access Time'
        },
        'calendar4': {
            public: false,
            name: 'My Holiday Time',
            description: 'Private Holiday Time'
        },
        'calendar5': {
            public: false,
            name: 'My Meeting Time',
            description: 'Private Meeting Time'
        }
    };

    return calendars;
});