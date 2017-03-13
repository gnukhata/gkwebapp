$(document).ready(function() {
  $("#viewpomodal").on('shown.bs.modal', function(event) {

  });
  $("#viewpomodal").on('hidden.bs.modal', function(event) {

  });
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

});
