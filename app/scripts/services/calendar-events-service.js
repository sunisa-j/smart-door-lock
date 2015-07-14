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
            id: 'calendarEvents2',
            calendar: 'calendar1',
            status: 'confirmed',
            name: 'Maintenance',
            description: '',
            startDate: '2015-07-01T13:30:00Z',
            endDate: '2015-07-01T16:30:00',
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
        if(!event.rRule){
            calendarEventsObj[event.id].rRule = {
                frequency: event.rRule.frequency,
                dateStart: event.rRule.dateStart,
                until: event.rRule.until,
                byWeekDay: event.rRule.byWeekDay,
                bySetPos: event.rRule.bySetPos
            };
        }
    });

    return function(data){

        if(data === 'object'){
            return calendarEventsObj;
        }
        else if (data === 'array') {
            return calendarEvents;
        }
    };
});