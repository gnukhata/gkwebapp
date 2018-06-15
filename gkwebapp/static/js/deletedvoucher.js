/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Vanita Rajpurohit" <vanita.rajpurohit9819@gmail.com>
"Reshma Bhatawadekar" <reshma_b@riseup.net>
*/

$(document).ready(function() {
  if (sessionStorage.orgt=="Profit Making") {
    $(".projecth").text("Cost Center");
  }
  $("#msspinmodal").modal("hide");
  
    $(".fixed-table-loading").remove();

  //Toggling the up and down arrow for sorting
    $('.glyphicon').click(function () {
	$(this).toggleClass("glyphicon-chevron-up").toggleClass("glyphicon-chevron-down"); // toggling the up and down
    });

    //click event for sorting date.
    $('.dateorder').click(function (e) {
	var orderflag = $("#delVoucherDate").attr("orderflag");
	if ( orderflag == 1 ){
	    $(this).find("#delVoucherDate").attr("orderflag",4);
	}else{
	    $(this).find("#delVoucherDate").attr("orderflag",1);
	    var dataset = {"orderflag":4};
	}
	$.ajax({
	    type: "POST",
	    url: "/showdeletedvoucher",
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

  $(' #deletedvouchertable tbody tr:first-child td:eq(1) a').focus();
  $('#deletedvouchertable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');

  $('#clearfields').click(function(){
    $(".search").children(".form-control").val("");
    $("#clearfields").hide();
		$(".search").children(".form-control").focus();
  });

  $(".search").children(".form-control").keyup(function(event){
  	$("#clearfields").show();
      if (event.keyCode == 27) {
        $(this).val("");
  			$("#clearfields").hide();
      }
  		else if (event.which == 13) {
  			$(".vno:visible").first().focus();
  		}
  		else if ($(this).val() == "") {
  			$("#clearfields").hide();
  		}
    });

  $(document).off('focus' ,'.vno').on('focus' ,'.vno',function() {
    $('#deletedvouchertable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $("#deletedvouchertable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#deletedvouchertable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#deletedvouchertable tbody tr:eq('+currindex+') a').focus();

  });

  var curindex ;
  var nextindex;
  var previndex;

 //For redirecting to the homepage
    $("#backbutton").click(function(event) {
	location.reload();
    });
    
  $(document).off('keydown' ,'.vno').on('keydown' ,'.vno',function(event) {
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#deletedvouchertable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#deletedvouchertable tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }

  });

});
