$(document).ready(function() {
$("#salesorder_product_table  tbody tr").each(function(){

  var curindex = $(this).closest('tr').index();
  productcode = $("#salesorder_product_table tbody tr:eq("+curindex+") td:eq(0) select option:selected").val();
  console.log(productcode);
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
      $('#salesorder_product_table tbody tr:eq('+curindex+') td:eq(1) span').text(resp["unitname"]);
    }
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

});

});
