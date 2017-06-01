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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
*/
// This script is for list of users report.
$(document).ready(function() {
  $("#msspinmodal").modal("hide");
  $(".modal-backdrop").remove();
  $(".fixed-table-loading").remove();

  $('#lutable tbody tr:first-child td:eq(1) a').focus();
  $('#lutable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');

  $('#laclearfields').click(function(){
    $(".search").children(".form-control").val("");
  });

  $(".search").children(".form-control").keyup(function(event){
    if (event.keyCode == 27) {
      $(this).val("");
    }
  });

  $("#lutable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#lutable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#lutable tbody tr:eq('+currindex+') a').focus();

  });

  $('#viewprintableversion').click(function (e) {

    $.ajax({
      type: "POST",
      url: "/showuser?type=printable",
      global: false,
      async: false,
      datatype: "text/html",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    })
    .done(function(resp) {
      $("#info").html(resp);
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
  });

  $("#print").click(function(event) {
        event.preventDefault();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/showuser?type=spreadsheet&fystart='+sessionStorage.getItem('year1')+'&orgname='+ sessionStorage.getItem('orgn')+'&fyend='+sessionStorage.getItem('year2'), true);
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        xhr.responseType = 'blob';

        xhr.onload = function(e) {
        if (this.status == 200) {
        // get binary data as a response
          var blob = this.response;
          var url = window.URL.createObjectURL(blob);
          window.location.assign(url)
        }
      };

      xhr.send();


  });


});
