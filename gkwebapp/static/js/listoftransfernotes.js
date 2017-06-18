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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
*/
// This script is for list of accounts report.
// refer listofstockitems.js file for documentation.
$(document).ready(function() {
  $("#msspinmodal").modal("hide");
  $(".modal-backdrop").remove();
  $(".fixed-table-loading").remove();
    var currentrow = 0;

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
  });

  $(".search").children(".form-control").keyup(function(event){
    if (event.keyCode == 27) {
      $(this).val("");
    }
  });

  var curindex ;
  var nextindex;
  var previndex;

    $('#viewanotherlist').click(function(e) {
	e.preventDefault();
	$("#msspinmodal").modal("show");
	$("#listoftransfernotes").click();
    });

  $('#viewprintableversion').click(function (e) {
      $("#msspinmodal").modal("show");
      var dataset = {"startdate":$("#startdate").data("startdate"),"enddate":$("#enddate").data("enddate")};
	    if ($("#godownselect").val() == 1) {
		dataset["goid"] = $("#goid").data("goid");
	    }
    $.ajax({
      type: "POST",
      url: "/transfernotes?action=printlist",
      global: false,
	async: false,
	data: dataset,
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


  $(document).off('keydown' ,'.libgname').on('keydown' ,'.libgname',function(event) {
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
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

  $("#latable").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).data("transfernoteid");
    var currindex = $(this).index();
    if(e.which==13)
      {
	e.preventDefault();
      $('#latable tbody tr:eq('+currindex+')').dblclick() ;
    }
  });

  $("#latable").off('dblclick','tr').on('dblclick','tr',function(e){
  // This function opens a modal of the selected voucher.
      // It shows the complete details of the selected voucher along with option to edit, delete and clone.
      currentrow = $(this).index();
    e.preventDefault();
      var id = "";
      id = $(this).data("transfernoteid");
    if (id=="")
    {
      return false;
    }
    $.ajax(
      {

        type: "POST",
        url: "/transfernotes?action=showtn",
        global: false,
        async: false,
        datatype: "text/html",
        data : {"transfernoteid":id},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        }
      }
    )
    .done(function(resp)
    {
      $("#tnload").html("");
      $('.modal-backdrop').remove();
      $('.modal').modal('hide');
      $("#tnload").html(resp);
      $('#tnview').modal('show');
      });
  });
    $("#tnview").on('hidden.bs.modal', function(event) {
	$('#latable tbody tr:eq('+currentrow+') td:eq(1) a').focus();
	$('#latable tbody tr:eq('+currentrow+') td:eq(1) a').closest('tr').addClass('selected');
    });
  $("#print").click(function(event) {
    event.preventDefault();
      var xhr = new XMLHttpRequest();
      var ltnurlstring = '&startdate='+$("#startdate").data("startdate")+'&enddate='+$("#enddate").data("enddate");
      if ($("#godownselect").val() == 1) {
	  ltnurlstring = ltnurlstring + '&goid=' + $("#goid").data("goid");
      }
      console.log(ltnurlstring);
      xhr.open('GET', '/transfernotes?action=generatespreadsheet&fystart='+sessionStorage.getItem('year1')+'&orgname='+ sessionStorage.getItem('orgn')+'&fyend='+sessionStorage.getItem('year2')+ltnurlstring, true);
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

});
