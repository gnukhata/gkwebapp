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
"Vaibhav Kurhe" <vaibspidy@openmailbox.org>
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
*/

$(document).ready(function() {
	$(".fixed-table-loading").remove();
	$('#rctable tbody tr:first-child td:eq(1) a').focus();
	$('#rctable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');
	var rcindex = 0
	var pyindex = 0

	$(document).off('focus' ,'.rcaccname').on('focus' ,'.rcaccname',function() {
		$('#rctable tr').removeClass('selected');
		$(this).closest('tr').addClass('selected');
	});

	$(document).off('blur' ,'.rcaccname').on('blur' ,'.rcaccname',function() {
		$('#rctable tr').removeClass('selected');

	});
	var todatearray = $("#ledtodate").val().split("-");
	var fromdatearray = $("#ledfromdate").val().split("-");
	var newtodate = todatearray[2]+"-"+todatearray[1]+"-"+todatearray[0];
	var newfromdate = fromdatearray[2]+"-"+fromdatearray[1]+"-"+fromdatearray[0];
	var curindex ;
	var nextindex;
	var previndex;
	var date = $("#ledtodate").val().split("-");
	var newtodate = date[2]+"-"+date[1]+"-"+date[0];

	$(document).off('keydown' ,'.rcaccname').on('keydown' ,'.rcaccname',function(event) {
		curindex = $(this).closest('tr').index();
		rcindex = $(this).closest('tr').index();
		nextindex = curindex+1;
		previndex = curindex-1;
		if (event.which==40)
		{
			event.preventDefault();
			$('#rctable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
		}
		else if (event.which==38)
		{
			if(previndex>-1)
			{
				event.preventDefault();
				$('#rctable tbody tr:eq('+previndex+') td:eq(1) a').focus();
			}
		}
		else if (event.which==39)
		{

			$('#pytable tbody tr:eq('+pyindex+') td:eq(1) a').focus();
		}
	});

	var urole = $("#urole").val();


	$("#rctable").off('click','tr').on('click','tr',function(e){
		e.preventDefault();
		var id = $(this).attr('data-value');
		var currindex = $(this).index();
		$('#rctable tr').removeClass('selected');
		$(this).toggleClass('selected');
		$('#rctable tbody tr:eq('+currindex+') a').focus();

	});

	$("#rctable").off('keydown','tr').on('keydown','tr',function(e){
		var id = $(this).attr('data-value');
		var rindex = $(this).index();

		if(e.which==13)
		{

		$('#rctable tbody tr:eq('+rindex+')').dblclick() ;
		}
});

	$("#rctable").off('dblclick','tr').on('dblclick','tr',function(e){
		e.preventDefault();
		var acccode = $(this).attr('data-value');
		if (acccode=="")
		{
				return false;
		}

		$.ajax(
			{
				type: "POST",
				url: "/showledgerreport",
				global: false,
				async: false,
				datatype: "text/html",
				data: {"backflag":$("#backflag").val(),"accountcode":acccode,"calculatefrom":newfromdate,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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

	$(document).off('focus' ,'.pyaccname').on('focus' ,'.pyaccname',function() {
		$('#pytable tr').removeClass('selected');
		$(this).closest('tr').addClass('selected');
	});

	$("#hideleft").click(function(event){
		$("#rctable").parentsUntil(".table-responsive").hide();
		$(".table-responsive").removeClass("col-xs-6");
		$("#hideleft").hide(100);
		$("#cflclearfields").hide(100);
		$("#showleft").show(100);
		$("#hideright").hide();
	});
	$("#showleft").click(function(event){
		$("#rctable").parentsUntil(".table-responsive").show();
		$(".table-responsive").addClass("col-xs-6");
		$("#showleft").hide(100);
		$("#hideleft").show(100);
		$("#cflclearfields").show(100);
		$("#hideright").show();
	});
	$("#hideright").click(function(event){
		$("#pytable").parentsUntil(".table-responsive").hide();
		$(".table-responsive").removeClass("col-xs-6");
		$("#hideright").hide(100);
		$("#cfrclearfields").hide(100);
		$("#showright").show(100);
		$("#hideleft").hide();
	});
	$("#showright").click(function(event){
		$("#pytable").parentsUntil(".table-responsive").show();
		$(".table-responsive").addClass("col-xs-6");
		$("#showright").hide(100);
		$("#hideright").show(100);
		$("#cfrclearfields").show(100);
		$("#hideleft").show();
	});
	$('#cfrclearfields').click(function(){
    $(this).siblings(".bootstrap-table").find(".form-control").val("");
  });
  $('#cflclearfields').click(function(){
    $(this).siblings(".bootstrap-table").find(".form-control").val("");
  });

  $(".search").children(".form-control").keydown(function(event){
    if (event.shiftKey && event.keyCode == 8) {
      $(this).val("");
    }
  });
$("#viewprintableversion").click(function(event) {

	$.ajax(
		{
			type: "POST",
			url: "/cashflowreportprint",
			global: false,
			async: false,
			datatype: "text/html",
			data: {"financialstart":sessionStorage.yyyymmddyear1,"orgtype":sessionStorage.orgt,"calculateto":newtodate,"calculatefrom":newfromdate},
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
});

	$(document).off('blur' ,'.pyaccname').on('blur' ,'.pyaccname',function() {
		$('#pytable tr').removeClass('selected');

	});
	var curindex ;
	var nextindex;
	var previndex;
	var date = $("#ledtodate").val().split("-");
	var newtodate = date[2]+"-"+date[1]+"-"+date[0];

	$(document).off('keydown' ,'.pyaccname').on('keydown' ,'.pyaccname',function(event) {
		curindex = $(this).closest('tr').index();
		pyindex = $(this).closest('tr').index();
		nextindex = curindex+1;
		previndex = curindex-1;
		if (event.which==40)
		{
			event.preventDefault();
			$('#pytable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
		}
		else if (event.which==38)
		{
			if(previndex>-1)
			{
				event.preventDefault();
				$('#pytable tbody tr:eq('+previndex+') td:eq(1) a').focus();
			}
		}
		else if (event.which==37)
		{

			$('#rctable tbody tr:eq('+rcindex+') td:eq(1) a').focus();
		}


	});

	var urole = $("#urole").val();


	$("#pytable").off('click','tr').on('click','tr',function(e){
		e.preventDefault();
		var id = $(this).attr('data-value');
		var currindex = $(this).index();
		$('#pytable tr').removeClass('selected');
		$(this).toggleClass('selected');
		$('#pytable tbody tr:eq('+currindex+') a').focus();

	});

	$("#pytable").off('keydown','tr').on('keydown','tr',function(e){
		var id = $(this).attr('data-value');
		var rindex = $(this).index();

		if(e.which==13)
		{

		$('#pytable tbody tr:eq('+rindex+')').dblclick() ;
		}
});

	$("#pytable").off('dblclick','tr').on('dblclick','tr',function(e){
		e.preventDefault();
		var acccode = $(this).attr('data-value');
		if (acccode=="")
		{
				return false;
		}
		var todatearray = $("#ledtodate").val().split("-");
		var fromdatearray = $("#ledfromdate").val().split("-");
		var newtodate = todatearray[2]+"-"+todatearray[1]+"-"+todatearray[0];
		var newfromdate = fromdatearray[2]+"-"+fromdatearray[1]+"-"+fromdatearray[0];
		$.ajax(
			{
				type: "POST",
				url: "/showledgerreport",
				global: false,
				async: false,
				datatype: "text/html",
				data: {"backflag":$("#backflag").val(),"accountcode":acccode,"calculatefrom":newfromdate,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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

	function open_in_newtab(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:application/pdf;charset=utf-8,' +	encodeURIComponent(text));
		element.setAttribute('target', '_blank');
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	function printcashflowreport() {
		var orgname = sessionStorage.getItem('orgn');
		var startyear = sessionStorage.getItem('year1');
		var endyear = sessionStorage.getItem('year2');
		filename = "cashflowreport.pdf"
		var date = $("#ledtodate").val().split("-");
		var newtodate = date[2]+"-"+date[1]+"-"+date[0];
		var date = $("#ledfromdate").val().split("-");
		var newfromdate = date[2]+"-"+date[1]+"-"+date[0];
		$.ajax(
			{
				type: "POST",
				url: "/printcashflowreport",
				global: false,
				async: false,
				datatype: "text",
				data: {"financialstart":sessionStorage.yyyymmddyear1,"orgtype":sessionStorage.orgt,"calculateto":newtodate,"calculatefrom":newfromdate, "orgname": orgname, "startyear": startyear, "endyear": endyear},
				beforeSend: function(xhr)
				{
					xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
				}
			})
			.done(function(resp) {
				open_in_newtab(filename, resp);
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
	}


	$("#cfback").click(function(event) {
		$("#showcashflow").click();
	});
	$("#printbutton").click(function(event) {
		var orgname = sessionStorage.getItem('orgn');
		var date = $("#ledtodate").val().split("-");
		var newtodate = date[2]+"-"+date[1]+"-"+date[0];
		var date = $("#ledfromdate").val().split("-");
		var newfromdate = date[2]+"-"+date[1]+"-"+date[0];
		var orgtype = sessionStorage.getItem('orgt');
		event.preventDefault();
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/printcashflowreport?fyend='+sessionStorage.getItem('year2')+'&fystart='+sessionStorage.yyyymmddyear1+'&orgname='+orgname+'&calculateto='+newtodate+'&orgtype='+orgtype+'&calculatefrom='+newfromdate, true);
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
