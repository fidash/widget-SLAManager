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

(function () {

    "use strict";

    /******************************************************************************/
    /********************************* PUBLIC *************************************/
    /******************************************************************************/

    // Constructor
    var SLAManager = function SLAManager() {
        this.statusSelect = null;
        this.agreementsData = null;
        this.templatesData = null;
        this.incompleted = 0;
        this.datatable = {};
    };

    SLAManager.prototype.init = function init() {
        // Preferences:
        setPreferences.call(this);

        // Context:
        //setResizeWidget.call(this);
        requestAgreements.call(this);
        setCreateCallback.call(this);
    };

    /******************************************************************************/
    /******************************** PRIVATE *************************************/
    /******************************************************************************/

    var setPreferences = function setPreferences() {
        this.serverUrl = MashupPlatform.prefs.get("serverUrl");
        this.user = MashupPlatform.prefs.get("user");
        this.password = MashupPlatform.prefs.get("password");
        this.statusFilter = MashupPlatform.prefs.get("statusFilter");
        this.providerFilter = MashupPlatform.prefs.get("providerFilter");
        MashupPlatform.prefs.registerCallback(handlerPreferences.bind(this));
    };

    var makeRequest = function makeRequest(url, method, onSuccess, onFailure) {
        var baseURL = this.serverUrl;
        if (baseURL[baseURL.length - 1] !== "/") {
            baseURL += "/";
        }
        baseURL += url;

        MashupPlatform.http.makeRequest(baseURL, {
            method: method,
            requestHeaders: {
                user: this.user,
                password: this.password,
                Accept: "application/json"
            },
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    };

    var requestAgreements = function requestAgreements() {

        makeRequest.call(this, "agreements", "GET",
            function (response) {
                setAgreements.call(this, JSON.parse(response.response));
                requestTemplates.call(this);
            }.bind(this),

            function () {
                console.log("Error retrieving the agreements data");
            }
        );
    };



    var requestTemplates = function requestTemplates() {

        makeRequest.call(this, "templates", "GET",
            function (response) {
                setTemplates.call(this, JSON.parse(response.response));
                requestStatus.call(this);
            }.bind(this),
            function () {
                console.log("Error retrieving the templates data");
            }
        );
    };

    var requestStatus = function requestStatus() {

        var onSuccess = function (response) {
            var id = response.request.url.split("/")[7];
            var resp = JSON.parse(response.response);
            this.agreementsData[id].status = {
                guaranteestatus: resp.guaranteestatus,
                guaranteeterms: resp.guaranteeterms
            };

            this.incompleted--;

            if (!this.incompleted) {
                displayData.call(this, this.agreementsData);
            }
        }.bind(this);

        var onFailure = function (response) {
            this.agreementsData[id].status = "-";
            console.log("Error retrieving the status data");
            this.incompleted--;

            if (!this.incompleted) {
                displayData.call(this, this.agreementsData);
            }
        }.bind(this);

        for (var id in this.agreementsData) {
            makeRequest.call(this, "agreements/" + id + "/guaranteestatus", "GET", onSuccess, onFailure);
        }
    };

    var displayData = function displayData(data) {

        var callbacks = {
            remove: function (id, row) {
                deleteAgreement.call(this, id, row);
            }.bind(this),
            refresh: function () {
                requestAgreements.call(this);
            }.bind(this)
        };

        var newData = transformData.call(this, data);
        UI.setCallbacks(callbacks);
        UI.displayData(newData);
    };

    var deleteAgreement = function (id, row) {
        makeRequest.call(this, "agreements/" + id, "DELETE",
            function () {//onSuccess
                console.log("Deleted agreement " + id);
                UI.removeRow(row);
            },
            function () {//onFailure
                console.log("Error: Could not delete agreement " + id);
            });
    };

    var transformData = function transformData(data) {
        var transformedData = [];
        var regexProvider = new RegExp(this.providerFilter, 'i');
        var regexStatus = (this.statusFilter == 'all') ? new RegExp("", 'i') : new RegExp(this.statusFilter, 'i');

        for (var i in data) {
            var status = data[i].status.guaranteestatus;
            var provider = data[i].context.serviceProvider;

            if (regexProvider.test(provider.replace(/ /g, '')) && regexStatus.test(status)) {//TODO add providerFilter
                var row = [];
                var deleteButton = UI.createDeleteButton();
                row.push(i); //ID: Necessary for the delete button
                row.push(status); //Status
                row.push(deleteButton); //TODO: Add delete button
                row.push(data[i].name);//Agreement name

                //Real code
                //row.push(this.templatesData[data[i].context.templateId]);//Template Name

                //Code for displaying something with the mocked data, since the only
                //existing template is not the one being used by the agreements.
                row.push(this.templatesData[Object.keys(this.templatesData)[0]]);

                row.push(provider);//Provider
                row.push(data[i].context.service);//Service

                transformedData.push(row);
            }
        }

        return transformedData;
    };

    var setAgreements = function setAgreements(response) {
        this.agreementsData = {};
        this.incompleted = response.length;

        for (var i in response) {
            this.agreementsData[response[i].agreementId] = {
                context: response[i].context,
                name: response[i].name,
                terms: response[i].terms
            };
        }
    };

    var setTemplates = function setTemplates(response) {
        this.templatesData = {};

        for (var i in response) {
            this.templatesData[response[i].templateId] = response[i].name; //The only thing we need is the names
        }
    };

    var createAgreement = function createAgreement () {
        var form = $('#create_agreement_form');
        var fields = readFormFields(form);
        console.dir(fields);
    };

    var readFormFields = function readFormFields (form) {

        var fields = {};

        $.each(form.serializeArray(), function (i, field) {
            if (field.value !== "") {
                fields[field.name] = field.value;
            }
        });

        return fields;
    };

    var setCreateCallback = function setCreateCallback () {
        $('#create-agreement').on('click', function () {
            createAgreement.call(this);
        }.bind(this));
    };

    /******************************** HANDLERS ************************************/

    // Preferences
    var handlerPreferences = function handlerPreferences(preferences) {
        var needRequest = false;
        var needUpdate = false;

        if (preferences.serverUrl) {
            this.serverUrl = preferences.serverUrl;
            needRequest = true;
        }

        if (preferences.user) {
            this.user = preferences.user;
            needRequest = true;
        }

        if (preferences.password) {
            this.password = preferences.password;
            needRequest = true;
        }

        if (preferences.statusFilter) {
            this.statusFilter = preferences.statusFilter;
            needUpdate = true;
        }

        if (preferences.providerFilter != null) {
            this.providerFilter = preferences.providerFilter;
            needUpdate = true;
        }

        if (needRequest) {
            requestAgreements.call(this);
        }else if (needUpdate) {
            displayData.call(this, this.agreementsData);
        }
    };


    /******************************** HELP FUNC ************************************/


    window.SLAManager = SLAManager;

})();
