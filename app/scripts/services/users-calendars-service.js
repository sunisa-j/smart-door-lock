'use strict';

window.app.factory('usersCalendars', function (calendars, passcodePolicies, autoReleasePolicies, userAccessPolicies) {

    var usersCalendars = {
        'userCalendar1': {
            user: 1,
            calendar: 'calendar1',
            accessRole: 'owner'
        },
        'userCalendar2': {
            user: 2,
            calendar: 'calendar1',
            accessRole: 'reader'
        },
        'userCalendar3': {
            user: 2,
            calendar: 'calendar2',
            accessRole: 'owner'
        },
        'userCalendar4': {
            user: 1,
            calendar: 'calendar2',
            accessRole: 'reader'
        },
        'userCalendar5': {
            user: 1,
            calendar: 'calendar3',
            accessRole: 'writer'
        },
        'userCalendar6': {
            user: 1,
            calendar: 'calendar4',
            accessRole: 'reader'
        },
        'userCalendar7': {
            user: 1,
            calendar: 'calendar5',
            accessRole: 'owner'
        }
    };

    var calendarsTmp = angular.copy(calendars);

    return function(userId, doorId, policiesType, passcodeId, doorUserId){

        // group by 'My Calendars' (accessRole: owner) and 'Other Calendars' (accessRole: reader or writer)
        var accessRoleArr = [];
        accessRoleArr[0] = []; // Store My Calendars
        accessRoleArr[1] = []; // Store Other Calendars

        var userCalendarsNotSelected = angular.copy(usersCalendars);

        // Passcode Policies -------------------------------------------------------------------------------------------
        if(policiesType == 'passcodePolicies') {

            var passcodePoliciesData = angular.copy(passcodePolicies(passcodeId, 'object', ''));

            angular.forEach(userCalendarsNotSelected, function(userCalendar, userCalendarId){

                if(userCalendar.user == userId) {
                    angular.forEach(passcodePoliciesData, function (passcodePolicy) {

                        if ((passcodePolicy.passcode == passcodeId) && (passcodePolicy.calendar.$id == userCalendar.calendar)) {
                            //console.log(userCalendar);
                            delete userCalendarsNotSelected[userCalendarId];
                        }
                    });
                }
            });
            //console.log(userCalendarsNotSelected);

        }

        // Auto Release Policies ---------------------------------------------------------------------------------------
        if(policiesType == 'autoReleasePolicies') {

            var autoReleasePoliciesData = autoReleasePolicies(doorId, 'object')

            angular.forEach(userCalendarsNotSelected, function(userCalendar, userCalendarId){

                if(userCalendar.user == userId) {
                    angular.forEach(autoReleasePoliciesData, function (autoReleasePolicy) {

                        if ((autoReleasePolicy.door == doorId) && (autoReleasePolicy.calendar.$id == userCalendar.calendar)) {
                            //console.log(userCalendar);
                            delete userCalendarsNotSelected[userCalendarId];
                        }
                    });
                }
            });
            //console.log(userCalendarsNotSelected);
        }

        // User Access Policies ----------------------------------------------------------------------------------------
        if(policiesType == 'userAccessPolicies') {

            var userAccessPoliciesData = userAccessPolicies(doorUserId, 'object')

            angular.forEach(userCalendarsNotSelected, function(userCalendar, userCalendarId){

                if(userCalendar.user == userId) {
                    angular.forEach(userAccessPoliciesData, function (userAccessPolicy) {

                        if ((userAccessPolicy.doorUser == doorUserId) && (userAccessPolicy.calendar.$id == userCalendar.calendar)) {
                            //console.log(userCalendar);
                            delete userCalendarsNotSelected[userCalendarId];
                        }
                    });
                }
            });
            //console.log(userCalendarsNotSelected);
        }

        // Group userCalendars data by accessRole ('owner' & 'not owner') ----------------------------------------------
        angular.forEach(userCalendarsNotSelected, function(value, key){
            var userCalendarTmp = angular.copy(value);

            if (userCalendarTmp.user == userId && userCalendarTmp.accessRole == 'owner') {
                var userCalendars = {};
                userCalendars.$id = key;
                userCalendars.accessRole = userCalendarTmp.accessRole;
                userCalendars.calendar = {
                    $id: userCalendarTmp.calendar,
                    public: calendarsTmp[userCalendarTmp.calendar].public,
                    name: calendarsTmp[userCalendarTmp.calendar].name,
                    description: calendarsTmp[userCalendarTmp.calendar].description
                };
                accessRoleArr[0].push(userCalendars) ;
            }
            else if (userCalendarTmp.user == userId && userCalendarTmp.accessRole != 'owner') {
                var userCalendars = {};
                userCalendars.$id = key;
                userCalendars.accessRole = userCalendarTmp.accessRole;
                userCalendars.calendar = {
                    $id: userCalendarTmp.calendar,
                    public: calendarsTmp[userCalendarTmp.calendar].public,
                    name: calendarsTmp[userCalendarTmp.calendar].name,
                    description: calendarsTmp[userCalendarTmp.calendar].description
                };
                accessRoleArr[1].push(userCalendars) ;
            }
        });

        return accessRoleArr;


    };
});