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
	/*var date = $("#ledtodate").val().split("-");
	var newtodate = date[2]+"-"+date[1]+"-"+date[0];
  */
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

	/* var urole = $("#urole").val(); */

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
          data: {"inputdate": $("#inputdate").val(), "inout":$("#inout").val()},
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



});
