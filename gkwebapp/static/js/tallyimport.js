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
"Vaibhav Kurhe" <vaibspidy@openmailbox.org>
*/
/*
This script is for the tallyimport page.
*/

$(document).ready(function() {
  $("#msspinmodal").modal("hide");
  $(".modal-backdrop").remove();
  $("#importlink").focus();
  $("#import").click(function(event) {
    $(".modal").modal('hide');
    $(".modal-backdrop").remove();
    if ($("#my-file-selector").val()=='') {
      $("#import-blank-alert").alert();
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
      url: "/import?action=import",
      global: false,
      contentType: false,
      cache: false,
      processData: false,
      async: false,
      datatype: "json",
      data: form_data,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
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
        });
        return false;
      }
      else {
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
    });
});
});
$("#confirm_yes_print").on('shown.bs.modal', function(event) {
  $("#tn_save_noprint").focus();
});
$("#confirm_yes_print").on('hidden.bs.modal', function(event) {
  $("#invoice_challanno").focus();
});
});
