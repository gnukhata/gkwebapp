$(document).ready(function() {
  $('.modal-backdrop').remove();
      $("#rec_tn_list").focus();
      $(".hidden-load").hide();
      $("#rec_received").hide();
      $(".disable").prop("disabled", true);
      var tnid ="";

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
          $("#rec_transfernote_no").html(result["transfernoteno"]);

          $("#rec_transport_mode").html(result["transportationmode"]);
          $("#rec_tn_from_godown").html(result["fromgodownid"]);
          $("#rec_tn_to_godown").html(result["togodownid"]);
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
            $("#rec_received").click();
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


  });
