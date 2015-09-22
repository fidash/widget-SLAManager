var Global1 = "TEST";
var UI = (function () {
    "use strict";
    var dataTable = null;
    var callbacks = {};

    var displayData = function displayData(data) {

        if (!dataTable) {//this means the table has not been created yet

            var columns = [
                {'title': 'ID'},
                {'title': 'Status'},
                {'title': 'Actions'},
                {'title': 'Agreement Name'},
                {'title': 'Template Name'},
                {'title': 'Provider'},
                {'title': 'Service'}
            ];

            dataTable = $('#agreements_table').dataTable({
                'columns': columns,
                "columnDefs": [
                    {
                        "targets": 0,
                        "visible": false
                    }
                ],
                'data': data,
                'dom': 't<"navbar navbar-default navbar-fixed-bottom"p>',
                'binfo': false,
                'pagingType': 'full_numbers',
                'info': false,
                "language": {
                    "paginate": {
                        "first": '<i class="fa fa-fast-backward"></i>',
                        "last": '<i class="fa fa-fast-forward"></i>',
                        "next": '<i class="fa fa-forward"></i>',
                        "previous": '<i class="fa fa-backward"></i>'
                    }
                }
            });

            createModalButton($('#agreements_table_paginate'));
            createRefreshButton($('#agreements_table_paginate'), callbacks.refresh);
            createSearchField($('#agreements_table_paginate'));

        }else {// the table exists, so we need to refresh the data
            dataTable.api().clear(); //we clear the data
            for (var i in data) {
                dataTable.api().row.add(data[i]);
            }
            dataTable.api().draw();
        }

        setDeleteCallback(callbacks.remove);
    };

    var createModalButton = function createModalButton (nextElement) {

        $('<button>')
            .html('<i class="fa fa-plus"></i>')
            .addClass('btn btn-success action-button pull-left')
            .attr('data-toggle', 'modal')
            .attr('data-target', '#createAgreementModal')
            .insertBefore(nextElement);
    };

    var createSearchField = function createSearchField (nextElement) {

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
            }else {
                searchInput.blur();
            }
        });

        searchInput.on('keyup', function () {
            dataTable.api().search(this.value).draw();
        });
    };

    var startLoadingAnimation = function startLoadingAnimation () {

        var bodyWidth = $('body').width();
        var bodyHeight = $('body').height();

        var element = $('.loading');
        var icon = $('.loading i');

        // Reference size is the smaller between height and width
        var referenceSize = (bodyWidth < bodyHeight) ? bodyWidth : bodyHeight;
        var font_size = referenceSize / 4;

        icon.css('font-size', font_size);
        element.removeClass('hide');
        $('#container').addClass('transparent');

    };

    var stopLoadingAnimation = function stopLoadingAnimation () {
        var element = $('.loading');
        element.addClass('hide');
        $('#container').removeClass('transparent');

    };

    var createDeleteButton = function createDeleteButton () {
        var wrapper = $('<div>');

        var button = $('<button>')
            .addClass('btn btn-danger')
            .attr('name', 'delete-button')
            .html('<i class="fa fa-trash"></i>')
            .appendTo(wrapper);
        return wrapper.html();
    };

    var setCallbacks = function setCallbacks (newCallbacks) {
        if (!dataTable) {
            callbacks = newCallbacks;
        }
    };

    var setDeleteCallback = function setDeleteCallback (callback) {
        $('button[name=delete-button]').on('click', function () {
            var row = $(this).parent().parent();
            var data = dataTable.api().row(row).data();
            dataTable.api().draw();
            callbacks.remove(data[0], row);
        });
    };

    var removeRow = function removeRow (row) {
        dataTable.api().row(row).remove();
        dataTable.api().draw();
    };

    var createRefreshButton = function createRefreshButton (nextElement, refreshCallback) {

        $('<button>')
            .html('<i class="fa fa-refresh"></i>')
            .addClass('btn btn-default action-button pull-left')
            .click(callbacks.refresh)
            .insertBefore(nextElement);
    };

    return {
        displayData: displayData,
        startLoadingAnimation: startLoadingAnimation,
        stopLoadingAnimation: stopLoadingAnimation,
        createDeleteButton: createDeleteButton,
        setCallbacks: setCallbacks,
        removeRow: removeRow
    };

})();