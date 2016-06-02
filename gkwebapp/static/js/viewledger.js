$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#viewledger_accname").focus();
  $('.viewledger_date').autotab('number');
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
      return false;
    }
    if (($("#viewledger_fromdate").val()=="" || $("#viewledger_frommonth").val()=="" || $("#viewledger_fromyear").val()=="" || $("#viewledger_todate").val()=="" || $("#viewledger_tomonth").val()=="" || $("#viewledger_toyear").val()=="") && $("#viewledger_monthly").is(":checked")==false) {
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
