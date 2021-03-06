
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
	$(".fixed-table-loading").remove(); // Remove unwanted symbol of loading from bootstrap-table
	$("#msspinmodal").modal("hide");
	if($("#canceldelflag").val() == 0){
	$('.del_unbilled_table tbody tr:first-child td:eq(1) a').focus(); // Set focus on first row on load.
	$('.del_unbilled_table tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');
	}else{
		$('.del_cancelled_table tbody tr:first-child td:eq(1) a').focus(); // Set focus on first row on load.
		$('.del_cancelled_table tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');
	}

    if(sessionStorage.userrole == 2){
	$("table thead tr th:last").hide();
	$("table tbody tr").each(function(){
	    $(this).find("td:last").hide();
	}
	);
    }
  
    $('.cancel_delchal').tooltip({
        title : "Clicking this button will cancel this Deliverynote.",
        placement : "bottom"
		});
		
	// Changing color of row if selected
	if($("#canceldelflag").val() == 0){
	$(document).off('focus' ,'.dcno').on('focus' ,'.dcno',function() {
		$('.del_unbilled_table tr').removeClass('selected');
		$(this).closest('tr').addClass('selected');
	});
	$(document).off('blur' ,'.dcno').on('blur' ,'.dcno',function() {
		$('.del_unbilled_table tr').removeClass('selected');
	});
}
	else{
		// Changing color of row if selected
		$(document).off('focus' ,'.dcno').on('focus' ,'.dcno',function() {
			$('.del_cancelled_table tr').removeClass('selected');
			$(this).closest('tr').addClass('selected');
		});
		$(document).off('blur' ,'.dcno').on('blur' ,'.dcno',function() {
			$('.del_cancelled_table tr').removeClass('selected');
		});
	}
	var curindex ;
	var nextindex;
	var previndex;
	if($("#canceldelflag").val() == 0){	
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
}
else{
	$(document).off('keydown' ,'.dcno').on('keydown' ,'.dcno',function(event) { // function for navigation in the table. i.e up and down arrow key.
		curindex = $(this).closest('tr').index();
		nextindex = curindex+1;
		previndex = curindex-1;
		if (event.which==40)
		{
			event.preventDefault();
			$('.del_cancelled_table tbody tr:eq('+nextindex+') td:eq(1) a').focus();
		}
		else if (event.which==38)
		{
			if(previndex>-1)
			{
				event.preventDefault();
				$('.del_cancelled_table tbody tr:eq('+previndex+') td:eq(1) a').focus();
			}
		}

	});
}
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
				    $("#info").html(resp);
				});

	});

	$("#viewcancelprintableversion").click(function(event){
		// Function to get a printable version of the report.
				$("#msspinmodal").modal("show");
				$.ajax(
					{
						type: "GET",
						url: "/print_cancelled_deliveries_report",
						global: false,
						async: false,
						datatype: "text",
			  data: {"inputdate": $("#inputdate").val(), "inout":$("#inout").val(), "del_cancelled_type": $("#del_cancelled_type").val()},
			  beforeSend: function(xhr)
						{
							xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
						}
					})
					.done(function(resp) {
						$("#info").html(resp);
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
	if (id==""){
		return false;
	}
	$("#modalindex").val($(this).index());
	console.log("double click");
	$.ajax({
	    type: "POST",
	    url: "/deliverychallan?action=showeditpopup",
	    global: false,
	    async: false,
	    datatype: "text/html",
	    data : {"dcid":id},
	    beforeSend: function(xhr)
	    {
		xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
	    }
	})
	.done(function(resp){
	    console.log("response");
	    $("#report_delchal").hide();
	    $("#viewdeldiv").show();
	    $("#viewdc").html("");
	    $("#viewdc").html(resp);

	    if($("#status").val() == 9){
		$("#print_button").hide();
	    }else{
		$("#print_button").show();
	    }

	    if($("#attachmentcount").val() > 0){
		$("#view_del_attachment").show();
	    }else{
		$("#view_del_attachment").hide();
	    }
	});
	});

	$(".del_cancelled_table").off('click','tr').on('click','tr',function(e){ // function to change color of row when it is selected using mouse.
		e.preventDefault();
		var id = $(this).attr('data-value');
		var currindex = $(this).index();
		$('.del_cancelled_table tr').removeClass('selected');
		$(this).toggleClass('selected');
		$('.del_cancelled_table tbody tr:eq('+currindex+') a').focus();

	});

	$(".del_cancelled_table").off('keydown','tr').on('keydown','tr',function(e){ // This function will call dblclick function of the selected row.
		var id = $(this).attr('data-value');
		var rindex = $(this).index();

		if(e.which==13)
		{
		$('.del_cancelled_table tbody tr:eq('+rindex+')').dblclick() ;
		}
});


	$(".del_cancelled_table").off('dblclick','tr').on('dblclick','tr',function(e){
		e.preventDefault();
		var id = $(this).attr('data-value');
		if (id==""){
			return false;
		}
		$("#modalindex").val($(this).index());
		$.ajax({
			type: "POST",
			url: "/deliverychallan?action=showcancelpopup",
			global: false,
			async: false,
			datatype: "text/html",
			data : {"dcid":id},
			beforeSend: function(xhr)
			{
			xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
			}
		})
		.done(function(resp){
			$("#report_delchal").hide();
			$("#viewdeldiv").show();
			$("#viewdc").html("");
			$("#viewdc").html(resp);
	
			if($("#status").val() == 9){
			$("#print_button").hide();
			}else{
			$("#print_button").show();
			}
	
			if($("#attachmentcount").val() > 0){
			$("#view_del_attachment").show();
			}else{
			$("#view_del_attachment").hide();
			}
		});
		});
		
	$("#back").click(function(event){
		$.ajax(
			{
			  type: "POST",
			  url: "/del_unbilled?action=view",
			  global: false,
			  async: false,
			  datatype: "json",
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

	$("#cback").click(function(event){
		$.ajax(
			{
			  type: "POST",
			  url: "/deliverychallan?action=viewcanceldel",
			  global: false,
			  async: false,
			  datatype: "json",
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

    $("#backbutton").click(function(event){
	$("#viewdc").html("");
	$("#viewdeldiv").hide();
	$('#report_delchal').show();
	$('#unbill_del_table tbody tr:eq(' + curindex + ') td:eq(1) a').focus();
        $('#unbill_del_table tbody tr:eq(' + curindex + ') td:eq(1) a').closest('tr').addClass('selected');
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
		$.ajax(
			{
			  type: "POST",
			  url: "/del_unbilled?action=view",
			  global: false,
			  async: false,
			  datatype: "json",
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
			$("#tbcback").click(function(event) {
				$.ajax(
					{
					  type: "POST",
					  url: "/deliverychallan?action=viewcanceldel",
					  global: false,
					  async: false,
					  datatype: "json",
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

	$('#del_unbilled_clearfields').click(function(){
    $(".search").children(".form-control").val("");
		$("#del_unbilled_clearfields").hide();
		$(".search").children(".form-control").focus();
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

    /*Following ajax will excute when "View Outword deliveries" or "View Inword deliveries" Button click.
      and it will gives the "Outward deliveries report" or "Inward deliveries report" depending on selected Period and Type of delivery*/
    
    var new_date_input = $("#inputdate").attr("value");
    var del_unbilled_type = $("#del_unbilled_type").attr("value");
    var inout = $("#inout").attr("value");
    $(".inoutdel").click(function(event) {
	if(inout == "9"){
	    inout = "15";
	}else if(inout == "15"){
	    inout = "9";
	}
	if(del_unbilled_type == "Purchase"){ 
	    del_unbilled_type = "Sale";
	}else if(del_unbilled_type == "Sale"){
	    del_unbilled_type = "Purchase";
	}
	$.ajax(
	{
        type: "POST",
        url: "/show_del_unbilled_report",
        global: false,
        async: false,
        data: {"inputdate": new_date_input, "inout":inout, "del_unbilled_type":del_unbilled_type},
        datatype: "text/html",
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
	

    var del_cancelled_type = $("#del_cancelled_type").attr("value");
    $(".inoutcanceldel").click(function(event) {
	if(inout == "9"){
	    inout = "15";
	}else if(inout == "15"){
	    inout = "9";
	}
	if(del_cancelled_type == "Purchase"){ 
	    del_cancelled_type = "Sale";
	}else if(del_cancelled_type == "Sale"){
	    del_cancelled_type = "Purchase";
	}
	$.ajax(
	{
        type: "POST",
        url: "/show_del_cancelled_report",
        global: false,
        async: false,
        data: {"inputdate": new_date_input, "inout":inout, "del_cancelled_type":del_cancelled_type},
        datatype: "text/html",
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
    	
	//For search data
	var curindex ;
  var nextindex;
  var previndex;

  $(document).off('keydown' ,'.libgname').on('keydown' ,'.libgname',function(event) {
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    n = $(".libgname").length;
    if (event.which==40 && nextindex < n)
    {
      event.preventDefault();
      $('#unbill_del_table tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#unbill_del_table tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }

	});

    $("#print_button").click(function(event){
	$.ajax({
            url: '/deliverychallan?action=print',
            type: 'POST',
            dataType: 'html',
            data: {"dcid":$("#dcid").val()},
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
        })
        .done(function(resp) {
            console.log("success");
            $('#printdc').html(resp);
	    $("#viewdc").hide();
	    $("#buttondiv").hide();
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
    });

    $(document).off("click", "#view_del_attachment").on("click", "#view_del_attachment", function(event){
        $.ajax({
            url: '/deliverychallan?action=getattachment',
            type: 'POST',
            datatype: 'json',
	    data: { "dcid": $("#dcid").val()},
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            }
        })
        .done(function(resp) {
	    var x = window.open();
            if (x) {
                x.focus();
                x.document.open();
                x.document.write(resp);
                x.document.close();
            } else {
                alert('Please allow popups and retry');
                x.close();
            }
            console.log("success");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
    });	
    
    $("#printbutton").click(function(event) {
	// this function creates a spreadsheet of the report.
	event.preventDefault();
	var orgname = sessionStorage.getItem('orgn');
	var orgtype = sessionStorage.getItem('orgt');
	var unbdelstring = '&inputdate='+$("#inputdate").val()+'&inout='+$("#inout").val()+'&del_unbilled_type='+ $("#del_unbilled_type").val();
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/deliverychallan?action=unbillspreadsheet&fystart='+sessionStorage.getItem('year1') + '&orgname='+orgname+'&orgtype='+orgtype+'&fyend='+sessionStorage.getItem('year2')+unbdelstring, true);
	xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
	xhr.responseType = 'blob';
	
	xhr.onload = function(e) {
  	    if (this.status == 200) {
		// if successfull a file will be served to the client.
		// get binary data as a response
        var blob = this.response;
        let windowURL = window.webkitURL || window.URL;
        var dwelement = document.createElement('a');
        let contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        dwelement.download = "Deliverynote.xlsx";
        dwelement.href = windowURL.createObjectURL(blob);
        dwelement.textContent = 'Download Sheet';
        dwelement.dataset.downloadurl = [contentType, dwelement.download, dwelement.href].join(':');
        dwelement.click();
  	    }
	};
	xhr.send();
	});

	$("#printcancelbutton").click(function(event) {
		// this function creates a spreadsheet of the report.
		event.preventDefault();
		var orgname = sessionStorage.getItem('orgn');
		var orgtype = sessionStorage.getItem('orgt');
		var unbdelstring = '&inputdate='+$("#inputdate").val()+'&inout='+$("#inout").val()+'&del_cancelled_type='+ $("#del_cancelled_type").val();
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/deliverychallan?action=cancellspreadsheet&fystart='+sessionStorage.getItem('year1') + '&orgname='+orgname+'&orgtype='+orgtype+'&fyend='+sessionStorage.getItem('year2')+unbdelstring, true);
		xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
		xhr.responseType = 'blob';
		
		xhr.onload = function(e) {
			  if (this.status == 200) {
			// if successfull a file will be served to the client.
			// get binary data as a response
			var blob = this.response;
			let windowURL = window.webkitURL || window.URL;
			var dwelement = document.createElement('a');
			let contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
			dwelement.download = "CancelledDeliverynote.xlsx";
			dwelement.href = windowURL.createObjectURL(blob);
			dwelement.textContent = 'Download Sheet';
			dwelement.dataset.downloadurl = [contentType, dwelement.download, dwelement.href].join(':');
			dwelement.click();
			  }
		};
		xhr.send();
		});
	
    $("#unbill_del_table").off('click', '.cancel_delchal').on('click', '.cancel_delchal', function(e) {
		var id = $(this).closest("tr").attr('data-value');
		if (id != ""){
			$('#myModal').modal('hide');
			$('#confirm_delete').modal('show');
			$('#confirm_delete').on('shown.bs.modal', function (e)
				{
				  $("#m_cancel").focus();
				});
		    $(document).off('click', '#delchaldel1').on('click', '#delchaldel1', function(e) {

				$.ajax(
				{
					type: "POST",
					url: "/deliverychallan?type=canceldelchal",
					global: false,
					async: false,
					datatype: "json",
					data: {"dcid":id},
					beforeSend: function(xhr)
			  		{
						xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
			  		},
			  		success: function(resp)
			  		{
						  if(resp["gkstatus"]==0){
							$('#confirm_delete').modal('hide');
							  $('#confirm_delete').on('hidden.bs.modal', function (e)
									{
									  $("#success-alert1").alert();
									  $("#success-alert1").fadeTo(2250, 500).slideUp(500, function(){
										$("#success-alert1").hide();

										var new_date_input = $("#inputdate").attr("value");
										var del_unbilled_type = $("#del_unbilled_type").attr("value");
										var inout = $("#inout").attr("value");
										$.ajax(
										{
											type: "POST",
											url: "/show_del_unbilled_report",
											global: false,
											async: false,
											data: {"inputdate": new_date_input, "inout":inout, "del_unbilled_type":del_unbilled_type},
											datatype: "text/html",
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
									  }); 
							  }
						  else {
							  $("#notran-del-alert1").alert();
							  $("#notran-del-alert1").fadeTo(2250, 500).slideUp(500, function(){
								$("#notran-del-alert1").hide();
							  });
							}
			  		}
				});
		});
	}
	});
});
