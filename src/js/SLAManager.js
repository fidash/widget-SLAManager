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

/* global Utils */
var SLAManager = (function () {

    "use strict";

    var ERRORS = {
        '500 Error': 'An error has occurred on the server side.',
        '503 Error': 'Cloud service is not available at the moment.',
        '422 Error': 'You are not authenticated in the wirecloud platform.'
    };
    //var BASE_URL = "http://130.206.113.159/sla-service";
    var BASE_URL = "http://private-anon-a77c63165-slamanagercore.apiary-mock.com";

    /******************************************************************/
    /*                      C O N S T R U C T O R                     */
    /******************************************************************/

    var SLAManager = function SLAManager() {
        this.init = init;
        this.getAgreements = getAgreements;
        this.getAgreementStatus = getAgreementStatus;
        this.createAgreement = createAgreement;
    };


    /******************************************************************/
    /*                P R I V A T E   F U N C T I O N S               */
    /******************************************************************/

    function makeRequest(url, method, onSuccess, onFailure, postBody) {
        var user = MashupPlatform.prefs.get("user");
        var password = MashupPlatform.prefs.get("password");
        var token = window.btoa(user + ":" + password);
        var options = {
            method: method,
            requestHeaders: {
                Authorization: "Basic " + token,
                Accept: "application/json",
                "Content-type": "application/json"
            },
            onSuccess: onSuccess,
            onFailure: onFailure
        };

        if (postBody) {
            options.postBody = postBody;
        }

        MashupPlatform.http.makeRequest(url, options);
    }

    function onError (error) {

        // Default values are assigned if the error doesn't have the field
        var title = error.message ? error.message : "Error";
        var body = error.message in ERRORS ? ERRORS[error.message] : (error.body ? error.body : "An error has occurred.");
        var details = Utils.isEmpty(error) ? null : error;

        Utils.createAlert('danger', title, body, details);

        console.log('Error: ' + JSON.stringify(error));
    }

    function readFormFields (form) {

        var fields = {};

        $.each(form.serializeArray(), function (i, field) {
            if (field.value !== "") {
                fields[field.name] = field.value;
            }
        });

        return fields;
    }


    /******************************************************************/
    /*                 P U B L I C   F U N C T I O N S                */
    /******************************************************************/

    function init () {
        UI.createTable(getAgreements, createAgreement);
        getAgreements(true);
    }

    function getAgreements(autoRefresh) {

        makeRequest(BASE_URL + "/agreements", "GET",
            function (response) {
                UI.displayData(getAgreementStatus, getAgreements, autoRefresh, JSON.parse(response.responseText));
            }, onError);
    }

    function getAgreementStatus (id, success) {
        makeRequest(BASE_URL + "/agreements/" + id + "/guaranteestatus", "GET", success, onError);
    }

    function createAgreement () {

        var form = $('#create_agreement_form');
        var fields = readFormFields(form);

        makeRequest(BASE_URL + '/agreements', 'POST', getAgreements.bind(null, false), onError, fields);
    }

    return SLAManager;
})();
