/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018, 2019, 2020 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"Abhijith Balan" <abhijithb21@openmailbox..org>
"Mohd. Talha Pawaty" <mtalha456@gmail.com>
*/

$(document).ready(function()
{
  $('.modal-backdrop').remove();
  $('#godowname').focus();
  $("#godowncontact").numeric();
  sessionStorage.newgodownname = "";
  sessionStorage.newgodownaddress = "";
  $(document).off("keydown","#godownname").on("keydown", "#godownname",function(e){
    if (e.which == 13) {
    	 e.preventDefault();
         if ($.trim($("#godownname").val())=="") {
             $("#godownname-blank-alert").alert();
             $("#godownname-blank-alert").fadeTo(2250, 200).slideUp(500, function(){
               $("#godownname-blank-alert").hide();
             });
             $("#godownname").focus();
             return false;
           }
         else {
         $("#godownstate").focus();
         }
       }
     });
  $(document).off("keydown","#godownstate").on("keydown", "#godownstate",function(e){
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
      $(document).off("keydown","#godownaddress").on("keydown", "#godownaddress",function(e){
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
      $(document).off("keydown","#godowncontactname").on("keydown", "#godowncontactname",function(e){
        if (e.which == 13) {
          e.preventDefault();
          $("#godowncontact").focus();
        }
        if (e.which == 38) {
          $("#godownaddress").focus();
        }
      });
      $(document).off("keydown","#godowncontact").on("keydown", "#godowncontact",function(e){
        if (e.which == 13) {
          e.preventDefault();
          $("#gdnsubmit").click();
        }
        if (e.which == 38) {
          $("#godowncontactname").focus();
        }
      });
      $(document).off("keyup").on("keyup",function(event) {
        if(event.which == 45) {
          event.preventDefault();
          $("#gdnsubmit").click();
          return false;
        }
      });
      $(document).off("click","#gdnsubmit").on("click", '#gdnsubmit',function(e)
      {
        e.preventDefault();
        if ($.trim($("#godownname").val())=="") {
          $("#godownname-blank-alert").alert();
          $("#godownname-blank-alert").fadeTo(2250, 200).slideUp(500, function(){
            $("#blank-alert").hide();
          });
          $("#godownname").focus();
          return false;
        }
        if ($.trim($("#godownstate").val())=="") {
		        $("#stateblank-alert").alert();
		        $("#stateblank-alert").fadeTo(2250, 500).slideUp(500, function(){
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
              data: {"godownname":$("#godownname").val(), "godownstate":$("#godownstate").val(), "godownaddress":$.trim($("#godownaddress").val()), "godowncontactname":$("#godowncontactname").val(), "godowncontact":$("#godowncontact").val()},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(resp)
            {
              if(resp["gkstatus"]==0)
              {
                $("#success-alert").alert();
                $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#success-alert").hide();
                  sessionStorage.newgodownname = $("#godownname").val();
                  sessionStorage.newgodownaddress = $.trim($("#godownaddress").val());
                  $('#addgodownmodal').modal('hide');
                  $('.modal-backdrop').remove();
                });
              }
              else if(resp["gkstatus"]==1)
              {
                $("#duplicate-godown-alert").alert();
                $("#duplicate-godown-alert").fadeTo(2250, 500).slideUp(500, function(){
                  $("#duplicate-godown-alert").hide();
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
      }
    );
  });
