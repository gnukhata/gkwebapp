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
"Vasudha Kadge" <kadge.vasudha@gmail.com>
*/
// This script is for log report.
$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#msspinmodal").modal("hide");
  $(".fixed-table-loading").remove();
    var currentrow = 0;
    //Toggling the up and down arrow for sorting
    $('.glyphicon').click(function () {
	$(this).toggleClass("glyphicon-chevron-up").toggleClass("glyphicon-chevron-down"); // toggling the up and down
    });
    //Sorting the data in ascending/descending order
    $("#latable").bootstrapTable({"sortName": "username", "sortOrder":"desc"},
				 {"sortName": "activity", "sortOrder":"desc"},
				 {"sortName":"date"});
    //Event for sorting Date in Ascending and Descending order.
    $('.dtwrap').click(function (e) {
	var orderflag = $("#logDate").attr("orderflag");
	if ( orderflag == 1 ){
	    $(this).find("#logDate").attr("orderflag",4);
	    var dataset = {"typeflag":$('#logof').val(),"userid":$('#userid').val(),"username":$('#username').val(), "calculatefrom":$('#calculatefrom').val(),"calculateto":$('#calculateto').val(),"backflag":1};
	}else{
	    $(this).find("#logDate").attr("orderflag",1);
	    dataset = {"typeflag":$('#logof').val(),"userid":$('#userid').val(),"username":$('#username').val(), "calculatefrom":$('#calculatefrom').val(),"calculateto":$('#calculateto').val(),"backflag":1,"orderflag":4};
	}
	$.ajax({
	    type: "POST",
	    url: "/log?action=showlogreport",
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
    $('#lclearfields').click(function(){
    $(this).siblings(".bootstrap-table").find(".form-control").val("");
  });
  $("#anotherlog").click(function(event) {
    $("#showviewlog").click();
  });

  $('#lclearfields').click(function(){
    $(".search").children(".form-control").val("");
		$("#lclearfields").hide();
		$(".search").children(".form-control").focus();
  });

$(".search").children(".form-control").keyup(function(event){
	$("#lclearfields").show();
    if (event.keyCode == 27) {
      $(this).val("");
			$("#lclearfields").hide();
    }
		else if ($(this).val() == "") {
			$("#lclearfields").hide();
		}
  });

  $('#viewprintablelogreport').click(function (e) {


    $.ajax(
      {
        type: "POST",
        url: "/log?action=printableshowlogreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"typeflag":$('#logof').val(),"userid":$('#userid').val(),"username":$('#username').val(), "calculatefrom":$('#calculatefrom').val(),"calculateto":$('#calculateto').val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      })
        .done(function(resp)
        {
          $("#info").html(resp);
          console.log($('#userid').val()+$('#username').val());
        }
      );

    });

});
