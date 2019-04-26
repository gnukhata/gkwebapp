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
"Mohd. Talha Pawaty" <mtalha456@gmail.com>
*/

$(document).ready(function() {
  $(".modal-backdrop").remove();

  $(".fixed-table-loading").remove();

  $('#latable tbody tr:first-child td:eq(1) a').focus();
  $('#latable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');


  $(document).off('focus' ,'.libgname').on('focus' ,'.libgname',function() {
    $('#latable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.libgname').on('blur' ,'.libgname',function() {
    $('#latable tr').removeClass('selected');

  });

  $('#laclearfields').click(function(){
    $(".search").children(".form-control").val("");
    $("#laclearfields").hide();
		$(".search").children(".form-control").focus();
  });

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
      var printdata ={};
    if ($("#godownflag").val()==0) {
	printdata = {"productcode":$("#productcode").val(),"productdesc":$("#productdesc").val(),"calculatefrom":$("#calculatefrom").val(), "calculateto":$("#calculateto").val(), "godownflag":$("#godownflag").val(), "goid":"-1", "goname":""};
    }
    else {
	printdata = {"productcode":$("#productcode").val(),"productdesc":$("#productdesc").val(),"calculatefrom":$("#calculatefrom").val(), "calculateto":$("#calculateto").val(), "godownflag":$("#godownflag").val(), "goid":$("#goid").val(), "goname":$("#goname").val(), "goaddr":$("#goaddr").val()};
    }
    console.log(printdata);
    $.ajax({
      type: "POST",
      url: "/product?type=printablestockreport",
      global: false,
      async: false,
      data: printdata,
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
    var orgname = sessionStorage.getItem('orgn');
    var orgtype = sessionStorage.getItem('orgt');
    var xhr = new XMLHttpRequest();

    if ($("#godownflag").val()==0) {
      xhr.open('GET', '/product?type=stockreportspreadsheet&orgname='+ orgname+'&fystart='+sessionStorage.yyyymmddyear1+'&fyend='+sessionStorage.getItem('year2')+'&calculatefrom='+$("#calculatefrom").val()+'&calculateto='+$("#calculateto").val()+'&productcode='+$("#productcode").val()+'&productdesc='+$("#productdesc").val()+'&godownflag=0&goid=-1&goname=""', true);
    }
    else {
      xhr.open('GET', '/product?type=stockreportspreadsheet&orgname='+ orgname+'&fystart='+sessionStorage.yyyymmddyear1+'&fyend='+sessionStorage.getItem('year2')+'&calculatefrom='+$("#calculatefrom").val()+'&calculateto='+$("#calculateto").val()+'&productcode='+$("#productcode").val()+'&productdesc='+$("#productdesc").val()+'&godownflag=1&goid='+$("#goid").val()+'&goname='+$("#goname").val()+'&goaddr='+$("#goaddr").val(), true);
    }
    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    xhr.responseType = 'blob';

    xhr.onload = function(e) {
    if (this.status == 200) {
    // get binary data as a response
      var blob = this.response;
      var url = window.URL.createObjectURL(blob);
	window.location.assign(url);
    }
  };

  xhr.send();

  });
  $("#viewanotherstock").click(function(event){
    $.ajax(
      {

        type: "POST",
        url: "/product?type=viewstockreport",
        global: false,
        async: false,
        datatype: "text/html",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          $("#info").html(resp);
        }
      }
    );
  });
  });
