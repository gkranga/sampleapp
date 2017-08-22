  
// common scripts

(function() {
  "use strict";
  var mainTable;
  // login form ajax
  
  $(document).on('click', '.login_local_btn', function () {
    var data = $('.form-signin').serialize();
    $.ajax({
      url: 'dashboard/auth',
      method: 'post',
      data: data
    }).success(function(response) {
      // console.log(response);
      if (response.status == "success") {
        window.location = "/";
      } else {
        toastr.error('Authentication Failed!!');
        toastr.clear();
      }
    });
    return false;
  })

  $(document).on('click', '.login_ldap_btn', function () {
    var data = $('.form-signin').serialize();
    var ldapData = $('.login_ldap_btn').data('ldap');
    ldapData.uid = $('#uid').val();
    ldapData.basedn = ldapData.uid;
    ldapData.password = $('#password').val();
    console.log(ldapData);
    $.ajax({
      url: 'newdashboard/ldap-user-login',
      method: 'post',
      data: ldapData
    }).success(function(response) {
      // console.log(response);
      if (response.status == "success") {
        window.location = "/";
      } else {
        toastr.error('Authentication Failed!!');
        toastr.clear();
      }
    });
    return false;
  })

  if ($('.form-verify')) {
    $('.form-verify').validate();
  }
  $('.verify-trigger').on('click', function () {
    var form = $(this).parents('form');
    if (form.valid()) {
      var data = form.serialize();
      $.ajax({
        url: '/api/emailValidate',
        method: 'post',
        data: data
      }).success(function(response) {
        // console.log(response);
        if (response.status == "success") {
          window.location = "/logout";
        } else {
          toastr.error('Authentication Failed!!');
          toastr.clear();
        }
      });
    } else {
      form.submit();
    }
    return false;
  })

  // Sidebar toggle
  var firstTime = false;

  jQuery('.menu-list > a').click(function() {
    if (firstTime) {

      var parent = jQuery(this).parent();
      var sub = parent.find('> ul');
      var sibling = jQuery(this).parents('ul').siblings('ul');

      if(!jQuery('body').hasClass('sidebar-collapsed')) {
        if(sub.is(':visible')) {
          sub.slideUp(300, function(){
            parent.removeClass('nav-active');
            jQuery('.body-content').css({height: ''});
            adjustMainContentHeight();
          });
        } else {
          visibleSubMenuClose();
          parent.addClass('nav-active');
          sub.slideDown(300, function(){
            adjustMainContentHeight();
          });
        }
      }
      hideAllLiExceptName(sibling);
      return false;
    }
  });
  // $('.child-list a').click(function() {
  //   var name = $(this).data('id');
  //   $('.page-head > .m-b-less > .service-name').text(name.charAt(0).toUpperCase() + name.slice(1));
  //   // console.log($(this).data('parent'), $(this).data('id'), $(this).data('customer-name'));
  //   fetchTableForService($(this).data('parent'), $(this).data('customer-name'), $(this).data('id'));
  // });

  if($('.menu-list').length == 0) {
    $('.form-trigger').hide();
  }

  $('.menu-list a').click(function() {
    var name = $(this).data('id');
    var capitalName = name.charAt(0).toUpperCase() + name.slice(1);
    var createName = 'create'+capitalName.slice(0, -1);
    var permittedActions = $(this).parents('.menu-list').data('permitted-actions');
    var createButton = $('.page-head > .m-b-less .form-trigger');
    $('.page-head > .m-b-less > .service-name').text(capitalName);
    createButton.data('value', createName);
    if (permittedActions.indexOf(createName) == -1) {
      createButton.hide();
    } else {
      createButton.show();
    }
    $('#selectedCustomerName').val($(this).data('customer-name'));
    // console.log($(this).data('parent'), $(this).data('id'), $(this).data('customer-name'));
    fetchTableForService($(this).data('parent'), $(this).data('customer-name'), $(this).data('id'));
  });

  jQuery('.navigation-title').click(function() {
    var parent = jQuery(this).parents('ul');
    var grandParent = parent.siblings('ul');
    showAllLiExceptName(parent);
    hideAllLiExceptName(grandParent);
  });

  function showAllLiExceptName(element) {
    element.find('.menu-list').slideDown(300);
  }

  function hideAllLiExceptName(element) {
    element.find('.menu-list').slideUp(300);
  }

  function visibleSubMenuClose() {
    jQuery('.menu-list').each(function() {
      var t = jQuery(this);
      if(t.hasClass('nav-active')) {
        t.find('> ul').slideUp(300, function(){
          t.removeClass('nav-active');
        });
      }
    });
  }

  function adjustMainContentHeight() {
  // Adjust main content height
    var docHeight = jQuery(document).height();
    if(docHeight > jQuery('.body-content').height())
      jQuery('.body-content').height(docHeight);
  }

  // add class mouse hover

  jQuery('.side-navigation > li').hover(function(){
    jQuery(this).addClass('nav-hover');
  }, function(){
    jQuery(this).removeClass('nav-hover');
  });


  // Toggle Menu

  jQuery('.toggle-btn').click(function(){

    var body = jQuery('body');
    var bodyposition = body.css('position');

    if(bodyposition != 'relative') {

      if(!body.hasClass('sidebar-collapsed')) {
        body.addClass('sidebar-collapsed');
        jQuery('.side-navigation ul').attr('style','');

      } else {
        body.removeClass('sidebar-collapsed chat-view');
        jQuery('.side-navigation li.active ul').css({display: 'block'});

      }
    } else {

      if(body.hasClass('sidebar-open'))
        body.removeClass('sidebar-open');
      else
        body.addClass('sidebar-open');

      adjustMainContentHeight();
    }

    // var owl = $("#news-feed").data("owlCarousel");
    // owl.reinit();

  });


  searchform_reposition();

  jQuery(window).resize(function(){

    if(jQuery('body').css('position') == 'relative') {

      jQuery('body').removeClass('sidebar-collapsed');

    } else {

      jQuery('body').css({left: '', marginRight: ''});
    }

    searchform_reposition();

  });

  function searchform_reposition() {
    if(jQuery('.search-content').css('position') == 'relative') {
      jQuery('.search-content').insertBefore('.sidebar-left-info .search-field');
    } else {
      jQuery('.search-content').insertAfter('.right-notification');
    }
  }

  // right slidebar

  // $(function(){
  //     $.slidebars();
  // });

  // body scroll

  $("html").niceScroll({
    styler: "fb",
    cursorcolor: "#a979d1",
    cursorwidth: '5',
    cursorborderradius: '15px',
    background: '#404040',
    cursorborder: '',
    zindex: '12000'
  });

  $(".notification-list-scroll").niceScroll({
    styler: "fb",
    cursorcolor: "#DFDFE2",
    cursorwidth: '3',
    cursorborderradius: '15px',
    //        background: '#404040',
    cursorborder: '',
    zindex: '12000'
  });



// collapsible panel

  $('.panel .tools .t-collapse').click(function () {
    var el = $(this).parents(".panel").children(".panel-body");
    if ($(this).hasClass("fa-chevron-down")) {
      $(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
      el.slideUp(200);
    } else {
      $(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
      el.slideDown(200); }
  });


  // close panel 
  $('.panel .tools .t-close').click(function () {
    $(this).parents(".panel").parent().remove();
  });


  // side widget close

  $('.side-w-close').on('click', function(ev) {
    ev.preventDefault();
    $(this).parents('.aside-widget').slideUp();
  });
  $('.info .add-people').on('click', function(ev) {
    ev.preventDefault();
    $(this).parents('.tab-pane').children('.aside-widget').slideDown();

  });


  // refresh panel

  $('.box-refresh').on('click', function(br) {
    br.preventDefault();
    $("<div class='refresh-block'><span class='refresh-loader'><i class='fa fa-spinner fa-spin'></i></span></div>").appendTo($(this).parents('.tools').parents('.panel-heading').parents('.panel'));

    setTimeout(function() {
      $('.refresh-block').remove();
    }, 1000);

  });

  $('.menu-list>a').first().trigger('click');
  firstTime = true;

  // tool tips

  $('.tooltips').tooltip();

  // popovers

  $('.popovers').popover();

  $(document).on('click', '.row-details-data-table tbody td.details-control', function() {
      var tr = $(this).parents('tr');
      var row = mainTable.row(tr);

      if (row.child.isShown()) {
          // This row is already open - close it
          row.child.hide();
          tr.removeClass('shown');
      } else {
          // Close open rows
          if ( mainTable.row( '.shown' ).length ) {
              $('td.details-control', mainTable.row( '.shown' ).node()).click();
          }
        
          // Open this row
          row.child(format($(this).data('content'), $(this).data('service'))).show();
          tr.addClass('shown');
      }
  });

  $('.refresh').click(function() {
    $.ajax({
      url: '/dashboard/refresh',
    }).success(function(data) {
      toastr.success('Refresh success');
      toastr.clear();
      location.reload();
    });
  })
  
  function getPermittedActions(service)
  {
    var customerSelected = $('#selected_customer').data('id');
  }

  function fetchTableForService(master, customerName, service)
  {
    var data;
    var name = keyActualNames(service, 'name');
    $.ajax({
      url: 'dashboard/data/'+customerName+'/'+service,
      method: 'get'
    }).success(function(response) {
      if (response.status == undefined) {
        populateTable(response);
      } else if (response.status == 'fail'){
        $('section.panel').html('');
      }
    }).error(function(error) {
      $('section.panel').html('');
    })
  }

  function populateTable(data) {
    $('section.panel').html(data);
    // $.fn.dataTable.ext.errMode = 'throw';
    mainTable = $('section.panel table').DataTable({
      dom: '<"tbl-top clearfix"lfr>,t,<"tbl-footer clearfix"<"tbl-info pull-left"i><"tbl-pagin pull-right"p>>'
    });
    $('section.panel table').validate();
    // var colvis = new $.fn.dataTable.ColVis( mainTable );
    // $('.ColVis').remove();
    // $( colvis.button() ).insertAfter('.service-name');
  }

  // Handlebars.registerHelpers('keyActualNames', keyActualNames);
  function keyActualNames(service, key) {
    var name = '';
    switch (service) {
      case 'bus' :
        if (key == 'roles') {
          name = 'buRole';
        } else if (key == 'name') {
          name = 'buName';
        }
        break;
      case 'customers' :
        if (key == 'roles') {
          name = 'customerRole';
        } else if (key == 'name') {
          name = 'customerName';
        }
        break;
      case 'projects' :
        if (key == 'roles') {
          name = 'projectRole';
        } else if (key == 'name') {
          name = 'projectName';
        }
        break;
      case 'accounts' :
        if (key == 'roles') {
          name = 'accountRole';
        } else if (key == 'name') {
          name = 'accountName';
        }
        break;
      case 'users' :
        if (key == 'roles') {
          name = 'userRole';
        } else if (key == 'name') {
          name = 'userName';
        }
        break;
      default: name = '';
    }
    return name;
  }


})(jQuery);

function checkUserLocal()
{
  var data = $('#uid').val();
  $.ajax({
    url: 'api/verify-user-local',
    method: 'post',
    data: {uid: data}
  }).success(function(response) {
    if (response.status == "success") {
      followUserLoginFlow(response);
    } else {
      toastr.error('Authentication Failed!!');
      toastr.clear();
    }
  });
  return false;
}

function followUserLoginFlow(response)
{
  if (response.statusMessage) {
    userLocalFlow(response);
  } else {
    userLdapFlow(response);
  }
}

function userLocalFlow(response)
{
  $('.password').removeClass('hidden');
  $('.local-login').removeClass('hidden');
  $('.verification-btn').addClass('hidden');
  // console.log(response);
}

function userLdapFlow(response)
{
  $('.password').removeClass('hidden');
  $('.ldap-login').removeClass('hidden');
  $('.verification-btn').addClass('hidden');
  $('.login_ldap_btn').data('ldap', response.statusMessage);
  // console.log(response);
}

function resetLoginForm()
{
  $('.password').addClass('hidden');
  $('.local-login').addClass('hidden');
  $('.ldap-login').addClass('hidden');
  $('.verification-btn').removeClass('hidden');
  $('.login_ldap_btn').data('ldap', '');
}