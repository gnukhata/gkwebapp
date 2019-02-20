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
  $('#my_profile').click(function(){
  $('#showeditorg').click();
});
   
function calldata(dataset){
  $.ajax(
  {

  type: "POST",
  url: "/dashboard?action=showlist",
  global: false,
  async: false,
  datatype: "json",
  data: dataset,
  beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  success: function(resp)
  {
    var tablediv="";
    if (dataset["inoutflag"] == 9){
      tablediv=$('#fivepurchaseinvoicelist');
    }
    else{
      tablediv=$('#fivesaleinvoicelist');
    }
    var list = resp["gkresult"];
    tablediv.html("");
    for (let index in list ){
      tablediv.append('<tr> <td  style="font-weight:normal;width:200px" class="col-sm-8">'+list[index].invoiceno+','+ list[index].invoicedate+','+ list[index].custname+' </td> <td  style="font-weight:normal;text-align:right;width:113px" class="col-sm-4">'+ list[index].balanceamount+' </td> </tr>');                  
    }
  }
  });
}   
    $("#pur_amount_wise").click(function(){
      dataset={
        "inoutflag": 9,
        "typeflag": 1
        };
    $("#pur_date_wise").removeClass("active");
    $("#pur_amount_wise").addClass("active");
    calldata(dataset);
  });

  $("#pur_date_wise").click(function(){
    dataset={
      "inoutflag": 9,
      "typeflag": 4
      };
    $("#pur_amount_wise").removeClass("active");
    $("#pur_date_wise").addClass("active");
    calldata(dataset);
  });
    $("#pur_amount_wise").click();

  $("#sale_amount_wise").click(function(){
   dataset={
      "inoutflag": 15,
      "typeflag": 1
      };
  $("#sale_date_wise").removeClass("active");
  $("#sale_amount_wise").addClass("active");
  calldata(dataset);
});

$("#sale_date_wise").click(function(){
 dataset={
    "inoutflag": 15,
    "typeflag": 4
    };
  $("#sale_amount_wise").removeClass("active");
  $("#sale_date_wise").addClass("active");
  calldata(dataset);
});
$("#sale_amount_wise").click();


dataset1={'inoutflag':9}
$.ajax(
  {

  type: "POST",
  url: "/dashboard?action=countinvoice",
  global: false,
  async: false,
  datatype: "json",
  data: dataset1,
  beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  success: function(resp)
  {
    console.log(resp,'rrrrrrrrrr')
    // var tablediv="";
    // if (dataset["inoutflag"] == 9){
    //   tablediv=$('#fivepurchaseinvoicelist');
    // }
    // else{
    //   tablediv=$('#fivesaleinvoicelist');
    // }
    // var list = resp["gkresult"];
    // tablediv.html("");
    // for (let index in list ){
    //   tablediv.append('<tr> <td  style="font-weight:normal;width:200px" class="col-sm-8">'+list[index].invoiceno+','+ list[index].invoicedate+','+ list[index].custname+' </td> <td  style="font-weight:normal;text-align:right;width:113px" class="col-sm-4">'+ list[index].balanceamount+' </td> </tr>');                  
    // }
    var list = resp["gkresult"];
    for (let index in list ){
      console.log(list[index])
      $('#chartdiv').append('<div col-xs-6>'+list[index].January+' </div><div col-xs-6>'+list[index].May+' </div><div col-xs-6>'+list[index].February+'</div>');
    }
  }
  });
  });



  