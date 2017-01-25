$/*
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
"Vaibhav Kurhe" <vaibspidy@openmailbox.org>
*/
/*
This script is for the Received transfer note page.
*/
(document).ready(function() {
  $('.modal-backdrop').remove();
      $("#rec_tn_list").focus();
      $(".hidden-load").hide();// Hide all widgets on load except the select transfernote box.
      $("#rec_received").hide();
      $(".disable").prop("disabled", true);
      $("#tn_editprint").hide();
      $(".tndate").autotab('number');
      var tnid ="";
      var fromgodownid;
      var togodownid;
      var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
      var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
      
      
      
      
      
      $("#rec_tn_list").change(function(event) {
      // Get complete transfer note details on change(of the selected note).
        tnid = $("#rec_tn_list option:selected").val();
        if (tnid != "") {

        $.ajax({
          url: '/transfernotes?action=get',
          type: 'POST',
          dataType: 'json',
          async : false,
          data: {"transfernoteid": tnid},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          }
        })
        .done(function(resp) {
          var result = resp["gkresult"];

          $(".hidden-load").show();// Show all the details.
          $("#tn_editprint").show();
          if (result["cancelflag"]==1) {// If the TN is cancelled then show a message indicating cancellation.
            $("#cancelmsg").show();
            $("#alertstrong").html("Transfer Note cancelled on "+result.canceldate);
            $("#rec_cancel").prop("disabled",true);
            $("#rec_cancel").hide();
            $("#tn_editprint").hide();
          }
          else {
            $("#cancelmsg").hide();
            $("#rec_cancel").prop("disabled",false);
            $("#rec_cancel").show();
          }
        // Show all details in its corresponding labels.
          $("#rec_transfernote_no").html(result["transfernoteno"]);

          $("#rec_transport_mode").html(result["transportationmode"]);
          $("#rec_tn_from_godown").html(result["fromgodown"]);
          fromgodownid = result.fromgodownid;
          togodownid = result.togodownid;
          $("#rec_tn_to_godown").html(result["togodown"]);
          $("#rec_no_of_packet").html(result["nopkt"]);
          $("#rec_name_issuer").html(result["issuername"]);
          $("#rec_designation").html(result["designation"]);
          $("#rec_transfernote_date").html(result["transfernotedate"]);
         

          
          // Empty the table and show the product details of the TN
          $('#transfernote_product_table tbody').empty();
          $.each(result.productdetails, function(key, value) {
            $('#transfernote_product_table tbody').append('<tr>'+
            '<td class="col-xs-9">'+
            value.productdesc+
            '</td>'+
            '<td class="col-xs-3">'+
            value.qty+' ' +value.unitname+
            '</td>'+

           '</tr>');
          });
          if (result["recieved"] ==false) {
            $("#recstatus").html("Pending");
            $("#rec_received").show();
            $("#rec_received").prop("disabled", false);
          }
          else  {

            $("#recstatus").html("Received");
              $("#rec_received").hide();
            $("#rec_received").prop("disabled", true);
          }



        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });
      }

      });
// Navigation events,
      $("#rec_tn_list").keydown(function(event) {
        if (event.which==13) {
          event.preventDefault();
          $("#rec_received").focus();
          }

      });
      $("#rec_received").keydown(function(event) {
        if (event.which==38) {
          event.preventDefault();
          $("#rec_tn_list").focus();
          }

      });
  // This function will set the TN as received.
      $("#rec_received").click(function(event) {
        event.preventDefault();
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $('#confirm_yes').modal('show').one('click', '#tn_yes', function (e)
        {
        	 if ($.trim($('#received_tn_date').val())=="") {
        	      $("#date-blank-alert").alert();
        	      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        	        $("#date-blank-alert").hide();
        	      });
        	      $('#received_tn_date').focus();
        	      return false;
        	    }
        	    if ($.trim($('#received_tn_month').val())=="") {
        	      $("#date-blank-alert").alert();
        	      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        	        $("#date-blank-alert").hide();
        	      });
        	      $('#received_tn_month').focus();
        	      return false;
        	    }
        	    if ($.trim($('#received_tn_year').val())=="") {
        	      $("#date-blank-alert").alert();
        	      $("#date-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        	        $("#date-blank-alert").hide();
        	      });
        	      $('#received_tn_year').focus();
        	      return false;
        	    }
        	    if(!Date.parseExact($("#received_tn_date").val()+$("#received_tn_month").val()+$("#received_tn_year").val(), "ddMMyyyy")){
        	      $("#date-alert").alert();
        	      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        	        $("#date-alert").hide();
        	      });
        	      $('#received_tn_date').focus().select();
        	      return false;
        	    }
        	    
        	    
        	    var curdate = Date.parseExact($("#received_tn_year").val()+$("#received_tn_month").val()+$("#received_tn_date").val(), "yyyyMMdd")
        	    
        	    
          var receiveddate1 =$("#received_tn_year").val()+'-'+$("#received_tn_month").val()+'-'+$("#received_tn_date").val();
          console.log("rec"+receiveddate1);
         
          if(Date.parseExact(receiveddate1,"yyyy-MM-dd").compareTo(financialend)==1){
         
         
           $("#between-date-alert").alert();
	       $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
	        $("#between-date-alert").hide();
	       });
	       $('#received_tn_date').focus().select();
	       return false;
	    
          }
          var createdate=$('#rec_transfernote_date').text();
          var createdateyyyymmdd=createdate[6]+createdate[7]+createdate[8]+createdate[9]+createdate[5]+createdate[3]+createdate[4]+createdate[2]+createdate[0]+createdate[1]
                                                                                                                                                                                 
          
           if(Date.parseExact(receiveddate1,"yyyy-MM-dd").compareTo(Date.parseExact(createdateyyyymmdd,"yyyy-MM-dd"))==-1)
          {
        	  $("#between-date-alert").alert();
	      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
  	        $("#between-date-alert").hide();
  	      });
  	      $('#received_tn_date').focus().select();
  	      return false;
  	    
          }
          
          
          
        	    	
        	  
        	    	
        	
        	   
          $.ajax(
            {

              type: "POST",
              url: '/transfernotes?action=received',
              async: false,
              datatype: "json",
              data:{"transfernoteid": tnid, "receiveddate":$("#received_tn_year").val()+'-'+$("#received_tn_month").val()+'-'+$("#received_tn_date").val()},
              beforeSend: function(xhr)
              {
                xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
              },
              success: function(resp)
              {
                if (resp["gkstatus"]==0) {
                  $("#recstatus").html("Received");
                  $('.modal-backdrop').remove();
                  $("#rec-confirm-alert").alert();
                  $("#rec-confirm-alert").fadeTo(2250, 500).slideUp(500, function(){
                    $("#rec-confirm-alert").hide();

                  });
                  $("#rec_received").hide();
                  $("#received_tn_date").prop("disabled", true);
                  $("#received_tn_month").prop("disabled", true);
                  $("#received_tn_year").prop("disabled", true);
                  
                }



              }

            });

        });
        $("#confirm_yes").on('shown.bs.modal', function(event) {
          $("#tn_no").focus();
        });
        $("#confirm_yes").on('hidden.bs.modal', function(event) {
          $("#rec_tn_list").focus();
        });
       });

       $("#rec_cancel").click(function(event) {
         event.preventDefault();
        // Cancels the selected TN
         $('.modal-backdrop').remove();
         $('.modal').modal('hide');
         $('#confirm_del').modal('show').one('click', '#accdel', function (e)
         {
           $.ajax(
             {

               type: "POST",
               url: '/transfernotes?action=delete',
               async: false,
               datatype: "json",
               data:{"transfernoteid": $("#rec_tn_list option:selected").val()},
               beforeSend: function(xhr)
               {
                 xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
               },
               success: function(resp)

               {
                 if (resp["gkstatus"]==0) {
                   $("#transfernote_edit").click();
                   $('.modal-backdrop').remove();
                   $("#delsuccess-alert").alert();
                   $("#delsuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
                     $("#delsuccess-alert").hide();

                   });
                 }



               }

             });

         });
         $("#confirm_del").on('shown.bs.modal', function(event) {
           $("#m_cancel").focus();
         });
         $("#confirm_del").on('hidden.bs.modal', function(event) {
           $("#rec_tn_list").focus();
         });
        });

        $("#tn_editprint").click(function(event) {
        // Prints the selected TN. Selects all the details from selected TN
          printset = [];
          for (var i = 0; i < $("#transfernote_product_table tbody tr").length; i++) {
            var obj = {};
            obj.productdesc = $("#transfernote_product_table tbody tr:eq("+i+") td:eq(0)").html();
            obj.qty = $("#transfernote_product_table tbody tr:eq("+i+") td:eq(1)").html();

            printset.push(obj);
          }
          $.ajax({
            url: '/transfernotes?action=print',
            type: 'POST',
            dataType: 'html',
            data: {
              "transfernoteno":$("#rec_transfernote_no").text(),
              "transfernotedate":$("#rec_transfernote_date").text(),
              "fromgodown":fromgodownid,
              "togodown":togodownid,
              "transportationmode":$("#rec_transport_mode").text(),
              "nopkt":$("#rec_no_of_packet").text(),
              "printset":JSON.stringify(printset),
              "issuername":$("#rec_name_issuer").text(),
              "designation":$("#rec_designation").text()},
              beforeSend: function(xhr)
              {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
              }
            })
            .done(function(resp) {
              console.log("success");
              $('#info').html(resp);
            })
            .fail(function() {
              console.log("error");
            })
            .always(function() {
              console.log("complete");
            });

        });

  });
