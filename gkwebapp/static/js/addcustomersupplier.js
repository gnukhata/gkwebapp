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
"Prajkta Patkar"<prajkta.patkar007@gmail.com>
*/

// This script is for the addcustomer/supplier.jinja2

$(document).ready(function() {
    //All the navigation events where pressing enter shifts focus to the next element and pressing the up arrow key focuses the previous element
    

    var todatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
    var year = (todatearray[0])
   
    if (year >= 2017){
	
		$("#gstin").show();
    }
    
    
  $("#add_cussup").focus().select();
  $("#add_cussup").keydown(function(event) {
    if (event.which==13) {

	if ($.trim($("#add_cussup").val())=="") {
            $("#role-blank-alert").alert();
            $("#role-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#role-blank-alert").hide();
            });
            $("#add_cussup").focus();
            return false;
          }
          event.preventDefault();
          $("#add_cussup_name").focus().select();
        }
      });
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
    	event.preventDefault();
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
  /*Customer/Supplier address field being a textarea pressing enter will shift the cursor on the new line
   instead of the next element. So the below function will detect the event where enter key is pressed twice
   and if so then shift the focus to the next element */
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

    if (year >= 2017){

    $("#add_cussup_tan").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#add_cussup_gstin").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_fax").focus().select();
    }
    });

      $("#add_cussup_gstin").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#cussup_save").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_tan").focus().select();
    }
  });
    }

    else{
	$("#add_cussup_tan").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#cussup_save").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#add_cussup_fax").focus().select();
    }
    });
	
    }

    
  $("#add_cussup_reset").click(function(event) {
      // click the customer/supplier create tab to reload the current page in tab creating a reset effect
    $("#customersupplier_create").click();
  });
  $(document).keyup(function(event) {
    if(event.which == 45) {
      $("#cussup_save").click();
      event.preventDefault();
      return false;
    }
  });
  $("#cussup_save").click(function(event) {
      //save event for saving the customer/supplier
    event.preventDefault();
    var custsupdata=$("#add_cussup option:selected").val(); //select with option either customer or supplier
    // custsupdata = 3 if customer or 19 if supplier
    var groupcode = -1;
    if (custsupdata == '3'){
      groupcode = $("#debtgroupcode").val();
    }
    else {
      groupcode = $("#credgroupcode").val();
    }
    //validations to check if none of the required fields are left blank
    if ($.trim($("#add_cussup option:selected").val())=="") {
      $("#cussup-blank-alert").alert();
      $("#cussup-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#cussup-blank-alert").hide();
      });
      $("#add_cussup").focus();
      return false;
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
          

    if ($.trim($("#add_cussup_tan").val())=="" && $.trim($("#add_cussup_gstin").val())=="" ) {
      $("#both-blank-alert").alert();
      $("#both-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#both-blank-alert").hide();
      });
      $("#add_cussup_tan").focus();
      return false;
    }
	  

      
    // ajax call for saving the customer/supplier
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
	     "gstin": $("#add_cussup_gstin").val(),    
      "state" : $("#add_state").val(),
      "csflag": $("#add_cussup option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken); //attaching the jwt token in the header
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
                $("#customersupplier_create").click();
                if (custsupdata == '3') {
                  $("#cus-success-alert").alert();
                  $("#cus-success-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#cus-success-alert").hide();
                  });

                }
                else  {
                  $("#sup-success-alert").alert();
                  $("#sup-success-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#sup-success-alert").hide();
                  });

                }
                $('#custsupmodal').modal('hide');
                $('.modal-backdrop').remove();
                return false;
              }
            }
          }
        );
        return false;
      }
      if(resp["gkstatus"] ==1){
          // gkstatus 1 implies its a duplicate entry.
          $("#add_cussup_name").focus();
          $("#cus-duplicate-alert").alert();
          $("#cus-duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#cus-duplicate-alert").hide();
          });
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
    event.stopPropagation(); // stoopping the event for unnecessarily repeating itself
  });
});
