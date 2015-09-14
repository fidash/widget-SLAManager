var UI = (function () {
    "use strict";
    var dataTable;

    var displayData = function displayData(data) {

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
})();