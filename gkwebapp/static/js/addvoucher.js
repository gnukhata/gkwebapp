/*
Copyright (C) 2014 2015 2016 Digital Freedom Foundation
  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.and old.stockflag = 's'

  GNUKhata is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public
  License along with GNUKhata (COPYING); if not, write to the
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributor:
"Navin Karkera" <navin@dff.org.in>
"Krishnakant Mane" <kk@dff.org.in>
"Ishan Masdekar " <imasdekar@dff.org.in>
*/

/*
Events are mostly associated with the classes.
Here is a list of classes that we have used.
1. dramt and cramt are for the dr and cr amount boxes respectively.
2. accs is for the accounts select boxes.
3. crdr for the cr dr select box, i.e for the first select box in the row
4. vdate for the date input boxes.
Events which have a selector which starts with a . are associated to a class, For eg. $(".crdr")
Events which have a selector which starts with a # are associated to an id, For eg. $("#vno")

Events are attached to dynamically created elements using document on method.
Document off is used to remove an already attached event to an element, so as to make sure that an event is fired only once.
*/
$(document).ready(function() {
  $("#vno").focus();
  $('.vdate').autotab('number');    //autotab is a library for automatically switching the focus to next input when max allowed characters are filled.
  $('.dramt').numeric({ negative: false });   //numeric is a library used for restricting the user to input only numbers and decimal inside a text box
  $('.cramt').numeric({ negative: false });
  var drsum = 0;    //drsum and crsum will have the total cr and dr amount
  var crsum = 0;
  var diff = 0;     //diff containns the difference of drsum and crsum

  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#vdate").val(fromdatearray[2])
  $("#vmonth").val(fromdatearray[1])
  $("#vyear").val(fromdatearray[0])

  //Calculates the total dr and cr amout when a change event is fired.
  $(document).off("change",".dramt").on("change", ".dramt", function() {
    drsum=0;
    // each function loops the widgets that have dramt class in it
    $(".dramt").each(function(){
      drsum += +$(this).val();
      // jquery enables us to select specific elements inside a table easily like below.
      $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2)); // tofixed function formats the number to have the specified number of digits after decimal, in this case 2
    });
  });

  $(document).off("change",".cramt").on("change", ".cramt", function() {
    crsum=0;
    $(".cramt").each(function(){
      crsum += +$(this).val();
      $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
    });
  });

  //Deletes a row from the table and recalculates the total cr and dr amount
  $(document).off("click",".del").on("click", ".del", function() {
    $(this).closest('tr').fadeOut(200, function(){
            $(this).closest('tr').remove();   //closest method gives the closest element specified
            drsum=0;
            crsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
            });
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
            });
            $('tbody tr:last input:enabled').focus();
        });
  });

  //Formats the number on focusout
  $(document).off("focusout",".dramt").on("focusout",".dramt",function(event)
  {
    if ($.trim($(this).val())=="" || $.trim($(this).val())==".") {
      $(this).val("0.00");
    }
    else{
      $(this).val((parseFloat($(this).val()).toFixed(2)));
    }
  });

  $(document).off("focusout",".cramt").on("focusout",".cramt",function(event)
  {
    if ($(this).val()=="" || $.trim($(this).val())==".") {
      $(this).val("0.00");
    }
    else{
      $(this).val((parseFloat($(this).val()).toFixed(2)));
    }
  });

  $('#vno').keyup(function(event) {
    if(event.which==13 && $('#vno').val()!=""){
      $('#vdate').select().focus();
    }
  });

  $('#vdate').keyup(function(event) {
    if(event.which==13 && $('#vdate').val()!=""){
      $('#vmonth').select().focus();
    }
  });

  $('#vmonth').keyup(function(event) {
    if(event.which==13 && $('#vmonth').val()!=""){
      $('#vyear').select().focus();
    }
  });

  $('#vyear').keyup(function(event) {
    if(event.which==13 && $('#vyear').val()!=""){
      $('#vtable tbody tr:first td:eq(1) select').focus();
    }
  });

  $('#project').keyup(function(event) {
    if(event.which==13){
      $('#narration').select().focus();
    }
  });

  $('#narration').keydown(function(event) {
    if(event.which==13){
      $('#save').click();
      event.preventDefault();
    }
  });
  //This event fires when the crdr select box option is changed
  $(document).off("change",".crdr").on("change",".crdr",function(event)
  {
    var curindex = $(this).closest('tr').index(); // gets the current index of the row
    $('#vtable tbody tr:eq('+curindex+') input:disabled').val("0.00"); // sets the text of the text box to 0.00 which is disabled in the current row.
    $('#vtable tbody tr:eq('+curindex+') input:enabled').val(""); // blanks out the text box which is enabled in the current row.
    $('#vtable tbody tr:eq('+curindex+') input').prop('disabled', function(i, v) { return !v; }); // toggles the property of the input boxes, i.e if the the box is enabled, it will be changed to disabled and vice versa.

    // the following lines will get the accounts depending on the type of the voucher and the current value of the crdr select box.
    if($(this).val()=="Cr"){
      $.ajax({
        url: '/getcjaccounts',
        type: 'POST',
        dataType: 'json',
        data: {"type": $('#vtype').val(),"side":"Cr"},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(jsonObj) {
          var accs = jsonObj["accounts"];
          $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty(); // emptying the accounts select box.
          for (i in accs ) {
            $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>'); // add the accounts to the select box
          }
        }
      });
    }
    if($(this).val()=="Dr"){
      $.ajax({
        url: '/getcjaccounts',
        type: 'POST',
        dataType: 'json',
        data: {"type": $('#vtype').val(),"side":"Dr"},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(jsonObj) {
          var accs = jsonObj["accounts"];
          $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty();
          for (i in accs ) {
            $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
          }
        }
      });
    }
    // When the crdr select box value is changed, the amount of that row also changes so its necessary to recalculate the total cr dr amounts
    drsum=0;
    $(".dramt").each(function(){
      drsum += +$(this).val();
      $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
    });
    crsum=0;
    $(".cramt").each(function(){
      crsum += +$(this).val();
      $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
    });
  });

  $(document).off("keyup",".accs").on("keyup",".accs",function(event){
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      $('#vtable tbody tr:eq('+curindex+') input:enabled').select().focus(); // focus shifts to the enabled amount box when one hits enter on the accounts select box.
    }
  });


  /*
  The following events are the backbone of the voucher functionality.
  When one hits enter on an dr or cr amount text box,
  the following code checks whether this row is the last row or not.
  If it is not the last row, it will check next row's amount box.
  If the amount box in the next row is empty or 0 then the diff will be inserted into the text box.
  If the amount box already has a value then only the focus is shifted to it.
  If it is the last row then a new row is added depending on the diff, if dr greater than cr than a cr row is added and vice versa.
  If the total cr dr amounts tally then the focus is shifted to project select box.
  */
  $(document).off("keyup",".dramt").on("keyup",".dramt",function(event)
  {
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      if($('#vtable tbody tr:eq('+curindex+') td:eq(2) input:enabled').val()=="" || $('#vtable tbody tr:eq('+curindex+') td:eq(2) input:enabled').val()==0){
        return false;
      }
      var lastindex = $('#vtable tbody tr:last').index();
      if(drsum > crsum)
      {
        diff=drsum-crsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()==0 || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
            crsum=0;
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') input:enabled').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            $("#project").focus();
            return false;
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Cr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr" selected>Cr</option>'+
              '<option value="Dr">Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="0.00">'+
              '</td class="col-xs-1">'+
              '<td><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
              crsum=0; // cr total is recalculated since a cr row is added.
              $(".cramt").each(function(){
                crsum += +$(this).val();
                $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
              });
            }
          });

        }

      }
      else if(drsum < crsum)
      {
        diff=crsum-drsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()==0 || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val(parseFloat(diff).toFixed(2));
            drsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') input:enabled').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            $("#project").focus();
            return false;
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Dr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr">Cr</option>'+
              '<option value="Dr" selected>Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(2) input:enabled').val(parseFloat(diff).toFixed(2));
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
              });
            }
          });

        }

      }
      else {
        $("#project").focus();
      }
      curindex=null;
      lastindex=null;
    }
  });

  $(document).off("keyup",".cramt").on("keyup",".cramt",function(event)
  {
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      if($('#vtable tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()=="" || $('#vtable tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()==0){
        return false;
      }
      var lastindex = $('#vtable tbody tr:last').index();
      if(drsum > crsum)
      {
        diff=drsum-crsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()==0){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
            crsum=0;
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') input:enabled').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            $("#project").focus();
            return false;
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Cr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr" selected>Cr</option>'+
              '<option value="Dr">Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
              crsum=0;
              $(".cramt").each(function(){
                crsum += +$(this).val();
                $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
              });
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
              });
            }
          });

        }

      }
      else if(drsum < crsum)
      {
        diff=crsum-drsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()==0 || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val(diff.toFixed(2));
            drsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') input:enabled').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            $("#project").focus();
            return false;
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Dr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr">Cr</option>'+
              '<option value="Dr" selected>Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(2) input:enabled').val(parseFloat(diff).toFixed(2));
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
              });
            }
          });
        }

      }
      else {
        $("#project").focus();
      }
    }
  });
  /*
  In this voucher form we are not using the form submit functionality since there is no need.
  When one clicks on the save button the validations are done and the voucher is saved.
  */
  $('#save').click(function(event) {
    var allow = true;
    // Check if voucher no. is blank and if it is then show an alert
    if ($('#vno').val()=="") {
      $("#vno-alert").alert();
      $("#vno-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vno-alert").hide();
      });
      $('#vno').focus();
      return false;
    }
    // Check if date fields are blank and if it is then show an alert
    if ($('#vdate').val()=="" || $('#vmonth').val()=="" || $('#vyear').val()=="") {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#vdate').focus();
      return false;
    }
    // Check if the total cr dr amounts tally, if it doesn't then show an alert.
    if ($('#drtotal').val()!=$('#crtotal').val()) {
      $("#balance-alert").alert();
      $("#balance-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#balance-alert").hide();
      });
      $('#vtable tbody tr:last input:enabled').focus()
      return false;
    }
    // Check if voucher amount is zero and if it is then show an alert.
    if ($('#drtotal').val()==0) {
      $("#zero-alert").alert();
      $("#zero-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#zero-alert").hide();
      });
      $("#vtable tbody tr:first input:enabled").focus();
      return false;
    }
    // Check whether an account is repeated, and if it does then set the allow flag to false.
    $("#vtable tbody tr").each(function() {
      var accountcode = $(".accs", this).val();
      var ccount=0;
      $("#vtable tbody tr").each(function() {
        if(accountcode==$(".accs", this).val()){
          ccount =ccount +1;
        }
      });
      if (ccount>1) {
        allow= false;
        return false;
      }
    });

    if(!allow){
      $("#accs-alert").alert();
      $("#accs-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#accs-alert").hide();
      });
      $("#vtable tbody tr:first td:eq(1) select").focus();
      return false;
    }

    var output = [];  // This is an array which will contain dictionaries representing rows of the table.
    $("#vtable tbody tr").each(function() { //loop for the rows of the table body
      if ($(".cramt", this).val()==0 && $(".dramt", this).val()=="" || $(".cramt", this).val()=="" && $(".dramt", this).val()==0 ) { //checking whether a row has no amount.
        allow= false;
        return false;
      }
      var obj = {};
      obj.side=$('.crdr',this).val();
      obj.accountcode = $(".accs", this).val();
      obj.cramount = $(".cramt", this).val();
      obj.dramount = $(".dramt", this).val();
      output.push(obj);
    });
    if(!allow){
      output.length = 0;
      $("#vtable tbody tr:first input:enabled").focus();
      $("#zerorow-alert").alert();
      $("#zerorow-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#zerorow-alert").hide();
      });
      return false;
    }
    var details = {} // dictionay containing details other than the table values.
    details.vno=$('#vno').val();
    details.vdate=$('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
    details.projectcode=$('#project').val();
    details.narration=$('#narration').val();
    details.vtype=$('#vtype').val();
    $.ajax({
      type: "POST",
      url: "/addvoucher",
      global: false,
      async: false,
      datatype: "json",
      data: {"vdetails":JSON.stringify(details),"transactions":JSON.stringify(output)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp)
      {
        if(resp.gkstatus){ // if the voucher is saved show an alert and then reset the voucher form and clear all variables.
          $('#voucher')[0].reset();
          drsum = 0;
          crsum = 0;
          diff = 0;
          $("#vtable tbody").find("tr:gt(1)").remove();
          var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
          $("#vdate").val(fromdatearray[2])
          $("#vmonth").val(fromdatearray[1])
          $("#vyear").val(fromdatearray[0])
          $("#success-alert").alert();
          $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#success-alert").hide();
          });
        }
        else {
          $("#failure-alert").alert();
          $("#failure-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#failure-alert").hide();
          });
        }
        $('#vno').focus();
      }
    });
  });
  // to close alerts
  $('.close').click(function() {

    $(this).parent().hide();

  })

  /*
  following function opens up a popup to add accounts
  This popup is created using bootstrap modals.
  */
  $('#popup').click(function (e) {
    $.ajax(
      {
        type: "POST",
        url: "/accountpopup",
        global: false,
        async: false,
        datatype: "text/html",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          $("#viewacc").html(resp);
          $('#m_accmodal').modal('show');
          $('#m_accmodal').on('shown.bs.modal', function (e) // shown.bs.modal is an event which fires when the modal is opened
          {
            $('#m_groupname').focus();
          });
          $('#m_accmodal').on('hidden.bs.modal', function (e) // hidden.bs.modal is an event which fires when the model is closed
          {
            /*
            following lines will refresh only the accounts select boxes.
            so if a new account is added, it will be available in the select box for the users.
            */
            $('#viewacc').html(""); // clears the modal
            $(".accs").each(function(){
              var curindex = $(this).closest('tr').index();
              var tmp = $("#vtable tbody tr:eq("+curindex+") td:eq(1) select").val();
              if($("#vtable tbody tr:eq("+curindex+") td:eq(0) select").val()==="Cr"){
                $.ajax({
                  url: '/getcjaccounts',
                  type: 'POST',
                  dataType: 'json',
                  data: {"type": $('#vtype').val(),"side":"Cr"},
                  beforeSend: function(xhr)
                  {
                    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
                  },
                  success: function(jsonObj) {
                    var accs = jsonObj["accounts"];
                    $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty();
                    for (i in accs ) {
                      if(accs[i].accountcode==tmp){
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '" selected>' +accs[i].accountname+ '</option>');
                      }
                      else {
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
                      }
                    }
                  }
                });
              }
              if($("#vtable tbody tr:eq("+curindex+") td:eq(0) select").val()==="Dr"){
                $.ajax({
                  url: '/getcjaccounts',
                  type: 'POST',
                  dataType: 'json',
                  data: {"type": $('#vtype').val(),"side":"Dr"},
                  beforeSend: function(xhr)
                  {
                    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
                  },
                  success: function(jsonObj) {
                    var accs = jsonObj["accounts"];
                    $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty();
                    for (i in accs ) {
                      if(accs[i].accountcode==tmp){
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '" selected>' +accs[i].accountname+ '</option>');
                      }
                      else {
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
                      }
                    }
                  }
                });
              }

            });
          });
        }
      }
    );
  });

  $('#reset').click(function(event) {
    $('#voucher')[0].reset();
    drsum = 0;
    crsum = 0;
    diff = 0;
    $("#vtable tbody").find("tr:gt(1)").remove();
    var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
    $("#vdate").val(fromdatearray[2])
    $("#vmonth").val(fromdatearray[1])
    $("#vyear").val(fromdatearray[0])
    $('#vno').focus();
  });
});
