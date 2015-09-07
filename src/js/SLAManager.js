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
        getAgreements.call(this);
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
    }

    var getAgreements = function getAgreements() {

        makeRequest.call(this, "agreements", "GET",
            onSuccess: function (response) {
                setAgreements.call(this, JSON.parse(response.response));
                getTemplates.call();
            }.bind(this),

            onFailure: function () {
                console.log("Error retrieving the agreements data");
            }
        );
    };

    var getTemplates = function getTemplates() {

        makeRequest.call(this, "templates", "GET",
            onSuccess: function (response) {
                this.templatesData = JSON.parse(response.response);
                displayData.call(this, agreementsData);
            }.bind(this),
            onFailure: function () {
                console.log("Error retrieving the templates data");
            }
        );
    }

    var setAgreements = function setAgreements(response){
        this.agreementsData = {};

        for (var i in response){
            this.agreementsData[response[i]['id']] = {
                context: response[i]['context'],
                name: response[i]['name'],
                terms: response[i]['terms']
            };
        }
    }

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
            row.push("Fullfiled"); //?? STATUS
            row.push("Actions"); //Not sure what goes in here
            row.push(data[i]['name']);//Agreement name
            row.push(data[i]['template']);//Template Name
            row.push(data[i]['name']);//Provider
            row.push(data[i]['name']);//Service

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
