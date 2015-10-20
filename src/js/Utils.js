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

    function formatCondition (rawCondition) {
        
        var formattedCondition = JSON.parse(rawCondition).constraint;
        
        for (var comparator in COMPARATORS) {
             formattedCondition = formattedCondition.replace(comparator, COMPARATORS[comparator]);
        }

        if (formattedCondition.indexOf("perc") > -1) {
            formattedCondition += "%";
        }

        return formattedCondition;
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

    function getDisplayableConditions (conditions) {
        
        var conditionsString = "";
        var formattedCondition;

        conditions.forEach(function (condition) {
            formattedCondition = formatCondition(condition.serviceLevelObjetive.kpitarget.customServiceLevel);
            conditionsString += formattedCondition + "<br/>";
        });

        return conditionsString;
    }

    function formatDate (dateString) {
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