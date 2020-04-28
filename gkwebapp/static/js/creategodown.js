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
"Prajkta Patkar" <prajkta.patkar007@gmail.com>
"Mohd. Talha Pawaty" <mtalha456@gmail.com>
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

  $("#brnreset").click(function()
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
          $("#godowncontact").focus();
        }
        if (e.which == 38) {
          $("#godownaddress").focus();
        }
      });
      $("#godowncontact").keydown(function(e){
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
                $("#godown").click();
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
    $("#my-file-selector").change(function(event) {
      $('#upload-file-info').html($(this).val());
      if ($("#my-file-selector").val()=='') {
        $("#import-blank-alert").alert("");
        $("#import-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#import-blank-alert").hide();
        });
        return false;
      }
      $('#confirm_yes_print').modal('show').one('click', '#tn_save_yesprint', function (e)
      {
      var form_data = new FormData();
      var file = $("#my-file-selector")[0].files[0];
      form_data.append("xlsxfile",file);
      $("#msspinmodal").modal("show");
      $.ajax({
        type: "POST",
        url: "/import?action=gdnimport",
        global: false,
        contentType: false,
        cache: false,
        processData: false,
        async: false,
        datatype: "json",
        data: form_data,
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken);
        },
      })
      .done(function(resp) {
        if (resp["gkstatus"]==0) {
          $("#filename").html($("#my-file-selector").val());
          $("#my-file-selector").val("");
          $("#upload-file-info").html("");
          $("#msspinmodal").modal("hide");
          $("#import-success-alert").alert();
          $("#import-success-alert").fadeTo(2250, 400).slideUp(500, function(){
          $("#import-success-alert").hide();
          $("#godown").click();
  
          });
          return false;
        }
         else if(resp["gkstatus"]==1){
          $("#msspinmodal").modal("hide");
          $("#import-duplicate-alert").alert();
          $("#import-duplicate-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#import-duplicate-alert").hide();
          });
          return false;
        }
        else if(resp["gkstatus"]==6){
          $("#msspinmodal").modal("hide");
          console.log(resp["errorRows"]);
          var table = document.querySelector("#errortablebody");   
          while(table.firstChild)
          {
            table.removeChild(table.firstChild);
          }
          for (var row in resp["errorRows"])
          {
            var tableRow = document.createElement("TR");
            rowCount=resp["errorRows"][row][0];
            tableRow.setAttribute("row_id", rowCount);
            columnCount=1;
            for (var key in resp["errorRows"][row])
            {
              var tableData = document.createElement("TD");
              tableData.setAttribute("column_id", (rowCount).toString()+(columnCount++).toString());
              var data = document.createTextNode(resp["errorRows"][row][key]);
              tableData.appendChild(data);
              tableRow.append(tableData);
            }
            table.append(tableRow);
          }
          if(resp["duplicateFlag"]==false)
          { 
            $("#errormsg").html("Please correct the following errors before proceeding:");
            for(var key in resp["errorList"])
            {
              console.log(key);
              row=resp["errorList"][key][1].toString();
              column=(resp["errorList"][key][0].charCodeAt(0)-63).toString();
              element=row+column;
              console.log(element);
              console.log( $("#errortablebody").find("[column_id="+element+"]"));
              $("#errortablebody").find("[column_id="+element+"]").attr("style","background-color:red;");
            }
          }
          else if(resp["duplicateFlag"]==true){
            $("#errormsg").html("Following are the duplicate entries:");
          }
          $('#errorDisplay').modal('show');    
          }
          else{
          $("#msspinmodal").modal("hide");
          $("#import-failure-alert").alert();
          $("#import-failure-alert").fadeTo(2250, 400).slideUp(500, function(){
            $("#import-failure-alert").hide();
          });
          return false;
        }
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      })
    });
  });
  });
