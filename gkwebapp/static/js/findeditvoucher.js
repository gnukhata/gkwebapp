$(document).ready(function() {
$("#searchby").focus();
$('.vdate').autotab('number');
$(".vtp").hide();
$(".vno").hide();
$(".amt").hide();
$(".vdate").hide();
$(".nar").hide();
$(".vtab").hide();

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

$(".table").on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).closest('tr').index();
    $('#vtable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('tr:eq('+currindex+') a').focus();

});

$(".table").on('dblclick','tr:not(:first)',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    alert(id);


});
$(document).on('focus' ,'.vno',function() {
          $('#vtable tr').removeClass('selected');
        $(this).closest('tr').addClass('selected');
    });

$(document).on('blur' ,'.vno',function() {
          $('#vtable tr').removeClass('selected');

    });

$(document).on('keyup' ,'.vno',function(event) {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)
    {

    $('tr:eq('+nextindex+') a').focus();
    }
    else if (event.which==38)
    {

    $('tr:eq('+previndex+') a').focus();
    }

    });


$("#findvoucher").submit(function(event) {
$(".vtab").show();
$(".table").empty();
$(".table").append('<thead>'+
  '<tr class="info">'+
    '<th>Voucher No.</th>'+
    '<th>Status</th>'+
    '<th>Date</th>'+
    '<th>Type</th>'+
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
                '<tr value ="'+
                 vdetails[vc].vouchercode+
                 '">'+
                '<td>'+
                '<a class="vno" href="">'+
                vdetails[vc].vouchernumber+
                '</a>'+
                '</td>'+
                '<td>'+
                ""+
                '</td>'+
                '<td>'+
                vdetails[vc].voucherdate+
                '</td>'+
                '<td>'+
                vdetails[vc].vouchertype+
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
            var links = $('table a');
            links.eq(links.index(this)-1).focus();
            $('#vtable tr:first-child').addClass('selected');


        }
      });
      event.preventDefault();
});


})
