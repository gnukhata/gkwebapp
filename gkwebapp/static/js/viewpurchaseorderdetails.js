$(document).ready(function() {

    $(document).off('click', '.purchaseorder_schedule').on('click', '.purchaseorder_schedule', function(event) {
      var curindex1 = $(this).closest('tr').index();
      pcode1 = $("#purchaseorder_product_table tbody tr:eq("+curindex1+") td:eq(0) select option:selected").val();
       $("#view_schedule_table  tbody tr").each(function(){
          if($(".procode",this).val() != pcode1){
            $(this).hide();
          }
          else {
            $(this).show();
          }
       });
    });

  $("#viewpomodal").on('shown.bs.modal', function(event) {
    $("#purchaseorder_product_table  tbody tr").each(function(){
      var curindex = $(this).closest('tr').index();
      productcode = $("#purchaseorder_product_table tbody tr:eq("+curindex+") td:eq(0) select option:selected").val();
      $.ajax({
        url: '/purchaseorder?action=getproduct',
        type: 'POST',
        dataType: 'json',
        async : false,
        data : {"productcode":productcode},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        console.log("success");
        if (resp["gkstatus"]==0) {
          $('#purchaseorder_product_table tbody tr:eq('+curindex+') td:eq(1) span').text(resp["unitname"]);

        }

      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

  });
  $("#viewpomodal").on('hidden.bs.modal', function(event) {

  });


});




});
