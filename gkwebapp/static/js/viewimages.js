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
"Navin Karkera" <navin@dff.org.in>
*/
/*
This script is for viewing attachments in a voucher.
*/
$(document).ready(function() {
  var deletedids = []
  if ($("#userrole").val()=="1") // if voucher is locked operators cannot remove any attachment.
  {
    if ($("#lockflag").val()=="True")
    {
      $(".imgremove").remove();
    }

  }
  $(document).off("click",".delimg").on("click", ".delimg", function(e) { // removes the corresponding image.
    deletedids.push($(this).attr('value'));
    $(this).parent().parent().fadeOut(200, function(){
      $(this).parent().parent().remove();   //closest method gives the closest element specified
    });
    e.preventDefault();
    return false;
  });
// function to save added images as well as removed ones for the current voucher.
  $("#saveimg").click(function(event) {
    var form_data = new FormData();
    var files = $("#addimg")[0].files
    var filelist = [];
    for (var i = 0; i < files.length; i++) {
      form_data.append("file"+i,files[i])
    }
    form_data.append("deletedids",deletedids);
    form_data.append("vouchercode",$("#vouchercode").val());
    form_data.append("vno",$("#vno").val());
    form_data.append("vtype",$("#vtype").val());
    $.ajax({
      url: '/updateattachment',
      type: 'POST',
      dataType: 'html',
      global: false,
      contentType: false,
      cache: false,
      processData: false,
      async: false,
      data: form_data,
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      }
    })
    .done(function(resp) { // show updated attachments.
      $("body").html(resp);
      $("#image-success-alert").alert();
      $("#image-success-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#image-success-alert").hide();
      });
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

  });
});
