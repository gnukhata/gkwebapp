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
      data: {"custid": $("#edit_cussup_list option:selected").val()},
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
      $("#edit_tn_month").val(deldatearray[1]);
      $("#edit_tn_year").val(deldatearray[2]);
      $("#edit_cussup_name").val(result["custname"]);
      $("#edit_cussup_name").prop("disabled", true);
      $("#edit_cussup_email").val(result["custemail"]);
      $("#edit_cussup_email").prop("disabled", true);
      $("#edit_cussup_phone").val(result["custphone"]);
      $("#edit_cussup_phone").prop("disabled", true);
      $("#edit_cussup_address").val(result["custaddr"]);
      $("#edit_cussup_address").prop("disabled", true);
      $("#edit_cussup_fax").val(result["custfax"]);
      $("#edit_cussup_fax").prop("disabled", true);
      $("#edit_cussup_pan").val(result["custpan"]);
      $("#edit_cussup_pan").prop("disabled", true);
      $("#edit_cussup_tan").val(result["custtan"]);
      $("#edit_cussup_tan").prop("disabled", true);
      $(".panel-footer").show();
      $("#cus_innerdiv").show();
      $("#cussup_edit_save").hide();
      $("#edit_cussup_btn").show();

    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });
});
