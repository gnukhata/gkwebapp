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
*/

$(document).ready(function() {
	$('.trialbaltable tbody tr:first-child td:eq(1) a').focus();
	$('.trialbaltable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');
	var percentwid = 100*(($(".table-fixedheader").width()-12)/$(".table-fixedheader").width());
	$('.table-fixedheader thead').width(percentwid+"%");
	var percentheigth = 100*(($("body").height()-$(".navbar").height()-148)/$("body").height());
	$('.table-fixedheader tbody').height(percentheigth+"%");

	$(document).off('focus' ,'.accname').on('focus' ,'.accname',function() {
		$('.trialbaltable tr').removeClass('selected');
		$(this).closest('tr').addClass('selected');
	});

	$(document).off('blur' ,'.accname').on('blur' ,'.accname',function() {
		$('.trialbaltable tr').removeClass('selected');

	});
	var curindex ;
	var nextindex;
	var previndex;
	var date = $("#ledtodate").val().split("-");
	var newtodate = date[2]+"-"+date[1]+"-"+date[0];

	$(document).off('keydown' ,'.accname').on('keydown' ,'.accname',function(event) {
		curindex = $(this).closest('tr').index();
		nextindex = curindex+1;
		previndex = curindex-1;
		if (event.which==40)
		{
			event.preventDefault();
			$('.trialbaltable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
		}
		else if (event.which==38)
		{
			if(previndex>-1)
			{
				event.preventDefault();
				$('.trialbaltable tbody tr:eq('+previndex+') td:eq(1) a').focus();
			}
		}

	});

	var urole = $("#urole").val();


	$(".trialbaltable").off('click','tr').on('click','tr',function(e){
		e.preventDefault();
		var id = $(this).attr('value');
		var currindex = $(this).index();
		$('.trialbaltable tr').removeClass('selected');
		$(this).toggleClass('selected');
		$('.trialbaltable tbody tr:eq('+currindex+') a').focus();

	});

	$(".trialbaltable").off('keydown','tr').on('keydown','tr',function(e){
		var id = $(this).attr('value');
		var rindex = $(this).index();

		if(e.which==13)
		{

		$('.trialbaltable tbody tr:eq('+rindex+')').dblclick() ;
		}
});

	$(".trialbaltable tbody tr").off('dblclick').on('dblclick',function(e){
		e.preventDefault();
		var acccode = $(this).attr('value');
		if (acccode=="")
		{
				return false;
		}
		 var date = $("#ledtodate").val().split("-");
		 var newtodate = date[2]+"-"+date[1]+"-"+date[0];
		$.ajax(
			{
				type: "POST",
				url: "/showledgerreport",
				global: false,
				async: false,
				datatype: "text/html",
				data: {"backflag":$("#trialbaltype").val(),"accountcode":acccode,"calculatefrom":sessionStorage.yyyymmddyear1,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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

	function trialbalcall(tbbaltype) {
		$.ajax(
			{
				type: "POST",
				url: "/showtrialbalancereport",
				global: false,
				async: false,
				datatype: "text/html",
				data: {"financialstart":sessionStorage.yyyymmddyear1,"calculateto":newtodate,"trialbalancetype":tbbaltype},
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

	function open_in_newtab(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:application/pdf;charset=utf-8,' +	encodeURIComponent(text));
		element.setAttribute('target', '_blank');
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
 }

	function printtrialbalance() {
			Filename_net = "NetBalanceReport.pdf"
			Filename_gross = "GrossBalanceReport.pdf"
			Filename_ext = "ExtendedBalanceReport.pdf"

			var orgname = sessionStorage.getItem('orgn');
			var orgtype = sessionStorage.getItem('orgt');
			var startyear = sessionStorage.getItem('year1');
			var endyear = sessionStorage.getItem('year2');

			trialbalancetype = $("#trialbaltype").val();
			$.ajax(
				{
					type: "GET",
					url: "/printtrialbalance",
					global: false,
					async: false,
					datatype: "text",
					data: {"financialstart":sessionStorage.yyyymmddyear1, "calculateto":newtodate, "trialbalancetype": trialbalancetype, "orgname": orgname, "orgtype": orgtype, "startyear":startyear, "endyear":endyear},
					beforeSend: function(xhr)
					{
						xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
					}
				})
				.done(function(resp) {
					if(trialbalancetype == 1) {
						open_in_newtab(Filename_net, resp);
					}
					else if(trialbalancetype == 2) {
						open_in_newtab(Filename_gross, resp);
					}
					else if(trialbalancetype == 3) {
						open_in_newtab(Filename_ext, resp);
					}
					console.log("done");
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
	}


	$("#ntbview").click(function(event) {
		trialbalcall(1);
	});
	$("#gtbview").click(function(event) {
		trialbalcall(2);
	});
	$("#extbview").click(function(event) {
		trialbalcall(3);
	});
	$("#tbback").click(function(event) {
		$("#showtrialbalance").click();
	});
	$("#printbutton").click(function(event) {
		printtrialbalance();
	});

});
