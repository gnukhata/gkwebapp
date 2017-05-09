/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
This file is part of GNUKhata:A modular,robust and Free Accounting System.

GNUKhata is Free Software; you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation; either version 3 of
the License, or (at your option) any later version.

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
"Rohini Baraskar" <robaraskar@gmail.com>
*/

$(document).ready(function() {
  $("#add_cussup_name").focus().select();
  $("#add_cussup_name").keydown(function(event) {
     if (event.which==13) {
      if ($.trim($("#add_cussup_name").val())=="") {
        $("#name-blank-alert").alert();
        $("#name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#name-blank-alert").hide();
        });
        $("#add_cussup_name").focus();
        return false;
      }
      event.preventDefault();
      $("#add_cussup_email").focus().select();
    }
  });
  $("#add_cussup_email").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#add_cussup_phone").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_name").focus().select();
    }
  });
  $("#add_cussup_phone").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#add_state").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_email").focus().select();
    }
  });
  $("#add_state").keydown(function(event) {
    if (event.which==13) {
      if ($.trim($("#add_state").val())=="") {
        $("#state-blank-alert").alert();
        $("#state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#state-blank-alert").hide();
        });

          $("#add_state").focus();
        return false;
      }
      event.preventDefault();
      $("#add_cussup_address").focus().select();
    }
    if (event.which==38 && $("#add_state option:selected").index()==0)  {
      event.preventDefault();
      $("#add_cussup_phone").focus().select();
    }
  });
  var delta = 500;
  var lastKeypressTime = 0;
  $("#add_cussup_address").keydown(function(event) {
    if (event.which==13)
    {
      var thisKeypressTime = new Date();
      if ( thisKeypressTime - lastKeypressTime <= delta )
      {
        if ($.trim($("#add_cussup_address").val())=="") {
          $("#address-blank-alert").alert();
          $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#address-blank-alert").hide();
          });
          $("#add_cussup_address").focus();
          return false;
        }
        $("#add_cussup_fax").focus();
        // optional - if we'd rather not detect a triple-press
        // as a second double-press, reset the timestamp
        thisKeypressTime = 0;
      }
      lastKeypressTime = thisKeypressTime;
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_state").focus();
    }
  });
  $("#add_cussup_fax").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#add_cussup_pan").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_address").focus().select();
    }
  });
  $("#add_cussup_pan").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#add_cussup_tan").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_fax").focus().select();
    }
  });
  $("#add_cussup_tan").keydown(function(event) {
    if (event.which==13) {
      if ($.trim($("#add_cussup_tan").val())=="") {
        $("#tin-blank-alert").alert();
        $("#tin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#tin-blank-alert").hide();
        });
        $("#add_cussup_tan").focus();
        return false;
      }
      event.preventDefault();
      $("#cussup_save").click();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_pan").focus().select();
    }
  });
  $("#add_cussup_reset").click(function(event) {
    $("#customersupplier_create").click();
  });
  $(document).keyup(function(event) {
    if(event.which == 45) {
      event.preventDefault();
      $("#cussup_save").click();
      return false;
    }
  });

  $("#cussup_save").click(function(event) {
    event.preventDefault();
    var custsupval;
    if ($("#deliverychallan_gkstatus").val()=='in' || $('#status').val()=='9') {
         custsupval= 19;
    }
    else {
         custsupval= 3 ;
    }
    // custsupdata = 3 if customer or 19 if supplier
    var groupcode = -1;
    if (custsupval == '3'){
      groupcode = $("#debtgroupcode").val();
    }
    else {
      groupcode = $("#credgroupcode").val();
    }
    if ($.trim($("#add_cussup_name").val())=="") {
      $("#name-blank-alert").alert();
      $("#name-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#name-blank-alert").hide();
      });
      $("#add_cussup_name").focus();
      return false;
    }
    if ($.trim($("#add_state").val())=="") {
      $("#state-blank-alert").alert();
      $("#state-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#state-blank-alert").hide();
      });

        $("#add_state").focus();
      return false;
    }
    if ($.trim($("#add_cussup_address").val())=="") {
      $("#address-blank-alert").alert();
      $("#address-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#address-blank-alert").hide();
      });
      $("#add_cussup_address").focus();
      return false;
    }
    if ($.trim($("#add_cussup_tan").val())=="") {
      $("#tin-blank-alert").alert();
      $("#tin-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#tin-blank-alert").hide();
      });
      $("#add_cussup_tan").focus();
      return false;
    }


    $.ajax({
      url: '/customersuppliers?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"custname": $("#add_cussup_name").val(),
      "custaddr": $.trim($("#add_cussup_address").val()),
      "custphone": $("#add_cussup_phone").val(),
      "custemail": $("#add_cussup_email").val(),
      "custfax": $("#add_cussup_fax").val(),
      "custpan": $("#add_cussup_pan").val(),
      "custtan": $("#add_cussup_tan").val(),
      "state" : $("#add_state").val(),
      "csflag": custsupval},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {

      if(resp["gkstatus"] == 0){
        $.ajax(
          {

            type: "POST",
            url: "/addaccount",
            global: false,
            async: false,
            datatype: "json",
            data: {"accountname":$("#add_cussup_name").val(),"openbal":0,"subgroupname":groupcode},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(resp)
            {
              if(resp["gkstatus"]==0)
              {
                var customeradded = $("#add_cussup_name").val();
                $('#selectedcustsup').val(customeradded);
              //  $("#customersupplier_create").click();
                if (custsupval == '3') {
                  $("#cus-success-alert").alert();
                  $("#cus-success-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $('#custsupmodal').modal('hide');
                    $('.modal-backdrop').remove();
                    $("#cus-success-alert").hide();
                  });

                }
                else  {
                  $("#sup-success-alert").alert();
                  $("#sup-success-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $('#custsupmodal').modal('hide');
                    $('.modal-backdrop').remove();
                    $("#sup-success-alert").hide();
                  });

                }
              return false;
              }
            }
          });
          return false;
        }
        if(resp["gkstatus"] ==1){

          // gkstatus 1 implies its a duplicate entry.
          if (custsupval == '3') {
          $("#add_cussup_name").focus();
          $("#sup-duplicate-alert").alert();
          $("#sup-duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#sup-duplicate-alert").hide();
          });
          console.log("duplicate supplier");
          return false;
        }
        else if (custsupval == '19') {
          $("#add_cussup_name").focus();
          $("#sup-duplicate-alert").alert();
          $("#sup-duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#sup-duplicate-alert").hide();
          });
          return false;
        }
    return false;
  }
else {
  $("#add_cussup").focus();
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
    event.stopPropagation();
  });
});
