$(document).ready(function() {
    $('#make_payment').click(function(){
    $('#showpayment').click();
  });

  $('#receipt_payment').click(function(){
    $('#showreceipt').click();
  });
  
  $("#add_customer").click(function() {
    $("#customersupplier").click();
  });

  $("#add_product").click(function() {
    $("#productinmaster").click();
  });

  $("#add_invoice").click(function() {
    $("#invoice").click();
  });
  $("#Adjustable_purchase_bill").click(function() {
    $("#showbillwiseaccounting").click();
  });
  $("#Adjustable_sale_bill").click(function() {
    $("#showbillwiseaccounting").click();
  });
    purchesedataset={
        "inoutflag": 9,
        // "typeflag": 1,
        "typeflag": $("#dropdownid option:selected").val(),

        };
     
      $.ajax(
      {
  
      type: "POST",
      url: "/dashboard?action=showlist",
      global: false,
      async: false,
      datatype: "json",
      data: purchesedataset,
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        var list = resp["gkresult"];
        for (let index in list ){
          $('#fivepurchaseinvoicelist').append('<tr> <td  style="font-weight:normal" class="col-sm-8">'+list[index].invoiceno+','+ list[index].invoicedate+','+ list[index].custname+' </td> <td  style="font-weight:normal;text-align:right" class="col-sm-4">'+ list[index].balanceamount+' </td> </tr>');                  
        }
      }
      }
    );
    saledataset={
        "inoutflag": 15,
        "typeflag": 1
        };
     
      $.ajax(
      {
  
      type: "POST",
      url: "/dashboard?action=showlist",
      global: false,
      async: false,
      datatype: "json",
      data: saledataset,
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        var list = resp["gkresult"];
        for (let index in list ){
          $('#fivesaleinvoicelist').append('<tr> <td  style="font-weight:normal" class="col-sm-8">'+list[index].invoiceno+','+ list[index].invoicedate+','+ list[index].custname+' </td> <td  style="font-weight:normal;text-align:right" class="col-sm-4">'+ list[index].balanceamount+' </td> </tr>');                  
        }
      }
      }
    );   
  
  });
  