'use strict';

window.app.factory('calendarEvents', function (doorsUsers, userAccessPolicies) {

    var calendarEvents = [
        {
            id: 'calendarEvents1',
            calendar: 'calendar1',
            status: 'confirmed',
            name: 'Technician Meeting',
            description: 'Every month on 2nd Monday until December 31, 2016',
            startDate: '2015-07-17T09:00:00.000Z',
            endDate: '2015-07-17T11:00:00.000Z',
            rRule: {
                frequency: 'MONTHLY',
                interval: 1,
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
            name: 'Electrical Maintenance',
            description: 'Electric Maintenance',
            startDate: '2015-07-30T13:30:00.000Z',
            endDate: '2015-07-30T16:30:00.000Z',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents3',
            calendar: 'calendar2',
            status: 'confirmed',
            name: 'Meeting',
            description: 'Electric Maintenance',
            startDate: '2015-08-01T09:00:00.000Z',
            endDate: '2015-08-01T16:30:00.000Z',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents4',
            calendar: 'calendar3',
            status: 'confirmed',
            name: 'Teaching',
            description: 'Electric Maintenance',
            startDate: '2015-08-01T10:00:00.000Z',
            endDate: '2015-08-01T16:30:00.000Z',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents5',
            calendar: 'calendar4',
            status: 'confirmed',
            name: 'Cleaning',
            description: 'Electric Maintenance',
            startDate: '2015-08-01T13:30:00.000Z',
            endDate: '2015-08-01T16:30:00.000Z',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents6',
            calendar: 'calendar5',
            status: 'confirmed',
            name: 'Maintenance',
            description: 'Electric Maintenance',
            startDate: '2015-07-30T13:00:00.000Z',
            endDate: '2015-07-30T16:00:00.000Z',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents7',
            calendar: 'calendar1',
            status: 'confirmed',
            name: 'Cleaning',
            description: 'Cleaning room',
            startDate: '2015-08-10T10:30:00.000Z',
            endDate: '2015-08-10T12:30:00.000Z',
            createdAt: '2015-03-14T12:31:45.000Z',
            updatedAt: '2015-03-14T12:31:45.000Z'
        },
        {
            id: 'calendarEvents8',
            calendar: 'calendar7',
            status: 'confirmed',
            name: 'Big Cleaning',
            description: 'COE Big Cleaning',
            startDate: '2015-08-20T08:30:00.000Z',
            endDate: '2015-08-20T16:30:00.000Z',
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

    return function(userId, doorId, calendarId, data){

        // group events by calender selected
        var calendarSelectedEvents = [];

        if(calendarId != '') {
            angular.forEach(calendarEvents, function(value){
                if(value.calendar == calendarId){
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

        if(data === 'object'){
            return calendarEventsObj;
        }
        else if (data === 'array') {
            return calendarEvents;
        }
        else if (data === 'calendarEvents') {
            return calendarSelectedEvents;
        }
        else if (data === 'doorUserEvents'){

            if(userId != '' && doorId != '') {
                // group events by door and user selected (in calendars this user is 'owner')
                var doorUserEvents = [];
                var doorUsersData = doorsUsers(doorId, 'array');
                var doorUserId = '';
                angular.forEach(doorUsersData, function(doorUsers){
                    if(doorUsers.user.id == userId){
                        doorUserId = doorUsers.id;
                    }
                });

                // get Calendars is userId's owner of doorId
                var userAccessPoliciesData = userAccessPolicies(doorUserId, 'object');

                // get events of calendars got (from userCalendarsData)
                angular.forEach(userAccessPoliciesData, function(userAccessPolicy){
                    angular.forEach(calendarEvents, function(event){

                        if(userAccessPolicy.calendar.id == event.calendar){
                            var tmp = angular.copy(event);
                            tmp.title = event.name;
                            tmp.start = event.startDate;
                            doorUserEvents.push(tmp);
                        }
                    });
                });

            }else{
                console.log('userId or doorId is undefined');
            }

            return doorUserEvents;
        }
    };
});