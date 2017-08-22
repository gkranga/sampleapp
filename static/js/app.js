(function() {

  window.onerror = function(message, url, lineNumber) {  
    //save error and send to server for example.
    console.log('error => ', message, url, lineNumber);
    return true;
  };

  $(document).on('change', '.min-date', function() {
    $('.max-date').attr('min', $(this).val());
  });

  $(document).on('change click', '.form-trigger', function() {
    var formModal = $('#forms');
    var formId = $(this).val() || $(this).data('value');
    var formData = $(this).parents('tr').find('.details-control').data('content');
    var selectedCustomer = $('#selectedCustomerName').val();
    var currEle = $(this);
    var def = $.Deferred();
    // console.log(formData);
    if (!formId) {
      return false;
    }

    var html = $('#'+formId+'Template').html();
    if (!$('#'+formId+'Template').length) {
      currEle.val('');
      toastr.error('form not defined');
      return false;
    }
    // var template = Handlebars.compile(source);
    // var html = template();
    var title = $(this).data('value') || $(this).find(":selected").text();

    formModal.find('.modal-body').html(html);
    formModal.find('.modal-title').text(title);
    if (['tagCa','createCustomer'].indexOf(formId) == -1) {
      formModal.find('input[name="customerName"]').val(selectedCustomer);
    }
    // formModal.find('form').data('content', formData);
    var selectElementsInForm = formModal.find('select');
    var selectElementsInFormLen = selectElementsInForm.length;
    if (selectElementsInFormLen) {
      selectElementsInForm.each(function(key, val) {
        var service = $(val).data('service');
        if (service) {
          $.ajax({
            url: '/api/select/'+selectedCustomer+'/'+service
          }).success(function(response) {
            var options = generateOptions(response);
            $(val).append(options);
            if (key == selectElementsInFormLen - 1) {
              def.resolve();
            }
          })
        } else {
          def.resolve();
        }
      });
    } else {
      def.resolve();
    }

    def.promise().then(function() {
      if (formId.indexOf('create') == -1) {
        $.each(formModal.find(':input'), function(key, val) {
          var inputEle = $(val);
          if (formData[inputEle.attr('name')]) {
            inputEle.val([formData[inputEle.attr('name')]]);
          }
        });
      }
      currEle.val('');
      formModal.modal();
    }, function() {
      toastr.error('Something went wrong');
    })
  });

  function generateOptions(items)
  {
    var options = '';
    $.each(items, function(key, value) {
      options += '<option value="'+value.value+'">'+value.name+'</option>';
    })
    return options;
  }

  $(document).on('click', '.form-submit', function() {
    var form = $(this).parents('form');
    var action = form.prop('action');
    var data = form.serializeArray();
    var isFormValid = form.valid();

    if (form.valid()) {
      // var oldData = form.data('content') || [];
      // $.each(data, function(key, val) {
      //   oldData[val['name']] = val['value'];
      // }); console.log(oldData)
      $.ajax({
        url: action,
        method: 'post',
        data: data
      }).success(function(response) {
        // console.log(response);
        if (response.status == 'success') {
          toastr.success(response.statusMessage || 'Success');
          toastr.clear();
          $('#forms').modal('hide');
        } else {
          toastr.error(response.statusMessage || 'Error');
          toastr.clear();
        }
      });
    } else {
      form.submit();
    }
    return false;
  })

  $(document).on('change', '.dispCspChange', function() {
    var selectedCustomer = $('#selectedCustomerName').val();
    var formModal = $('#forms');
    var selectedCsp = $(this).val();
    $.ajax({
      url: '/api/select/'+selectedCustomer+'/regions',
      data: {csps: selectedCsp}
    }).success(function(response) {
      var options = generateOptions(response);
      formModal.find("select[name='regionName']").append(options);
    })
  })


})(jQuery);

function changeProfileImg(form)
{
  var str = new FormData(form[0]); 
  $.ajax({
    url: '/dashboard/image',
    data: str,
    processData: false,
    contentType: false,
    type: 'POST',
    success: function(data) {
      $('.profilePic').attr('src', data.src+'?t='+ new Date());
      toastr.success('Profile pic changed.')
      toastr.clear();
    }
  });
}