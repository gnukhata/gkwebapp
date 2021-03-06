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
*/
// This script is for multiple account popup.
$(document).ready(function() {
    if($("#m_sgname").val() == 'Bank'){
	$("#bnkac").show();
	$("#chsac").hide();
    }else if($("#m_sgname").val() == 'Cash'){
	$("#bnkac").hide();
	$("#chsac").show();
    }else if($("#m_sgname").val() == 'Purchase'){
	$("#saleac").hide();
	$("#purac").show();
    }else if($("#m_sgname").val() == 'Sales'){
	$("#purac").hide();
	$("#saleac").show();
    }

    //Help message for sub-group 'Bank' or 'Cash'.
    if($("#m_sgname").val() == 'Bank' || $("#m_sgname").val() == 'Cash'){
	$("#helpmsg").show();
    }else{
	$("#helpmsg").hide();
    }
    if($("#m_sgname").val() == 'Purchase' || $("#m_sgname").val() == 'Sales'){
	$("#helpsp").show();
    }else{
	$("#helpsp").hide();
    }
  $(".m_openbal").numeric();// opening balance column will only accept numbers, decimal and minus sign.

  $(document).off("keydown",".m_accname").on("keydown",".m_accname",function(event)
  {
  // This is the keydown event for account name column fields.
    $(".m_openbal").numeric();
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    var m_grpnm = $.trim($("#m_gname").val());// get value of groupname selected.
    var s_grpnm = $.trim($("#m_sgname").val());  

    if (event.which==40)
    {
      if(m_grpnm=="Direct Expense" || m_grpnm=="Direct Income" || m_grpnm=="Indirect Expense" || m_grpnm=="Indirect Income")
      {
        // If groupname is Direct or Indirect income OR direct or Indirect Expense there will be no opening balance field so focus will be shifted to next account name.
        $('#m_acctable tbody tr:eq('+nextindex+') td:eq(0) input').focus();
        $('#m_acctable tbody tr:eq('+nextindex+') td:eq(0) input').select();

      }
      else
      {
	  // else it will be shifted to the corresponding opening balance field.
	  if(s_grpnm == 'Bank' || s_grpnm == 'Cash'){
	      $('#m_acctable tbody tr:eq('+curindex+') td:eq(2) input').focus();
              $('#m_acctable tbody tr:eq('+curindex+') td:eq(2) input').select();
	  }else{
              $('#m_acctable tbody tr:eq('+curindex+') td:eq(1) input').focus();
              $('#m_acctable tbody tr:eq('+curindex+') td:eq(1) input').select();
	  }
      }
    }
    if (event.which==38)
    {
      if(m_grpnm=="Direct Expense" || m_grpnm=="Direct Income" || m_grpnm=="Indirect Expense" || m_grpnm=="Indirect Income")
      {
        // If groupname is Direct or Indirect income OR direct or Indirect Expense there will be no opening balance field so focus will be shifted to previous account name.
        $('#m_acctable tbody tr:eq('+previndex+') td:eq(0) input').focus();
        $('#m_acctable tbody tr:eq('+previndex+') td:eq(0) input').select();

      }
      else
      {
        // else it will be shifted to the previous opening balance field.
	  if(s_grpnm == 'Bank' || s_grpnm == 'Cash'){
	      $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) input').focus();
              $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) input').select();
	  }else{  
              $('#m_acctable tbody tr:eq('+previndex+') td:eq(1) input').focus();
              $('#m_acctable tbody tr:eq('+previndex+') td:eq(1) input').select();
	  }
      }
    }
    if (event.which==13)
      {
	event.preventDefault();
	if ($(".m_accname").val()=="") {
	  $("#m_blank-alert").alert();
          $("#m_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#m_blank-alert").hide();
          });
	  return false;
	}
	if(m_grpnm=="Select Group" || m_grpnm=="Direct Expense" || m_grpnm=="Direct Income" || m_grpnm=="Indirect Expense" || m_grpnm=="Indirect Income")
	  {
        //If groupname is Direct or Indirect income OR direct or Indirect Expense there will be no opening balance field
        if ($(this).closest('tr').is(":first-child")) {
          if ($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) input').val() == "") {
	    $("#nodatasaved-alert").alert();
            $("#nodatasaved-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#m_multiacc").modal("hide");
              $(".modal-backdrop").hide();
              $("#nodatasaved-alert").hide();
            });
            return false;
          }
        }
        if ($(this).closest('tr').is(":last-child"))
        {
          // If its the last row then a new row is added by calling the function addRow.
          addRow(curindex);
        }
        else
        {
        // If groupname is Direct or Indirect income OR direct or Indirect Expense there will be no opening balance field so focus will be shifted to next account name.
          $('#m_acctable tbody tr:eq('+nextindex+') td:eq(0) input:enabled').focus();
          $('#m_acctable tbody tr:eq('+nextindex+') td:eq(0) input:enabled').select();
        }
      }
      else
      {
          // else focus will be shifted to corresponding opening balance field.
	  if(s_grpnm == 'Bank' || s_grpnm == 'Cash'){
	      $('#m_acctable tbody tr:eq('+curindex+') td:eq(2) input:enabled').focus().select();
	  }else{
	      $('#m_acctable tbody tr:eq('+curindex+') td:eq(1) input:enabled').focus().select();
	  }
      }

    }
  });

    $(document).off("keydown",".default").on("keydown",".default",function(event){
	var curindex1 = $(this).closest('tr').index();
	var nextindex1 = curindex1+1;
	var previndex1 = curindex1-1;

	if(event.which == 13){
	    $('#m_acctable tbody tr:eq('+curindex1+') td:eq(1) input:enabled').focus();
	}
	if(event.which == 38){
	    if($("#m_sgname").val() == 'Bank' || $("#m_sgname").val() == 'Cash'){
		$('#m_acctable tbody tr:eq('+previndex1+') td:eq(2) input:enabled').focus();
	    }else if($("#m_sgname").val() == 'Purchase' || $("#m_sgname").val() == 'Sales'){
		$('#m_acctable tbody tr:eq('+previndex1+') td:eq(1) input:enabled').focus();
	    }
	}
    });

    //In account table at time single account can select to set default for 'Bank' or 'Cash' Transaction. 
    $(document).off("change",".default").on("change",".default",function(event){
	if($('.default').is(':checked')){
	    $('.default').not(this).prop('checked', false);
	}
    });

  function addRow(curindex)
  {
// This function will validate the current row and then add a new row.
    var m_grpnm = $.trim($("#m_gname").val());
    var sub_grpnm = $.trim($("#m_sgname").val());  
    if(sub_grpnm == 'Bank' || sub_grpnm == 'Cash' || sub_grpnm == 'Purchase' || sub_grpnm == 'Sales'){
	var accname = $('#m_acctable tbody tr:eq('+curindex+') td:eq(1) input').val();
    }else{
	accname = $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) input').val();
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
    .done(function(jsonobj)
    {
      if (jsonobj["gkstatus"]==1)
      {
        $("#m_duplicate-alert").alert();
        $("#m_duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#m_duplicate-alert").hide();
        });
        $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) input').focus();
        $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) input').select();
      }
      if (jsonobj["gkstatus"]==0)
      {
        var m_grpnm = $.trim($("#m_gname").val());
	var m_sgname = $.trim($("#m_sgname").val());
  
        if(m_grpnm=="Direct Expense" || m_grpnm=="Direct Income" || m_grpnm=="Indirect Expense" || m_grpnm=="Indirect Income")
        {
	  // will add row with only account name field as the groups mentioned above do not have opening balance.
	  if(m_sgname == 'Purchase'){
	      $("#m_acctable").append('<tr>'+
	      '<td class="col-xs-1 defbx"><input type="checkbox" class="default" id="purac"></td>'+			    		     
              '<td class="col-xs-9"><input type="text" id="m_alt_accname" class="form-control input-sm m_accname" placeholder="Account Name"></td>'+
              '<td class="col-xs-2">'+
              '<a href="#" class="m_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
              '</td>'+
              '</tr>'
              );
	  }else if(m_sgname == 'Sales'){
	      $("#m_acctable").append('<tr>'+
	      '<td class="col-xs-1 defbx"><input type="checkbox" class="default" id="saleac"></td>'+			    		     
              '<td class="col-xs-9"><input type="text" id="m_alt_accname" class="form-control input-sm m_accname" placeholder="Account Name"></td>'+
              '<td class="col-xs-2">'+
              '<a href="#" class="m_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
              '</td>'+
              '</tr>'
              );
	  }else{ 
	      $("#m_acctable").append('<tr>'+
              '<td class="col-xs-10"><input type="text" id="m_alt_accname" class="form-control input-sm m_accname" placeholder="Account Name"></td>'+
              '<td class="col-xs-2">'+
              '<a href="#" class="m_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
              '</td>'+
              '</tr>'
         );
	  }
	}
      else
      {
	// will add row with both account name and opening balance.
	if(m_sgname == 'Bank'){
	    $("#m_acctable").append('<tr>'+
	    '<td class="col-xs-1 defbx"><input type="checkbox" class="default" id="bnkac"></td>'+			    
            '<td class="col-xs-6"><input type="text" id="m_alt_accname" class="form-control input-sm m_accname" placeholder="Account Name"></td>'+
            '<td class="col-xs-3">'+
            '<input type="text" class=" form-control input-sm m_openbal rightJustified" placeholder="0.00">'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<a href="#" class="m_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
            '</td>'+
	    '</tr>');
	}else if(m_sgname == 'Cash'){
	    $("#m_acctable").append('<tr>'+
	    '<td class="col-xs-1 defbx"><input type="checkbox" class="default" id="chsac"></td>'+			    
            '<td class="col-xs-6"><input type="text" id="m_alt_accname" class="form-control input-sm m_accname" placeholder="Account Name"></td>'+
            '<td class="col-xs-3">'+
            '<input type="text" class=" form-control input-sm m_openbal rightJustified" placeholder="0.00">'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<a href="#" class="m_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
            '</td>'+
	    '</tr>');
	}else{  
            $("#m_acctable").append('<tr>'+
	    '<td class="col-xs-7"><input type="text" id="m_alt_accname" class="form-control input-sm m_accname" placeholder="Account Name"></td>'+
            '<td class="col-xs-3">'+
            '<input type="text" class=" form-control input-sm m_openbal rightJustified" placeholder="0.00">'+
            '</td>'+
            '<td class="col-xs-2">'+
            '<a href="#" class="m_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
	    '</td>'+
	    '</tr>');
	}
      }

    $('#m_acctable tbody tr:last td:eq(0) input').focus().select();// finally focus is set to the account name of the last row.
  }
});

  }
    
$(document).off("keydown",".m_openbal").on("keydown",".m_openbal", function(event)
{
// Keydown event for opening balance field.
  $(".m_openbal").numeric();
  var curindex = $(this).closest('tr').index();
  var nextindex = curindex+1;
  var previndex = curindex-1;
  var numberofrows = $(".m_openbal").length;  
  if (event.which==40)
  {

    $('#m_acctable tbody tr:eq('+nextindex+') td:eq(0) input:enabled').focus();
    $('#m_acctable tbody tr:eq('+nextindex+') td:eq(0) input:enabled').select();

  }
  if (event.which==38)
  {


    $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) input:enabled').focus();
    $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) input:enabled').select();

  }
  if(event.which == 13)
  {
    // Validates whether the account name of corresponfing row is blank or not.
      var m_sgrpname = $.trim($("#m_sgname").val());
      if(m_sgrpname == 'Bank' || m_sgrpname == 'Cash'){  
	  var accnt = $('#m_acctable tbody tr:eq('+curindex+') td:eq(1) input').val();
      }else{
	  accnt = $('#m_acctable tbody tr:eq('+curindex+') td:eq(0) input').val();
      }
    if(accnt=="")
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
    }


    if ($('#m_acctable tbody tr:eq('+curindex+') td:eq(1) input:enabled').val()==0 || $('#m_acctable tbody tr:eq('+curindex+') td:eq(1) input:enabled').val()=="")
    {
      // Default value 0.00 is set if the field is left blank or its value is 0.
      $('#m_acctable tbody tr:eq('+curindex+') td:eq(1) input:enabled').val("0.00");
    }

    if ($(this).closest('tr').is(":last-child"))
    {
    // If the current row is the last row then addrow function is called.
      addRow(curindex);
    }
    else
    {
    // Else focus is set to the account name of the next row.
      $('#m_acctable tbody tr:eq('+nextindex+') td:eq(0) input:enabled').focus();
      $('#m_acctable tbody tr:eq('+nextindex+') td:eq(0) input:enabled').select();
    }

  }

});

$(document).off("click",".m_del").on("click", ".m_del", function() {
// This function will delete the current row.
  $(this).closest('tr').fadeOut(200, function(){
    $(this).closest('tr').remove();	 //closest method gives the closest element specified
    $('#m_acctable tbody tr:last td:eq(0) input').focus().select();
  });
  $('#m_acctable tbody tr:last td:eq(0) input').select();
});
var allow = true;
var blankindex = 0;
$(document).off("click",".#acc_add").on("click", "#acc_add", function() {

// Function to save all accounts in the table.
  var output = [];	// This is an array which will contain dictionaries representing rows of the table.
  var m_grpnm = $.trim($("#m_gname").val());
  var sub_grpnm = $.trim($("#m_sgname").val());
  $("#m_acctable tbody tr").each(function() { //loop for the rows of the table body
    var accn = $(".m_accname", this).val();
    if (accn=="")
    {
      // If account name in any row is blank then the allow variable is set to false, also the index of the same row is saved.
      allow = false;
      blankindex = $(this).closest('tr').index();

    }
    else {
      var obj = {};// Dictionary is created for every row.

      obj.accountname = $(".m_accname", this).val();
      if(m_grpnm=="Direct Expense" || m_grpnm=="Direct Income" || m_grpnm=="Indirect Expense" || m_grpnm=="Indirect Income" || $(".m_openbal", this).val()=="")
      {
        // Opening balance is set to 0.00 is its zero or group name is one from the above mentioned groups.
        obj.openbal = "0.00";
      }
      else {
        obj.openbal = $(".m_openbal", this).val();
      }

	//Saving defaultflag for particular account.
	if(sub_grpnm == "Bank"){
	    if ($(".default",this).is(":checked")) {
		var defaultflag = 2;
	    }else{
		defaultflag = 0;
	    }
	}else if(sub_grpnm == "Cash"){
	    if ($(".default",this).is(":checked")) {
		defaultflag = 3;
	    }else{
		defaultflag = 0;
	    }
	}else if(sub_grpnm == "Purchase"){
	    if ($(".default",this).is(":checked")) {
		defaultflag = 16;
	    }else{
		defaultflag = 0;
	    }
	}else if(sub_grpnm == "Sales"){
	    if ($(".default",this).is(":checked")) {
		defaultflag = 19;
	    }else{
		defaultflag = 0;
	    }
	}else{
	    defaultflag = 0;
	}
	
      obj.groupname = $("#m_gcode").val();
      obj.subgroupname = $("#m_sgcode").val();
      obj.newsubgroup = $("#m_nsgcode").val();
      obj.defaultflag = defaultflag;	
      output.push(obj);
    }
  });

// ajax function below takes list of dictionaries "output" as input and saves all accounts.
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

});


});
