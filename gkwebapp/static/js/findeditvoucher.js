$(document).ready(function() {
$("#searchby").focus();
$('.vcdate').autotab('number');
$(".vtp").hide();
$(".vn").hide();
$(".amt").hide();
$(".vdate").hide();
$(".nar").hide();
$(".vtab").hide();

$("#searchby").bind("change keyup",function(event) {


  var search = $("#searchby option:selected").val();

  if (search=="type")
  {
    $(".vtp").show();

    $(".vn").hide();
    $(".amt").hide();
    $(".vdate").hide();
    $(".nar").hide();

    if (event.which==13)
    {
      $("#vtype").focus();
    }

  }
  else if (search=="vnum")
  {
    $(".vn").show();

    $(".vtp").hide();
    $(".amt").hide();
    $(".vdate").hide();
    $(".nar").hide();

    if (event.which==13)
    {
      $("#vnum").focus();
    }

  }
  else if (search=="amount")
  {
    $(".vn").hide();
    $(".vtp").hide();
    $(".amt").show();

    $(".vdate").hide();
    $(".nar").hide();

    if (event.which==13)
    {
      $("#amount").focus();
    }

  }
  else if (search=="date")
  {
    $(".vn").hide();
    $(".vtp").hide();
    $(".amt").hide();
    $(".vdate").show();

    $(".nar").hide();

    if (event.which==13)
    {
      $("#fday").focus();
    }

  }

  else if (search=="narration")
  {
    $(".vn").hide();
    $(".vtp").hide();
    $(".amt").hide();
    $(".vdate").hide();
    $(".nar").show();


    if (event.which==13)
    {
      $("#narration").focus();

    }

  }



});

$("#narration").keydown(function(event) {
  if (event.which==13)
  {
    event.preventDefault();
    $("#submit").click();
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


$("#reset").click(function()
{
  $('#fevoucher').click();
}
);


$("#findvoucher").submit(function(event) {



var search = $("#searchby option:selected").val();
if (search=="type")
{
  if ($('#vtype').val()=="") {
    $("#vtype-alert").alert();
    $("#novt").focus();
    $("#vtype-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#vtype-alert").alert('close');
    });
    $('#vtype').focus();
    return false;
  }
}
else if (search=="vnum")
{
  if ($('#vnum').val()=="") {
    $("#vno-alert").alert();
    $("#novn").focus();
    $("#vno-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#vno-alert").alert('close');
    });
    $('#vnum').focus();
    return false;
  }
}
else if (search=="amount")
{
  if ($('#amount').val()=="") {
    $("#vamt-alert").alert();
    $("#noamt").focus();
    $("#vamt-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#vamt-alert").alert('close');
    });
    $('#amount').focus();
    return false;
  }
}
else if (search=="date")
{
  if ($('#fday').val()=="") {
    $("#vdt-alert").alert();
    $("#nodt").focus();
    $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#vdt-alert").alert('close');
    });
    $('#fday').focus();
    return false;
  }

  if ($('#fmonth').val()=="") {
    $("#vdt-alert").alert();
    $("#nodt").focus();
    $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#vdt-alert").alert('close');
    });
    $('#fmonth').focus();
    return false;
  }

  if ($('#fyear').val()=="") {
    $("#vdt-alert").alert();
    $("#nodt").focus();
    $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#vdt-alert").alert('close');
    });
    $('#fyear').focus();
    return false;
  }

  if ($('#tday').val()=="") {
    $("#vdt-alert").alert();
    $("#nodt").focus();
    $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#vdt-alert").alert('close');
    });
    $('#tday').focus();
    return false;
  }

  if ($('#tmonth').val()=="") {
    $("#vdt-alert").alert();
    $("#nodt").focus();
    $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#vdt-alert").alert('close');
    });
    $('#tmonth').focus();
    return false;
  }
  if ($('#tyear').val()=="") {
    $("#vdt-alert").alert();
    $("#nodt").focus();
    $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#vdt-alert").alert('close');
    });
    $('#tyear').focus();
    return false;
  }

}

else if (search=="narration")
{
  if ($('#narration').val()=="") {
    $("#vnar-alert").alert();
    $("#nonar").focus();
    $("#vnar-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#vnar-alert").alert('close');
    });
    $('#narration').focus();
    return false;
  }

}

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
          if (vdetails=="")
          {
            $("#notran-alert").alert();
            $("#notran-alert").fadeTo(2000, 500).slideUp(500, function(){
              $("#notran-alert").alert('close');
            });
            var search = $("#searchby option:selected").val();
            if (search=="type")
            {
              $("#nt").append('with the specified <strong>Type</strong>');
              $('#vtype').focus();
            }
            else if (search=="vnum")
            {
              $("#nt").append('with the specified <strong>Number</strong>');
              $('#vnum').focus();
            }
            else if (search=="amount")
            {
              $("#nt").append('with the specified <strong>Amount</strong>');
              $('#amount').focus();
            }
            else if (search=="date")
            {
              $("#nt").append('within the specified <strong>Date</strong>');
              $('#fday').focus();
            }

            else if (search=="narration")
            {
              $("#nt").append('containing the specified <strong>Text as Narration</strong>');
              $('#narration').focus();
            }
          }
          else
          {
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
          }
          $('#vtable tr:eq(1) td:eq(0) a').focus();
          $('#vtable tr:first-child').addClass('selected');
        }
      });
      event.preventDefault();
});


})
