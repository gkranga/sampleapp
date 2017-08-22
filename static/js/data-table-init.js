/**
 * Created by mosaddek on 3/4/15.
 */

function format(d, service) {
    var result = '<div>';
    var adminFormat = JSON.parse($('#adminFormat').val());
    if (typeof d[0] == 'object') {
        d = d[0];
    }
    if (adminFormat[service]['tab']) {
        $.each(adminFormat[service]['tab'], function(value, key) {
            if (d[value]) {
                result += '<b>'+adminFormat[service]['tab'][value]+' : </b>'+(d[value] || '')+'<br>';
            }
        });
    }
    result += '</div>';
    // `d` is the original data object for the row
    return '<ul class="nav nav-tabs" role="tablist">'+
    '<li role="presentation" class="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Details</a></li>'+
    '</ul>'+
    '<div class="tab-content">'+
    '<div role="tabpanel" class="tab-pane active" id="home"><p>'+result+'</p></div>'+
    '</div>';
}


// Data Table

// $('.convert-data-table').DataTable({
//     "PaginationType": "bootstrap",
//     dom: '<"tbl-head clearfix"T>,<"tbl-top clearfix"lfr>,t,<"tbl-footer clearfix"<"tbl-info pull-left"i><"tbl-pagin pull-right"p>>',
//     tableTools: {
//         "sSwfPath": "swf/copy_csv_xls_pdf.swf"
//     }
// });




// $('.colvis-data-table').DataTable({
//     "PaginationType": "bootstrap",
//     dom: '<"tbl-head clearfix"C>,<"tbl-top clearfix"lfr>,t,<"tbl-footer clearfix"<"tbl-info pull-left"i><"tbl-pagin pull-right"p>>'


// });


// $('.responsive-data-table').DataTable({
//     "PaginationType": "bootstrap",
//     responsive: true,
//     dom: '<"tbl-top clearfix"lfr>,t,<"tbl-footer clearfix"<"tbl-info pull-left"i><"tbl-pagin pull-right"p>>'
// });

//
//
//$('.scrolling-table').DataTable({
//    "PaginationType": "bootstrap",
//    "ajax": "data/2500.txt",
//    "scrollY": "200px",
//    dom: '<"tbl-top clearfix"fr>,t,<"tbl-footer clearfix"<"tbl-info-large pull-left"i><"tbl-pagin pull-right"S>>',
//
//    "deferRender": true
//
//
//});


$(function() {
    var table = $('.row-details-data-table').DataTable({
        // "ajax": "dashboard/1/projects/adminServices/details",
        dom: '<"tbl-top clearfix"lfr>,t,<"tbl-footer clearfix"<"tbl-info pull-left"i><"tbl-pagin pull-right"p>>',
        "columns": [{
            "class": 'details-control',
            "orderable": false,
            "data": null,
            "defaultContent": ''
        }, {
            "data": "projectName"
        }, {
            "data": "projectDescription"
        }, {
            "data": "startDate"
        }, {
            "data": "endDate"
        }, {
            "data": "budget"
        }, {
            "data": "status"
        }, {
            "data": "buName"
        }],
        "order": [
            [1, 'asc']
        ],
        "responsive": true
    });

    // Add event listener for opening and closing details
    // $(document).on('click', '.row-details-data-table tbody td.details-control', function() {
    //     var tr = $(this).parents('tr');
    //     var row = table.row(tr);

    //     if (row.child.isShown()) {
    //         // This row is already open - close it
    //         row.child.hide();
    //         tr.removeClass('shown');
    //     } else {
    //         // Close open rows
    //         if ( table.row( '.shown' ).length ) {
    //             $('td.details-control', table.row( '.shown' ).node()).click();
    //         }
          
    //         // Open this row
    //         row.child(format(row.data())).show();
    //         tr.addClass('shown');
    //     }
    // });
});