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
        this.agreementsTable = document.getElementById("agreements_table");
        this.incompleted = 0;
    };

    SLAManager.prototype.init = function init() {
        // Preferences:
        //setPreferences.call(this);
        // Wiring:
        //setWiringInputs.call(this);
        // Context:
        //setResizeWidget.call(this);
        // User Interface:
        //buildDOM.call(this);
        requestAgreements.call(this);
    };

    /******************************************************************************/
    /******************************** PRIVATE *************************************/
    /******************************************************************************/
    /*var buildDOM = function buildDOM() {
        /*this.status_select = new StyledElements.StyledSelect({'class': 'full'});
        this.status_select.addEventListener('change', create_graph_config.bind(this));

        statuses = [
            {label: "All", value: "all"}
        }
        this.status_select.addEntries(statuses);*/
    //};

    var makeRequest = function makeRequest(url, method, onSuccess, onFailure) {
        var baseURL = MashupPlatform.prefs.get("server_url");
        if (baseURL[baseURL.length - 1] !== "/") {
            baseURL += "/";
        }
        baseURL += url;

        MashupPlatform.http.makeRequest(baseURL, {
            method: method,
            requestHeaders: {
                user: MashupPlatform.prefs.get("user"),
                password: MashupPlatform.prefs.get("password"),
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

    /*  agreementId: "87726a36-e570-4482-b3cc-1cb3d8998bb8"
        context: Object
            agreementInitiator: "user1@serviceuser.com"
            agreementResponder: "Provider1"
            expirationTime: "0024-03-07T11:08:24CET"
            service: "Service1"
            serviceProvider: "AgreementResponder"
            templateId: "e7efbfc1-3039-44c1-82d5-3d0e04cf2368"
    */

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

    /*
        context: Object
            agreementInitiator: "Provider1"
            agreementResponder: null
            expirationTime: "0037-01-04T15:08:15CET"
            service: "Service1"
            serviceProvider: "AgreementInitiator"
            templateId: null
        name: "Template1"
        templateId: "casdasd
    */
    var setTemplates = function setTemplates(response) {
        this.templatesData = {};

        for (var i in response) {
            this.templatesData[response[i].templateId] = response[i].name; //The only thing we need is the names
        }
    };

    var displayData = function displayData(data) {
        //TODO How to update data???
        //this.agreementsTable.innerHTML = "";
        console.log("Display data:");

        var tableData = transformData.call(this, data);
        console.log(tableData);

    };
    /*Status    Actions Agreement Name  Template Name   Provider    Service    */
    var transformData = function transformData(data) {
        var transformedData = [];
        for (var i in data) {
            var row = [];
            //Apparently we need to get the status separately, does not make much sense....
            row.push(data[i].status.guaranteestatus); //Status
            row.push("Actions"); //Not sure what goes in here
            row.push(data[i].name);//Agreement name
            row.push(this.templatesData[data[i].context.templateId]);//Template Name
            row.push(data[i].context.serviceProvider);//Provider
            row.push(data[i].context.service);//Service

            transformedData.push(row);
        }

        return transformedData;
    };

    /******************************** HANDLERS ************************************/

    // Preferences
    //var handlerPreferences = function handlerPreferences(preferences) {

    //};


    /******************************** HELP FUNC ************************************/


    window.SLAManager = SLAManager;

})();
