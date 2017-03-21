/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
This file is part of GNUKhata:A modular,robust and Free Accounting System.

GNUKhata is Free Software; you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation; either version 3 of
the License, or (at your option) any later version.and old.stockflag = 's'

GNUKhata is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with GNUKhata (COPYING); if not, write to the
Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
Boston, MA  02110-1301  USA59 Temple Place, Suite 330,

*/

// This script is for the addpurchaseorder.jinja2

$(document).ready(function() {
  $('.modal-backdrop').remove();
      $("#purchaseorder_orderno").focus();
      var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
      var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
      $('.podate').autotab('number');
      $('.sodate').autotab('number');
      var schedule=[];
      var scheduleall={};
      $.ajax({
        url: '/purchaseorder?action=getuser',
        type: 'POST',
        dataType: 'json',
        async : false,
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
          $("#purchaseorder_issuername").val("");
          $("#purchaseorder_issuername").prop("placeholder",resp["username"]);
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });


      function pad (str, max) { //to add leading zeros in date
           str = str.toString();
           if (str.length==1) {
             return str.length < max ? pad("0" + str, max) : str;
           }
           else{
             return str
           }
       }
       function yearpad (str, max) {
         str = str.toString();
         if (str.length==1) {
           return str.length < max ? pad("200" + str, max) : str;
         }
         else if (str.length==2) {
           return str.length < max ? pad("20" + str, max) : str;
         }
         else{
           return str
         }
       }
      // Following are events to handle enter and up key navigations among fields
      $("#purchaseorder_orderno").keydown(function(event) {
        if (event.which==13) {  //Enter key event
          event.preventDefault();
          $("#purchaseorder_date").focus().select();

        }
      });
     $("#purchaseorder_date").keydown(function(event) {

       if (event.which==38) {  // Up arrow key event
         event.preventDefault();
         $("#purchaseorder_orderno").focus().select();
       }
       if (event.which==13) {
         event.preventDefault();
         $("#purchaseorder_month").focus().select();
       }
     });
     $("#purchaseorder_month").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
         $("#purchaseorder_year").focus().select();
       }
       if (event.which==38) {
         event.preventDefault();
         $("#purchaseorder_date").focus().select();
       }
     });
     $("#purchaseorder_year").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
         $("#designation").focus().select();
       }
       if (event.which==38) {
         event.preventDefault();
         $("#purchaseorder_month").focus().select();
       }
     });

     $("#designation").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
         $("#payterms").focus().select();
       }
       if (event.which==38) {
         event.preventDefault();
         $("#purchaseorder_date").focus().select();
       }
     });


     $("#payterms").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
         $("#modeoftransport").focus().select();
       }
       if (event.which==38) {
         event.preventDefault();
         $("#designation").focus().select();
       }
     });
     $("#modeoftransport").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
         $("#creditperiod").focus().select();
       }
       if (event.which==38) {
         event.preventDefault();
         $("#payterms").focus().select();
       }
     });
     $("#creditperiod").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
         $("#purchaseorder_supplier").focus().select();
       }
       if (event.which==38) {
         event.preventDefault();
         $("#modeoftransport").focus().select();
       }
     });

     $("#purchaseorder_supplier").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
         $("#purchaseorder_state").focus().select();
       }
       if (event.which==38 && (document.getElementById('purchaseorder_supplier').selectedIndex==1||document.getElementById('purchaseorder_supplier').selectedIndex==0)) {
         event.preventDefault();
         $("#creditperiod").focus().select();
       }
     });
     var taxstate;
    $("#purchaseorder_state").keydown(function(event) {
      if (event.which==13) {
        event.preventDefault();
        $("#po_togodown").focus();

        taxstate = $("#purchaseorder_state").val();

        if(taxstate=="none"){
         $(".purchaseorder_product_tax_rate").prop("disabled",true);
        }
        else{
          $(".purchaseorder_product_tax_rate").prop("disabled",false);
        }

      }
      if (event.which==38) {
        event.preventDefault();
        $("#purchaseorder_supplier").focus().select();
      }
    });


   $("#po_togodown").keydown(function(event) {
     if (event.which==13) {
       var togodown = $("#po_togodown option:selected").val();

       event.preventDefault();
       if ($("#purchaseorder_product_table tbody tr:first td:eq(0) select").is(":disabled")||$("#purchaseorder_product_table tbody tr").length==0) {
       }
       else {
         $("#purchaseorder_product_table tbody tr:first td:eq(0) select").focus();
       }


     }
     if (event.which==38) {
       event.preventDefault();
       $("#purchaseorder_state").focus().select();
     }
   });


/*   Modal events */


$("#addpomodal").on('shown.bs.modal', function(event) {
  $('.soday').focus();
});
$("#addpomodal").on('hidden.bs.modal', function(event) {
  $(".purchaseorder_product_per_price").focus();
});
var schedulepcode = 0;
var noofpackages = 0;
$(document).off("click","#addschedule").on("click","#addschedule",function(event)
{
  var curindex = $(this).closest('tr').index();
  schedulepcode = $("#purchaseorder_product_table tbody tr:eq("+curindex+") td:eq(0) select option:selected").val();
  noofpackages = $("#purchaseorder_product_table tbody tr:eq("+curindex+") td:eq(2) input").val();

  $('.sodate').autotab('number');
  var numberofschedulerows = 0;
  $('#schedule_table tbody tr').each(function(){
    if ($(this).attr("value")==schedulepcode || $(this).attr("value")==0) {
    $(this).show();
    numberofschedulerows = numberofschedulerows +1;
    }
    else {
      $(this).hide();
    }
  });
  if (numberofschedulerows == 0) {
    rowhtml = '<td class="col-sm-6">'+
    '<div class="form-group">'+
    '<div class="form-inline ">'+
    '<div class="form-group">'+
    '<input type="text" class="form-control input-sm sodate soday" size="2" maxlength="2" placeholder="DD" >'+
    '</div>'+
    '<div class="form-group">'+
    '<input type="text" class="form-control input-sm sodate somonth" size="2" maxlength="2" placeholder="MM" >'+
    '</div>'+
    '<div class="form-group">'+
    '<input type="text" class="form-control input-sm sodate soyear" size="4" maxlength="4" placeholder="YYYY">'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</td>'+
    '<td class="col-sm-4">'+
    '<input type="text" class="form-control input-sm text-right purchaseorder_schedule_packages" value="0.00">'+
    '</td>'+
    '<td class="col-sm-2"><a href="#" class="scheduledel"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>';
    $('#schedule_table tbody').append('<tr value="'+schedulepcode+'">'+rowhtml+'</tr>');
  }
});

$(document).off("change",".sodate").on("change",".sodate",function(event)
{
    $('.sodate').autotab('number');
  $(document).off("keydown",".soday").on("keydown",".soday",function(event)
  {

    if (event.which==13) {
      event.preventDefault();
      $(".somonth").focus().select();
    }
  });
  $(document).off("keydown",".somonth").on("keydown",".somonth",function(event)
  {

    if (event.which==13) {
      event.preventDefault();
      $(".soyear").focus().select();
    }
  });

});



$(document).off("keydown",".soyear").on("keydown",".soyear",function(event)
{
  var curindex = $(this).closest('tr').index();
  if (event.which==13) {
    event.preventDefault();
    $('#schedule_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
  }
});
//Sets productcode as value of schedule table row
$(document).off("focus",".purchaseorder_schedule_packages").on("focus",".purchaseorder_schedule_packages",function(event) {
  var curindex1 = $(this).closest('tr').index();
  $("#schedule_table tbody tr:eq("+curindex1+")").attr({
    value: schedulepcode
  });

});

$(document).off("keydown",".purchaseorder_schedule_packages").on("keydown",".purchaseorder_schedule_packages",function(event)
{
  var curindex1 = $(this).closest('tr:visible').index();
  var nextindex1 = curindex1+1;
  var previndex1 = curindex1-1;

  if (event.which==13) {
    event.preventDefault();
    //Gets productcode from click event and stores in table row value
    $("#schedule_table tbody tr:eq("+curindex1+")").attr({
      value: schedulepcode
    });

    if ($('#schedule_table tbody tr:eq('+curindex1+') td:eq(1) input').val() > noofpackages) {
      $("#packages-alert").alert();
      $("#packages-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#packages-alert").hide();
      });
      $('#schedule_table tbody tr:eq('+curindex1+') td:eq(1) input').focus();
      return false;
    }
      if ($('#schedule_table tbody tr:eq('+curindex1+') td:eq(0) input').val()=="") {
        $("#dates-improper-alert").alert();
        $("#dates-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#dates-improper-alert").hide();
        });
        $('#schedule_table tbody tr:eq('+curindex1+') td:eq(0) input:first').focus();
        return false;
      }
      if ($('#schedule_table tbody tr:eq('+curindex1+') td:eq(1) input').val()=="" || $("#schedule_table tbody tr:eq("+curindex1+") td:eq(1) input").val()==0) {
        $("#packages-blank-alert").alert();
        $("#packages-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("packages-blank-alert").hide();
        });
        $('#schedule_table tbody tr:eq('+curindex1+') td:eq(1) input').focus();
        return false;
      }
      var curdate = Date.parseExact($(".soyear").val()+$(".somonth").val()+$(".soday").val(), "yyyyMMdd")
      if (!curdate.between(financialstart,financialend)) {
        $("#betweens-date-alert").alert();
        $("#betweens-date-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#betweens-date-alert").hide();
        });
        $('.soday').focus().select();
        return false;
      }

          var obj = {};
          var date = [];
         if ($.trim($("#schedule_table tbody tr:eq("+curindex1+") td:eq(0) input").val())!="") {
            $("#schedule_table tbody tr:eq("+curindex1+") td:eq(0)").each(function(){
              date.push($(".soday",this).val());
              date.push($(".somonth",this).val());
              date.push($(".soyear",this).val());
            });
          }

            var soDateFormatted = date[2] + "-" + date[1] + "-" + date[0];
            date = [];

            obj.sdate = soDateFormatted;
            obj.noofpackages = $("#schedule_table tbody tr:eq("+curindex1+") td:eq(1) input").val();
            schedule.push(obj);

      var rowhtml = $("#schedule_table tbody tr:eq("+curindex1+")").html();
      $('#schedule_table tbody').append('<tr value="'+schedulepcode+'">'+rowhtml+'</tr>');
      $('.sodate').autotab('number');
      $('#schedule_table tbody tr:last').show();
      $('#schedule_table tbody tr:last td:eq(0) input:first').focus();

  }
});
$(document).off("click",".scheduledel").on("click", ".scheduledel", function() {
  $(this).closest('tr').fadeOut(200, function(){
    $(this).closest('tr').remove();	 //closest method gives the closest element productified
    $('#schedule_table tbody tr:last td:eq(0) input').focus().select();
  });
  $('#schedule_table tbody tr:last td:eq(0) select').select();
});

/* End here  */
  /*Table key events */
  $(document).off("keydown",".product_name").on("keydown",".product_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    if (event.which==13) {
      event.preventDefault();
      $('#purchaseorder_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
    }

  });

  $(document).off('focus', '.purchaseorder_product_quantity').on('focus', '.purchaseorder_product_quantity', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".purchaseorder_product_quantity").numeric();
  });
  $(document).off("keydown",".purchaseorder_product_quantity").on("keydown",".purchaseorder_product_quantity",function(event)
  {
    var curindex = $(this).closest('tr').index();
    if (event.which==13) {
      event.preventDefault();
      $('#purchaseorder_product_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
    }
  });

  $(document).off('focus', '.purchaseorder_product_packages').on('focus', '.purchaseorder_product_packages', function(event) {
  event.preventDefault();
  /* Act on the event */
  $(".purchaseorder_product_packages").numeric();
});

$(document).off("keydown",".purchaseorder_product_packages").on("keydown",".purchaseorder_product_packages",function(event)
{
    var curindex = $(this).closest('tr').index();
    if (event.which==13) {
      event.preventDefault();
      $('#purchaseorder_product_table tbody tr:eq('+curindex+') td:eq(3) input').focus().select();
    }
    $(document).off("change",".purchaseorder_product_packages").on("change",".purchaseorder_product_packages",function(event)
    {
       var noofpackages = $(".purchaseorder_product_packages").val();
       if(noofpackages > 1){
         $(".purchaseorder_product_schedule").prop("disabled",false);
        // $('#purchaseorder_product_table tbody tr:eq('+curindex+') td:eq(5) input').focus();

       }
    });
});



  $(document).off('focus', '.purchaseorder_product_per_price').on('focus', '.purchaseorder_product_per_price', function(event) {
    event.preventDefault();
    /* Act on the event */
    $(".purchaseorder_product_per_price").numeric();
  });

  $(document).off('blur', '.purchaseorder_product_per_price').on('blur', '.purchaseorder_product_per_price', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()!="") {
      $(this).val(parseFloat($(this).val()).toFixed(2));
    }
    else
    {
      $(this).val(parseFloat(0).toFixed(2));
    }
  });

  $(document).off("keydown",".purchaseorder_product_tax_rate").on("keydown",".purchaseorder_product_tax_rate",function(event){
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    var selectindex = $('#purchaseorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').index();
    var selectedpo = $('#purchaseorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select').val();
    if (event.which==13) {
      event.preventDefault();
      pcode = $("#purchaseorder_product_table tbody tr:eq("+curindex1+") td:eq(0) select option:selected").val();
      scheduleall[pcode] = schedule;
      schedule=[];
      if (curindex1 != ($("#purchaseorder_product_table tbody tr").length-1)) {
        $('#purchaseorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      else {

        if ($('#purchaseorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
          $("#product-blank-alert").alert();
          $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#product-blank-alert").hide();
          });
          $('#purchaseorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
          return false;
        }

        if ($("#purchaseorder_product_table tbody tr:eq("+curindex1+") td:eq(1) input").val()=="" || $("#purchaseorder_product_table tbody tr:eq("+curindex1+") td:eq(1) input").val()==0) {
          $("#quantity-blank-alert").alert();
          $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#quantity-blank-alert").hide();
          });
          $("#purchaseorder_product_table tbody tr:eq("+curindex1+") td:eq(1) input").focus();
          return false;
        }

        $('#purchaseorder_product_table tbody').append('<tr>'+$("#purchaseorder_product_table tbody tr:first").closest('tr').html()+'</tr>');
        if (curindex1 == 0) {
          $("#purchaseorder_product_table tbody tr:last td:last").append('<a href="#" class="schedule_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
        }
        $(".purchaseorder_product_tax_rate").numeric();
        $('#purchaseorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select option[value='+selectedpo+']').prop('hidden', true).prop('disabled', true);
        $('#purchaseorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
    }
  });

  $(document).off("keydown",".purchaseorder_product_per_price").on("keydown",".purchaseorder_product_per_price",function(event){
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    var selectindex = $('#purchaseorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').index();
    var selectedpo = $('#purchaseorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select').val();

    if (event.which==13) {
      event.preventDefault();
      if($("#purchaseorder_state").val()!="none"){

          $('#purchaseorder_product_table tbody tr:eq('+curindex1+') td:eq(4) input').focus().select();
      }
      else{
        pcode = $("#purchaseorder_product_table tbody tr:eq("+curindex1+") td:eq(0) select option:selected").val();
        scheduleall[pcode] = schedule;
        schedule=[];
        if (curindex1 != ($("#purchaseorder_product_table tbody tr").length-1)) {
          $('#purchaseorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
        }
        else {

          if ($('#purchaseorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
            $("#product-blank-alert").alert();
            $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#product-blank-alert").hide();
            });
            $('#purchaseorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
            return false;
          }

          if ($("#purchaseorder_product_table tbody tr:eq("+curindex1+") td:eq(1) input").val()=="" || $("#purchaseorder_product_table tbody tr:eq("+curindex1+") td:eq(1) input").val()==0) {
            $("#quantity-blank-alert").alert();
            $("#quantity-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#quantity-blank-alert").hide();
            });
            $("#purchaseorder_product_table tbody tr:eq("+curindex1+") td:eq(1) input").focus();
            return false;
          }
          $('#purchaseorder_product_table tbody').append('<tr>'+$("#purchaseorder_product_table tbody tr:first").closest('tr').html()+'</tr>');
          if (curindex1 == 0) {
            $("#purchaseorder_product_table tbody tr:last td:last").append('<a href="#" class="schedule_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
          }
          $(".purchaseorder_product_tax_rate").numeric();
          $('#purchaseorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select option[value='+selectedpo+']').prop('hidden', true).prop('disabled', true);
          $('#purchaseorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
      }
      }
    }

  });

  $(document).off('blur', '.purchaseorder_product_tax_rate').on('blur', '.purchaseorder_product_tax_rate', function(event) {
    event.preventDefault();
    /* Act on the event */
    if ($(this).val()!="") {
      $(this).val(parseFloat($(this).val()).toFixed(2));

    }
    else
    {
      $(this).val(parseFloat(0).toFixed(2));
    }
  });
  $(document).off('focus', '.purchaseorder_product_quantity').on('focus', '.purchaseorder_product_quantity', function(event) {
       event.preventDefault();
       /* Act on the event */
       $(".numtype").numeric();
     });
     $(document).off('blur', '.purchaseorder_product_quantity').on('blur', '.purchaseorder_product_quantity', function(event) {
       event.preventDefault();
       /* Act on the event */
       if ($(this).val()=="")
       {
         $(this).val(0);
       }
     });


     $(document).off("click",".schedule_del").on("click", ".schedule_del", function() {
         $(this).closest('tr').fadeOut(200, function(){
           $(this).closest('tr').remove();	 //closest method gives the closest element productified
           $('#purchaseorder_product_table tbody tr:last td:eq(0) input').focus().select();
         });
         $('#purchaseorder_product_table tbody tr:last td:eq(0) select').select();
       });

       $(document).off('keyup').on('keyup',function(event){
         if(event.which == 45) {
           event.preventDefault();
           $("#posubmit").click();
           return false;
         }
       });

      $("#purchaseorder_date").blur(function(event) {
        $(this).val(pad($(this).val(),2));
      });

      $("#purchaseorder_month").blur(function(event) {
        $(this).val(pad($(this).val(),2));
      });

      $("#purchaseorder_year").blur(function(event) {
        $(this).val(yearpad($(this).val(),4));
      });

      $(document).off("change",".soday").on("change",".soday",function(event){
        $(this).val(pad($(this).val(),2));
      });
      $(document).off("change",".somonth").on("change",".somonth",function(event){
        $(this).val(pad($(this).val(),2));
      });
      $(document).off("change",".soyear").on("change",".soyear",function(event){
          $(this).val(yearpad($(this).val(),4));
      });


    $(document).off("click","#poreset").on("click","#poreset",function(event){
      $("#purchaseorder_create").click();
    });



  $(document).off("change",".product_name").on("change",".product_name",function(event)
  {
    var productcode = $(this).find('option:selected').val();

    var curindex = $(this).closest('tbody tr').index();
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
    var csid;
    $("#purchaseorder_supplier").change(function(event) {
      $.ajax({
        url: '/customersuppliers?action=get',
        type: 'POST',
        dataType: 'json',
        async : false,
        data: {"custid":$("#purchaseorder_supplier option:selected").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        console.log("success");
        if (resp["gkstatus"]==0) {
          csid = resp["gkresult"]["custid"];

          $("#purchaseorder_supplieraddr").val(resp["gkresult"]["custaddr"]);
          if(resp["gkresult"]["custtan"]=="") {
            $("#purchaseorder_suppliertin").val("");
            $("#purchaseorder_suppliertin").prop("placeholder","Not Available");
          }
          else {
            $("#purchaseorder_suppliertin").val(resp["gkresult"]["custtan"]);
          }
        }
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });
    });



    $("#posubmit").click(function(event) {
      event.preventDefault();

       if ($.trim($("#purchaseorder_orderno").val())=="") {


       $("#purchaseorder_orderno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
         $("#purchaseorder_orderno-blank-alert").hide();
       });
       $("#purchaseorder_orderno").focus();
       return false;
      }
       var poOrderno = $("#purchaseorder_orderno").val();
       var designation = $("#designation").val();
       var payterms = $("#payterms").val();
       var modeoftransport = $("#modeoftransport").val();
       var creditperiod = $("#creditperiod").val();
       var purchaseorder_state = $("#purchaseorder_state option:selected").val();
       var togodown = $("#po_togodown option:selected").val();

       var poDay = $("#purchaseorder_date").val();
       var poMonth = $("#purchaseorder_month").val();
       var poYear = $("#purchaseorder_year").val();
       var poDate = poDay+poMonth+poYear;
       var poDateFormatted = poYear + "-" + poMonth + "-" + poDay;
       if (poDay==0)
       {
         $("#date-improper-alert").alert();
         $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#date-improper-alert").hide();
         });
         $("#purchaseorder_date").focus();
         $("#purchaseorder_date").select();
         return false;
       }
       if (poMonth==0)
       {
         $("#date-improper-alert").alert();
         $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#date-improper-alert").hide();
         });
         $("#purchaseorder_month").focus();
         $("#purchaseorder_month").select();
         return false;
       }
       if (poYear==0)
       {
         $("#date-improper-alert").alert();
         $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#date-improper-alert").hide();
         });
         $("#purchaseorder_year").focus();
         $("#purchaseorder_year").select();
         return false;
       }
       if ($.trim($("#purchaseorder_date").val())==""||$.trim($("#purchaseorder_month").val())==""||$.trim($("#purchaseorder_year").val())=="") {
           $("#date-blank-alert").alert();
           $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
             $("#date-blank-alert").hide();
           });
           $("#purchaseorder_date").focus();
           return false;
       }
       if (!Date.parseExact(poDate, "ddMMyyyy")) {
         $("#date-improper-alert").alert();
         $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#date-improper-alert").hide();
         });
         $("#purchaseorder_date").focus();
         $("#purchaseorder_date").select();
         return false;
       }
       var curdate = Date.parseExact($("#purchaseorder_year").val()+$("#purchaseorder_month").val()+$("#purchaseorder_date").val(), "yyyyMMdd")
       if (!curdate.between(financialstart,financialend)) {
         $("#between-date-alert").alert();
         $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#between-date-alert").hide();
         });
         $('#purchaseorder_date').focus().select();
         return false;
       }

       if ($.trim($("#designation").val())=="") {
         $("#designation-blank-alert").alert();
         $("#designation-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#designation-blank-alert").hide();
         });
         $("#designation").focus();
         return false;
       }
       if ($.trim($("#payterms").val())=="") {
         $("#modeofpayment-blank-alert").alert();
         $("#modeofpayment-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#modeofpayment-blank-alert").hide();
         });
         $("#payterms").focus();
         return false;
       }
       if ($.trim($("#modeoftransport").val())=="") {
         $("#modeoftransport-blank-alert").alert();
         $("#modeoftransport-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#modeoftransport-blank-alert").hide();
         });
         $("#modeoftransport").focus();
         return false;
       }

       if ($.trim($("#creditperiod").val())=="") {
         $("#creditperiod-blank-alert").alert();
         $("#creditperiod-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#creditperiod-blank-alert").hide();
         });
         $("#creditperiod").focus();
         return false;
       }
       var scheduledata = {};

       $("#purchaseorder_product_table  tbody tr").each(function(){

         for (var i = 0; i < $("#purchaseorder_product_table tbody tr").length; i++) {

           pcode = $("#purchaseorder_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();

           var obj = {};
           obj.productname = $.trim($("#purchaseorder_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").text());
           obj.quantity = $("#purchaseorder_product_table tbody tr:eq("+i+") td:eq(1) input").val();
           obj.packages = $("#purchaseorder_product_table tbody tr:eq("+i+") td:eq(2) input").val();
           obj.rateperunit = $("#purchaseorder_product_table tbody tr:eq("+i+") td:eq(3) input").val();
           obj.staggered = scheduleall[pcode];
           obj.taxrate = parseFloat($("#purchaseorder_product_table tbody tr:eq("+i+") td:eq(5) input").val()).toFixed(2);
           scheduledata[pcode] = obj;


           if ($("#purchaseorder_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()=="") {
             $("#product-blank-alert").alert();
             $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
               $("#product-blank-alert").hide();
             });
             $("#purchaseorder_product_table tbody tr:eq("+i+") td:eq(0) select").focus();
             return false;
           }


         }
       });

         $('.modal-backdrop').remove();
         $('.modal').modal('hide');
         $('#confirm_yes').modal('show').one('click', '#po_save_yes', function (event) {
               $.ajax({
                 url: '/purchaseorder?action=save',
                 type: 'POST',
                 dataType: 'json',
                 async : false,
                 data: {"orderno": poOrderno,
                 "orderdate":poDateFormatted,
                 "creditperiod":creditperiod,
                 "payterms":payterms,
                 "modeoftransport":modeoftransport,
                 "designation":designation,
                 "schedule":JSON.stringify(scheduledata),
                 "taxstate":purchaseorder_state,
                  "psflag":16,
                  "csid":csid,
                  "togodown":togodown
                },
                 beforeSend: function(xhr)
                 {
                   xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
                 }
               })
               .done(function(resp) {
                 if(resp["gkstatus"] == 0){
                   $('.modal-backdrop').remove();
                   $("#purchaseorder_create").click();
                   $("#success-alert").alert();
                   $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
                     $("#success-alert").hide();
                   });
                   return false;
                 }
                 else if(resp["gkstatus"]==1) {
                   $('.modal-backdrop').remove();
                   $("#duplicate-alert").alert();
                   $("#purchaseorder_orderno").focus();
                   $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
                     $("#duplicate-alert").hide();
                   });
                   return false;
                 }
                 else{
                   $('.modal-backdrop').remove();
                   $("#purchaseorder_orderno").focus();
                   $("#failure-alert").alert();
                   $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
                     $("#failure-alert").hide();
                   });
                 }

               })
               .fail(function() {
                 console.log("error");
               })
               .always(function() {
                 console.log("complete");
               });

               return false;

     });
     $("#confirm_yes").on('shown.bs.modal', function(event) {
       $('#po_save_no').focus();
     });
     $("#confirm_yes").on('hidden.bs.modal', function(event) {
       $("#purchaseorder").click();
       $("#purchaseorder_orderno").focus();
     });

    }); /* save click */
});
