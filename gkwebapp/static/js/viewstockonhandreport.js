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
"Prajkta Patkar"<prajkta.patkar007@gmail.com>
"Abhijith Balan" <abhijithb21@openmailbox.org>
"Mohd. Talha Pawaty" <mtalha456@gmaail.com>
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
			return str
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
	$("#viewstock_productname").change(function(){
		if ($("#viewstock_productname").val()==0){
			$("#godownwise_div").hide();
		}
		else{
			$("#godownwise_div").show();
		}
				$(this).keyup(function(e){
						if (e.which == 13) {
							e.preventDefault();
							$(".dis").attr('disabled', false);
							$("#viewstock_todate").focus().select();
						}
				});
				$(".dis").attr('disabled', false);
	});


	$("#viewstock_todate").blur(function(event) {
		$(this).val(pad($(this).val(),2));
	});
	$("#viewstock_tomonth").blur(function(event) {
		$(this).val(pad($(this).val(),2));
	});

	$("#viewstock_toyear").blur(function(event) {
		$(this).val(yearpad($(this).val(),4));
	});
	// navigation functions for enter key and up arrow keys.


	$("#viewstock_todate").keydown(function(e){
		if(e.which==13){
			e.preventDefault();
			$("#viewstock_tomonth").focus().select();
		}
		if(e.which==38){
			$("#viewstock_fromyear").focus().select();
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
			    if($("#godownwise_div").is(":hidden"))
				{
					$('#viewstock_submit').focus().click();
				}
			    else {
				if($("#godownflag").is (":visible")){
				    
				    $("#godownflag").focus().select();
				}
				else{
				    if($("#editgoddet").length>0){ //if there is no select box then view button is triggered.
					$("#editgoddet").focus();
				    }
				    else{
					$('#viewstock_submit').focus().click();
				    }
				}
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
			if(e.which==38){
				$("#godownflag").focus().select();
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
		if ($("#viewstock_productname").val()==null) {
			$("#account-blank-alert").alert();
			$("#account-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
				$("#account-blank-alert").hide();
			});
		    $('#viewstock_productname').focus();
			return false;
		}
	    if ($("#editgoddet").val()==null && $("#godownflag").val()==1 && $("#godwn").data("data-value") !=null){
			$("#godown-blank-alert").alert();
			$("#godown-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
				$("#godown-blank-alert").hide();
			});
		    $('#editgoddet').focus();
			return false;
		}

		if ($("#editgoddet").val()=="allgod" && $("#viewstock_productname").val()=="allprod") {
			$("#godprod-all-alert").alert();
			$("#godprod-all-alert").fadeTo(2250, 500).slideUp(500, function(){
				$("#godprod-all-alert").hide();
			});
		    $('#viewstock_productname').focus();
			return false;
		}

		if ($("#editgoddet").val() > 0  && $("#viewstock_productname").val()=="allprod") {
			$("#godprod-all-alert").alert();
			$("#godprod-all-alert").fadeTo(2250, 500).slideUp(500, function(){
				$("#godprod-all-alert").hide();
			});
		    $('#viewstock_productname').focus();
			return false;
		}

			/*	if ($("#godownflag").val()==1  && $("#viewstock_productname").val()=="allprod") {
					$("#godprod-all-alert").alert();
					$("#godprod-all-alert").fadeTo(2250, 500).slideUp(500, function(){
						$("#godprod-all-alert").hide();
					});
					$('#viewstock_productname').focus()
					return false;
				}
*/



		if ($("#viewstock_toyear").val() ==0||$("#viewstock_tomonth").val()==0||$("#viewstock_todate").val()==0) {
			$("#date-alert").alert();
			$("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
				$("#date-alert").hide();
			});
			$('#viewstock_todate').focus().select();
			return false;
		}
		var todate = $("#viewstock_toyear").val()+$("#viewstock_tomonth").val()+$("#viewstock_todate").val();
	/*	var fromdate = $("#viewstock_fromyear").val()+$("#viewstock_frommonth").val()+$("#viewstock_fromdate").val();
		if(!Date.parseExact(fromdate,"yyyyMMdd")){
			$("#date-alert").alert();
			$("#date-alert").fadeTo(2250, 400).slideUp(500, function(){
				$("#date-alert").hide();
			});
			$('#viewstock_fromdate').focus().select();
			return false;
		}*/

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

		// -----------------------end of validations---------------------

		// creating dataset for retrieving report from the server.
	    var dataset = {};
		if ($("#godownflag").val()==0) {
			if ($("#viewstock_productname").val()==0){

			    dataset = {"productcode":0, "productdesc": 0,"calculateto":$("#viewstock_toyear").val()+"-"+$("#viewstock_tomonth").val()+"-"+$("#viewstock_todate").val(),"backflag":1,"godownflag":$("#godownflag").val(),"goid":-1,"goname":""};
		}
			else {
			    dataset = {"productcode":$("#viewstock_productname option:selected").val(), "productdesc": $.trim($("#viewstock_productname option:selected").text()),"calculateto":$("#viewstock_toyear").val()+"-"+$("#viewstock_tomonth").val()+"-"+$("#viewstock_todate").val(),"backflag":0,"godownflag":$("#godownflag").val(),"goid":-1,"goname":""};
			}
		}
		else if ($("#godownflag").val()==1) {
			if ($("#editgoddet").val()==0){
//pag condition
			    dataset = {"productcode":$("#viewstock_productname option:selected").val(), "productdesc": $.trim($("#viewstock_productname option:selected").text()),"calculateto":$("#viewstock_toyear").val()+"-"+$("#viewstock_tomonth").val()+"-"+$("#viewstock_todate").val(),"backflag":2,"godownflag":$("#godownflag").val(), "goid":0 , "goname":"All godowns", "goaddr":$("#editgoddet option:selected").data('godownaddress')};
			}
		    
		    else{
			if($("#editgoddet").length>0){
			   dataset = {"productcode":$("#viewstock_productname option:selected").val(), "productdesc": $.trim($("#viewstock_productname option:selected").text()),"calculateto":$("#viewstock_toyear").val()+"-"+$("#viewstock_tomonth").val()+"-"+$("#viewstock_todate").val(),"backflag":3,"godownflag":$("#godownflag").val(), "goid":$("#editgoddet option:selected").val(), "goname":$("#editgoddet option:selected").data('godownname'), "goaddr":$("#editgoddet option:selected").data('godownaddress')};
				    
			}
		
			else{
			    // Dataset for single Godown.
			    dataset = {"productcode":$("#viewstock_productname option:selected").val(), "productdesc": $.trim($("#viewstock_productname option:selected").text()),"calculateto":$("#viewstock_toyear").val()+"-"+$("#viewstock_tomonth").val()+"-"+$("#viewstock_todate").val(),"backflag":3,"godownflag":$("#godownflag").val(), "goid":$("#godwn").data('value'), "goname":$("#godwn").data('godownname'), "goaddr":$("#godwn").data('godownaddress')};
			}
		    }
		}
		$.ajax(
			{
				type: "POST",
				url: "/product?type=showstockonhandreport",
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
		$("#stockonhandreport").click();
	});
	});
