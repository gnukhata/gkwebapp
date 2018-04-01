$(document).ready(function() {

  $('.modal-backdrop').remove();
  $("#purchaseorder_select").focus();


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
    var purchaseorderid="";
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
          $("#purchaseorderdetails").html(resp);
	  $("#viewpofooter").show();
	  if ($("#purchaseorder_select option:selected").attr("attachmentcount") > 0) {
		   $("#viewattach").show();
	       }
        console.log("success");
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    });

    $("#viewattach").click(function(event) {
        $.ajax({
                url: '/purchaseorder?action=getattachment',
                type: 'POST',
            datatype: 'json',
	    data: { "orderid": $("#purchaseorder_select option:selected").val() },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                var x = window.open();
                if (x) {
                    //Browser has allowed it to be opened
                    x.focus();
                    x.document.open();
                    x.document.write(resp);
                    x.document.close();
                } else {
                    //Browser has blocked it
                    alert('Please allow popups and retry');
                    x.close();
                }

                console.log("success");
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });

    });
    $("#po_print").click(function(event) {
        $.ajax({
                url: '/purchaseorder?action=print',
                type: 'POST',
                dataType: 'html',
            data: {"orderid":$("#purchaseorder_select option:selected").val()},
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                }
            })
            .done(function(resp) {
                console.log("success");
                $('#info').html(resp);
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
