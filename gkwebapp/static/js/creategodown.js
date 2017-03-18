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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
*/
$(document).ready(function()
{
  $("#godownname").focus();
  $('.modal-backdrop').remove();
  $("#godowncontact").numeric();
  $("#gdnreset").click(function()
  {
    $("a[href ='#godown_create']").click();
  });

  $("#godownname").keydown(function(e){
    if (e.which == 13) {
      e.preventDefault();
      if ($.trim($("#godownname").val())=="") {
          $("#blank-alert").alert();
          $("#blank-alert").fadeTo(2250, 200).slideUp(500, function(){
            $("#blank-alert").hide();
          });
          $("#godownname").focus();
          return false;
        }
      else {
      $("#godownstate").focus(); 
      }
    }
  });
  
    
  $("#godownstate").keydown(function(e){
    if (e.which == 13) {
    	if ($.trim($("#godownstate").val())=="") {
	        $("#stateblank-alert").alert();
	        $("#stateblank-alert").fadeTo(2250, 500).slideUp(500, function(){
	          $("#stateblank-alert").hide();
	        });
	        $("#godownstate").focus();
	        return false;
	      }
      e.preventDefault();
      $("#godownaddress").focus();
    }
    if (e.which == 38 && ($("#godownstate option:selected").index()==1 || $("#godownstate option:selected").index()==0)) {
      $("#godownname").focus();
    }
  });
  
 
  
      var delta = 500;
      var lastKeypressTime = 0;
      $("#godownaddress").keydown(function(e){
        if (e.which == 13) {
          var thisKeypressTime = new Date();
          if ( thisKeypressTime - lastKeypressTime <= delta )
          {if ($.trim($("#godownaddress").val())=="") {
              $("#addressblank-alert").alert();
              $("#addressblank-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#addressblank-alert").hide();
              });
              $("godownaddress").focus();
              return false;
          }
        	  
            $("#godowncontactname").focus();
            thisKeypressTime = 0;
          }
          lastKeypressTime = thisKeypressTime;
        }
        if (e.which == 38) {
          $("#godownstate").focus();
        }
      });
      $("#godowncontactname").keydown(function(e){
        if (e.which == 13) {
          e.preventDefault();
          $("#godowndesignation").focus();
        }
        if (e.which == 38) {
          $("#godownaddress").focus();
        }
      });
      $("#godowndesignation").keydown(function(e){
        if (e.which == 13) {
          e.preventDefault();
          $("#godowncontact").focus();
        }
        if (e.which == 38) {
          $("#godowncontactname").focus();
        }
      });
      $("#godowncontact").keydown(function(e){
        if (e.which == 13) {
          e.preventDefault();
          $("#gdnsubmit").click();
        }
        if (e.which == 38) {
          $("#godowndesignation").focus();
        }
      });
      $(document).off("keyup").on("keyup",function(event) {
        if(event.which == 45) {
          event.preventDefault();
          $("#gdnsubmit").click();
          return false;
        }
          /* Act on the event */
        if (event.which == 45)
          {
            event.preventDefault();
            $("#gdnsubmit").click();
          }
      });

      $("#lists").click(function(event) {
        $.ajax(
       {
       type: "POST",
       url: "/godown?type=lists",
       global: false,
       async: false,
       datatype: "text/html",
       beforeSend: function(xhr)
         {
           xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
         },
       success: function(resp)
       {
         $("#listofgodownspopup").html("");
         $('.modal-backdrop').remove();
         $('.modal').modal('hide');
         $("#listofgodownspopup").html(resp);
         $('#allgodownmodal').modal('show');
         $('#allgodownmodal').on('shown.bs.modal', function(e){
         });
       }
       });

      });

      $("#gdnsubmit").click(function(e)
      {
        e.preventDefault();
        if ($.trim($("#godownname").val())=="") {
          $("#blank-alert").alert();
          $("#blank-alert").fadeTo(2250, 200).slideUp(500, function(){
            $("#blank-alert").hide();
          });
          $("#godownname").focus();
          return false;
        }
        if ($.trim($("#godownstate option:selected").text())=="None") {
          $("#stateblank-alert").alert();
          $("#stateblank-alert").fadeTo(2250, 200).slideUp(500, function(){
            $("#stateblank-alert").hide();
          });
          $("#godownstate").focus();
          return false;
        }
        if ($.trim($("#godownaddress").val())=="") {
          $("#addressblank-alert").alert();
          $("#addressblank-alert").fadeTo(2250, 200).slideUp(500, function(){
            $("#addressblank-alert").hide();
          });
          $("#godownaddress").focus();
          return false;
        }
        $.ajax(
          {

            type: "POST",
            url: "/godown?type=add",
            global: false,
            async: false,
            datatype: "json",
            data: {"godownname":$("#godownname").val(), "godownstate":$("#godownstate").val(), "godownaddress":$.trim($("#godownaddress").val()), "godowncontactname":$("#godowncontactname").val(), "godowndesignation":$("#godowndesignation").val(), "godowncontact":$("#godowncontact").val()},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(resp)
            {
              if(resp["gkstatus"]==0)
              {
                $("#gdnreset").click();
                $("#success-alert").alert();
                $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
                $("#success-alert").hide();
                });

              }
              else if(resp["gkstatus"]==1)
              {
                $("#duplicate-alert").alert();
                $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#duplicate-alert").hide();
                });
                $("#godownname").focus().select();
              }
              else
              {
                $("#failure-alert").alert();
                $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#failure-alert").hide();
                });
                $("#godownname").focus().select();
              }
            }

          }
        );
        e.preventDefault();
      }
    );
  });
