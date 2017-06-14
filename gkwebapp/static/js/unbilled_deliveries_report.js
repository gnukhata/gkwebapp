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
"Vaibhav Kurhe" <vaibspidy@openmailbox.org>
*/
/*
This script is for the report page of Unbilled Deliveries.
*/
$(document).ready(function() {
	//Disabled Clear Search button
	$(".fixed-table-loading").remove(); // Remove unwanted symbol of loading from bootstrap-table
	$("#msspinmodal").modal("hide");
	$("#del_unbilled_clearfields").hide();
	$('.del_unbilled_table tbody tr:first-child td:eq(1) a').focus(); // Set focus on first row on load.
	$('.del_unbilled_table tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');

	// Changing color of row if selected
	$(document).off('focus' ,'.dcno').on('focus' ,'.dcno',function() {
		$('.del_unbilled_table tr').removeClass('selected');
		$(this).closest('tr').addClass('selected');
	});
	$(document).off('blur' ,'.dcno').on('blur' ,'.dcno',function() {
		$('.del_unbilled_table tr').removeClass('selected');

	});
	var curindex ;
	var nextindex;
	var previndex;
	$(document).off('keydown' ,'.dcno').on('keydown' ,'.dcno',function(event) { // function for navigation in the table. i.e up and down arrow key.
		curindex = $(this).closest('tr').index();
		nextindex = curindex+1;
		previndex = curindex-1;
		if (event.which==40)
		{
			event.preventDefault();
			$('.del_unbilled_table tbody tr:eq('+nextindex+') td:eq(1) a').focus();
		}
		else if (event.which==38)
		{
			if(previndex>-1)
			{
				event.preventDefault();
				$('.del_unbilled_table tbody tr:eq('+previndex+') td:eq(1) a').focus();
			}
		}

	});

	$("#viewprintableversion").click(function(event){
	// Function to get a printable version of the report.
			$("#msspinmodal").modal("show");
			$.ajax(
				{
					type: "GET",
					url: "/print_unbilled_deliveries_report",
					global: false,
					async: false,
					datatype: "text",
          data: {"inputdate": $("#inputdate").val(), "inout":$("#inout").val(), "del_unbilled_type": $("#del_unbilled_type").val()},
          beforeSend: function(xhr)
					{
						xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
					}
				})
				.done(function(resp) {
					$("#info").html(resp)
				});

	});




	$(".del_unbilled_table").off('click','tr').on('click','tr',function(e){ // function to change color of row when it is selected using mouse.
		e.preventDefault();
		var id = $(this).attr('data-value');
		var currindex = $(this).index();
		$('.del_unbilled_table tr').removeClass('selected');
		$(this).toggleClass('selected');
		$('.del_unbilled_table tbody tr:eq('+currindex+') a').focus();

	});

	$(".del_unbilled_table").off('keydown','tr').on('keydown','tr',function(e){ // This function will call dblclick function of the selected row.
		var id = $(this).attr('data-value');
		var rindex = $(this).index();

		if(e.which==13)
		{
		$('.del_unbilled_table tbody tr:eq('+rindex+')').dblclick() ;
		}
});

$(".del_unbilled_table").off('dblclick','tr').on('dblclick','tr',function(e){
	e.preventDefault();
	var id = $(this).attr('data-value');
	if (id=="")
	{
		return false;
	}
	$("#modalindex").val($(this).index());
	console.log("double click");
	$.ajax(
		{
			type: "POST",
			url: "/deliverychallan?action=showeditpopup",
			global: false,
			async: false,
			datatype: "text/html",
			data : {"id":id},
			beforeSend: function(xhr)
			{
				xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
			}
		}
	)
	.done(function(resp)
	{
		console.log("response");
		$("#viewdc").html("");
		$('.modal-backdrop').remove();
		$('.modal').modal('hide');
		$("#viewdc").html(resp);
		$('#myModal').modal('show');
		$('#myModal').on('hidden.bs.modal', function (e)
		{
			$("#viewdc").html("");
			$('.del_unbilled_table tbody tr:eq('+$("#modalindex").val()+') a').focus();
		});
	});
});

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

	$("#tbback").click(function(event) {
		$("#show_unbilled_deliveries").click();
	});

$(".search").children(".form-control").keyup(function(event){
	$("#del_unbilled_clearfields").show();
    if (event.keyCode == 27) {
      $(this).val("");
			$("#del_unbilled_clearfields").hide();
    }
		else if (event.which == 13) {
			$(".dcno:visible").first().focus();
		}
		else if ($(this).val() == "") {
			$("#del_unbilled_clearfields").hide();
		}
  });
	
/*
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

});*/
});
