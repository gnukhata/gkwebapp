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
"Abhijith Balan" <abhijith@dff.org.in>
"Nitesh Chaughule" <nitesh@disroot.org>
*/
// This script is for multiple account popup.
$(document).ready(function() {
    
    $(".m_openbal").numeric();// opening balance column will only accept numbers, decimal and minus sign.
    $(".cessrate").numeric({"negative":false});
    $('#cessdiv').hide();
    var accrowhtml = '<tr>' + $('#m_acctable tbody tr:eq(0)').html() + '</tr>';
    var newrowhtml = '<tr>' + $('#multiactable tbody tr:eq(0)').html() + '</tr>';
    var cessdiv = '<div class="input-group cessratediv" id="cessdiv"><input type="text" class="form-control input-sm cessrate gstaccountfields" name="accountname" accesskey="a"><span class="input-group-addon cessrateaddon">%</span></div>';
    var taxtype ="";
    var taxrate ="";
    var taxstate ="";
    var cessrate = "";

    $(document).off("keydown",".m_accname").on("keydown",".m_accname",function(event){
	// This is the keydown event for account name column fields.
	$(".m_openbal").numeric();
	var nindex = $(this).closest('tr').index();
	var npindex = nindex-1;
	if (event.which==38)
	{
            if($('#m_gstaccount').is(':checked')){
		$('.taxrate').focus().select();
	    }else{
		$('#multiactable tbody tr:eq('+npindex+') td:eq(1) input').focus().select();
	    }
	}
	if (event.which==13){
	    event.preventDefault();
	    if ($.trim($('.m_accname').val()) == "" ) {
		$("#mult_blank-alert").alert();
		$("#mult_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#mult_blank-alert").hide();
		});
		return false;
	    }
	    if($('#m_gstaccount').is(':checked')){
		$('#m_acctable tbody tr:eq('+nindex+') td:eq(4) input').focus().select();
	    }else{
		$('#multiactable tbody tr:eq('+nindex+') td:eq(1) input').focus().select();
	    }
	}
    });

    //Change event for 'GST Account' checkbox.
    $(document).off("change","#m_gstaccount").on("change","#m_gstaccount",function(event){
	if($('#m_gstaccount').is(':checked')){
	    $('.actable').hide();
	    $('.multgstac').show();
	    $('.m_accname').prop("disabled", true);
	    $("input.gstaccountfields, select.gstaccountfields").prop("disabled", false);
	    $(".gstaccountfields").val($(".gstaccountfields option:first").val());
	}else{
	    $('.actable').show();
	    $('.multgstac').hide();
	    $('.m_accname').prop("disabled", false);
	    $("input.gstaccountfields, select.gstaccountfields").prop("disabled", true);
	    $(".gstaccountfields").val($(".gstaccountfields option:first").val());
	}
    });

    //Keydown event for 'GST Account' checkbox.
    $(document).off("keydown","#m_gstaccount").on("keydown","#m_gstaccount",function(event){
	if(event.which == 13){
	    if($('#m_gstaccount').is(':checked')){
		$(".taxname:enabled:first").focus().select();
	    }else{
		$(".m_accname:enabled:first").focus().select();
	    }
	}
    });

    //Change event for 'Tax Type'
    $(document).off("change",".taxname").on("change",".taxname",function(event){
	var txnindex = $(this).closest('tr').index();
	var ptxnindex = txnindex -1;
	taxtype = $.trim($('#m_acctable tbody tr:eq('+txnindex+') td:eq(0) option:selected').val());
	if (taxtype == "CESSIN" || taxtype == "CESSOUT") {
	    $('#m_acctable tbody tr:eq('+txnindex+') td:eq(2) input').numeric({"negative":false});
	    $('#m_acctable tbody tr:eq('+ txnindex +') td:eq(2) select').hide('#rate');

	    $('#m_acctable tbody tr:eq('+ txnindex +') td:eq(1) option:first').prop("selected",true);
	    $('#m_acctable tbody tr:eq('+ txnindex +') td:eq(2) option:first').prop("selected",true);
	    $('#m_acctable tbody tr:eq('+ txnindex +') td:eq(3) input').val("");
	    if ($(this).closest('tr').is(":last-child")){
		$('#m_acctable tbody tr:last td:eq(2) input').remove();
		$('#m_acctable tbody tr:last td:eq(2) span').remove();
		$('#m_acctable tbody tr:last td:eq(2)').append(cessdiv);
		$('#m_acctable tbody tr:eq('+txnindex+') td:eq(2) input').numeric({"negative":false});
	    }else{
		if($('.cessratediv').is(':visible')){
		    $('#m_acctable tbody tr:eq('+ txnindex +') td:eq(2) input').remove();
		    $('#m_acctable tbody tr:eq('+ txnindex +') td:eq(2) span').remove();
		    $('#m_acctable tbody tr:eq('+ txnindex +') td:eq(2)').append(cessdiv);
		    $('#m_acctable tbody tr:eq('+txnindex+') td:eq(2) input').numeric({"negative":false});
		}else{
		    $('#m_acctable tbody tr:eq('+ txnindex +') td:eq(2)').append(cessdiv);
		    $('#m_acctable tbody tr:eq('+txnindex+') td:eq(2) input').numeric({"negative":false});
		}
	    }
	}else{
	    $('#m_acctable tbody tr:eq('+ txnindex +') td:eq(2) select').show('#rate');
	    $('#m_acctable tbody tr:eq('+ txnindex +') td:eq(2) input').hide('#cessdiv');
	    $('#m_acctable tbody tr:eq('+ txnindex +') td:eq(2) span').hide('#cessdiv');
	    if (taxtype == 'IGSTIN' || taxtype == 'IGSTOUT') {
		$(".taxrate option.sgstopt").prop("disabled", true).prop("hidden", true);
		$(".taxrate option.igstopt").prop("disabled", false).prop("hidden", false);
		$('#m_acctable tbody tr:eq('+ txnindex +') td:eq(1) option:first').prop("selected",true);
		$('#m_acctable tbody tr:eq('+ txnindex +') td:eq(2) option:first').prop("selected",true);
		$('#m_acctable tbody tr:eq('+ txnindex +') td:eq(3) input').val("");
	    }
 	    else {
		$(".taxrate option.igstopt").prop("disabled", true).prop("hidden", true);
		$(".taxrate option.sgstopt").prop("disabled", false).prop("hidden", false);
		$('#m_acctable tbody tr:eq('+ txnindex +') td:eq(1) option:first').prop("selected",true);
		$('#m_acctable tbody tr:eq('+ txnindex +') td:eq(2) option:first').prop("selected",true);
		$('#m_acctable tbody tr:eq('+ txnindex +') td:eq(3) input').val("");
	    }
	}
    });

    //Keydown for 'Tax Type'.
    $(document).off("keydown",".taxname").on("keydown",".taxname",function(event){
	var tnindex = $(this).closest('tr').index();
	var ptnindex = tnindex - 1;
	if (event.which == 13) {
	    event.preventDefault();
	    if ($.trim($('.taxname').val()) == "" ) {
                $("#m_taxtype-alert").alert();
                $("#m_taxtype-alert").fadeTo(2250, 200).slideUp(500, function(){
                    $("#m_taxtype-alert").hide();
		});
                $(".taxname").focus();
                return false;
            }
	    $('#m_acctable tbody tr:eq('+tnindex+') td:eq(1) select').focus().select();
	}
	else if (event.which == 38) {
	    if(tnindex > 0){
		if ($('#m_acctable tbody tr:eq('+tnindex+') td:eq(0) option:visible').first().is(":selected")) {
		    $( '#m_acctable tbody tr:eq('+ptnindex+') td:eq(4) input').focus().select();
		}
	    }
	    
	}
    });

    //Keydown for 'Tax state'.
    $(document).off("keydown",".taxstate").on("keydown",".taxstate",function(event){
	var tsindex = $(this).closest('tr').index();
	taxtype = $.trim($('#m_acctable tbody tr:eq('+tsindex+') td:eq(0) option:selected').val());
	if (event.which == 13) {
	    event.preventDefault();
	    if ($.trim($('.taxstate').val()) == "" ) {
		$("#mult_taxstate-alert").alert();
                $("#mult_taxstate-alert").fadeTo(2250, 200).slideUp(500, function(){
                    $("#mult_taxstate-alert").hide();
		});
                $(".taxstate").focus();
                return false;
            }

	    let taxstatecode = $('#m_acctable tbody tr:eq('+tsindex+') td:eq(1) option:selected').attr("stateid");
	    if (taxstatecode !== "") {
	    $.ajax({
		url: '/addaccount?type=abbreviation',
		type: 'POST',
		global: false,
		async: false,
		datatype: 'json',
		data: {"statecode": taxstatecode},
		beforeSend: function(xhr)
		{
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		}
	    })
	    .done(function(resp){
		if (resp.gkstatus == 0) {
		    taxstate = resp.abbreviation;
		}
	    })
            .fail(function() {
		console.log("error");
	    })
	    .always(function() {
		console.log("complete");
	    });
	    }
	    
	    if(taxtype == 'CESSIN' || taxtype == 'CESSOUT'){
		$('#m_acctable tbody tr:eq('+tsindex+') td:eq(2) input').focus().select();
	    }else{
		$('#m_acctable tbody tr:eq('+tsindex+') td:eq(2) select').focus().select();
	    }
	}
	else if (event.which == 38) {
	    if ($('#m_acctable tbody tr:eq('+tsindex+') td:eq(1) option:visible').first().is(":selected")) {
		$('#m_acctable tbody tr:eq('+tsindex+') td:eq(0) select').focus().select();
	    }
	}
    });

    //Change Event for 'Tax State' under that ajax call which can give abbreviation of state.  
    $(document).off("change",".taxstate").on("change",".taxstate",function(event){
	var tscindex = $(this).closest('tr').index();
	let taxstatecode = $('#m_acctable tbody tr:eq('+tscindex+') td:eq(1) option:selected').attr("stateid");
	$('#m_acctable tbody tr:eq('+ tscindex +') td:eq(2) option:first').prop("selected",true);
	$('#m_acctable tbody tr:eq('+ tscindex +') td:eq(3) input').val("");
	$('#m_acctable tbody tr:eq('+ tscindex +') td:eq(2) input').val("");
	if (taxstatecode !== "") {
	    $.ajax({
		url: '/addaccount?type=abbreviation',
		type: 'POST',
		global: false,
		async: false,
		datatype: 'json',
		data: {"statecode": taxstatecode},
		beforeSend: function(xhr)
		{
		    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
		}
	    })
	    .done(function(resp)   /*This function will return spec name of the product*/
		  {
		      if (resp.gkstatus == 0) {
			  taxstate = resp.abbreviation;
		      }
		  })
		.fail(function() {
		    console.log("error");
		})
		.always(function() {
		    console.log("complete");
		});
	}
	else {
	    taxstate = "";
	    $(".m_accname").val("");
	}
    });

    //Keydown for 'Tax Rate'.
    $(document).off("keydown",".taxrate").on("keydown",".taxrate",function(event){
	var rateindex = $(this).closest('tr').index();
	if(event.which == 13){
	    event.preventDefault();
	    if(rateindex == 0){
		if(!$('.taxrate').is(':hidden')){
		    if ($.trim($('#m_acctable tbody tr:eq('+rateindex+') td:eq(2) option:selected').val()) == "" ) {
			$("#mult_taxrate-alert").alert();
			$("#mult_taxrate-alert").fadeTo(2250, 200).slideUp(500, function(){
			    $("#mult_taxrate-alert").hide();
			});
			$(".taxrate").focus();
			return false;
		    }
		}
	    }
	    if($("#m_gstaccount").is(':checked')){
		$('#m_acctable tbody tr:eq('+rateindex+') td:eq(4) input').focus().select();
	    }else{
		$('#m_acctable tbody tr:eq('+rateindex+') td:eq(3) input').focus().select();
	    }
	}
	else if (event.which == 38) {
	    if ($('#m_acctable tbody tr:eq('+rateindex+') td:eq(2) option:visible').first().is(":selected")) {
		$('#m_acctable tbody tr:eq('+rateindex+') td:eq(1) select').focus().select();
	    }
	}

	taxrate = $.trim($('#m_acctable tbody tr:eq('+rateindex+') td:eq(2) option:selected').val());
	if (taxtype!="" && taxstate!="" && taxrate!="") {
	    $('#m_acctable tbody tr:eq('+rateindex+') td:eq(3) input').val(taxtype + "_" + taxstate + "@" + taxrate);
	}
	else {
	    $('#m_acctable tbody tr:eq('+rateindex+') td:eq(3) input').val("");
	}
    });

    $(document).off("change",".taxrate").on("change",".taxrate",function(event){
	var trindex = $(this).closest('tr').index();
	taxrate = $.trim($('#m_acctable tbody tr:eq('+trindex+') td:eq(2) option:selected').val());
	if (taxtype!="" && taxstate!="" && taxrate!="") {
	    $('#m_acctable tbody tr:eq('+trindex+') td:eq(3) input').val(taxtype + "_" + taxstate + "@" + taxrate);
	}
	else {
	    $('#m_acctable tbody tr:eq('+trindex+') td:eq(3) input').val("");
	}
    });

    //Change event for 'Cess rate' field.
    $(document).off("change",".cessrate").on("change",".cessrate", function(event){
	var cesindex = $(this).closest('tr').index();
	cessrate = $.trim($('#m_acctable tbody tr:eq('+cesindex+') td:eq(2) input').val());
	if (taxtype!="" && taxstate!="" && cessrate!="") {
	    $('#m_acctable tbody tr:eq('+cesindex+') td:eq(3) input').val(taxtype + "_" + taxstate + "@" + cessrate + "%");
	}
	else {
	    $('#m_acctable tbody tr:eq('+cesindex+') td:eq(3) input').val("");
	}
    });

    //Keydown for 'Cess rate' field.
    $(document).off("keydown",".cessrate").on("keydown",".cessrate", function(event){
	var cesindex = $(this).closest('tr').index();
	if (event.which == 13 ) {
	    event.preventDefault();
	    if(cesindex == 0){
		if(!$('.cessrate').is(':hidden')){
		    if ($.trim($('.cessrate').val())=="") {
			$("#mult_cessrate-alert").alert();
			$("#mult_cessrate-alert").fadeTo(2250, 200).slideUp(500, function(){
			    $("#mult_cessrate-alert").hide();
			});
			$('#m_acctable tbody tr:eq('+cesindex+') td:eq(2) input').focus();
			return false;
		    }
		}
	    }

	    cessrate = $.trim($('#m_acctable tbody tr:eq('+cesindex+') td:eq(2) input').val());
	    if (taxtype!="" && taxstate!="" && cessrate!="") {
		$('#m_acctable tbody tr:eq('+cesindex+') td:eq(3) input').val(taxtype + "_" + taxstate + "@" + cessrate + "%");
	    }
	    else {
		$('#m_acctable tbody tr:eq('+cesindex+') td:eq(3) input').val("");
	    }
	    
	    if($("#m_gstaccount").is(':checked')){
		$('#m_acctable tbody tr:eq('+cesindex+') td:eq(4) input').focus().select();
	    }else{
		$('#m_acctable tbody tr:eq('+cesindex+') td:eq(3) input').focus().select();
	    }
	}
	else if (event.which == 38) {
	    $('#m_acctable tbody tr:eq('+cesindex+') td:eq(1) select').focus().select();
	}
    });
    
    $(document).off("keydown",".m_openbal").on("keydown",".m_openbal", function(event){
	// Keydown event for opening balance field.
	$(".m_openbal").numeric();
	var curindex = $(this).closest('tr').index();
	var nextindex = curindex+1;
	var previndex = curindex-1;
	var numberofrows = $(".m_openbal").length;
	if (event.which==38)
	{
	    if($('#m_gstaccount').is(':checked')){
		if(taxtype == 'CESSIN' || taxtype == 'CESSOUT'){
		    $('#m_acctable tbody tr:eq('+curindex+') td:eq(2) input').focus().select();
		}else{
		    $('#m_acctable tbody tr:eq('+curindex+') td:eq(2) select').focus().select();
		}
	    }else{
		$('#multiactable tbody tr:eq('+curindex+') td:eq(0) input').focus().select();
	    }
	}
	if(event.which == 13)
	{
	    // Validates whether the account name of corresponfing row is blank or not.
	    var accnt = $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(3) input').val());
	    var type = $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val());
	    if($("#m_gstaccount").is(':checked')){
		if(type == 'CESSIN' || type == 'CESSOUT'){
		    var rateoftax = $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(2) input').val());
		}else{
		    rateoftax = $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(2) option:selected').val());
		}
		if(accnt=="" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) == "" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) =="" && rateoftax =="")
		{
		    if (curindex == 0) {
			$("#nodatasaved-alert").alert();
			$("#nodatasaved-alert").fadeTo(2250, 500).slideUp(500, function(){
			    $("#m_multiacc").modal("hide");
			    $(".modal-backdrop").hide();
			    $("#nodatasaved-alert").hide();
			});
			return false;
		    }
		    if (curindex == numberofrows - 1) {
			$("#acc_add").click();
			return false;
		    }
		}else{
		    $('#m_acctable tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
		}

		if ($(this).closest('tr').is(":last-child"))
		{
		    if(accnt=="" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) == "" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) =="" && rateoftax ==""){
			$("#acc_add").click();
			return false;
		    }else if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) != "" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) !="" && rateoftax !="" && accnt !="" ){
			var curacname = $('#m_acctable tbody tr:eq('+curindex+') td:eq(3) input').val();
			for (let j = 0; j < $('#m_acctable tbody tr').length - 1; j++) {
			    let pvacname = $('#m_acctable tbody tr:eq('+ j +') td:eq(3) input').val();
			    if(curacname == pvacname){
				$("#acname_duplicate-alert").alert();
				$("#acname_duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
				    $("#acname_duplicate-alert").hide();
				});
				$('#m_acctable tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
				return false;
			    }
			}
		    }
		    else if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) == "" || $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) =="" || rateoftax =="" || accnt =="" ){
			$("#field_blank-alert").alert();
			$("#field_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			    $("#field_blank-alert").hide();
			});
			$('#m_acctable tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
			return false;
		    }
		    addRow(curindex);
		}else{
		    
		    if(type == 'CESSIN' || type == 'CESSOUT'){
			rateoftax = $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(2) input').val());
		    }else{
			rateoftax = $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(2) option:selected').val());
		    }
		    if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) != "" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) !="" && rateoftax !="" && accnt !="" ){
			curacname = $('#m_acctable tbody tr:eq('+curindex+') td:eq(3) input').val();
			for (let j = 0; j < $('#m_acctable tbody tr').length - 1; j++) {
			    if(curindex == j){
				j++;
			    }else{
				let pvacname = $('#m_acctable tbody tr:eq('+ j +') td:eq(3) input').val();
				if(curacname == pvacname){
				    $("#acname_duplicate-alert").alert();
				    $("#acname_duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
					$("#acname_duplicate-alert").hide();
				    });
				    $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
				    return false;
				}
			    }
			}
		    }else if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) == "" || $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) =="" || rateoftax =="" || accnt =="" ){
			$("#field_blank-alert").alert();
			$("#field_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
			    $("#field_blank-alert").hide();
			});
			$('#m_acctable tbody tr:eq('+curindex+') td:eq(0) select').focus().select();
			return false;
		    }
		    $('#m_acctable tbody tr:eq('+nextindex+') td:eq(0) select').focus().select();
		}
	    }else{
		var acname = $.trim($('#multiactable tbody tr:eq('+curindex+') td:eq(0) input').val());
		if(acname == "")
		{
		    if (curindex == 0) {
			$("#nodatasaved-alert").alert();
			$("#nodatasaved-alert").fadeTo(2250, 500).slideUp(500, function(){
			    $("#m_multiacc").modal("hide");
			    $(".modal-backdrop").hide();
			    $("#nodatasaved-alert").hide();
			});
			return false;
		    }
		    if (curindex == numberofrows - 1) {
			$("#acc_add").click();
			return false;
		    }
		}else{
		    $('#multiactable tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
		}
		if ($(this).closest('tr').is(":last-child"))
		{
		    curacname = $('#multiactable tbody tr:eq('+curindex+') td:eq(0) input').val();
		    for (let j = 0; j < $('#multiactable tbody tr').length - 1; j++) {
			let pvacname = $('#multiactable tbody tr:eq('+ j +') td:eq(0) input').val();
			if(curacname == pvacname){
			    $("#acname_duplicate-alert").alert();
			    $("#acname_duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
				$("#acname_duplicate-alert").hide();
			    });
			    $('#multiactable tbody tr:eq('+curindex+') td:eq(0) input').focus().select();
			    return false;
			}
		    }
		    addRow(curindex);
		}
	    }
	    if ($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(4) input').val()) == 0 || $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(4) input').val())=="")
	    {
		// Default value 0.00 is set if the field is left blank or its value is 0.
		$('#m_acctable tbody tr:eq('+curindex+') td:eq(4) input:enabled').val("0.00");
	    }
	    if ($.trim($('#multiactable tbody tr:eq('+curindex+') td:eq(1) input').val()) == 0 || $.trim($('#multiactable tbody tr:eq('+curindex+') td:eq(1) input').val())=="")
	    {
		// Default value 0.00 is set if the field is left blank or its value is 0.
		$('#multiactable tbody tr:eq('+curindex+') td:eq(1) input:enabled').val("0.00");
	    }
	}
    });

    //Function to add new row to add 'GST Account'.
    function addRow(curindex){
	var nextrwindex = curindex+1;
      // This function will validate the current row and then add a new row.
	if($("#m_gstaccount").is(':checked')){
	    var accname = $('#m_acctable tbody tr:eq('+curindex+') td:eq(3) input').val();
	}else{
	    accname = $('#multiactable tbody tr:eq('+curindex+') td:eq(0) input').val();
	}
	if (accname == "") {
	    $("#acc_add").click();
	    return false;
	}
	
    $.ajax({
	url: '/accountexists',
	type: 'POST',
	datatype: 'json',
	data: {"accountname": accname},
	beforeSend: function(xhr)
	{
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
	}
    })
    .done(function(jsonobj){
	if (jsonobj["gkstatus"]==1){
            $("#mult_duplicate-alert").alert();
            $("#mult_duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
		$("#mult_duplicate-alert").hide();
            });
	    if($('#m_gstaccount').is(':checked')){
		$('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:first').focus().select();
	    }else{
		$('#multiactable tbody tr:eq('+curindex+') td:eq(0) input').focus().select();
	    }
	}
	if (jsonobj["gkstatus"] == 0){
	    if($("#m_gstaccount").is(':checked')){
		$("#m_acctable").append(accrowhtml);
		$('#m_acctable tbody tr:eq('+nextrwindex+') td:eq(0) option:first').focus().select();
		$("#m_acctable tbody tr:last td:eq(5)").append('<div style="text-align: center;"><a href="#" class="m_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div>');
	    }else{
		$("#multiactable").append(newrowhtml);
		$('#multiactable tbody tr:eq('+nextrwindex+') td:eq(0) input').focus().select();
		$("#multiactable tbody tr:last td:eq(2)").append('<div style="text-align: center;"><a href="#" class="m_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div>');
	    }
	    if($('#m_gstaccount').is(':checked')){
		$("input.gstaccountfields, select.gstaccountfields").prop("disabled", false);
		$('.m_accname').prop("disabled", true);
		$('.taxname').focus().select();
	    }else{
		$("input.gstaccountfields, select.gstaccountfields").prop("disabled", true);
		$('.m_accname').prop("disabled", false);
		$('.m_accname').focus().select();
	    }
	}
    });
    }

    $(document).off("click",".headerdel").on("click", ".headerdel", function() {
	$("#m_multiacc").modal('hide');
	$("#reset").click();
	$('.modal-backdrop').remove();
    });
    
    $(document).off("click",".m_del").on("click", ".m_del", function() {
	//This function will delete the current row.
	$(this).closest('tr').fadeOut(200, function(){
	    $(this).closest('tr').remove();	 //closest method gives the closest element specified
	    if($('#m_gstaccount').is(':checked')){
		$('#m_acctable tbody tr:last td:eq(4) input').focus().select();
	    }else{
		$('#multiactable tbody tr:last td:eq(1) input').focus().select();
	    }
	});
	if($('#m_gstaccount').is(':checked')){
	    $('#m_acctable tbody tr:last td:eq(4) input').focus().select();
	}else{
	    $('#multiactable tbody tr:last td:eq(1) input').focus().select();
	}
    });
    
var allow = true;
var blankindex = 0;
$(document).off("click","#acc_add").on("click", "#acc_add", function() {

// Function to save all accounts in the table.
    var output = [];	// This is an array which will contain dictionaries representing rows of the table.
    var m_grpnm = $.trim($("#m_gname").val());
    var allowsave = 1;
    var seenac = {};
    if($("#m_gstaccount").is(':checked')){ 
  $("#m_acctable tbody tr").each(function() { //loop for the rows of the table body
      var curindex = $(this).index();
      var accnt = $.trim($('#m_acctable tbody tr:eq('+ curindex +') td:eq(3) input').val());
      var taxtype = $.trim($('#m_acctable tbody tr:eq('+ curindex +') td:eq(0) option:selected').val());

      if ($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(4) input').val()) == 0 || $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(4) input').val())=="")
      {
	  $('#m_acctable tbody tr:eq('+curindex+') td:eq(4) input:enabled').val("0.00");
      }
      
      if(taxtype =='CESSIN' || taxtype =='CESSOUT'){
	  var rateoftax = $.trim($('#m_acctable tbody tr:eq('+ curindex +') td:eq(2) input').val());
      }else{
	  rateoftax = $.trim($('#m_acctable tbody tr:eq('+ curindex +') td:eq(2) option:selected').val());
      }

      //This is do not allow to create same account name. 
      if(seenac[accnt]){
	  $("#acname_duplicate-alert").alert();
	  $("#acname_duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#acname_duplicate-alert").hide();
	  });
	  $('#m_acctable tbody tr:last td:eq(4) input').focus().select();
	  allowsave = 0;
	  return false;
      }else{
	  seenac[accnt] = true;
      }
      
      //Alert for blank fields
      if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) != "" && accnt !="" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) =="" && rateoftax =="" ){
	  $("#field_blank-alert").alert();
	  $("#field_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#field_blank-alert").hide();
	  });
	  allowsave = 0;
	  $('#m_acctable tbody tr:eq('+ curindex +') td:eq(0) select').focus().select();
	  return false;
      }else if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) == "" && accnt =="" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) !="" && rateoftax =="" ){
	  $("#field_blank-alert").alert();
	  $("#field_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#field_blank-alert").hide();
	  });
	  allowsave = 0;
	  $('#m_acctable tbody tr:eq('+ curindex +') td:eq(0) select').focus().select();
	  return false;
      }else if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) == "" && accnt =="" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) =="" && rateoftax !="" ){
	  $("#field_blank-alert").alert();
	  $("#field_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#field_blank-alert").hide();
	  });
	  allowsave = 0;
	  $('#m_acctable tbody tr:eq('+ curindex +') td:eq(0) select').focus().select();
	  return false;
      }else if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) != "" && accnt !="" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) =="" && rateoftax !="" ){
	  $("#field_blank-alert").alert();
	  $("#field_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#field_blank-alert").hide();
	  });
	  allowsave = 0;
	  $('#m_acctable tbody tr:eq('+ curindex +') td:eq(0) select').focus().select();
	  return false;
      }else if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) != "" && accnt !="" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) !="" && rateoftax =="" ){
	  $("#field_blank-alert").alert();
	  $("#field_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#field_blank-alert").hide();
	  });
	  allowsave = 0;
	  $('#m_acctable tbody tr:eq('+ curindex +') td:eq(0) select').focus().select();
	  return false;
      }else if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) != "" && accnt =="" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) =="" && rateoftax =="" ){
	  $("#field_blank-alert").alert();
	  $("#field_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#field_blank-alert").hide();
	  });
	  allowsave = 0;
	  $('#m_acctable tbody tr:eq('+ curindex +') td:eq(0) select').focus().select();
	  return false;
      }else if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) == "" && accnt =="" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) !="" && rateoftax !="" ){
	  $("#field_blank-alert").alert();
	  $("#field_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#field_blank-alert").hide();
	  });
	  allowsave = 0;
	  $('#m_acctable tbody tr:eq('+ curindex +') td:eq(0) select').focus().select();
	  return false;
      }else if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) != "" && accnt !="" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) !="" && rateoftax =="" ){
	  $("#field_blank-alert").alert();
	  $("#field_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#field_blank-alert").hide();
	  });
	  allowsave = 0;
	  $('#m_acctable tbody tr:eq('+ curindex +') td:eq(0) select').focus().select();
	  return false;
      }else if($.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(0) option:selected').val()) != "" && accnt =="" && $.trim($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) option:selected').val()) !="" && rateoftax =="" ){
	  $("#field_blank-alert").alert();
	  $("#field_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#field_blank-alert").hide();
	  });
	  allowsave = 0;
	  $('#m_acctable tbody tr:eq('+ curindex +') td:eq(0) select').focus().select();
	  return false;
      }
      
    var accn = $(".m_accname", this).val();  
    if (accn=="")
    {
      if(curindex == 0){
	  $("#nodatasaved-alert").alert();
	  $("#nodatasaved-alert").fadeTo(2250, 500).slideUp(500, function(){
	      $("#m_multiacc").modal("hide");
	      $(".modal-backdrop").hide();
	      $("#nodatasaved-alert").hide();
	  });
	  allowsave = 0;
	  return false;
      }
      // If account name in any row is blank then the allow variable is set to false, also the index of the same row is saved.
      allow = false;
      blankindex = $(this).closest('tr').index();

    }
    else {
      var obj = {};// Dictionary is created for every row.

      obj.accountname = $(".m_accname", this).val();
      obj.openbal = $(".m_openbal", this).val();
      obj.groupname = $("#m_gcode").val();
      obj.subgroupname = $("#m_sgcode").val();
      obj.newsubgroup = $("#m_nsgcode").val();
      obj.defaultflag = 0;
      output.push(obj);
    }
  });
    }else{
	$("#multiactable tbody tr").each(function() {
	    var mulindex = $(this).index();
	    var mulaccnt = $.trim($('#multiactable tbody tr:eq('+ mulindex +') td:eq(0) input').val());

	    //This is do not allow to create same account name.
	    if(seenac[mulaccnt]){
		$("#acname_duplicate-alert").alert();
		$("#acname_duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#acname_duplicate-alert").hide();
		});
		$('#multiactable tbody tr:last td:eq(1) input').focus().select();
		allowsave = 0;
		return false;
	    }else{
		seenac[mulaccnt] = true;
	    }
	    
	    if ($.trim($('#multiactable tbody tr:eq('+mulindex+') td:eq(1) input').val()) == 0 || $.trim($('#multiactable tbody tr:eq('+mulindex+') td:eq(1) input').val())=="")
	    {
		$('#multiactable tbody tr:eq('+mulindex+') td:eq(1) input:enabled').val("0.00");
	    }

	    if (mulaccnt=="")
	    {
		if(mulindex == 0){
		    $("#nodatasaved-alert").alert();
		    $("#nodatasaved-alert").fadeTo(2250, 500).slideUp(500, function(){
			$("#m_multiacc").modal("hide");
			$(".modal-backdrop").hide();
			$("#nodatasaved-alert").hide();
		    });
		    allowsave = 0;
		    return false;
		}

		// If account name in any row is blank then the allow variable is set to false, also the index of the same row is saved.
		allow = false;
		blankindex = $(this).closest('tr').index();
	    }else {
		var obj = {};// Dictionary is created for every row.

		obj.accountname = $(".m_accname", this).val();
		obj.openbal = $(".m_openbal", this).val();
		obj.groupname = $("#m_gcode").val();
		obj.subgroupname = $("#m_sgcode").val();
		obj.newsubgroup = $("#m_nsgcode").val();
		obj.defaultflag = 0;
		output.push(obj);
	    }
	});
    }
    
    //ajax function below takes list of dictionaries "output" as input and saves all accounts.
    if(allowsave == 1){
	$.ajax({
	url: '/multiacc',
	type: 'POST',
	datatype: 'json',
	data: {"accdetails": JSON.stringify(output)},
	beforeSend: function(xhr)
	{
	    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
	}
	})
        .done(function(resp) {
	    if(resp["gkstatus"]==0)
	    {
		$("#m_multiacc").modal('hide');
		$("#reset").click();
		$('.modal-backdrop').remove();
		$("#multisuccess-alert").alert();
		$("#multisuccess-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#multisuccess-alert").hide();
		});
		
	    }
	    else if(resp["gkstatus"]==1)
	    {
		$("#m_multiacc").modal('hide');
		$("#duplicate-alert").alert();
		$("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#duplicate-alert").hide();
		});
		$("#accname").focus().select();
	    }
	    else
	    {
		$("#m_multiacc").modal('hide');
		$("#failure-alert").alert();
		$("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
		    $("#failure-alert").hide();
		});
		$("#accname").focus().select();
	    }
	});
    }
    });

    $(document).off("keyup").on("keyup", function(event) {
	if (event.which == 45) {
	    event.preventDefault();
	    $("#acc_add").click();
	}
    });

});
