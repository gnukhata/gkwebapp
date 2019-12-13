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
  $('#rclearfields').click(function(){
    $(this).siblings(".bootstrap-table").find(".form-control").val("");
  });
  $("#anotherregister").click(function(event) {
    $("#msspinmodal").modal();
    $.ajax(
      {
        type: "POST",
        url: "/invoice?action=showviewregister",
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

  $('#rclearfields').click(function(){
    $(".search").children(".form-control").val("");
		$("#rclearfields").hide();
		$(".search").children(".form-control").focus();
  });

$(".search").children(".form-control").keyup(function(event){
	$("#rclearfields").show();
    if (event.keyCode == 27) {
      $(this).val("");
			$("#rclearfields").hide();
    }
		else if ($(this).val() == "") {
			$("#rclearfields").hide();
		}
});


  //Toggling the up and down arrow for sorting
    $('.glyphicon').click(function () {
	$(this).toggleClass("glyphicon-chevron-up").toggleClass("glyphicon-chevron-down"); // toggling the up and down
    });

    //click event for sorting date.
    $('.invDate').click(function (e) {
	var orderflag = $("#invoiceDate").attr("orderflag");
	if ( orderflag == 1 ){
	    $(this).find("#invoiceDate").attr("orderflag",4);
	    var dataset = {"flag":$("#flag").val(),"calculatefrom":$("#calculatefrom").val(), "calculateto":$("#calculateto").val()};
	}else{
	    $(this).find("#invoiceDate").attr("orderflag",1);
	    dataset = {"flag":$("#flag").val(),"calculatefrom":$("#calculatefrom").val(), "calculateto":$("#calculateto").val(),"orderflag":4};
	}
	$.ajax({
	    type: "POST",
	    url: "/invoice?action=showregisterreport",
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

  $('#exporttospreadsheetregister').click(function (event) {
    console.log("in");
    event.preventDefault();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/invoice?type=spreadsheet&fystart='+sessionStorage.getItem('year1')+'&orgname='+ sessionStorage.getItem('orgn')+'&fyend='+sessionStorage.getItem('year2')+'&calculatefrom='+$("#calculatefrom").val()+'&calculateto='+$("#calculateto").val()+'&flag='+$('#flag').val(), true);
    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    xhr.responseType = 'blob';

    xhr.onload = function(e) {
      if (this.status == 200) {
      // get binary data as a response
      var blob = this.response;
      let windowURL = window.webkitURL || window.URL;
      var dwelement = document.createElement('a');
      let contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      dwelement.download = "Register.xlsx";
      dwelement.href = windowURL.createObjectURL(blob);
      dwelement.textContent = 'Download Sheet';
      dwelement.dataset.downloadurl = [contentType, dwelement.download, dwelement.href].join(':');
      dwelement.click();
      }
    };
    xhr.send();
  });

});
