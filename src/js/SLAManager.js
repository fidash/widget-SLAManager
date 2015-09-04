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

    var getAgreements = function getAgreements() {
        var url = MashupPlatform.prefs.get("server_url");
        if (url[url.length - 1] !== "/") {
            url += "/";
        }
        url+="agreements";

        MashupPlatform.http.makeRequest(url, {
            method: "GET",
            requestHeaders: {
                user: MashupPlatform.prefs.get("user"),
                password: MashupPlatform.prefs.get("password"),
                Accept: "application/json"
            },
            onSuccess: function (response) {
                setAgreementsData.call(this, JSON.parse(response.response));
            }.bind(this),
            onFailure: function () {
                console.log("Failing on the request");
            }
        });
    };

    var setAgreementsData = function setAgreementsData(agreementsData) {
        this.agreementsData = agreementsData;
        displayData.call(this, agreementsData);
    };

    var displayData = function displayData(data) {
        //TODO How to update data???
        //this.agreementsTable.innerHTML = "";
        console.log("Display data:");

        var tableData = transformData.call(this, data);
        console.log(tableData);

    };

    var transformData = function transformData(data) {
        var transformedData = [];
        for (var i in data) {
            var row = [];
            for (var d in data[i]) {
                row.push(data[i][d]);
            }
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
