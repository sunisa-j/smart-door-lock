'use strict';

window.app.factory('calendarEvents', function (doorsUsers, userAccessPolicies) {

    var calendarEvents = [
        {
            id: 'calendarEvents1',
            calendar: 'calendar1',
            status: 'confirmed',
            name: 'Technician Meeting',
            description: 'Test Monthly',
            startDate: '2015-08-17T09:00:00.000Z',
            endDate: '2015-08-17T11:00:00.000Z',
            rRule: {
                frequency: 'MONTHLY',
                interval: 1,
                dateStart: '2015-08-17',
                count: 2,
                //until: '2015-12-31',
                byMonthDay: [1,31]
            },
            recurringEvent: 'recurringId1',
            createdAt: '2015-08-17T12:31:45.000Z',
            updatedAt: '2015-08-17T12:31:45.000Z'
        },
        {
            id: 'calendarEvents2',
            calendar: 'calendar1',
            status: 'confirmed',
            name: 'Electrical Maintenance',
            description: 'Electric Maintenance',
            startDate: '2015-07-30T13:30:00.000Z',
            endDate: '2015-07-30T16:30:00.000Z',
            rRule: {
                frequency: 'YEARLY',
                interval: 2,
                dateStart: '2015-07-30',
                until: '2015-12-31',
                byMonth: [1,4,7],
                //byWeekDay: [
                //    'MO','TU','WE','TH','FR'
                //],
                byWeekDay: [
                    'SA','SU'
                ],
                bySetPos: [
                    2
                ]
            },
            recurringEvent: 'recurringId2',
            createdAt: '2015-07-30T12:31:45.000Z',
            updatedAt: '2015-07-30T12:31:45.000Z'
        },
        {
            id: 'calendarEvents3',
            calendar: 'calendar2',
            status: 'confirmed',
            name: 'Meeting',
            description: 'Electric Maintenance',
            startDate: '2015-08-01T09:00:00.000Z',
            endDate: '2015-08-01T16:30:00.000Z',
            rRule: {
                frequency: 'MONTHLY',
                interval: 1,
                dateStart: '2015-08-01',
                until: '2015-12-31',
                byWeekDay: [
                    'MO'
                ],
                bySetPos: [
                    2
                ]
            },
            recurringEvent: 'recurringId3',
            createdAt: '2015-08-01T12:31:45.000Z',
            updatedAt: '2015-08-01T12:31:45.000Z'
        },
        {
            id: 'calendarEvents4',
            calendar: 'calendar3',
            status: 'confirmed',
            name: 'Teaching',
            description: 'Electric Maintenance',
            startDate: '2015-08-01T10:00:00.000Z',
            endDate: '2015-08-01T16:30:00.000Z',
            rRule: {
                frequency: 'WEEKLY',
                interval: 1,
                dateStart: '2015-08-01',
                until: '2015-12-31',
                byWeekDay: [
                    'TU', 'TH'
                ]
            },
            recurringEvent: 'recurringId4',
            createdAt: '2015-08-01T12:31:45.000Z',
            updatedAt: '2015-08-01T12:31:45.000Z'
        },
        {
            id: 'calendarEvents5',
            calendar: 'calendar4',
            status: 'confirmed',
            name: 'Cleaning',
            description: 'Electric Maintenance',
            startDate: '2015-08-01T13:30:00.000Z',
            endDate: '2015-08-01T16:30:00.000Z',
            rRule: {
                frequency: 'DAILY',
                interval: 2,
                dateStart: '2015-08-01',
                until: '2015-12-31'
            },
            recurringEvent: 'recurringId5',
            createdAt: '2015-08-01T13:30:00.000Z',
            updatedAt: '2015-08-01T13:30:00.000Z'
        },
        {
            id: 'calendarEvents6',
            calendar: 'calendar5',
            status: 'confirmed',
            name: 'Maintenance',
            description: 'Electric Maintenance',
            startDate: '2015-07-30T13:00:00.000Z',
            endDate: '2015-07-30T16:00:00.000Z',
            createdAt: '2015-07-30T13:00:00.000Z',
            updatedAt: '2015-07-30T13:00:00.000Z'
        },
        {
            id: 'calendarEvents7',
            calendar: 'calendar1',
            status: 'confirmed',
            name: 'Cleaning',
            description: 'Cleaning room',
            startDate: '2015-08-10T10:30:00.000Z',
            endDate: '2015-08-10T12:30:00.000Z',
            createdAt: '2015-03-14T10:30:00.000Z',
            updatedAt: '2015-03-14T10:30:00.000Z'
        },
        {
            id: 'calendarEvents8',
            calendar: 'calendar7',
            status: 'confirmed',
            name: 'Big Cleaning',
            description: 'COE Big Cleaning',
            startDate: '2015-08-20T08:30:00.000Z',
            endDate: '2015-08-20T16:30:00.000Z',
            createdAt: '2015-08-20T08:30:00.000Z',
            updatedAt: '2015-08-20T08:30:00.000Z'
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

        calendarEventsObj[event.id].start = event.startDate;
        calendarEventsObj[event.id].title = event.name;

        if(event.rRule){
            calendarEventsObj[event.id].rRule = event.rRule;
        }
    });

    return function(userId, doorId, calendarId, data){

        // group events by calender selected
        var calendarSelectedEvents = [];

        if(calendarId !== '') {
            angular.forEach(calendarEvents, function(value){
                if(value.calendar === calendarId){
                    var tmp = angular.copy(value);
                    tmp.title = value.name;
                    tmp.start = value.startDate;
                    calendarSelectedEvents.push(tmp);
                }
            });
        }else{
            angular.forEach(calendarEvents, function(value){
                var tmp = angular.copy(value);
                tmp.title = value.name;
                tmp.start = value.startDate;
                calendarSelectedEvents.push(tmp);
            });
        }

        if(data === 'object'){ // Events in each calendar (Object format)
            return calendarEventsObj;
        }
        else if (data === 'array') { // Events in each calendar (Array format)
            return calendarEvents;
        }
        else if (data === 'calendarEvents') { // Events in Selected Calendar
            return calendarSelectedEvents;
        }
        else if (data === 'doorUserEvents'){ // Events in any calendar association with doorId & userId

            if(userId !== '' && doorId !== '') {
                // group events by door and user selected (in calendars this user is 'owner')
                var doorUserEvents = [];
                var doorUsersData = doorsUsers(doorId, 'array');
                var doorUserId = '';
                angular.forEach(doorUsersData, function(doorUsers){
                    if(doorUsers.user.id === userId){
                        doorUserId = doorUsers.id;
                    }
                });

                // get Calendars is userId's owner of doorId
                var userAccessPoliciesData = userAccessPolicies(doorUserId, 'object');

                // get events of calendars got (from userCalendarsData)
                angular.forEach(userAccessPoliciesData, function(userAccessPolicy){
                    angular.forEach(calendarEvents, function(event){

                        if(userAccessPolicy.calendar.id === event.calendar){
                            var tmp = angular.copy(event);
                            tmp.title = event.name;
                            tmp.start = event.startDate;
                            doorUserEvents.push(tmp);
                        }
                    });
                });

                return doorUserEvents;

            }else{
                console.log('userId or doorId is undefined');
            }
        }
    };
});