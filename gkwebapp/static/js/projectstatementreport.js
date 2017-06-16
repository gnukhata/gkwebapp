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
// This script is for the project statement report.
$(document).ready(function() {

  oninvoice = 0;

  $("#msspinmodal").modal("hide");
  $("#psclearfields").hide();
  $(".fixed-table-loading").remove();

  $(' #prjsttable tbody tr:first-child td:eq(1) a').focus();
  $('#prjsttable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');

// Add and remove selected class to the row on focus and blure respectively.
  $(document).off('focus' ,'.prjstaccs').on('focus' ,'.prjstaccs',function() {
    $('#prjsttable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.prjstaccs').on('blur' ,'.prjstaccs',function() {
    $('#prjsttable tr').removeClass('selected');

  });
  var curindex;
  var nextindex;
  var previndex;


  $(document).off('keydown' ,'.prjstaccs').on('keydown' ,'.prjstaccs',function(event) {
// Navigation function for table rows
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#prjsttable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#prjsttable tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }

  });


  $("#prjsttable").off('click','tr').on('click','tr',function(e){
// Add selected class on click.
    e.preventDefault();
    var id = $(this).attr('data-value');
    var currindex = $(this).index();
    $('#prjsttable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#prjsttable tbody tr:eq('+currindex+') a').focus();

  });

  $("#prjsttable").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('data-value');
    var rindex = $(this).index();

    if(e.which==13)
    {

      $('#prjsttable tbody tr:eq('+rindex+')').dblclick() ;
    }
  });

  $("#prjsttable").off('dblclick','tr').on('dblclick','tr',function(e){
// Function to drill down to account ledger of the selected account.
    e.preventDefault();
    var acccode = $(this).attr('data-value');
    if (acccode=="")
    {
        return false;
    }
     var date = $("#calculateto").val().split("-");
     var newtodate = date[2]+"-"+date[1]+"-"+date[0];
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":6,"accountcode":acccode,"calculatefrom":sessionStorage.yyyymmddyear1,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":$("#projectcode").val(),"projectname":$("#projectname").val(),"monthlyflag":false,"narrationflag":false},
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
  $('#psclearfields').click(function(){
    // Clear search field.
    $(this).siblings(".bootstrap-table").find(".form-control").val("");
    $("#psclearfields").hide();
		$(".search").children(".form-control").focus();
  });

  $(".search").children(".form-control").keyup(function(event){
  	$("#psclearfields").show();
      if (event.keyCode == 27) {
        $(this).val("");
  			$("#psclearfields").hide();
      }
  		else if (event.which == 13) {
  			$(".prjstaccs:visible").first().focus();
  		}
  		else if ($(this).val() == "") {
  			$("#psclearfields").hide();
  		}
    });
  $("#print").click(function(event) {
// Function to serve a spreadsheet of the project statement.
    var date = $("#calculateto").val().split("-");
    var newtodate = date[2]+"-"+date[1]+"-"+date[0];
      event.preventDefault();
  		var orgname = sessionStorage.getItem('orgn');
  		var orgtype = sessionStorage.getItem('orgt');
  		var xhr = new XMLHttpRequest();
  		trialbalancetype = $("#trialbaltype").val();

  		xhr.open('GET', '/printprojectstatementreport?orgname=' +sessionStorage.getItem('orgn')+'&fystart='+sessionStorage.getItem('yyyymmddyear1')+'&fyend='+sessionStorage.getItem('yyyymmddyear2')+'&calculateto='+ newtodate+'&projectcode='+$("#projectcode").val()+'&projectname='+$("#projectname").val() , true);
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

  $("#printprjstatement").click(function(event) {
// Function to display a printable version of the report.
    var date = $("#calculateto").val().split("-");
    var newtodate = date[2]+"-"+date[1]+"-"+date[0];
    $("#msspinmodal").modal("show");
    $.ajax(
      {
        type: "POST",
        url: "/printprojectstatement",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":$("#projectcode").val(),"projectname":$("#projectname").val()},
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
  $("#prjstback").click(function(event) {
    $("#showprjstate").click();
  });



});
