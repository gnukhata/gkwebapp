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
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"Abhijith Balan" <abhijithb21@openmailbox.com>
*/
// This script is for the profit and loss report.
$(document).ready(function() {
  var oninvoice = 0;
  $(".fixed-table-loading").remove();
    $('.modal-backdrop').remove();
    $("tbody tr:not('.group')").hide();
  $("#msspinmodal").modal("hide");
    $("#realprintpnl").hide();
  $('#expensetbl tbody tr:first-child td:first a').focus();
  $('#expensetbl tbody tr:first-child td:first a').closest('tr').addClass('selected');
    var rcindex = 0;
    var pyindex = 0;

// Add and remove selected class to the row on focus and blur respectively for expensetbl.
  $(document).off('focus' ,'.rcaccname').on('focus' ,'.rcaccname',function() {
    $('#expensetbl tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.rcaccname').on('blur' ,'.rcaccname',function() {
    $('#expensetbl tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var date = $("#ledtodate").val().split("-");
  var newtodate = date[2]+"-"+date[1]+"-"+date[0];

// Navigation function for table rows for expensetbl
  $(document).off('keydown' ,'.rcaccname').on('keydown' ,'.rcaccname',function(event) {
    var currentrow = $(this).closest('tr');
    rcindex = $(this).closest('tr').index();
     nextindex = $(currentrow).nextAll("tr:visible:first").index();
     previndex = $(currentrow).prevAll("tr:visible:first").index();
    if (event.which==40)
    {
      event.preventDefault();
      $('#expensetbl tbody tr:eq('+nextindex+') td:first a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#expensetbl tbody tr:eq('+previndex+') td:first a').focus();
      }
    }
    else if (event.which==39)
    {

      $('#incometbl tbody tr:eq('+pyindex+') td:first a').focus();
    }
  });

  var urole = $("#urole").val();


// Add selected class on click for expensetbl.
  $("#expensetbl").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('data-value');
    var currindex = $(this).index();
    $('#expensetbl tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#expensetbl tbody tr:eq('+currindex+') a').focus();

  });

  $("#expensetbl").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('data-value');
    var rindex = $(this).index();

    if(e.which==13)
    {

    $('#expensetbl tbody tr:eq('+rindex+')').dblclick() ;
    }
});

// Function to drill down to account ledger of the selected account for expensetbl.
  $("#expensetbl").off('dblclick','tr').on('dblclick','tr',function(e){
    e.preventDefault();
      var accname = $.trim($(this).find('td:first').text());
      var acccode = "";
      let curindex = $(this).index();
      if (accname!="" && $(this).hasClass("accountfield"))
      {
	  $.ajax(
      {
        type: "POST",
        url: "/getaccdetails?getAccCode",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"accountname":accname},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      })
        .done(function(resp)
        {
          var todatearray = $("#ledtodate").val().split("-");
     var fromdatearray = $("#ledfromdate").val().split("-");
     var newtodate = todatearray[2]+"-"+todatearray[1]+"-"+todatearray[0];
	    var newfromdate = fromdatearray[2]+"-"+fromdatearray[1]+"-"+fromdatearray[0];
	    acccode = resp["accountcode"];
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":7,"accountcode":acccode,"calculatefrom":newfromdate,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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
        }
      );
    }
      /*
	We need to find out if the row contains groups or not.
	We have given classes to these rows - degroup for Direct Expense, iegroup for Indirect Expense, digroup for Direct Income, digroup for Direct Income and iigroup for Indirect Income.
	jQuery has hasClass method that lets one select all elements with a class.
	Then we use slice function to select elements in a range.
	The limits are from next row to the row before the total is displayed. Upper limit is not included.
	Then we toggle the selected elements.
       */
      if ($(this).hasClass("degroup")) {
	  $('.subgroupofdegroup, .accountofdegroup').toggle();
	  $('.accountofsubgroupofdegroup').hide();
      }
      if ($(this).hasClass("subgroupofdegroup")) {
	  let subgroupindex = $(this).index() + 1;
	  let numberofaccounts = $(this).data("numberofaccounts") - 1;
	  let lastaccountindex = subgroupindex + numberofaccounts;
	  $('#expensetbl tbody tr').slice(subgroupindex, lastaccountindex).toggle();
      }
      if ($(this).hasClass("iegroup")) {
	  $('.subgroupofiegroup, .accountofiegroup').toggle();
	  $('.accountofsubgroupofiegroup').hide();
      }
      if ($(this).hasClass("subgroupofiegroup")) {
	  let subgroupindex = $(this).index() + 1;
	  let numberofaccounts = $(this).data("numberofaccounts") - 1;
	  let lastaccountindex = subgroupindex + numberofaccounts;
	  $('#expensetbl tbody tr').slice(subgroupindex, lastaccountindex).toggle();
      }
  });

// Add and remove selected class to the row on focus and blur respectively for incometbl.
  $(document).off('focus' ,'.pyaccname').on('focus' ,'.pyaccname',function() {
    $('#incometbl tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.pyaccname').on('blur' ,'.pyaccname',function() {
    $('#incometbl tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;
  var date = $("#ledtodate").val().split("-");
  var newtodate = date[2]+"-"+date[1]+"-"+date[0];

// Navigation function for table rows for incometbl
  $(document).off('keydown' ,'.pyaccname').on('keydown' ,'.pyaccname',function(event) {
   
    curindex = $(this).closest('tr');
    pyindex = $(this).closest('tr').index();
    nextindex = $(curindex).nextAll("tr:visible:first").index();
    previndex = $(curindex).prevAll("tr:visible:first").index();
        if (event.which==40)
    {

      $('#incometbl tbody tr:eq('+nextindex+') td:first a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        $('#incometbl tbody tr:eq('+previndex+') td:first a').focus();
      }
    }
    else if (event.which==37)
    {

      $('#expensetbl tbody tr:eq('+rcindex+') td:first a').focus();
    }


  });

  var urole = $("#urole").val();


// Add selected class on click for incometbl.
  $("#incometbl").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('data-value');
    var currindex = $(this).index();
    $('#incometbl tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#incometbl tbody tr:eq('+currindex+') a').focus();

  });

  $("#incometbl").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('data-value');
    var rindex = $(this).index();

    if(e.which==13)
    {

    $('#incometbl tbody tr:eq('+rindex+')').dblclick() ;
    }
});

// Function to drill down to account ledger of the selected account for incometbl.
  $("#incometbl").off('dblclick','tr').on('dblclick','tr',function(e){
    e.preventDefault();
      var accname = $.trim($(this).find('td:first').text());
      var acccode = "";
      let curindex = $(this).index();
      if (accname!="" && $(this).hasClass("accountfield"))
      {
	  $.ajax(
      {
        type: "POST",
        url: "/getaccdetails?getAccCode",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"accountname":accname},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      })
        .done(function(resp)
        {
          var todatearray = $("#ledtodate").val().split("-");
     var fromdatearray = $("#ledfromdate").val().split("-");
     var newtodate = todatearray[2]+"-"+todatearray[1]+"-"+todatearray[0];
	    var newfromdate = fromdatearray[2]+"-"+fromdatearray[1]+"-"+fromdatearray[0];
	    acccode = resp["accountcode"];
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":7,"accountcode":acccode,"calculatefrom":newfromdate,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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
        }
      );
    }
      if ($(this).hasClass("digroup")) {
	  $('.subgroupofdigroup, .accountofdigroup').toggle();
	  $('.accountofsubgroupofdigroup').hide();
      }
      if ($(this).hasClass("subgroupofdigroup")) {
	  let subgroupindex = $(this).index() + 1;
	  let numberofaccounts = $(this).data("numberofaccounts") - 1;
	  let lastaccountindex = subgroupindex + numberofaccounts;
	  $('#incometbl tbody tr').slice(subgroupindex, lastaccountindex).toggle();
      }
      if ($(this).hasClass("iigroup")) {
	  $('.subgroupofiigroup, .accountofiigroup').toggle();
	  $('.accountofsubgroupofiigroup').hide();
      }
      if ($(this).hasClass("subgroupofiigroup")) {
	  let subgroupindex = $(this).index() + 1;
	  let numberofaccounts = $(this).data("numberofaccounts") - 1;
	  let lastaccountindex = subgroupindex + numberofaccounts;
	  $('#incometbl tbody tr').slice(subgroupindex, lastaccountindex).toggle();
      }
  });

// Functions to clear search fields.
  $('#plrclearfields').click(function(){
    $(this).siblings(".bootstrap-table").find(".form-control").val("");
    $("#plrclearfields").hide();
		$(".search").children(".form-control").focus();
  });
  $('#pllclearfields').click(function(){
    $(this).siblings(".bootstrap-table").find(".form-control").val("");
    $("#pllclearfields").hide();
		$(".search").children(".form-control").focus();
  });

  $(".search").children(".form-control").keyup(function(event){
		if ($(this).parent(".search").hasClass("pull-right") && $(this).val() !="") {
			$("#pllclearfields").show();
		}
		else {
			$("#pllclearfields").hide();
		}
    if($(this).parent(".search").hasClass("pull-left")&& $(this).val() !="") {
 		 $("#plrclearfields").show();
 		}
 		else {
 			$("#plrclearfields").hide();
 		}
    if (event.keyCode == 27) {
      if ($(this).parent(".search").hasClass("pull-right")) {
        $(".rcaccname:visible").first().focus();
      }
      else if($(this).parent(".search").hasClass("pull-left")) {
        $(".pyaccname:visible").first().focus();
      }
      $(this).val("");
      $("#pllclearfields").hide();
      $("#plrclearfields").hide();
    }
    else if (event.which == 13) {
      if ($(this).parent(".search").hasClass("pull-right")) {
        $(".rcaccname:visible").first().focus();
      }
      else if($(this).parent(".search").hasClass("pull-left")) {
        $(".pyaccname:visible").first().focus();
      }
    }
    });

  $("#print").click(function(event){
// Function to serve spreadsheet of the report.
      var todatearray = $("#ledtodate").val().split("-");
      var orgtype = sessionStorage.getItem('orgt');
      var newtodate = todatearray[2]+"-"+todatearray[1]+"-"+todatearray[0];
        event.preventDefault();
    		var orgname = sessionStorage.getItem('orgn');
    		var orgtype = sessionStorage.getItem('orgt');
    		var xhr = new XMLHttpRequest();

    		xhr.open('GET', '/printprofitandloss?fyend='+sessionStorage.getItem('year2')+'&fystart='+sessionStorage.getItem('year1')+'&orgname='+orgname+'&calculateto='+newtodate+'&orgtype='+orgtype, true);
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


    $("#printpnl").click(function(event) {
// Displays a printable version of the report.
      $("#incometbl").unbind('dblclick');
      $("#expensetbl").unbind('dblclick');
      $('table a').contents().unwrap();
      $("table").removeClass('fixed-table').addClass('table-striped');
      $(".fixed-table-toolbar").remove();
      $("#printpnl").hide();
      $("#realprintpnl").show();
    });
    $("#realprintpnl").click(function(event) {
      window.print();
    });

  $("#pnlback").click(function(event) {
// Function to return from printable version.
    if ($("#realprintpnl").is(":visible")) {
      var todatearray = $("#ledtodate").val().split("-");
      var newtodate = todatearray[2]+"-"+todatearray[1]+"-"+todatearray[0];
      $.ajax(
        {
          type: "POST",
          url: "/showprofitlossreport",
          global: false,
          async: false,
          datatype: "text/html",
          data: {"financialstart":sessionStorage.yyyymmddyear1,"orgtype":sessionStorage.orgt,"calculateto":newtodate},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          }
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
    }
    else {
    $("#showprofitloss").click();
  }
  });

});
