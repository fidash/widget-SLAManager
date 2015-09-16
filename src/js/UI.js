var Global1 = "TEST";
var UI = (function () {
    "use strict";
    var dataTable = null;

    var displayData = function displayData(data) {

        if (!dataTable) {//this means the table has not been created yet

            var columns = [
                {'title': 'Status'},
                {'title': 'Actions'},
                {'title': 'Agreement Name'},
                {'title': 'Template Name'},
                {'title': 'Provider'},
                {'title': 'Service'}
            ];

            dataTable = $('#agreements_table').dataTable({
                'columns': columns,
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
            createSearchField($('#agreements_table_paginate'));
        }else {// the table exists, so we need to refresh the data
            dataTable.api().clear(); //we clear the data
            for (var i in data) {
                dataTable.api().row.add(data[i]);
            }
            dataTable.api().draw();
        }
    };

    var createModalButton = function createModalButton (nextElement) {

        $('<button>')
            .html('<i class="fa fa-plus"></i>')
            .addClass('btn btn-success action-button pull-left')
            .attr('data-toggle', 'modal')
            .attr('data-target', '#uploadImageModal')
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

    var startLoadingAnimation = function startLoadingAnimation (element, icon) {

        var bodyWidth = $('body').width();
        var bodyHeight = $('body').height();

        // Reference size is the smaller between height and width
        var referenceSize = (bodyWidth < bodyHeight) ? bodyWidth : bodyHeight;
        var font_size = referenceSize / 4;

        icon.css('font-size', font_size);
        element.removeClass('hide');

    };

    var stopLoadingAnimation = function stopLoadingAnimation (element) {

        element.addClass('hide');

    };

    return {
        displayData: displayData,
        startLoadingAnimation: startLoadingAnimation,
        stopLoadingAnimation: stopLoadingAnimation
    };

})();