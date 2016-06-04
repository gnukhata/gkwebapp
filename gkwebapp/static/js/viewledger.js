$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#viewledger_accname").focus();
  $('.viewledger_date').autotab('number');
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  var sel1 = 0;
  $("#viewledger_prjname").focus(function(){
    sel1 = 1;
  });
  $("#viewledger_prjname").blur(function(){
    sel1 = 0;
  });

  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewledger_fromdate").val(fromdatearray[2])
  $("#viewledger_frommonth").val(fromdatearray[1])
  $("#viewledger_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewledger_todate").val(todatearray[2])
  $("#viewledger_tomonth").val(todatearray[1])
  $("#viewledger_toyear").val(todatearray[0])

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

  $("#viewledger_fromdate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewledger_frommonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewledger_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewledger_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#viewledger_fromyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $("#viewledger_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });


  $('input:text:enabled,input:checkbox:enabled,select:enabled').keydown( function(e) {
    var n = $("input:text:enabled,input:checkbox:enabled,select:enabled").length;
    var f = $('input:text:enabled,input:checkbox:enabled,select:enabled');
      if (e.which == 13)
      {
        var nextIndex = f.index(this) + 1;
        if(nextIndex < n){
          e.preventDefault();
          f[nextIndex].focus();
          f[nextIndex].select();
        }
      }
      var s1 = $("#viewledger_prjname option:selected").index();
      if (e.which == 38 && sel1 == 1 && s1 == 0 || (e.which == 38 && sel1 == 0))
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          e.preventDefault();
          f[prevIndex].focus();
          f[prevIndex].select();
        }
      }
    });
  $("#viewledger_prjname").keydown(function(event) {
    if (event.which==13) {
      $("#viewledger_submit").click();
    }
  });

  $("#viewledger_monthly").keydown(function(event) {
    if (event.which==13) {
      if ($("#viewledger_monthly").is(":checked")) {
      $("#viewledger_submit").click();
    }
    }
  });

  $("#viewledger_monthly").change(function(event) {
    if ($("#viewledger_monthly").is(":checked")) {
      $('.dis').attr('disabled', true);
    }
    else {
      $('.dis').attr('disabled', false);
    }
  });
  $("#viewledger_submit").click(function(event) {
    if ($("#viewledger_accname").val()==null) {
      $("#account-blank-alert").alert();
      $("#account-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#account-blank-alert").hide();
      });
      $('#viewledger_accname').focus()
      return false;
    }
    var todate = $("#viewledger_toyear").val()+$("#viewledger_tomonth").val()+$("#viewledger_todate").val();
    var fromdate = $("#viewledger_fromyear").val()+$("#viewledger_frommonth").val()+$("#viewledger_fromdate").val();
    if(!Date.parseExact(fromdate,"yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2000, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewledger_fromdate').focus().select();
      return false;
    }
    if (!Date.parseExact(fromdate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2000, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewledger_fromdate').focus().select();
      return false;
    }
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2000, 400).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewledger_todate').focus().select();
      return false;
    }
    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2000, 400).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewledger_todate').focus().select();
      return false;
    }
    if (Date.parseExact(fromdate,"yyyyMMdd").compareTo(Date.parseExact(todate,"yyyyMMdd"))==1) {
      $("#compare-date-alert").alert();
      $("#compare-date-alert").fadeTo(2000, 400).slideUp(500, function(){
        $("#compare-date-alert").hide();
      });
      $('#viewledger_todate').focus().select();
      return false;
    }
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":0,"accountcode":$("#viewledger_accname").val(),"calculatefrom":$("#viewledger_fromyear").val()+"-"+$("#viewledger_frommonth").val()+"-"+$("#viewledger_fromdate").val(),"calculateto":$("#viewledger_toyear").val()+"-"+$("#viewledger_tomonth").val()+"-"+$("#viewledger_todate").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":$("#viewledger_prjname").val(),"monthlyflag":$("#viewledger_monthly").is(":checked"),"narrationflag":$("#viewledger_nar").is(":checked")},
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

  $("#viewledger_reset").click(function(event) {
    $("#showviewledger").click();
  });
  });
