$(document).ready(function() {
  $('.modal-backdrop').remove();
      $("#rec_tn_list").focus();
      $(".hidden-load").hide();
      $("#rec_received").hide();
      $(".disable").prop("disabled", true);
      $("#tn_editprint").hide();
      var tnid ="";
      var fromgodownid;
      var togodownid;

      $("#rec_tn_list").change(function(event) {
        tnid = $("#rec_tn_list option:selected").val();
        if (tnid != "") {

        $.ajax({
          url: '/transfernotes?action=get',
          type: 'POST',
          dataType: 'json',
          async : false,
          data: {"transfernoteid": tnid },
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          }
        })
        .done(function(resp) {
          var result = resp["gkresult"];

          $(".hidden-load").show();
          $("#tn_editprint").show();
          if (result["cancelflag"]==1) {
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

          $('#transfernote_product_table tbody').empty();
          $.each(result.productdetails, function(key, value) {
            $('#transfernote_product_table tbody').append('<tr>'+
            '<td class="col-xs-9">'+
            value.productdesc+
            '</td>'+
            '<td class="col-xs-3">'+
            value.qty+
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
      $("#rec_received").click(function(event) {
        event.preventDefault();
        $('.modal-backdrop').remove();
        $('.modal').modal('hide');
        $('#confirm_yes').modal('show').one('click', '#tn_yes', function (e)
        {
          $.ajax(
            {

              type: "POST",
              url: '/transfernotes?action=received',
              async: false,
              datatype: "json",
              data:{"transfernoteid": tnid},
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
