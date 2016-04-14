$(document).ready(function() {
$("#searchby").focus();
$('.vdate').autotab('number');
$(".vtp").hide();
$(".vno").hide();
$(".amt").hide();
$(".vdate").hide();
$(".nar").hide();

$("#searchby").bind("change keyup",function(event) {

  var search = $("#searchby option:selected").val();
  if (search=="type")
  {
    $(".vtp").show();
    $(".vno").hide();
    $(".amt").hide();
    $(".vdate").hide();
    $(".nar").hide();

  }
  else if (search=="vnum")
  {
    $(".vno").show();
    $(".vtp").hide();
    $(".amt").hide();
    $(".vdate").hide();
    $(".nar").hide();

  }
  else if (search=="amount")
  {
    $(".vno").hide();
    $(".vtp").hide();
    $(".amt").show();
    $(".vdate").hide();
    $(".nar").hide();

  }
  else if (search=="date")
  {
    $(".vno").hide();
    $(".vtp").hide();
    $(".amt").hide();
    $(".vdate").show();
    $(".nar").hide();

  }

  else if (search=="narration")
  {
    $(".vno").hide();
    $(".vtp").hide();
    $(".amt").hide();
    $(".vdate").hide();
    $(".nar").show();

  }



});

$("#findvoucher").submit(function(event) {
$(".table").empty();
$(".table").append('<thead>'+
  '<tr class="info">'+
    '<th>Voucher No.</th>'+
    '<th>Date</th>'+
    '<th>Dr Accounts</th>'+
    '<th>Cr Accounts</th>'+
    '<th>Dr Amounts</th>'+
    '<th>Cr Amounts</th>'+
    '<th>Narration</th>'+
    '</tr>'+
    '</thead>')
var search = $("#searchby option:selected").val();

$.ajax({
        type: "POST",
        url: "/getvouchers",
        data: $("#findvoucher").serialize(),
        global: false,
        async: false,
        dataType: "json",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(jsonObj)
        {
          var vdetails=jsonObj["vouchers"];

            for(vc in vdetails)
            {
              var DRS = vdetails[vc].drs;
              var CRS = vdetails[vc].crs;
              var draccs={};
              var craccs={};
              var tdr=0.00;
              var tcr=0.00;
              var i =0;
              var j =0;
              for(var key in DRS)
              {
                var tdr = tdr+DRS[key];
                draccs[i]=key;
                i=i+1;

              }
              for(var key in CRS)
              {
                var tcr = tcr+CRS[key];
                craccs[j]=key;
                j=j+1;

              }
              if(draccs.length>1)
              {
                alert("great");
              }

              $(".table").append(
                '<tr>'+
                '<td>'+
                vdetails[vc].vouchernumber+
                '</td>'+
                '<td>'+
                vdetails[vc].voucherdate+
                '</td>'+
                '<td>'+
                draccs[0]+
                '</td>'+
                '<td>'+
                craccs[0]+
                '</td>'+
                '<td>'+
                tdr+
                '</td>'+
                '<td>'+
                tcr+
                '</td>'+
                '<td>'+
                vdetails[vc].narration+
                '</td>'+
                '</tr>'
              );

            };

            $('tr:first').focus();
        }
      });
      event.preventDefault();
});


})
