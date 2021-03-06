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
"Abhijith Balan" <abhijithb21@openmailbox.org>
"Mohd. Talha Pawaty" <mtalha456@gmail.com>
*/
/*
This script is for the view page of stock report.
*/
$(document).ready(function() {
	$('.modal-backdrop').remove();
	$("#viewstock_productname").focus();
	$('.viewstock_date').autotab('number');
	$(".dis").attr('disabled', true);

	var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");

	var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
	var sel1 = 0; // flag for focus on combo box

	// Setting default date to financialstart and end.
    var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g);
	$("#viewstock_fromdate").val(fromdatearray[2]);
	$("#viewstock_frommonth").val(fromdatearray[1]);
	$("#viewstock_fromyear").val(fromdatearray[0]);
    var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g);
    $("#viewstock_todate").val(todatearray[2]);
    $("#viewstock_tomonth").val(todatearray[1]);
    $("#viewstock_toyear").val(todatearray[0]);

	function pad (str, max) { //to add leading zeros in date
		str = str.toString();
		if (str.length==1) {
			return str.length < max ? pad("0" + str, max) : str;
		}
		else{
		    return str;
		}
	}
	function yearpad (str, max) { //to add leading 20 or 200 to year
		str = str.toString();
		if (str.length==1) {
			return str.length < max ? pad("200" + str, max) : str;
		}
		else if (str.length==2) {
			return str.length < max ? pad("20" + str, max) : str;
		}
		else{
		    return str;
		}
	}

	// function to toggle godown option depending on check box.
	$("#godownflag").click(function(e){
		if ($(this).is(":checked")) {
			$("#godownflag").val(1);
			$("#goselect").show();
		}
		else {
			$("#godownflag").val(0);
			$("#goselect").hide();
		}
	});
	// function to enable date fields on change of combo box  and setting focus on the date field on enter keyup.
	$(".viewstock_productname-option").click(function(){
		$("#viewstock_productname").data("value", $(this).data("value"));
		$("#viewstock_productname").text($(this).text());
	$("#viewstock_productname").focus();
	$(".dis").attr('disabled', false);
	
  });
  $("#viewstock_productname-input").keyup(function(event) {
    let searchtext = $("#viewstock_productname-input").val().toLowerCase();
      if (searchtext != "") {
        $(".viewstock_productname-option").each(function(index){
    if (index != -1) {
      let rowtext = $(this).text().toLowerCase();
      if (rowtext.indexOf(searchtext) != -1) {
        $(this).parent().show();
        $(this).show();
      }
      else {
        $(this).parent().hide();
        $(this).hide();
      }
    }
        });
      }
      else{
        $(".viewstock_productname-option").each(function(index){
    $(this).parent().show();
    $(this).show();
        });
      }
    });
  
    $(document).off('keydown' ,'#viewstock_productname-input').on('keydown' ,'#viewstock_productname-input',function(event) {
      if (event.which == 13 || event.which == 40){
        event.preventDefault();
        $(".viewstock_productname-option").parent().parent().find("a:visible").first().focus();
    }
	});
	
	$(".editgoddet-option").click(function(){
		$("#editgoddet").data("value", $(this).data("value"));
		$("#editgoddet").text($(this).text());
	$("#editgoddet").focus();
	$(".dis").attr('disabled', false);
	
  });
  $("#editgoddet-input").keyup(function(event) {
    let searchtext = $("#editgoddet-input").val().toLowerCase();
      if (searchtext != "") {
        $(".editgoddet-option").each(function(index){
    if (index != -1) {
      let rowtext = $(this).text().toLowerCase();
      if (rowtext.indexOf(searchtext) != -1) {
        $(this).parent().show();
        $(this).show();
      }
      else {
        $(this).parent().hide();
        $(this).hide();
      }
    }
        });
      }
      else{
        $(".editgoddet-option").each(function(index){
    $(this).parent().show();
    $(this).show();
        });
      }
    });
  
    $(document).off('keydown' ,'#editgoddet-input').on('keydown' ,'#editgoddet-input',function(event) {
      if (event.which == 13 || event.which == 40){
        event.preventDefault();
        $(".editgoddet-option").parent().parent().find("a:visible").first().focus();
    }
    });
  
    $(".searchabledropdown").on("shown.bs.dropdown", function () {
    let searchinput = $(this).data("input-id");
      document.getElementById(searchinput).focus();
    });

	$("#viewstock_productname").keydown(function(e){
		if (e.which == 13) {
			e.preventDefault();
			$(".dis").attr('disabled', false);
			$("#viewstock_fromdate").focus().select();
			}
		else{
			if (!$("#viewstock_productname").hasClass("open")){
				$("#viewstock_productname").click();
				  }
		}
	});

	$("#viewstock_fromdate").blur(function(event) {
		$(this).val(pad($(this).val(),2));
	});
	$("#viewstock_frommonth").blur(function(event) {
		$(this).val(pad($(this).val(),2));
	});
	$("#viewstock_todate").blur(function(event) {
		$(this).val(pad($(this).val(),2));
	});
	$("#viewstock_tomonth").blur(function(event) {
		$(this).val(pad($(this).val(),2));
	});

	$("#viewstock_fromyear").blur(function(event) {
		$(this).val(yearpad($(this).val(),4));
	});

	$("#viewstock_toyear").blur(function(event) {
		$(this).val(yearpad($(this).val(),4));
	});
	// navigation functions for enter key and up arrow keys.
	$("#viewstock_fromdate").keydown(function(e){
		if(e.which==13){
			e.preventDefault();
			$("#viewstock_frommonth").focus().select();
		}
		if(e.which==38){
			$("#viewstock_productname").focus().select();
		}
	});
	$("#viewstock_frommonth").keydown(function(e){
		if(e.which==13){
			e.preventDefault();
			$("#viewstock_fromyear").focus().select();
		}
		if(e.which==38){
			$("#viewstock_fromdate").focus().select();
		}
	});
	$("#viewstock_fromyear").keydown(function(e){
		if(e.which==13){
			e.preventDefault();
			$("#viewstock_todate").focus().select();
		}
		if(e.which==38){
			$("#viewstock_frommonth").focus().select();
		}
	});
	$("#viewstock_todate").keydown(function(e){
		if(e.which==13){
			e.preventDefault();
			$("#viewstock_tomonth").focus().select();
		}
		if(e.which==38){
			$("#viewstock_fromyear").focus();
		}
	});
	$("#viewstock_tomonth").keydown(function(e){
		if(e.which==13){
			e.preventDefault();
			$("#viewstock_toyear").focus().select();
		}
		if(e.which==38){
			$("#viewstock_todate").focus().select();
		}
	});
	if ($("#godownpresent").val()==0) {
		$("#viewstock_toyear").keydown(function(e){
			if(e.which==13){
				e.preventDefault();
				$("#viewstock_submit").click();
			}
			if(e.which==38){
				$("#viewstock_tomonth").focus().select();
			}
		});
	}

	else {
		$("#viewstock_toyear").keydown(function(e){
			if(e.which==13){
				e.preventDefault();
				if ($("#godownflag").val()==0){

				$("#godownflag").focus().select();}
				else{
					$("#editgoddet").focus();
				}
			}
			if(e.which==38){
				$("#viewstock_tomonth").focus().select();
			}
		});
		$("#editgoddet").keydown(function(e){
			if(e.which==13){
				e.preventDefault();
				$("#viewstock_submit").click();
			}
			else if(e.which==38){
				$("#editgoddet").prop("disabled", true);
				e.preventDefault();
				if ($("#godownflag").val()==0){
				$("#godownflag").focus().select();
			}
			else{ 
				$("#viewstock_toyear").focus().select();
			}
				setTimeout(function () {
					$("#editgoddet").prop("disabled", false);
					  }, 0);
			
			}
			else{
				if (!$("#viewsteditgoddetock_productname").hasClass("open")){
					$("#editgoddet").click();
					  }
			}
		});
	}
	$("#godownflag").keydown(function(e){
		if (e.which == 13 && $(this).val()==0) {
			e.preventDefault();
			$("#viewstock_submit").click();
		}
		if (e.which == 13 && $(this).val()==1) {
			e.preventDefault();
			$("#editgoddet").focus()  ;
		}
		if (e.which == 38) {
			$("#viewstock_toyear").focus().select();
		}
	});
	$("#viewstock_submit").click(function(event) {
		// --------------------starting validations------------------
		if ($("#viewstock_productname").data('value')==null) {
			$("#account-blank-alert").alert();
			$("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
				$("#account-blank-alert").hide();
			});
		    $('#viewstock_productname').focus();
			return false;
		}
		if ($("#editgoddet").data('value')==null && $("#godownflag").val()==1) {
			$("#godown-blank-alert").alert();
			$("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
				$("#godown-blank-alert").hide();
			});
		    $('#editgoddet').focus();
			return false;
		}
		if ($("#viewstock_fromyear").val()==0 ||$("#viewstock_frommonth").val()==0 ||$("#viewstock_fromdate").val()==0 ) {
			$("#date-alert").alert();
			$("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
				$("#date-alert").hide();
			});
			$('#viewstock_fromdate').focus().select();
			return false;
		}
		if ($("#viewstock_toyear").val() ==0||$("#viewstock_tomonth").val()==0||$("#viewstock_todate").val()==0) {
			$("#date-alert").alert();
			$("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
				$("#date-alert").hide();
			});
			$('#viewstock_todate').focus().select();
			return false;
		}
		var todate = $("#viewstock_toyear").val()+$("#viewstock_tomonth").val()+$("#viewstock_todate").val();
		var fromdate = $("#viewstock_fromyear").val()+$("#viewstock_frommonth").val()+$("#viewstock_fromdate").val();
		if(!Date.parseExact(fromdate,"yyyyMMdd")){
			$("#date-alert").alert();
			$("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
				$("#date-alert").hide();
			});
			$('#viewstock_fromdate').focus().select();
			return false;
		}
		if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
			$("#between-date-alert").alert();
			$("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
				$("#between-date-alert").hide();
			});
			$('#viewstock_fromdate').focus().select();
			return false;
		}
		if(!Date.parseExact(todate, "yyyyMMdd")){
			$("#date-alert").alert();
			$("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
				$("#date-alert").hide();
			});
			$('#viewstock_todate').focus().select();
			return false;
		}
		if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
			$("#between-date-alert").alert();
			$("#between-date-alert").fadeTo(2250, 400).slideUp(500, function(){
				$("#between-date-alert").hide();
			});
			$('#viewstock_todate').focus().select();
			return false;
		}
		if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
			$("#compare-date-alert").alert();
			$("#compare-date-alert").fadeTo(2250, 400).slideUp(500, function(){
				$("#compare-date-alert").hide();
			});
			$('#viewstock_todate').focus().select();
			return false;
		}
		// -----------------------end of validations---------------------

		// creating dataset for retrieving report from the server.
	    var dataset = {};
		if ($("#godownflag").val()==0) {
		    dataset = {"productcode":$("#viewstock_productname").data('value'), "productdesc": $.trim($("#viewstock_productname").text()),"calculatefrom":$("#viewstock_fromyear").val()+"-"+$("#viewstock_frommonth").val()+"-"+$("#viewstock_fromdate").val(),"calculateto":$("#viewstock_toyear").val()+"-"+$("#viewstock_tomonth").val()+"-"+$("#viewstock_todate").val(),"financialstart":sessionStorage.yyyymmddyear1,"backflag":0,"godownflag":$("#godownflag").val(),"goid":-1,"goname":""};
		}
		else if ($("#godownflag").val()==1) {
		    dataset = {"productcode":$("#viewstock_productname").data('value'), "productdesc": $.trim($("#viewstock_productname").text()),"calculatefrom":$("#viewstock_fromyear").val()+"-"+$("#viewstock_frommonth").val()+"-"+$("#viewstock_fromdate").val(),"calculateto":$("#viewstock_toyear").val()+"-"+$("#viewstock_tomonth").val()+"-"+$("#viewstock_todate").val(),"financialstart":sessionStorage.yyyymmddyear1,"backflag":0,"godownflag":$("#godownflag").val(), "goid":$("#editgoddet").data('value'), "goname":$(".editgoddet-option").data('godownname'), "goaddr":$(".editgoddet-option").data('godownaddress')};
		}
		$.ajax(
			{
				type: "POST",
				url: "/product?type=showstockreport",
				global: false,
				async: false,
				datatype: "text/html",
				data: dataset,
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

	$("#viewstock_reset").click(function(event) {
		$.ajax(
			{
	  
			  type: "POST",
			  url: "/product?type=viewstockreport",
			  global: false,
			  async: false,
			  datatype: "text/html",
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
	});
