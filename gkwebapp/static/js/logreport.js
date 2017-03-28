/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
*/
// This script is for log report.
$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#msspinmodal").modal("hide");
  $(".fixed-table-loading").remove();
  $('#lclearfields').click(function(){
    $(this).siblings(".bootstrap-table").find(".form-control").val("");
  });
  $("#anotherlog").click(function(event) {
    $("#showviewlog").click();
  });
});
/*$("#printlogreport").click(function(event) {
  window.print();
});*/


$('#viewprintablelogreport').click(function (e) {

  console.log("rohini  "+$('#user').val());
  $.ajax(
    {
      type: "POST",
      url: "/log?action=printableshowlogreport",
      global: false,
      async: false,
      datatype: "text/html",
      data: {"typeflag":$('#logof').val(),"userid":$('#user').val(), "calculatefrom":$('#calculatefrom').val(),"calculateto":$('#calculateto').val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    })
      .done(function(resp)
      {
        $("#info").html(resp);
      }
    );

  });
