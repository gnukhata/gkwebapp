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


Contributors:
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
*/

// This script is for the add category page

$(document).ready(function() {
  $('.modal-backdrop').remove();


  if ($("#catcount").val()==0)
  {
      $("#new_parent_name").focus();
  }
  else
  {
      $("#category_under").focus();
  }

//
$("#category_under").change(function(event) {
  $.ajax({
    url: '/customersuppliers?action=get',
    type: 'POST',
    dataType: 'json',
    async : false,
    data: {"custid":$("#deliverychallan_customer option:selected").val()},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    }
  })
  .done(function(resp) {
    console.log("success");
    if (resp["gkstatus"]==0) {
      $("#deliverychallan_customeraddr").val(resp["gkresult"]["custaddr"]);
      $("#deliverychallan_supplieraddr").val(resp["gkresult"]["custaddr"]);
    }
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });
});


  $("#category_under").keydown(function(event) {

    if (event.which==13) {
        event.preventDefault();
        $("#child_category_name").focus();
    //    $("#category_name").select();
    }

     if (event.which==32)
    {
      event.preventDefault();
      $("#oldparentdiv").hide();
      $("#new_parent_div1").show();

      $("#new_parent_name").focus();
    }

  });
});
$("#child_category_name").keydown(function(event) {

  if (event.which==13) {
      event.preventDefault();
      $("#child_spec").focus();
    }
  });

/*  $("#parent_spec").click(function() {
    $("#addspecspopup").html("");
    $('.modal-backdrop').remove();

    $('.modal').modal('hide');


    //$('#addspecmodal').show();
    $('#addspecmodal').modal('show');
    console.log("success baraskar");
    $('#addspecmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
    {
      //$("#godownname").focus();
    });
  });*/


$("#child_spec").click(function() {

  $("#addspecspopup").html("");
  $('.modal-backdrop').remove();

  $('.modal').modal('hide');


  $('#addspecmodal').show();
  $('#addspecmodal').modal('show');
  console.log("success rohini11");
  $('#addspecmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
  {
    //$("#godownname").focus();
  });

});






$("#child_tax").click(function() {
 $.ajax(
 {
 type: "POST",
 url: "/category?type=addtaxpopup",
 global: false,
 async: false,
 datatype: "text/html",
 beforeSend: function(xhr)
   {
     xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
   },
 success: function(resp)
 {

	     $("#addtaxpopup").html("");
	     $('.modal-backdrop').remove();

       $('.modal').modal('hide');

       $("#addtaxpopup").html(resp);

       $('#addtaxmodal').modal('show');
       console.log("success rohini");
       $('#addtaxmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
       {

       });

}
 });
});


/* If a parent category is selected then its specs are automatically inhereted by its child category and the specs are displayed */
  $("#category_under").change(function(event) {

    /* when a (parent)category is changed by the user except the last blank row all the other category spec rows are removed
    and replaced with the spec rows of the newly selected (parent)category
    */

    var category_code = $("#category_under option:selected").val();

    // ajax for getting the specs of the newly selected (parent)category
    $.ajax({
      url: '/category?action=getspecs',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"categorycode": category_code},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      console.log("success rohini  ");


      for (spec of resp["gkresult"].reverse()) {
        console.log(" "+spec["attrtype"]);
        var trs;
        if (spec["attrtype"]==0) {
          trs ="Text"
          }
        else if (spec["attrtype"]==1) {
          trs =
          "Number"
                  }
        else if (spec["attrtype"]==2) {
          trs ="Date"
        }
        else if (spec["attrtype"]==3) {
          trs="Option"
        }
        $('#spectbl tbody').prepend('<tr>'+
        '<td class="col-xs-8">'+
        spec["attrname"]+
        '</td>'+
        '<td class="col-xs-3">'+
        trs+
        '</td>'+

        '</tr>');
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });
var specs = [];
var taxes = [];
$(document).off("keydown",".spec_type").on("keydown",".spec_type",function(event)
{
  var curindex1 = $(this).closest('tr').index();
  var nextindex1 = curindex1+1;
  var previndex1 = curindex1-1;
  if (event.which==13) {
    event.preventDefault();




    if (curindex1 != ($("#category_spec_table tbody tr").length-1)) {
      $('#category_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
    }
    else {
      if ($('#category_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').val()=="") {
        $("#spec-blank-alert").alert();
        $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#spec-blank-alert").hide();
        });
        $('#category_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus();
        return false;
      }
      var obj = {};
      //dict for specs
      if ($.trim($("#category_spec_table tbody tr:eq("+curindex1+") td:eq(0) input").val())!="") {
        obj.attrname = $("#category_spec_table tbody tr:eq("+curindex1+") td:eq(0) input").val();
        obj.attrtype = $("#category_spec_table tbody tr:eq("+curindex1+") td:eq(1) select").val();
        specs.push(obj);
      }
      // appending a new row for adding another spec to category
      $('#category_spec_table tbody').append('<tr>'+
      '<td class="col-xs-8">'+
      '<input type="text" class="form-control input-sm spec_name" placeholder="Spec Name">'+
      '</td>'+
      '<td class="col-xs-3">'+
      '<select id="category_spec_type" class="form-control input-sm spec_type">'+
      '<option value="0">Text</option>'+
      '<option value="1">Number</option>'+
      '<option value="2">Date</option>'+
      '<option value="3">Option</option>'+
      '</select>'+
      '</td>'+
      '<td class="col-xs-1">'+
      '<a href="#" class="spec_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
      '</td>'+
      '</tr>');
      $('#category_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
    }
  }


});
  /*-----------------------------Rohini------------------------*/
  $(document).off("keydown",".tax_rate").on("keydown",".tax_rate",function(event)
   {

     var curindex1 = $(this).closest('tr').index();
     var nextindex1 = curindex1+1;
     var previndex1 = curindex1-1;
     if (event.which==13) {
       event.preventDefault();
       if (curindex1 != ($("#category_tax_table tbody tr").length-1)) {
         $('#category_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
       }
       else {
           //validations for blank tax(CVAT or VAT) and and blank tax rate
         if ($('#category_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').val()=="") {
           $("#tax-name-blank-alert").alert();
           $("#tax-name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
             $("#tax-name-blank-alert").hide();
           });
           $('#category_tax_table tbody tr:eq('+curindex1+') td:eq(0) select').focus();
           return false;
         }
         if ($('#category_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').val()=="") {
           $("#tax-rate-blank-alert").alert();
           $("#tax-rate-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
             $("#tax-rate-blank-alert").hide();
           });
           $('#category_tax_table tbody tr:eq('+curindex1+') td:eq(2) input').focus();
           return false;
         }
         var obj = {}; // dict for storing tax details
        obj.taxname = $("#category_tax_table tbody tr:eq("+curindex1+") td:eq(0) select").val();
        obj.state = $("#category_tax_table tbody tr:eq("+curindex1+") td:eq(1) select option:selected").val();
        obj.taxrate = $("#category_tax_table tbody tr:eq("+curindex1+") td:eq(2) input").val();
        taxes.push(obj);

         // appending a new row for adding another tax to category

         $('#category_tax_table tbody').append('<tr>'+
         '<td class="col-xs-4">'+
         '<select class="form-control input-sm tax_name">'+
           '<option value="" selected>Select Tax</option>'+
           '<option value="VAT">VAT</option>'+
           '<option value="CVAT">CVAT</option>'+
         '</select>'+
         '</td>'+
         '<td class="col-xs-4">'+
         '<select class="form-control input-sm tax_state" >'+
         '<option value="">None</option><option value="Andaman and Nicobar Islands" stateid="1">Andaman and Nicobar Islands</option><option value="Andhra Pradesh" stateid="2">Andhra Pradesh</option><option value="Arunachal Pradesh" stateid="3">Arunachal Pradesh</option><option value="Assam" stateid="4">Assam</option><option value="Bihar" stateid="5">Bihar</option><option value="Chandigarh" stateid="6">Chandigarh</option><option value="Chhattisgarh" stateid="7">Chhattisgarh</option><option value="Dadra and Nagar Haveli" stateid="8">Dadra and Nagar Haveli</option><option value="Daman and Diu" stateid="9">Daman and Diu</option><option value="Delhi" stateid="10">Delhi</option><option value="Goa" stateid="11">Goa</option><option value="Gujarat" stateid="12">Gujarat</option><option value="Haryana" stateid="13">Haryana</option><option value="Himachal Pradesh" stateid="14">Himachal Pradesh</option><option value="Jammu and Kashmir" stateid="15">Jammu and Kashmir</option><option value="Jharkhand" stateid="16">Jharkhand</option><option value="Karnataka" stateid="17">Karnataka</option><option value="Kerala" stateid="19">Kerala</option><option value="Lakshadweep" stateid="20">Lakshadweep</option><option value="Madhya Pradesh" stateid="21">Madhya Pradesh</option><option value="Maharashtra" stateid="22">Maharashtra</option><option value="Manipur" stateid="23">Manipur</option><option value="Meghalaya" stateid="24">Meghalaya</option><option value="Mizoram" stateid="25">Mizoram</option><option value="Nagaland" stateid="26">Nagaland</option><option value="Odisha" stateid="29">Odisha</option><option value="Pondicherry" stateid="31">Pondicherry</option><option value="Punjab" stateid="32">Punjab</option><option value="Rajasthan" stateid="33">Rajasthan</option><option value="Sikkim" stateid="34">Sikkim</option><option value="Tamil Nadu" stateid="35">Tamil Nadu</option><option value="Telangana" stateid="36">Telangana</option><option value="Tripura" stateid="37">Tripura</option><option value="Uttar Pradesh" stateid="38">Uttar Pradesh</option><option value="Uttarakhand" stateid="39">Uttarakhand</option><option value="West Bengal" stateid="41">West Bengal</option>'+
         '</select>'+
         '</td>'+
         '<td class="col-xs-3">'+
         '<input class="form-control input-sm tax_rate text-right"  placeholder="Rate">'+
         '</td>'+
         '<td class="col-xs-1">'+
         '<a href="#" class="tax_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
         '</td>'+
         '</tr>');
         $(".tax_rate").numeric();
         $('#category_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
       }
     }
     else if(event.which==190 && event.shiftKey)
     {
       event.preventDefault();
       $('#category_tax_table tbody tr:eq('+nextindex1+') td:eq(2) input').focus().select();
     }
     else if (event.which==188 && event.shiftKey)
     {
       if(previndex1>-1)
       {
         event.preventDefault();
         $('#category_tax_table tbody tr:eq('+previndex1+') td:eq(2) input').focus().select();
       }
     }
     else if (event.ctrlKey && event.which==188) {
       event.preventDefault();
       $('#category_tax_table tbody tr:eq('+curindex1+') td:eq(1) select').focus();
     }
     else if (event.which==190 && event.ctrlKey) {
       event.preventDefault();
       $('#category_tax_table tbody tr:eq('+nextindex1+') td:eq(0) select').focus().select();
     }


   });
   $(document).off("click",".tax_del").on("click", ".tax_del", function() {
     $(this).closest('tr').fadeOut(200, function(){
       $(this).closest('tr').remove();	 //closest method gives the closest element specified
       $('#category_tax_table tbody tr:last td:eq(0) select').focus().select();
     });
     $('#category_tax_table tbody tr:last td:eq(0) select').select();
   });

  //////////////////////////
  $("#parent_save").click(function(event) {
    console.log(specs);
    console.log(taxes);
    $.ajax({
          url: '/category?action=save',
          type: 'POST',
          dataType: 'json',
          async : false,
          data: {"categoryname": $("#new_parent_name").val(),"subcategoryof":"","specs":JSON.stringify(specs),"taxes":JSON.stringify(taxes)},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          }
        })
        .done(function(resp) {
          if(resp["gkstatus"] == 0){
            $("#success-alert").alert();
console.log("roooo");
            $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#success-alert").hide();
              $("#searchcategory").show();
              $("#addcategory").click();
              });
            return false;
          }
          else if(resp["gkstatus"] == 1){
            $("#category_name").focus().select();
            $("#duplicate-alert").alert();
            $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#duplicate-alert").hide();
            });
            return false;0
          }
          else {
            $("#category_name").focus();
            $("#failure-alert").alert();
            $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#failure-alert").hide();
            });
            return false;
          }
        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });
});
