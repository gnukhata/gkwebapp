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
/*
This script is for the report page of Trial balance.
*/
$(document).ready(function() {
	$(".fixed-table-loading").remove(); // Remove unwanted symbol of loading from bootstrap-table
	$("#msspinmodal").modal("hide");
	$('.trialbaltable tbody tr:first-child td:eq(1) a').focus(); // Set focus on first row on load.
	$('.trialbaltable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');

	// Changing color of row if selected
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

	$(document).off('keydown' ,'.accname').on('keydown' ,'.accname',function(event) { // function for navigation in the table. i.e up and down arrow key.
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

	$("#viewprintableversion").click(function(event){
	// Function to get a printable version of the report.
			var orgname = sessionStorage.getItem('orgn');
			var orgtype = sessionStorage.getItem('orgt');
			var startyear = sessionStorage.getItem('year1');
			var endyear = sessionStorage.getItem('year2');

			trialbalancetype = $("#trialbaltype").val();
			$("#msspinmodal").modal("show");
			$.ajax(
				{
					type: "GET",
					url: "/printtrialbalancereport",
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
					$("#info").html(resp)
				});

	});




	$(".trialbaltable").off('click','tr').on('click','tr',function(e){ // function to change color of row when it is selected using mouse.
		e.preventDefault();
		var id = $(this).attr('data-value');
		var currindex = $(this).index();
		$('.trialbaltable tr').removeClass('selected');
		$(this).toggleClass('selected');
		$('.trialbaltable tbody tr:eq('+currindex+') a').focus();

	});

	$(".trialbaltable").off('keydown','tr').on('keydown','tr',function(e){ // This function will call dblclick function of the selected row.
		var id = $(this).attr('data-value');
		var rindex = $(this).index();

		if(e.which==13)
		{
		$('.trialbaltable tbody tr:eq('+rindex+')').dblclick() ;
		}
});

	$(".trialbaltable").off('dblclick','tr').on('dblclick','tr',function(e){ // This function will drill down to ledger of the selected account.
		e.preventDefault();
		var acccode = $(this).attr('data-value');
		if (acccode=="")
		{
				return false;
		}
		 var date = $("#ledtodate").val().split("-");
		 var newtodate = date[2]+"-"+date[1]+"-"+date[0];
		 /*
		 Back flag is sent so that the ledger page will know from where it has been called.
		 accountcode of the selected account along with the report period is also sent.
		 */
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
		/* This function takes one arguement as an integer and displays the corresponding trail balance report.
		1 = Net trial balance
		2 = Gross trial balance
		3 = Extended trial balance
		*/
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
// Not used. For future reference.
	function open_in_newtab(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:application/pdf;charset=utf-8,' +	encodeURIComponent(text));
		element.setAttribute('target', '_blank');
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
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

	$('#gtbclearfields').click(function(){
    $(this).siblings(".bootstrap-table").find(".form-control").val("");
  });
	$('#etbclearfields').click(function(){
    $(this).siblings(".bootstrap-table").find(".form-control").val("");
  });
	$('#ntbclearfields').click(function(){
    $(this).siblings(".bootstrap-table").find(".form-control").val("");
  });
  $(".search").children(".form-control").keyup(function(event){
    if (event.keyCode == 27) {
      $(this).val("");
    }
  });

		$("#printbutton").click(function(event) {
			// this function creates a spreadsheet of the report.
		event.preventDefault();
		var orgname = sessionStorage.getItem('orgn');
		var orgtype = sessionStorage.getItem('orgt');
		var xhr = new XMLHttpRequest();
		trialbalancetype = $("#trialbaltype").val();

		xhr.open('GET', '/printtrialbalance?financialstart='+sessionStorage.yyyymmddyear1+'&orgname='+orgname+'&calculateto='+newtodate+'&orgtype='+orgtype+'&trialbalancetype='+trialbalancetype+'&fyend='+sessionStorage.getItem('year2'), true);
		xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
		xhr.responseType = 'blob';

		xhr.onload = function(e) {
  	if (this.status == 200) {
		// if successfull a file will be served to the client.
    // get binary data as a response
    	var blob = this.response;
	 		var url = window.URL.createObjectURL(blob);
			window.location.assign(url)
  	}
	};

	xhr.send();

	});

});
