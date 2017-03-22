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

// This script is for the addsalesorder.jinja2

$(document).ready(function() {
  $('.modal-backdrop').remove();
      $("#salesorder_orderno").focus();
      var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
      var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
      $('.sodate').autotab('number');
      $('.salesorder_product_quantity').numeric({ negative : false });
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
          $("#salesorder_issuername").val("");
          $("#salesorder_issuername").prop("placeholder",resp["username"]);
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

      // Following are events to handle enter and up key navigations among fields
      $("#salesorder_orderno").keydown(function(event) {
        if (event.which==13) {  //Enter key event
          event.preventDefault();
          $(".soday").focus().select();

        }
      });
      $(".soday").keydown(function(event) {

        if (event.which==38) {  // Up arrow key event
          event.preventDefault();
          $("#salesorder_orderno").focus().select();
        }
        if (event.which==13) {
          event.preventDefault();
          $(".somonth").focus().select();
        }
      });

     $(".somonth").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
         $(".soyear").focus().select();
       }
       if (event.which==38) {
         event.preventDefault();
         $(".soday").focus().select();
       }
     });
     $(".soyear").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
         $("#designation").focus().select();
       }
       if (event.which==38) {
         event.preventDefault();
         $(".somonth").focus().select();
       }
     });

     $("#designation").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
         $("#payterms").focus().select();
       }
       if (event.which==38) {
         event.preventDefault();
         $(".soyear").focus().select();
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
         $("#salesorder_customer").focus().select();
       }
       if (event.which==38) {
         event.preventDefault();
         $("#modeoftransport").focus().select();
       }
     });

     $("#salesorder_customer").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
         $("#salesorder_state").focus().select();
       }
       if (event.which==38 && (document.getElementById('salesorder_customer').selectedIndex==1||document.getElementById('salesorder_customer').selectedIndex==0)) {
         event.preventDefault();
         $("#creditperiod").focus().select();
       }
     });
      var taxstate;
     $("#salesorder_state").keydown(function(event) {
       if (event.which==13) {
         event.preventDefault();
           $("#so_togodown").focus();
           taxstate = $("#salesorder_state").val();
           console.log(taxstate);
           if(taxstate=="none"){
            $(".salesorder_product_tax_rate").prop("disabled",true);
           }
           else{
             $(".salesorder_product_tax_rate").prop("disabled",false);
           }
       }
       if (event.which==38) {
         event.preventDefault();
         $("#salesorder_customer").focus().select();
       }
     });



   $("#so_togodown").keydown(function(event) {
     if (event.which==13) {
       var togodown = $("#so_togodown option:selected").val();
       console.log(togodown);
       event.preventDefault();
       if ($("#salesorder_product_table tbody tr:first td:eq(0) select").is(":disabled")||$("#salesorder_product_table tbody tr").length==0) {
       }
       else {
         $("#salesorder_product_table tbody tr:first td:eq(0) select").focus();
       }


     }
     if (event.which==38) {
       event.preventDefault();
       $("#salesorder_state").focus().select();
     }
   });

     /*Table key events */
     $(document).off("keydown",".product_name").on("keydown",".product_name",function(event)
     {
       var curindex = $(this).closest('tr').index();
       if (event.which==13) {
         event.preventDefault();
         $('#salesorder_product_table tbody tr:eq('+curindex+') td:eq(1) input').focus().select();
       }
     });
     $(document).off('focus', '.salesorder_product_quantity').on('focus', '.salesorder_product_quantity', function(event) {
       event.preventDefault();
       /* Act on the event */
       $(".salesorder_product_quantity").numeric();
     });
     $(document).off("keydown",".salesorder_product_quantity").on("keydown",".salesorder_product_quantity",function(event)
     {
       var curindex = $(this).closest('tr').index();
       if (event.which==13) {
         event.preventDefault();
         $('#salesorder_product_table tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
       }
     });

     $(document).off('focus', '.salesorder_product_packages').on('focus', '.salesorder_product_packages', function(event) {
     event.preventDefault();
     /* Act on the event */
     $(".salesorder_product_packages").numeric();
   });

   $(document).off("keydown",".salesorder_product_packages").on("keydown",".salesorder_product_packages",function(event)
   {
     var curindex = $(this).closest('tr').index();
       if (event.which==13) {
         event.preventDefault();
         $('#salesorder_product_table tbody tr:eq('+curindex+') td:eq(3) input').focus().select();
       }

   });

     $(document).off('focus', '.salesorder_product_per_price').on('focus', '.salesorder_product_per_price', function(event) {
       event.preventDefault();
       /* Act on the event */
       $(".salesorder_product_per_price").numeric();
     });

     $(document).off("keydown",".salesorder_product_per_price").on("keydown",".salesorder_product_per_price",function(event)
     {
       var curindex = $(this).closest('tr').index();
       if (event.which==13) {
         event.preventDefault();
         $('#salesorder_product_table tbody tr:eq('+curindex+') td:eq(3) input').focus().select();
       }
     });



     $(document).off('blur', '.salesorder_product_per_price').on('blur', '.salesorder_product_per_price', function(event) {
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

     $(document).off('blur', '.salesorder_product_tax_rate').on('blur', '.salesorder_product_tax_rate', function(event) {
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



     $(document).off('focus', '.salesorder_product_quantity').on('focus', '.salesorder_product_quantity', function(event) {
          event.preventDefault();
          /* Act on the event */
          $(".numtype").numeric();
        });
        $(document).off('blur', '.salesorder_product_quantity').on('blur', '.salesorder_product_quantity', function(event) {
          event.preventDefault();
          /* Act on the event */
          if ($(this).val()=="")
          {
            $(this).val(0);
          }
        });

     $(document).off("keydown",".salesorder_product_per_price").on("keydown",".salesorder_product_per_price",function(event)
     {
       var curindex1 = $(this).closest('tr').index();
       var nextindex1 = curindex1+1;
       var previndex1 = curindex1-1;
       var selectindex = $('#salesorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').index();
       var selectedso = $('#salesorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select').val();

       if (event.which==13) {
         if($("#salesorder_state").val()!="none"){
           console.log($("#purchaseorder_state").val());
             $('#salesorder_product_table tbody tr:eq('+curindex1+') td:eq(4) input').focus().select();
         }
         else{

         event.preventDefault();
         if (curindex1 != ($("#salesorder_product_table tbody tr").length-1)) {
           $('#salesorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
         }
         else {

           if ($('#salesorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
             $("#product-blank-alert").alert();
             $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
               $("#product-blank-alert").hide();
             });
             $('#salesorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
             return false;
           }


           $('#salesorder_product_table tbody').append('<tr>'+$("#salesorder_product_table tbody tr:last").closest('tr').html()+'</tr>');
            if (curindex1 == 0) {
              $("#salesorder_product_table tbody tr:last td:last").append('<a href="#" class="schedule_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
            }
           $(".salesorder_product_tax_rate").numeric();
           $('#salesorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select option[value='+selectedso+']').prop('hidden', true).prop('disabled', true);
           $('#salesorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();

         }
       }
       }

   });
   $(document).off("keydown",".salesorder_product_tax_rate").on("keydown",".salesorder_product_tax_rate",function(event)
   {
     var curindex1 = $(this).closest('tr').index();
     var nextindex1 = curindex1+1;
     var previndex1 = curindex1-1;
     var selectindex = $('#salesorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').index();
     var selectedso = $('#salesorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select').val();

     if (event.which==13) {


       event.preventDefault();
       if (curindex1 != ($("#salesorder_product_table tbody tr").length-1)) {
         $('#salesorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
       }
       else {

         if ($('#salesorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select option:selected').val()=="") {
           $("#product-blank-alert").alert();
           $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
             $("#product-blank-alert").hide();
           });
           $('#salesorder_product_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
           return false;
         }
         $('#salesorder_product_table tbody').append('<tr>'+$("#salesorder_product_table tbody tr:last").closest('tr').html()+'</tr>');
         if (curindex1 == 0) {
           $("#salesorder_product_table tbody tr:last td:last").append('<a href="#" class="schedule_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>');
         }
         $(".salesorder_product_tax_rate").numeric();
         $('#salesorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select option[value='+selectedso+']').prop('hidden', true).prop('disabled', true);
         $('#salesorder_product_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();

       }

     }

 });

     $(document).off("click",".schedule_del").on("click", ".schedule_del", function() {
         $(this).closest('tr').fadeOut(200, function(){
           $(this).closest('tr').remove();	 //closest method gives the closest element productified
           $('#salesorder_product_table tbody tr:last td:eq(0) input').focus().select();
         });
         $('#salesorder_product_table tbody tr:last td:eq(0) select').select();
       });


       $(document).off('keyup').on('keyup',function(event){
         if(event.which == 45) {
           event.preventDefault();
           $("#sosubmit").click();
           return false;
         }
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

      $(document).off("change",".soday").on("change",".soday",function(event){
        $(this).val(pad($(this).val(),2));
      });
      $(document).off("change",".somonth").on("change",".somonth",function(event){
        $(this).val(pad($(this).val(),2));
      });
      $(document).off("change",".soyear").on("change",".soyear",function(event){
          $(this).val(yearpad($(this).val(),4));
      });



      $(document).off("click","#soreset").on("click","#soreset",function(event){
        $("#salesorder_create").click();
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
    var csid;
    $("#salesorder_customer").change(function(event) {
      $.ajax({
        url: '/customersuppliers?action=get',
        type: 'POST',
        dataType: 'json',
        async : false,
        data: {"custid":$("#salesorder_customer option:selected").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        }
      })
      .done(function(resp) {
        console.log("success");
        if (resp["gkstatus"]==0) {
          csid = resp["gkresult"]["custid"];
          console.log("heyy:");
          console.log(csid);
          $("#salesorder_customeraddr").val(resp["gkresult"]["custaddr"]);
          if(resp["gkresult"]["custtan"]=="") {
            $("#salesorder_customertin").val("");
            $("#salesorder_customertin").prop("placeholder","Not Available");
          }
          else {
            $("#salesorder_customertin").val(resp["gkresult"]["custtan"]);
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

    $("#sosubmit").click(function(event) {
      event.preventDefault();
      console.log("sdjg");
       if ($.trim($("#salesorder_orderno").val())=="") {
       $("#salesorder_orderno-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
         $("#salesorder_orderno-blank-alert").hide();
       });
       $("#salesorder_orderno").focus();
       return false;
      }
       var soOrderno = $("#salesorder_orderno").val();
       var designation = $("#designation").val();
       var payterms = $("#payterms").val();
       var modeoftransport = $("#modeoftransport").val();
       var creditperiod = $("#creditperiod").val();
       var salesorder_state = $("#salesorder_state option:selected").val();
       var taxrate = $("#taxrate").val();
       var soDay = $(".soday").val();
       var soMonth = $(".somonth").val();
       var soYear = $(".soyear").val();
      var togodown = $("#so_togodown option:selected").val();
       var soDate = soDay+soMonth+soYear;
       var soDateFormatted = soYear + "-" + soMonth + "-" + soDay;
       if (soDay==0)
       {
         $("#date-improper-alert").alert();
         $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#date-improper-alert").hide();
         });
         $(".soday").focus();
         $(".soday").select();
         return false;
       }
       if (soMonth==0)
       {
         $("#date-improper-alert").alert();
         $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#date-improper-alert").hide();
         });
         $(".somonth").focus();
         $(".somonth").select();
         return false;
       }
       if (soYear==0)
       {
         $("#date-improper-alert").alert();
         $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#date-improper-alert").hide();
         });
         $(".soday").focus();
         $(".soday").select();
         return false;
       }
       if ($.trim($(".soday").val())==""||$.trim($(".somonth").val())==""||$.trim($(".soyear").val())=="") {
           $("#date-blank-alert").alert();
           $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
             $("#date-blank-alert").hide();
           });
           $(".soday").focus();
           return false;
       }
       if (!Date.parseExact(soDate, "ddMMyyyy")) {
         $("#date-improper-alert").alert();
         $("#date-improper-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#date-improper-alert").hide();
         });
         $(".soday").focus();
         $(".soday").select();
         return false;
       }
       var curdate = Date.parseExact($(".soyear").val()+$(".somonth").val()+$(".soday").val(), "yyyyMMdd")
       if (!curdate.between(financialstart,financialend)) {
         $("#between-date-alert").alert();
         $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
           $("#between-date-alert").hide();
         });
         $('.soday').focus().select();
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
       $("#salesorder_product_table  tbody tr").each(function(){
         for (var i = 0; i < $("#salesorder_product_table tbody tr").length; i++) {
           console.log(i);
           var obj = {};
           pcode = $("#salesorder_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val();
           obj.productname = $.trim($("#salesorder_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").text());
           obj.quantity = $("#salesorder_product_table tbody tr:eq("+i+") td:eq(1) input").val();
            obj.packages = $("#salesorder_product_table tbody tr:eq("+i+") td:eq(2) input").val();
           obj.rateperunit = $("#salesorder_product_table tbody tr:eq("+i+") td:eq(3) input").val();

           obj.taxrate = parseFloat($("#salesorder_product_table tbody tr:eq("+i+") td:eq(4) input").val()).toFixed(2);
           obj.staggered = [];

              scheduledata[pcode] = obj;
             console.log("scheduledata"+scheduledata[pcode]);

           if ($("#salesorder_product_table tbody tr:eq("+i+") td:eq(0) select option:selected").val()=="") {
             $("#product-blank-alert").alert();
             $("#product-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
               $("#product-blank-alert").hide();
             });
             $("#salesorder_product_table tbody tr:eq("+i+") td:eq(0) select").focus();
             return false;
           }

           }
       });

         $('.modal-backdrop').remove();
         $('.modal').modal('hide');
         $("#confirm_yes").on('shown.bs.modal', function(event) {
           $('#so_save_no').focus();
         });
         $('#confirm_yes').modal('show').one('click', '#so_save_yes', function (event) {

               $.ajax({
                 url: '/salesorder?action=save',
                 type: 'POST',
                 dataType: 'json',
                 async : false,
                 data: {"orderno": soOrderno,
                 "orderdate":soDateFormatted,
                 "creditperiod":creditperiod,
                 "payterms":payterms,
                 "modeoftransport":modeoftransport,
                 "designation":designation,
                 "schedule":JSON.stringify(scheduledata),
                 "taxstate":salesorder_state,
                  "psflag":20,
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
                   if ($("#salesorder_view").length > 0) {
                     $("#salesorder_create").click();
                   }
                   else {
                     $("#purchaseorder").click();
                   }
                   $("#success-alert").alert();
                   $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
                     $("#success-alert").hide();
                   });
                   return false;
                 }
                 else if(resp["gkstatus"]==1) {
                   $('.modal-backdrop').remove();
                   $("#soduplicate-alert").alert();
                   $("#soduplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
                     $("#salesorder_orderno").focus();
                     $("#soduplicate-alert").hide();
                   });
                   return false;
                 }
                 else{
                   $('.modal-backdrop').remove();
                   $("#salesorder_orderno").focus();
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

    }); /* save click */

});
