$(document).ready(function() {

  $('.modal-backdrop').remove();
  $("#salesorder_select").focus();

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



       $("#salesorder_select").change(function(event) {
           /* Act on the event */
	   $("#viewpofooter, #viewattach").hide();
          var salesorderid = $("#salesorder_select option:selected").val();
           $.ajax({
             url: '/purchaseorder?type=details',
             type: 'POST',
             global: false,
             async: false,
             datatype: 'text/html',
             data: {"orderid": salesorderid

           },
             beforeSend: function(xhr)
             {
               xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
             }
           })
           .done(function(resp)
           {
             $("#salesorderdetails").html("");
               $("#salesorderdetails").html(resp);
	       if ($("#salesorder_select option:selected").attr("attachmentcount") > 0) {
		   $("#viewpofooter, #viewattach").show();
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
	    data: { "orderid": $("#salesorder_select option:selected").val() },
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
            }else{
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
    
     $(document).on('click', '#soreset', function(event) {
       event.preventDefault();
       /* Act on the event */
       $("#salesorder_view").click();
     });



});
