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
         console.log("change");
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
