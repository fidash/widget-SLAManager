/*
 * Copyright (c) 2012-2015 CoNWeT Lab., Universidad Politécnica de Madrid
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
var Utils = (function() {
	"use strict";

    var COMPARATORS = {
        "LT": "<",
        "GT": ">",
        "LE": "<=",
        "GE": ">="
    };


    /******************************************************************/
    /*                P R I V A T E   F U N C T I O N S               */
    /******************************************************************/

    function formatCondition (rawCondition, status) {
        
        var formattedCondition = JSON.parse(rawCondition).constraint;
        
        for (var comparator in COMPARATORS) {
             formattedCondition = formattedCondition.replace(comparator, COMPARATORS[comparator]);
        }

        if (formattedCondition.indexOf("perc") > -1) {
            formattedCondition += "%";
        }

        return '<div class="' + status.toLowerCase() + '">' + formattedCondition + "</div>";
    }

    function findStatus (name, statusList) {
        for (var status in statusList) {
            if (name === statusList[status].name) {
                return statusList[status].status;
            }
        }
    }


    /******************************************************************/
    /*                 P U B L I C   F U N C T I O N S                */
    /******************************************************************/

	function createAlert (type, title, message, details) {

        // TODO buffer and show them on a list instead of removing them
        // Hide previous alerts
        $('.alert').hide();
 
        var alert = $('<div>')
            .addClass('alert alert-dismissible alert-' + type + ' fade in')
            .attr('role', 'alert')
            .html('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>');

        // Title
        $('<strong>')
            .text(title + ' ')
            .appendTo(alert);

        // Message
        $('<span>')
            .text(message  + ' ')
            .appendTo(alert);

        if (details) {
            // Details
            var detailsMessage = $('<div>')
                .appendTo(alert)
                .hide();
            for (var detail in details) {
                detailsMessage.text(detailsMessage.text() + details[detail] + ' ');
            }

            // Toggle details
            $('<a>')
                .text('Details')
                .click(function () {
                    detailsMessage.toggle('fast');
                })
                .insertBefore(detailsMessage);
        }

        $('body').append(alert);

    }

    function getDisplayableConditions (conditions, statusList) {
        
        var conditionsString = "";
        var formattedCondition;
        var status;

        conditions.forEach(function (condition) {
            status = findStatus(condition.name, statusList);
            formattedCondition = formatCondition(condition.serviceLevelObjetive.kpitarget.customServiceLevel, status);
            conditionsString += formattedCondition;
        });

        return conditionsString;
    }

    function formatDate (dateString) {

        // Remove extra "CET" that makes the date string invalid
        dateString = dateString.replace("CET", "");
        
        var date = new Date(dateString);
        return date.toUTCString();
    }

    return {
    	createAlert: createAlert,
        getDisplayableConditions: getDisplayableConditions,
        formatDate: formatDate
    };
})();