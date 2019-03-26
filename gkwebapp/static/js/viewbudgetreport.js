/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
  Free Software Foundation, Inc.,51 Franklin Street, 
  Fifth Floor, Boston, MA 02110, United States


   Contributors:
   "Krishnakant Mane" <kk@gmail.com>
   "Karan Kamdar" <kamdar.karan@gmail.com>
   "Prajkta Patkar" <prajkta@riseup.com>
   "Abhijith Balan" <abhijith@dff.org.in>
   "rohan khairnar" <rohankhairnar@gmail.com>
 */
$(document).ready(function() {
    $('.modal-backdrop').remove();
    $("#msspinmodal").modal("hide");
    $("#budgettype").focus();
    $("#bdgt_list").show();
    $("#cash").select();
    $("#foot").hide();
    var val;
    // ------------------   Keydown functions -------------
    $("#b_list").keydown(function(e){
        if (e.which==38 )
        {e.preventDefault();
          $("#cash").focus().click();
          $("#b_list").change();
        }
        if (e.which==13 )
        {e.preventDefault();
          $("#submit").focus().click();
        }
    });
    $("#submit").keydown(function(e){
        if (e.which==38 )
        {e.preventDefault();
          $("#b_list").focus();
        }
    });
    $("#cash").keydown(function(e){
        if (e.which==13)
        {e.preventDefault();
        $("#b_list").focus();
        }
    });
    $("#expense").keydown(function(e){
        if (e.which==13)
        {e.preventDefault();
        $("#b_list").focus();
        }
    });
    $("#sales").keydown(function(e){
        if (e.which==13)
        {e.preventDefault();
        $("#b_list").focus();
        }
    });
    // ------- end Keydown --------------
    $("#budgettype ").change(function(e){   // This is for load list of selected type of budget.
        if($("#cash").is(":checked")) {
            val = 3;
        }
        if($("#expense").is(":checked")) {
            val = 5;
        }
        if($("#sales").is(":checked")) {
            val = 19;
        }
            $.ajax(
              {
              type: "POST",
              url: "/budget?type=bdg_list",
              global: false,
              async: false,
              datatype: "json",
              data: {"btype":val},
              beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
              success: function(jsonObj){
                len = jsonObj["numberofbudget"]
                // if their are more than zero branches, only that time it will show branch selection option.
                $('#b_list').html("");
                if (len > 0){
                    $("#submit").show();
                    $("#nobudget").hide();
                    $("#bdgt_list").show();
                    $("#foot").show();
                }
                else{
                    $("#foot").hide();
                    $("#bdgt_list").hide();
                    $("#submit").hide();
                    $("#nobudget").show();
                }
                var br = jsonObj["gkresult"];
                $('#b_list').append('<option value="" disabled selected hidden >' + "Select Budget" +' </option>'); 
                for (let i in br ){
                  $('#b_list').append('<option value="' + br[i].budid + '">' + br[i].budname+' ('+br[i].startdate+' To '+br[i].enddate+')'+' </option>');                  
                }
              }
              });
      });
      $("#budgettype").change();
      
    var financialstart = sessionStorage.yyyymmddyear1;
    $("#submit").click(function(event) {
        if ($.trim($("#b_list option:selected").val())=="") {
            $("#b_list-alert").alert();
            $("#b_list-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#b_list-alert").hide();
            });
            $("#b_list").focus();
            return false;
        }
       $.ajax({
        type: "POST",
        url: "/budget?type=report",
        global: false,
        async: false,
        datatype: "json",
        data: {"buddetails":$("#b_list option:selected").text(),"budid": $("#b_list option:selected").val(),"financialstart":financialstart,"btype":val},
        beforeSend: function(xhr) {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        },
        success: function(resp) {
            $("#info").html(resp);
        }
    }); 

    });
});