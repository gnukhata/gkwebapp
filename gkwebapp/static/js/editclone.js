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

$(document).ready(function()
{
    function getBalance( accountcode, calculateTo ){
        var bal = '';
        $.ajax({
          url: '/showvoucher?type=getclosingbal',
          type: 'POST',
          dataType: 'json',
          async : false,
          data: {"accountcode": accountcode, "calculateto" : calculateTo, "financialstart" : sessionStorage.yyyymmddyear1},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
          }
        })
        .done(function(resp) {
          if (resp["gkstatus"]==0) {
            bal= resp["gkresult"];
          }
          else {
            bal= '';
          }
        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });
        return bal;
      }

      if($('#demovctable tbody tr:first td:eq(1) select option:selected').val()){
        var curacccode = $('#demovctable tbody tr:first td:eq(1) select option:selected').val();
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
        $('#demovctable tbody tr:first td:eq(2) input').val(getBalance(curacccode, caldata));
      }
      if($('#demovctable tbody tr:eq(1) td:eq(1) select option:selected').val()){
        var curacccode = $('#demovctable tbody tr:eq(1) td:eq(1) select option:selected').val();
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
        $('#demovctable tbody tr:eq(1) td:eq(2) input').val(getBalance(curacccode, caldata));
      }
      $('#demovctable tbody tr:first td:eq(1) select').change(function(event) {
        var curacccode = $('#demovctable tbody tr:first td:eq(1) select option:selected').val();
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
        $('#demovctable tbody tr:first td:eq(2) input').val(getBalance(curacccode, caldata));
      });
      $('#demovctable tbody tr:eq(1) td:eq(1) select').change(function(event) {
        var curacccode = $('#demovctable tbody tr:eq(1) td:eq(1) select option:selected').val();
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
        $('#demovctable tbody tr:eq(1) td:eq(2) input').val(getBalance(curacccode, caldata));
      });

  //rohini
  if (($('#m_vtype').val()=="sales" || $('#m_vtype').val()=="purchase") && sessionStorage.invflag==1)
  {
    $(".invhide").show();
    var inv = $("#invsel option:selected").attr("total");
    if ($.trim(inv)!="")
    {
      $("#invtotal").val(parseFloat(inv).toFixed(2));
    }
    else
    {
      $("#invtotal").val(parseFloat(0).toFixed(2));
    }

  }
  else
  {
      $(".invhide").hide();
  }
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  $("#vctable").hide();
  $("#save").hide();
  $("#clonereplaceattach").hide();
  $("#replaceattach").hide();
  $("#vouchercancel").hide();
  if ($("#urole").val()=="1")
  {
    $("#lock").hide();

    if ($("#lock").val()=="Unlock")
    {
      $("#edit").attr("disabled", "disabled");
    }

  }
  var percentwid = 100*(($("#vctable").width()-1)/$("#vctable").width());
  $('#vctable thead').width(percentwid+"%");

  if (sessionStorage.booksclosedflag==1) {
    $("#lock").remove();
    $("#edit").remove();
    $("#clone").remove();
    $("#delete").remove();
  }
  if (sessionStorage.orgt=="Profit Making") {
    $("label[for='project']").text("Cost Center:");
  }
  $(document).off("change","#invsel").on('change', '#invsel', function(event) {
    event.preventDefault();
    /* Act on the event */
    var inv = $("#invsel option:selected").attr("total");
    if ($.trim(inv)!="")
    {
      $("#invtotal").val(parseFloat(inv).toFixed(2));
    }
    else
    {
      $("#invtotal").val(parseFloat(0).toFixed(2));
    }
  });


  var demodrsum = 0;
  var democrsum = 0;
  var drsum = 0;
  var crsum = 0;
  $(".demodramt").each(function()
  {
    demodrsum += +$(this).val();
    $('#demovctable tfoot tr:last td:eq(1) input').val(parseFloat(demodrsum).toFixed(2));
  });

  $(".democramt").each(function(){
    democrsum += +$(this).val();
    $('#demovctable tfoot tr:last td:eq(2) input').val(parseFloat(democrsum).toFixed(2));
  });


  $(".dramt").each(function()
  {
    drsum += +$(this).val();
    $('#vctable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
  });

  $(".cramt").each(function(){
    crsum += +$(this).val();
    $('#vctable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
  });



  $("#demovctable").find("input,select,textarea,button").prop("disabled",true);
  $("#vno").prop('disabled', true);
  $("#invsel").prop('disabled', true);
  $(".vdate").prop('disabled', true);
  $("#narr").prop('disabled', true);
  $("#project").prop('disabled', true);
  $("#lock").click(function(event)
  {

    var id = $("#vcode").val();

    if($("#lock").val()=="Unlock")
    {

      var  vstatus = "False";

    }
    else
    {

      var  vstatus = "True";
    }

    $.ajax({
      type: "POST",
      url: "/lockvoucher",
      data: {"id":id,"vstatus":vstatus},
      global: false,
      async: false,
      dataType: "json",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(jsonObj)
      {
        gkstatus=jsonObj["gkstatus"]
        if(gkstatus)
        {
          if ($("#lock").val()=="Unlock")
          {
            $("#lock").html("Loc<u>k</u>");
            $("#lock").val("Lock");
          }
          else
          {
            $("#lock").html("Unloc<u>k</u>");
            $("#lock").val("Unlock");
          }
        }
      }
    });

  });
  var ecflag;
  var navflag;

  $("#lock").keydown(function(event)
  {

    if (event.which==37)
    {

      $("#viewattach").focus();
    }
    if (event.which==39)
    {
      $("#edit").focus();
    }
    /* Act on the event */
  });


  $("#edit").keydown(function(event)
  {
    if (event.which==13)
    {
      navflag=true;

    }
    if (event.which==37)
    {
      $("#lock").focus();
    }
    if (event.which==39)
    {
      $("#clone").focus();
    }
    /* Act on the event */
  });

  $("#clone").keydown(function(event)
  {
    if (event.which==13)
    {
      navflag=true;

    }
    if (event.which==37)
    {
      $("#edit").focus();
    }
    if (event.which==39)
    {
      $("#delete").focus();
    }
  });

  $("#delete").keydown(function(event)
  {

    if (event.which==37)
    {
      $("#clone").focus();
    }
    if (event.which==39)
    {
      $("#viewattach").focus();
    }
  });
  $("#viewattach").keydown(function(event)
  {
    if (event.which==37)
    {
      $("#delete").focus();
    }
    if (event.which==39)
    {
      $("#lock").focus();
    }
  });
  $("#removeattach").change(function(event)
  {
    if ($("#removeattach").is(":checked")) {
      $("#replaceattach").hide();
      $("#viewattach").hide();
    }
    else {
      $("#replaceattach").show();
      $("#viewattach").show();
    }
  });

  $("#edit").click(function(event)
  {

    ecflag="edit";
    $(".lblec").prepend('<i>Edit </i>');
    if ($("#replaceattach").length) {
      $("#replaceattach").show();
      $("#clonereplaceattach").remove();
    }
    $("#vouchercancel").show();
    $("#save").show();
    $("#removediv").show();
    $("#lock").hide();
    $("#edit").hide();
    $("#clone").hide();
    $("#delete").hide();
    $("#vno").prop('disabled', true);
    $(".ttl").prop('disabled', true);
    $(".vdate").prop('disabled', false);
    $("#invsel").prop('disabled', false);
    $("#vdate").focus().select();
    $("#vctable").show();
    $("#demovctable").hide();
    $("#narr").prop('disabled', false);
    $("#project").prop('disabled', false);


  if($('#vctable tbody tr:first td:eq(1) select option:selected').val()){
    var curacccode = $('#vctable tbody tr:first td:eq(1) select option:selected').val();
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    $('#vctable tbody tr:first td:eq(2) input').val(getBalance(curacccode, caldata));
  }
  if($('#vctable tbody tr:eq(1) td:eq(1) select option:selected').val()){
    var curacccode = $('#vctable tbody tr:eq(1) td:eq(1) select option:selected').val();
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    $('#vctable tbody tr:eq(1) td:eq(2) input').val(getBalance(curacccode, caldata));
  }
  $('#vctable tbody tr:first td:eq(1) select').change(function(event) {
    var curacccode = $('#vctable tbody tr:first td:eq(1) select option:selected').val();
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    $('#vctable tbody tr:first td:eq(2) input').val(getBalance(curacccode, caldata));
  });
  $('#vctable tbody tr:eq(1) td:eq(1) select').change(function(event) {
    var curacccode = $('#vctable tbody tr:eq(1) td:eq(1) select option:selected').val();
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
    $('#vctable tbody tr:eq(1) td:eq(2) input').val(getBalance(curacccode, caldata));
  });

  });


  $("#clone").click(function(event)
  {
    if ($("#replaceattach").length) {
      $("#replaceattach").show();
    }
    else {
      $("#clonereplaceattach").show();
    }
    ecflag="clone";
    $("#vouchercancel").show();
    $(".lblec").prepend('<i>Cloning </i>');
    $("#lock").hide();
    $("#clone").hide();
    $("#edit").hide();
    $("#delete").hide();
    $(".ttl").prop('disabled', true);
    $("#save").show();
    $("#vno").prop('disabled', false);
    $("#invsel").prop('disabled', false);
    $("#vno").focus().select();
    $("#vctable").show();
    $("#demovctable").hide();
    $(".vdate").prop('disabled', false);
    $("#narr").prop('disabled', false);
    $("#project").prop('disabled', false);
    $("#viewattach").hide();


      if($('#vctable tbody tr:first td:eq(1) select option:selected').val()){
        var curacccode = $('#vctable tbody tr:first td:eq(1) select option:selected').val();
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
        $('#vctable tbody tr:first td:eq(2) input').val(getBalance(curacccode, caldata));
      }
      if($('#vctable tbody tr:eq(1) td:eq(1) select option:selected').val()){
        var curacccode = $('#vctable tbody tr:eq(1) td:eq(1) select option:selected').val();
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
        $('#vctable tbody tr:eq(1) td:eq(2) input').val(getBalance(curacccode, caldata));
      }
      $('#vctable tbody tr:first td:eq(1) select').change(function(event) {
        var curacccode = $('#vctable tbody tr:first td:eq(1) select option:selected').val();
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
        $('#vctable tbody tr:first td:eq(2) input').val(getBalance(curacccode, caldata));
      });
      $('#vctable tbody tr:eq(1) td:eq(1) select').change(function(event) {
        var curacccode = $('#vctable tbody tr:eq(1) td:eq(1) select option:selected').val();
        var d = new Date();
        var month = d.getMonth()+1;
        var day = d.getDate();
        var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
        $('#vctable tbody tr:eq(1) td:eq(2) input').val(getBalance(curacccode, caldata));
      });



  });
  $("#vouchercancel").click(function(event)
  {
    $("#myModal").modal('hide');
    $('.modal-backdrop').remove();
    $("tbody tr:eq("+$("#modalindex").val()+")").dblclick();
  });

  $("#viewattach").click(function(event)
  {
    var vcode = $("#vcode").val();
    $.ajax({
      url: '/getattachment',
      type: 'POST',
      datatype: 'json',
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      data: {"vouchercode": vcode,"vtype":$(".lblec").text(),"vno":$("#vno").val()},
    })
    .done(function(resp) {
      var x=window.open();
      if (x) {
        //Browser has allowed it to be opened
        x.focus();
        x.document.open();
        x.document.write(resp);
        x.document.close();
      } else {
        //Browser has blocked it
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



  $('.vdate').autotab('number');

  function pad (str, max) { //to add leading zeros in date
    str = str.toString();
    if (str.length==1) {
      return str.length < max ? pad("0" + str, max) : str;
    }
    else{
      return str
    }
  }
  function yearpad (str, max) {
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

  var diff = 0;

  $(document).off("change",".dramt").on("change", ".dramt", function() {
    drsum=0;
    $(".dramt").each(function(){
      drsum += +$(this).val();
      $('#vctable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
    });
  });

  $(document).off("change",".cramt").on("change", ".cramt", function() {
    crsum=0;
    $(".cramt").each(function(){
      crsum += +$(this).val();
      $('#vctable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
    });
  });

  $(document).off("click",".del").on("click", ".del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();
      drsum=0;
      crsum=0;
      $(".dramt").each(function(){
        drsum += +$(this).val();
        $('#vctable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
      });
      $(".cramt").each(function(){
        crsum += +$(this).val();
        $('#vctable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
      });
      $('#vctable tbody tr:last input:enabled').focus();
    });
  });


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
  $("#vdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#vmonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#vyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
    if(!Date.parseExact($("#vdate").val()+$("#vmonth").val()+$("#vyear").val(), "ddMMyyyy")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
        $('#vdate').focus().select();
      });
      $("#postdate-alert").hide();
      $('#vdate').focus().select();
      return false;
    }
    var curdate = Date.parseExact($("#vyear").val()+$("#vmonth").val()+$("#vdate").val(), "yyyyMMdd")
    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
        $('#vdate').focus().select();
      });
      $("#postdate-alert").hide();
      $('#vdate').focus().select();
      return false;
    }
    if (Date.today().compareTo(curdate)==-1) {

      $("#postdate-alert").alert();
      $("#postdate-alert").show();
    }
    else {
      $("#postdate-alert").hide();
    }
  });

  $('#vno').keyup(function(event) {
    if (navflag==true)
    {
      navflag=false;
      event.preventDefault();
    }
    else
    {
      if(event.which==13 && $('#vno').val()!="")
      {
        $('#vdate').select().focus();
      }
    }
  });

  $('#vno').keydown(function(event) {
    if (event.which==190 && event.ctrlKey) {
      $("#vdate").focus().select();
      event.preventDefault();
    }
  });

  $('#vdate').keyup(function(event) {
    if (navflag==true)
    {
      navflag=false;
      event.preventDefault();
    }
    else
    {
      if(event.which==13 && $('#vyear').val()!="")
      {
        $('#vmonth').focus().select();
      }
    }
    if (event.which==38) {
      $("#vno").select().focus();
    }
  });
  $('#vdate').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#vno').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vmonth').focus().select();
      event.preventDefault();
    }
  });

  $('#vmonth').keyup(function(event) {
    if(event.which==13 && $('#vyear').val()!=""){
      $('#vyear').focus().select();
    }
    if (event.which==38) {
      $("#vdate").select().focus();
    }
  });

  $('#vmonth').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#vdate').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vyear').focus().select();
      event.preventDefault();
    }
  });

  $('#vyear').keyup(function(event) {
    if(event.which==13 && $('#vyear').val()!=""){
      $('#vctable tbody tr:first select:enabled:first').focus();
    }
    if (event.which==38) {
      $("#vmonth").select().focus();
    }
  });
  $("#invsel").keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#vyear').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vctable tbody tr:first select:enabled').focus();
      event.preventDefault();
    }
  });


  $("#invsel").keyup(function(event) {
    /* Act on the event */
    if (event.which==13) {

      $('#vctable tbody tr:first select:enabled').focus();
    }
  });

  $('#vyear').keyup(function(event) {
    if(event.which==13 && $('#vyear').val()!=""){
      if (($('#m_vtype').val()=="sales" || $('#m_vtype').val()=="purchase") && sessionStorage.invflag==1)
      {
        $("#invsel").focus();
      }
      else
      {
        $('#vctable tbody tr:first select:enabled').focus();
      }
    }
    if (event.which==38) {
      $("#vmonth").select().focus();
    }
    if (event.which==40) {
      $("#vctable tbody tr:first select:enabled)").select().focus();
    }
  });
  $('#vyear').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#vmonth').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      if (($('#m_vtype').val()=="sales" || $('#m_vtype').val()=="purchase") && sessionStorage.invflag==1)
      {
        $("#invsel").focus();
      }
      else
      {
        $('#vctable tbody tr:first select:enabled').focus();
      }
      event.preventDefault();
    }
  });

  $('#project').keyup(function(event) {
    if(event.which==13){
      $('#narr').select().focus();
    }
  });
  $('#project').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#vctable tbody tr:last input:enabled').focus().select();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#narr').focus().select();
      event.preventDefault();
    }
    if (event.which==13) {
      event.preventDefault();
    }
  });

  $(document).off('keydown', '#narr').on('keydown', '#narr', function(event) {
    if (event.which==188 && event.ctrlKey) {
        if (  $('#project').val()== undefined) {
        $('#vctable tbody tr:last input:enabled').focus().select();
        event.preventDefault();
        }
        else {
          $('#project').focus().select();
          event.preventDefault();
        }

    }
    if (event.which==190 && event.ctrlKey) {
      $('#save').focus();
      event.preventDefault();
    }
    if (event.which==13) {
      $('#save').click();
      event.preventDefault();
    }
  });

  $('#save').keydown(function(event) {
    if (event.which==188 && event.ctrlKey) {
      $('#narr').focus().select();
      event.preventDefault();
    }
  });

  $(document).off("change",".crdr").on("change",".crdr",function(event)
  {
    var curindex = $(this).closest('tr').index();
    $('#vctable tbody tr:eq('+curindex+') input:disabled').val($('#vctable tbody tr:eq('+curindex+') input:enabled').val());
    $('#vctable tbody tr:eq('+curindex+') input:enabled').val("");
    $('#vctable tbody tr:eq('+curindex+') input').prop('disabled', function(i, v) { return !v; });
    if($(this).val()=="Cr"){
      $.ajax({
        url: '/getcjaccounts',
        type: 'POST',
        dataType: 'json',
        data: {"type": $('#m_vtype').val(),"side":"Cr"},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(jsonObj) {
          var accs = jsonObj["accounts"];
          $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').empty();
          for (i in accs ) {
            $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
          }
        }
      });
    }
    if($(this).val()=="Dr"){
      $.ajax({
        url: '/getcjaccounts',
        type: 'POST',
        dataType: 'json',
        data: {"type": $('#m_vtype').val(),"side":"Dr"},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(jsonObj) {
          var accs = jsonObj["accounts"];
          $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').empty();
          for (i in accs ) {
            $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
          }
        }
      });
    }
//rohini
var curacccode = $('#vctable tbody tr:last td:eq(1) select option:selected').val();
var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
$('#vctable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));

    drsum=0;
    $(".dramt").each(function(){
      drsum += +$(this).val();
      $('#vctable tfoot tr:last td:eq(1) input').val(drsum.toFixed(2));
    });
    crsum=0;
    $(".cramt").each(function(){
      crsum += +$(this).val();
      $('#vctable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
    });
  });

  $(document).off("keyup",".crdr").on("keyup",".crdr",function(event)
  {
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
  });

      $(document).off("keyup",".accs").on("keyup",".accs",function(event){
        var curindex = $(this).closest('tr').index();
        var curacccode = $('#vctable tbody tr:eq('+curindex+') td:eq(1) select option:selected').val();
        var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
        $('#vctable tbody tr:eq('+curindex+') td:eq(2) input').val(getBalance(curacccode, caldata));
        if(event.which==13 )
        {
          event.preventDefault();
          if ($(this).val()==null) {
            return false;
          }
          var curindex = $(this).closest('tr').index();
          $('#vctable tbody tr:eq('+curindex+') input:enabled').select().focus(); // focus shifts to the enabled amount box when one hits enter on the accounts select box.
        }
      });
  $(document).off("keydown",".accs").on("keydown",".accs",function(event){
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==32 || event.which==13) {
      event.preventDefault();
    }
    if(event.which==190 && event.shiftKey)
    {
      $('#vctable tbody tr:eq('+nextindex+') td:eq(1) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#vctable tbody tr:eq('+previndex+') td:eq(1) select').focus();
      }
      if (curindex==0) {
        event.preventDefault();
        if (($('#m_vtype').val()=="sales" || $('#m_vtype').val()=="purchase") && sessionStorage.invflag==1)
        {
          $("#invsel").focus();
        }
        else
        {
          $("#vyear").focus().select();

        }
      }
    }
    if (event.which==188 && event.ctrlKey) {
      $('#vctable tbody tr:eq('+curindex+') td:eq(0) select').focus();
      event.preventDefault();

    }
    if (event.which==190 && event.ctrlKey) {
      $('#vctable tbody tr:eq('+curindex+') input:enabled').focus().select();
      event.preventDefault();
    }
  });
  $(document).off("keydown",".crdr").on("keydown",".crdr",function(event){
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      $('#vctable tbody tr:eq('+nextindex+') td:eq(0) select').focus();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#vctable tbody tr:eq('+previndex+') td:eq(0) select').focus();
      }
    }
    if (event.which==13) {
      event.preventDefault();
    }
    if (event.which==188 && event.ctrlKey) {
      if (curindex == 0) {
        if (($('#m_vtype').val()=="sales" || $('#m_vtype').val()=="purchase") && sessionStorage.invflag==1)
        {
          $("#invsel").focus();
        }
        else
        {
          $("#vyear").focus().select();

        }
      }
      else{
        $('#vctable tbody tr:eq('+previndex+') input:enabled').focus().select();
        event.preventDefault();
      }
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
  });
  $(document).off("keydown",".cramt").on("keydown",".cramt",function(event){
    curindex = $(this).closest('tr').index();
    lastindex = $("#vctable tbody tr:last").index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#vctable tbody tr:eq('+nextindex+') input:enabled').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#vctable tbody tr:eq('+previndex+') input:enabled').focus().select();
      }
    }
    if (event.which==188 && event.ctrlKey) {
      $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vctable tbody tr:eq('+nextindex+') select:enabled:first').focus();
      event.preventDefault();
      if (curindex==lastindex) {
        if (  $('#project').val()== undefined) {
        $('#narr').focus();
        event.preventDefault();
        }
        else {
          $('#project').focus();
          event.preventDefault();
        }
      }
    }
  });
  $(document).off("keydown",".dramt").on("keydown",".dramt",function(event){
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if(event.which==190 && event.shiftKey)
    {
      event.preventDefault();
      $('#vctable tbody tr:eq('+nextindex+') input:enabled').focus().select();
    }
    else if (event.which==188 && event.shiftKey)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#vctable tbody tr:eq('+previndex+') input:enabled').focus().select();
      }
    }
    if (event.which==188 && event.ctrlKey) {
      $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    if (event.which==190 && event.ctrlKey) {
      $('#vctable tbody tr:eq('+nextindex+') select:enabled:first').focus();
      event.preventDefault();
      if (curindex==lastindex) {
        if (  $('#project').val()== undefined) {
        $('#narr').focus();
        event.preventDefault();
        }
        else {
          $('#project').focus();
          event.preventDefault();
        }
      }
    }
  });

  $(document).off("keypress",".dramt").on("keypress",".dramt",function(event)
  {
    $('.dramt').numeric({ negative: false });
  });

  $(document).off("keypress",".cramt").on("keypress",".cramt",function(event)
  {
    $('.cramt').numeric({ negative: false });
  });



  $(document).off("keyup",".dramt").on("keyup",".dramt",function(event)
  {

    if(event.which==13)
    {
      console.log("here for dr amount");

      var curindex = $(this).closest('tr').index();
      if($('#vctable tbody tr:eq('+curindex+') td:eq(2) input:enabled').val()=="" || $('#vctable tbody tr:eq('+curindex+') td:eq(2) input:enabled').val()==0){
        return false;
      }
      var lastindex = $('#vctable tbody tr:last').index();
      if(drsum > crsum)
      {
        diff=drsum-crsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vctable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()=="" || $('#vctable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()==0 || $('#vctable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()=="NaN"){
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
            var curacccode = $('#vctable tbody tr:last td:eq(1) select option:selected').val();
            var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
            $('#vctable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));
            crsum=0;
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));//refer rohini
            });
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            if (  $('#project').val()== undefined) {
            $('#narr').focus();
            return false;
            }
            else {
              $('#project').focus();
              return false;
            }
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#m_vtype').val(),"side":"Cr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('#vctable').append('<tr>'+
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
              '<td class="col-xs-2">'+
                '<input class="form-control input-sm clbal rightJustified" type="text" value="0.00" disabled>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vctable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vctable tbody tr:last td:eq(1) select').focus();

              $('#vctable tbody tr:last td:eq(4) input:enabled').val(parseFloat(diff).toFixed(2));
              //rohini
                var curacccode = $('#vctable tbody tr:last td:eq(1) select option:selected').val();
                var d = new Date();
                var month = d.getMonth()+1;
                var day = d.getDate();
                var caldata = d.getFullYear() + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
                $('#vctable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));
                //rohini
                var curacccode = $('#vctable tbody tr:last td:eq(1) select option:selected').val();
                var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
                $('#vctable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));

              crsum=0;
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
          if($('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="" || $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()==0 || $('#vctable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()=="NaN"){
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
            var curacccode = $('#vctable tbody tr:last td:eq(1) select option:selected').val();
            var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
            $('#vctable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));
            drsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
            });
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#m_vtype').val(),"side":"Dr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('#vctable').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr">Cr</option>'+
              '<option value="Dr" selected>Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '<td class="col-xs-2">'+
                '<input class="form-control input-sm clbal rightJustified" type="text" value="0.00" disabled>'+
              '</td>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vctable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vctable tbody tr:last td:eq(1) select').focus();
              $('#vctable tbody tr:last td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
              var curacccode = $('#vctable tbody tr:last td:eq(1) select option:selected').val();
              var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
              $('#vctable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));
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
        if (curindex<lastindex)
        {
          var nxtindex = curindex+1;
          $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();

        }
        else
        {
          if (  $('#project').val()== undefined) {
          $('#narr').focus();
          return false;
          }
          else {
            $('#project').focus();
            return false;
          }
        }
      }

      curindex=null;
      lastindex=null;
    }

  });
  $(document).off("keyup",".cramt").on("keyup",".cramt",function(event)
  {

    if(event.which==13)
    {
      console.log("here for cramout");
      var curindex = $(this).closest('tr').index();
      if($('#vctable tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()=="" || $('#vctable tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()==0 || $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
        return false;
      }
      var lastindex = $('#vctable tbody tr:last').index();
      if(drsum > crsum)
      {
        diff=drsum-crsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vctable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()=="" || $('#vctable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val()==0){
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(4) input:enabled').val(parseFloat(diff).toFixed(2));
            var curacccode = $('#vctable tbody tr:last td:eq(1) select option:selected').val();
            var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
            $('#vctable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));
            crsum=0;
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
            });
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            if (  $('#project').val()== undefined) {
            $('#narr').focus();
            return false;
            }
            else {
              $('#project').focus();
              return false;
            }
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#m_vtype').val(),"side":"Cr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('#vctable').append('<tr>'+
              '<td  class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr" selected>Cr</option>'+
              '<option value="Dr">Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+

              '<td class="col-xs-2">'+
                '<input class="form-control input-sm clbal rightJustified" type="text" value="0.00" disabled>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vctable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vctable tbody tr:last td:eq(1) select').focus();
              $('#vctable tbody tr:last td:eq(4) input:enabled').val(parseFloat(diff).toFixed(2));
              var curacccode = $('#vctable tbody tr:last td:eq(1) select option:selected').val();
              var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
              $('#vctable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));
              crsum=0;
              $(".cramt").each(function(){
                crsum += +$(this).val();
                $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
              });
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('tfoot tr:last td:eq(1) input').val(drsum.toFixed(2));
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
          if($('#vctable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()=="" || $('#vctable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()==0 || $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(diff.toFixed(2));
            drsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(drsum.toFixed(2));
            });
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#m_vtype').val(),"side":"Dr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('#vctable').append('<tr>'+
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
              '<td class="col-xs-2">'+
                '<input class="form-control input-sm clbal rightJustified" type="text" value="0.00" disabled>'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-2">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vctable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vctable tbody tr:last td:eq(1) select').focus();
              $('#vctable tbody tr:last td:eq(3) input:enabled').val(diff.toFixed(2));
              var curacccode = $('#vctable tbody tr:last td:eq(1) select option:selected').val();
              var caldata = $('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
              $('#vctable tbody tr:last td:eq(2) input').val(getBalance(curacccode, caldata));
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('tfoot tr:last td:eq(1) input').val(drsum.toFixed(2));
              });
            }
          });
        }

      }
      else {
        if (curindex<lastindex)
        {
          var nxtindex = curindex+1;
          $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
        }
        else
        {
          if (  $('#project').val()== undefined) {
          $('#narr').focus();
          return false;
          }
          else {
            $('#project').focus();
            return false;
          }
        }
      }
    }
  });


  $("#delete").click(function(event) {
    // Act on the event

	  $("#hideinp").val(1);
	  $('#myModal').modal('hide');
	  $('#confirm_del').modal('show');
      $('#confirm_del').on('shown.bs.modal', function (e)
              {
                $("#m_cancel").focus();

              });
	  $('#vcdel1').click(function(event){
		  $.ajax({
		        url: '/deletevoucher',
		        type: 'POST',
		        datatype: 'json',
		        data: {vcode: $("#vcode").val()},
		        beforeSend: function(xhr)
		        {
		          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
		        },
		      })
		      .done(function(jsonobj) {
		        if(jsonobj["gkstatus"]==0){
		          $('#confirm_del').modal('hide');
		          $('#confirm_del').on('hidden.bs.modal', function (e)
		                  {
		                    $('.modal-backdrop').remove();
		                    $("#success-alert").alert();
		  		          $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
		  		            $("#success-alert").hide();
		  		          $("#viewvc").html("");
		                    $("#submit").click();
		  		          });
		  		          });


		        }

		        else {
		          $("#notran-del-alert").alert();
		          $("#notran-del-alert").fadeTo(2250, 500).slideUp(500, function(){
		            $("#notran-del-alert").hide();
		          });
		        }
		      });

	  });

   // var cnf = confirm("Are you sure?");
   /* if (cnf) {

      $.ajax({
        url: '/deletevoucher',
        type: 'POST',
        datatype: 'json',
        data: {vcode: $("#vcode").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      })
      .done(function(jsonobj) {
        if(jsonobj["gkstatus"]==0){
          $('#myModal').modal('hide');

        }
        else {
          $("#notran-del-alert").alert();
          $("#notran-del-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#notran-del-alert").hide();
          });
        }
      });

    }
    else {
      $("#delete").focus();
    }
    */


  });
  $('#save').click(function(event) {
    var allow = true;
    if ($('#vno').val()=="") {
      $("#vno-alert").alert();
      $("#vno-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#vno-alert").hide();
      });
      $('#vno').focus();
      return false;
    }
    if ($('#vdate').val()=="" || $('#vmonth').val()=="" || $('#vyear').val()==""||$('#vdate').val()==0 || $('#vmonth').val()==0 || $('#vyear').val()==0) {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#vdate').focus();
      return false;
    }
    var curdate = Date.parseExact($("#vyear").val()+$("#vmonth").val()+$("#vdate").val(), "yyyyMMdd")
    if (!curdate.between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#vdate').focus().select();
      return false;
    }
    if ($('#drtotal').val()!=$('#crtotal').val()) {
      $("#balance-alert").alert();
      $("#balance-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#balance-alert").hide();
      });
      $('#vctable tbody tr:last input:enabled').focus()
      return false;
    }
    if ($('#drtotal').val()==0) {
      $("#zero-alert").alert();
      $("#zero-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#zero-alert").hide();
      });
      $("#vctable tbody tr:first input:enabled").focus();
      return false;
    }

    $("#vctable tbody tr").each(function() {
      var accountcode = $(".accs", this).val();
      var ccount=0;
      $("#vctable tbody tr").each(function() {
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
      $("#accs-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#accs-alert").hide();
      });
      $("#vctable tbody tr:first td:eq(1) select").focus();
      return false;
    }

    var output = [];
    $("#vctable tbody tr").each(function() {
      if ($(".cramt", this).val()==0 && $(".dramt", this).val()=="" || $(".cramt", this).val()=="" && $(".dramt", this).val()==0 ) {
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
      $("#vctable tbody tr:first input:enabled").focus();
      $("#zerorow-alert").alert();
      $("#zerorow-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#zerorow-alert").hide();
      });
      return false;
    }
    var details = {}
    details.vno=$('#vno').val();
    details.vdate=$('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
    details.projectcode=$('#project').val();

      if ($('#project').length) {
          details.projectcode=$('#project').val();
      } // returns 1
      else {
        details.projectcode=""
      }
    details.narration=$('#narr').val();
    details.vtype=$('#m_vtype').val();
    var form_data = new FormData();
    var files = $("#my-edit-file-selector")[0].files
    var filelist = [];
    for (var i = 0; i < files.length; i++) {
      form_data.append("file"+i,files[i])
    }
    if (($('#m_vtype').val()=="sales" || $('#m_vtype').val()=="purchase") && sessionStorage.invflag==1)
    {
      details.invid = $("#invsel option:selected").val();
      var invoicetotal= $("#invtotal").val();
      var vtotal= $('#vctable tfoot tr:last td:eq(2) input').val();
      if (details.invid!="")
      {

        if (vtotal>invoicetotal)
        {
          $('#vctable tbody tr:first td:eq(1) input').focus();
          $('#vctable tbody tr:first td:eq(1) input').select();
          $("#invoicebalance-alert").alert();
          $("#invoicebalance-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#invoicebalance-alert").hide();
          });
          $('#vctable tbody tr:first input:enabled').focus().select();
          return false;
        }
      }
    }
    else
    {
      details.invid = "";
    }
    if(ecflag=="clone")
    {
      form_data.append("vdetails",JSON.stringify(details));
      form_data.append("transactions",JSON.stringify(output));
      $.ajax({
        type: "POST",
        url: "/addvoucher",
        global: false,
        contentType: false,
        cache: false,
        processData: false,
        async: false,
        datatype: "json",
        data: form_data,
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          if(resp.gkstatus){

            $("#myModal").modal('hide');
            $('.modal-backdrop').remove();
            $("tbody tr:eq("+$("#modalindex").val()+")").dblclick();
          }
          else {
            $("#notran-clone-alert").alert();
            $("#notran-clone-alert").fadeTo(2250, 500).slideUp(500, function(){
              $("#notran-clone-alert").hide();
            });
          }

        }
      });
    }
    else if (ecflag=="edit")
    {

      if ($("#removeattach").is(":checked")) {
        details.delattach = true
      }
      else {
        details.delattach = false
      }
      details.vcode=$('#vcode').val();
      form_data.append("vdetails",JSON.stringify(details));
      form_data.append("transactions",JSON.stringify(output));
      $.ajax({
        type: "POST",
        url: "/editvoucher",
        global: false,
        contentType: false,
        cache: false,
        processData: false,
        async: false,
        datatype: "json",
        data: form_data,
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          if(resp.gkstatus){

            $("#myModal").modal('hide');
            $('.modal-backdrop').remove();
            $("tbody tr:eq("+$("#modalindex").val()+")").dblclick();
          }
          else {
            $("#notran-edit-alert").alert();
            $("#notran-edit-alert").fadeTo(2250, 500).slideUp(500, function(){

              $("#notran-edit-alert").hide();
            });
          }

        }
      });

    }


  });

  $('.close').click(function() {

    $(this).parent().hide();

  })






});
