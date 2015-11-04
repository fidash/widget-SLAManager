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

var UI = (function () {
    "use strict";

    var dataTable;

    /******************************************************************/
    /*                P R I V A T E   F U N C T I O N S               */
    /******************************************************************/

    function initDataTable () {

        var columns = [
            {'title': 'Agreement'},
            {'title': 'Initiator'},
            {'title': 'Provider'},
            {'title': 'Service'},
            {'title': 'Conditions'},
            {'title': 'Expiration time'},
            {'title': 'Status'}
        ];

        dataTable = $('#agreements_table').dataTable({
            'columns': columns,
            "columnDefs": [
                {
                    "targets": [6],
                    "visible": false
                }
            ],
            'dom': 't<"navbar navbar-default navbar-fixed-bottom"p>',
            'binfo': false,
            'pagingType': 'full_numbers',
            'info': false,
            // 'order': [],
            "language": {
                "paginate": {
                    "first": '<i class="fa fa-fast-backward"></i>',
                    "last": '<i class="fa fa-fast-forward"></i>',
                    "next": '<i class="fa fa-forward"></i>',
                    "previous": '<i class="fa fa-backward"></i>'
                }
            }
        });
    }

    function createSearchField (nextElement) {

        var search = $('<div>').addClass('input-group search-container').insertBefore(nextElement);
        var searchButton = $('<button>').addClass('btn btn-default').html('<i class="fa fa-search"></i>');
        $('<span>').addClass('input-group-btn').append(searchButton).appendTo(search);
        var searchInput = $('<input>').attr('type', 'text').attr('placeholder', 'Search for...').addClass('search form-control').appendTo(search);
        var focusState = false;

        searchButton.on('click', function () {
            focusState = !focusState;

            searchInput.toggleClass('slideRight');
            searchButton.parent()
                .css('z-index', 20);

            if (focusState) {
                searchInput.focus();
            }
            else {
                searchInput.blur();
            }
        });

        searchInput.on('keyup', function () {
            dataTable.api().search(this.value).draw();
        });
    }

    function createModalButton (nextElement) {

        $('<button>')
            .html('<i class="fa fa-plus"></i>')
            .addClass('btn btn-success action-button pull-left')
            .attr('data-toggle', 'modal')
            .attr('data-target', '#createAgreementModal')
            .insertBefore(nextElement);
    }

    function createRefreshButton (nextElement, refreshCallback) {

        $('<button>')
            .html('<i class="fa fa-refresh"></i>')
            .addClass('btn btn-default action-button pull-left')
            .click(refreshCallback.bind(null, false))
            .insertBefore(nextElement);
    }

    function createStatusButton (nextElement) {

        var container = $('<div>')
            .addClass('button-group dropup')
            .insertBefore(nextElement);

        $('<button>')
            .html('<i class="fa fa-list-ul"></i>')
            .addClass('btn btn-default pull-left action-button')
            .attr('data-toggle', 'dropdown')
            .attr('id', 'statusButton')
            .attr('aria-haspopup', 'true')
            .attr('aria-expanded', 'false')
            .click(function () {
                $('#status-selector').addClass('slideUp');
            })
            .appendTo(container);

        $('<ul>')
            .addClass('dropdown-menu')
            .attr('aria-labelledby', 'statusButton')
            .html('<li><a class="small" data-value="all" tabIndex="-1">' +
                    '<input name="statusRadio" checked value="" type="radio"/>&nbsp;All</a></li>' +
                 '<li><a class="small" data-value="fulfilled" tabIndex="-1">' +
                    '<input name="statusRadio" value="FULFILLED" type="radio"/>&nbsp;Fulfilled</a></li>' +
                 '<li><a class="small" data-value="violated" tabIndex="-1">' +
                    '<input name="statusRadio" value="VIOLATED" type="radio"/>&nbsp;Violated</a></li>' +
                 '<li><a class="small" data-value="non-determined" tabIndex="-1">' +
                    '<input name="statusRadio" value="NON_DETERMINED" type="radio"/>&nbsp;Non Determined</a></li>'
            )
            .appendTo(container);
    }

    function setStatusDropdownEvents () {
        var options = [];

        $('.dropdown-menu a').on('click', function (e) {

            var input = $('input', this);

            input.prop('checked', true);
            dataTable.api().columns(6).search(input.val()).draw();

            return false;
        });
    }

    function buildTableBody (data, getStatus) {

        var nRows = data.length;
        var rows = [];

        data.forEach(function (agreement) {

            getStatus(agreement.agreementId, function (response) {

                var status = JSON.parse(response.responseText);

                rows.push([
                    agreement.name,
                    agreement.context.agreementInitiator,
                    agreement.context.agreementResponder,
                    agreement.context.service,
                    Utils.getDisplayableConditions(agreement.terms.allTerms.guaranteeTerms, status.guaranteeterms),
                    Utils.formatDate(agreement.context.expirationTime),
                    status.guaranteestatus
                ]);

                if (rows.length === nRows) {

                    // Clear previous elements
                    dataTable.api().clear();

                    dataTable.api().rows.add(rows).draw();
                }

            });
        });
    }

    function initFixedHeader () {
        UI.fixedHeader = new $.fn.dataTable.FixedHeader(dataTable);
        $(window).resize(redrawFixedHeaders);
    }

    function redrawFixedHeaders () {
        UI.fixedHeader._fnUpdateClones(true); // force redraw
        UI.fixedHeader._fnUpdatePositions();
    }


    /******************************************************************/
    /*                 P U B L I C   F U N C T I O N S                */
    /******************************************************************/

    function createTable (refreshCallback, createCallback) {

        initDataTable();

        // Extra padding to adjust to bottom fixed navbar
        $('#agreements_table_wrapper').attr('style', 'padding-bottom: 40px;');

        var paginationElement = $('#agreements_table_paginate');

        // Pagination style
        paginationElement.addClass('pagination pull-right');

        createModalButton(paginationElement);
        createSearchField(paginationElement);
        createRefreshButton(paginationElement, refreshCallback);
        createStatusButton(paginationElement);
        setStatusDropdownEvents();

        // Set modal create agreement button click
        $('#create-agreement').on('click', createCallback);

        initFixedHeader();

    }

    function displayData (getStatus, refreshCallback, autoRefresh, data) {

        // Save previous scroll and page
        var scroll = $(window).scrollTop();
        var page = dataTable.api().page();

        buildTableBody(data, getStatus);

        // Restore previous scroll and page
        $(window).scrollTop(scroll);
        dataTable.api().page(page).draw(false);

        // Adjust columns and headers
        dataTable.api().columns.adjust();
        redrawFixedHeaders();

        if (autoRefresh) {
            setTimeout(function () {
                refreshCallback(true);
            }, 4000);
        }
    }

    function clearTable () {
        dataTable.api().clear();
        dataTable.api().draw();
    }

    return {
        clearTable: clearTable,
        createTable: createTable,
        displayData: displayData
    };
})();