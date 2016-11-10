$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#edit_tn_list").focus();
  $(".panel-footer").hide();

  $("#edit_tn_list").change(function(event) {
    $.ajax({
      url: '/transfernnots?action=get',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"transfernoteid": $("#edit_tn_list option:selected").val()},
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

  });
});
