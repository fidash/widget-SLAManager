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
    var BASE_URL = "http://private-anon-c19d8c469-slamanagercore.apiary-mock.com";

    /******************************************************************/
    /*                      C O N S T R U C T O R                     */
    /******************************************************************/

    var SLAManager = function SLAManager() {
        this.init = init;
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

        if (error.message in ERRORS) {
            Utils.createAlert('danger', 'Error', ERRORS[error.message], error);
        }
        else {
            Utils.createAlert('danger', error.message, error.body);
        }

        console.log('Error: ' + JSON.stringify(error));
    }

    function getAgreements(autoRefresh) {

        makeRequest(BASE_URL + "/agreements", "GET",
            function (response) {
                UI.displayData(getStatus, getAgreements, autoRefresh, JSON.parse(response.responseText));
            }, onError);
    }

    function getStatus (id, success) {
        makeRequest(BASE_URL + "/agreements/" + id + "/guaranteestatus", "GET", success);
    }

    function createAgreement () {
        var form = $('#create_agreement_form');
        var fields = readFormFields(form);
        console.dir(fields);

        //TODO: End create POST
        makeRequest(BASE_URL + '/agreements', 'POST',
            function () {
                getAgreements();
            }, onError, fields);
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

    return SLAManager;
})();
