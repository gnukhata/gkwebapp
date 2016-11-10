$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#edit_tn_list").focus();
  $(".panel-footer").hide();

  $("#edit_tn_list").change(function(event) {
    var tnid = $("#edit_tn_list option:selected").val();
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
      $("#edit_transfernote_no").val(result["transfernoteno"]);
      $("#edit_transfernote_no").prop("disabled", true);
      var deldatearray = podata.datedelivery.split(/\s*\-\s*/g);
      $("#edit_tn_date").val(deldatearray[0]);
      $("#edit_tn_date").prop("disabled", true);
      $("#edit_tn_month").val(deldatearray[1]);
      $("#edit_tn_month").prop("disabled", true);
      $("#edit_tn_year").val(deldatearray[2]);
      $("#edit_tn_year").prop("disabled", true);
      $("#edit_transport_mode").val(result["custname"]);
      $("#edit_transport_mode").prop("disabled", true);
      $("#edit_tn_from_godown").val(result["custemail"]);
      $("#edit_tn_from_godown").prop("disabled", true);
      $("#edit_tn_to_godown").val(result["custphone"]);
      $("#edit_tn_to_godown").prop("disabled", true);
      $("#edit_no_of_packet").val(result["custaddr"]);
      $("#edit_no_of_packet").prop("disabled", true);
      $(".panel-footer").show();
      $("#edit_transfernote_save").hide();
      $("#edit_btn").show();

    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  }

  });
  $("#edit_tn_list").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_transfernote_no").focus().select();
    }
  });
  $("#edit_transfernote_no").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#edit_tn_date").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#edit_tn_list").focus().select();
    }
  });

  $("#tn_month").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_year").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#tn_date").focus().select();
    }
  });
  $("#tn_year").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#transport_mode").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#tn_month").focus().select();
    }
  });

  $("#transport_mode").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_from_godown").focus().select();
    }
    if (event.which==38) {
      event.preventDefault();
      $("#tn_year").focus().select();
    }
  });

  $("#tn_from_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#tn_to_godown").focus().select();
    }
    if (event.which==38 && $("#tn_from_godown option:selected").index()==0) {
      event.preventDefault();
      $("#transport_mode").focus().select();
    }
  });

  $("#tn_to_godown").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $('#transfernote_product_table tbody tr:first td:eq(0) select').focus();
    }
    if (event.which==38 && $("#tn_to_godown option:selected").index()==0) {
      event.preventDefault();
      $("#tn_from_godown").focus().select();
    }
  });

  $("#no_of_packet").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#name_issuer").focus().select
    }
    if (event.which==38) {
      event.preventDefault();
      $("#tn_to_godown").focus().select();
    }
  });
  $("#name_issuer").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#designation").focus().select
    }
    if (event.which==38) {
      event.preventDefault();
      $("#no_of_packet").focus().select();
    }
  });

  $("#designation").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#transfernote_save").click();
    }
    });
  $(document).keyup(function(event) {
    if(event.which == 45) {
      $("#transfernote_save").click();
      event.preventDefault();
      return false;
    }
  });


  });
