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
"Abhijith Balan" <abhijithb21@openmailbox.org>
"Reshma Bhatawadekar" <bhatawadekar1reshma@gmail.com>
*/
// This script file is for list of stock items report.
$(document).ready(function() {
  $(".modal-backdrop").remove();

  $(".fixed-table-loading").remove();

  $('#latable tbody tr:first-child td:eq(1) a').focus();
  $('#latable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');

  if (sessionStorage.vatorgstflag == 22) {
    $(".type").hide();
    $(".prdserv").text("Product");
  }
  else {
    $(".type").show();
    $(".prdserv").text("Product / Service");
  }

  // functions to add remove selected class on focus and blur.
  $(document).off('focus' ,'.libgname').on('focus' ,'.libgname',function() {
    $('#latable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.libgname').on('blur' ,'.libgname',function() {
    $('#latable tr').removeClass('selected');

  });

  // Button to clear search field.
  $('#laclearfields').click(function(){
    $(".search").children(".form-control").val("");
    $("#laclearfields").hide();
		$(".search").children(".form-control").focus();
  });
  // clear search field on ESC key.
  $(".search").children(".form-control").keyup(function(event){
  	$("#laclearfields").show();
      if (event.keyCode == 27) {
        $(this).val("");
  			$("#laclearfields").hide();
      }
  		else if ($(this).val() == "") {
  			$("#laclearfields").hide();
  		}
    });

  var curindex ;
  var nextindex;
  var previndex;

  $(document).off('keydown' ,'.libgname').on('keydown' ,'.libgname',function(event) {
  // Navigation between rows using up down arrow keys.
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    n = $(".libgname").length;
    if (event.which==40 && nextindex < n)
    {
      event.preventDefault();
      $('#latable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#latable tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }

  });


  $("#latable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#latable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#latable tbody tr:eq('+currindex+') a').focus();

  });

  $('#viewprintableversion').click(function (e) {
// calls a printable version of the report.
    $.ajax({
      type: "POST",
      url: "/product?type=printable",
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


    //For redirecting to the homepage
    $("#backbutton").click(function(event) {
	location.reload();
    });
    
    
    $("#print").click(function(event) {
  // serves a spreadsheet file to the client of this report.
        event.preventDefault();
        var xhr = new XMLHttpRequest();

        xhr.open('GET', '/product?type=spreadsheet&fystart='+sessionStorage.getItem('year1')+'&orgname='+ sessionStorage.getItem('orgn')+'&fyend='+sessionStorage.getItem('year2'), true);
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
