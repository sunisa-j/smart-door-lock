'use strict';

window.app.factory('calendarEvents', function () {

    var calendarEvents = [
        {
            id: 'calendarEvents1',
            calendar: 'calendar1',
            status: 'confirmed',
            name: 'Technician Meeting',
            description: 'Every month on 2nd Monday until December 31, 2016',
            startDate: '2015-01-01T09:00:00Z',
            endDate: '2015-01-01T11:00:00Z',
            rRule: {
                frequency: 'MONTHLY',
                dateStart: '2015-01-01',
                until: '2016-12-31',
                byWeekDay: [
                    'MO'
                ],
                bySetPos: [
                    2
                ]
            },
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents7',
            calendar: 'calendar1',
            status: 'confirmed',
            name: 'Cleaning',
            description: 'Cleaning room',
            startDate: '2015-07-14T10:30:00Z',
            endDate: '2015-07-14T12:30:00',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents2',
            calendar: 'calendar1',
            status: 'confirmed',
            name: 'Maintenance',
            description: 'Electric Maintenance',
            startDate: '2015-07-14T13:30:00Z',
            endDate: '2015-07-14T16:30:00',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents3',
            calendar: 'calendar2',
            status: 'confirmed',
            name: 'Maintenance',
            description: 'Electric Maintenance',
            startDate: '2015-08-01T13:30:00Z',
            endDate: '2015-08-01T16:30:00',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents4',
            calendar: 'calendar3',
            status: 'confirmed',
            name: 'Maintenance',
            description: 'Electric Maintenance',
            startDate: '2015-08-01T13:30:00Z',
            endDate: '2015-08-01T16:30:00',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents5',
            calendar: 'calendar4',
            status: 'confirmed',
            name: 'Maintenance',
            description: 'Electric Maintenance',
            startDate: '2015-08-01T13:30:00Z',
            endDate: '2015-08-01T16:30:00',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents6',
            calendar: 'calendar5',
            status: 'confirmed',
            name: 'Maintenance',
            description: 'Electric Maintenance',
            startDate: '2015-08-01T13:30:00Z',
            endDate: '2015-08-01T16:30:00',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        }
    ];

    // transform calendarEvents to obj
    var calendarEventsObj = {};
    angular.forEach(calendarEvents, function(event){
        calendarEventsObj[event.id] = {};
        calendarEventsObj[event.id].calendar = event.calendar;
        calendarEventsObj[event.id].status = event.status;
        calendarEventsObj[event.id].name = event.name;
        calendarEventsObj[event.id].description = event.description;
        calendarEventsObj[event.id].startDate = event.startDate;
        calendarEventsObj[event.id].endDate = event.endDate;
        if(event.rRule){
            calendarEventsObj[event.id].rRule = {
                frequency: event.rRule.frequency,
                dateStart: event.rRule.dateStart,
                until: event.rRule.until,
                byWeekDay: event.rRule.byWeekDay,
                bySetPos: event.rRule.bySetPos
            };
        }
    });

    return function(calendarId, data){

        if(calendarId != '') {
            var calendarSelectedEvents = [];
            angular.forEach(calendarEvents, function(value){
                if(value.calendar == calendarId){
                    var tmp = angular.copy(value);
                    calendarSelectedEvents.push(tmp);
                }
            });
        }

        if(data === 'object'){
            return calendarEventsObj;
        }
        else if (data === 'array') {
            return calendarEvents;
        }
        else if (data === 'calendarEvents') {
            return calendarSelectedEvents;
        }
    };
});