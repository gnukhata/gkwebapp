$(document).ready(function() {

  $('.modal-backdrop').remove();
  $("#purchaseorder_select").focus();

  $.ajax({
    url: '/purchaseorder?action=getuser',
    type: 'POST',
    dataType: 'json',
    async : false,

    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    }
  })
  .done(function(resp) {
      $("#purchaseorder_issuername").val("");
      $("#purchaseorder_issuername").prop("placeholder",resp["username"]);
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });


  $(document).off('focus', '.numtype').on('focus', '.numtype', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".numtype").numeric();
  });
  $(document).off('blur', '.numtype').on('blur', '.numtype', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()=="")
    {
    $(this).val(parseFloat(0).toFixed(2));
    }
    else
    {
      $(this).val(parseFloat($(this).val()).toFixed(2));
    }
  });

  $("#purchaseorder_select").change(function(event) {
    /* Act on the event */
     purchaseorderid = $("#purchaseorder_select option:selected").val();
     console.log(purchaseorderid);
      $.ajax({
        url: '/purchaseorder?type=details',
        type: 'POST',
        global: false,
        async: false,
        datatype: 'text/html',
        data: {"orderid": purchaseorderid
      },
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp)
      {
        //$("#purchaseorderdetails").html("");
        $("#purchaseorderdetails").html(resp);
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    });

$(document).on('click', '#poreset', function(event) {
  event.preventDefault();
  /* Act on the event */
  $("#purchaseorder_view").click();
});


});
