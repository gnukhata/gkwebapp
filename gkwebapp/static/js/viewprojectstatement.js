$(document).ready(function() {
  $("#viewprjstate_todate").focus();
  $('.viewprjstate_date').autotab('number');
  var sel1 = 0;
  $("#viewprjstate_prjname").focus(function(){
    sel1 = 1;
  });
  $("#viewprjstate_prjname").blur(function(){
    sel1 = 0;
  });

  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewprjstate_fromdate").val(fromdatearray[2])
  $("#viewprjstate_frommonth").val(fromdatearray[1])
  $("#viewprjstate_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewprjstate_todate").val(todatearray[2])
  $("#viewprjstate_tomonth").val(todatearray[1])
  $("#viewprjstate_toyear").val(todatearray[0])
  $("#viewprjstate_todate").select();
  $('input:text:enabled,select:enabled').keydown( function(e) {
    var n = $("input:text:enabled,select:enabled").length;
    var f = $('input:text:enabled,select:enabled');
      if (e.which == 13)
      {
        var nextIndex = f.index(this) + 1;
        if(nextIndex < n){
          e.preventDefault();
          f[nextIndex].focus();
          f[nextIndex].select();
        }
      }
      var s1 = $("#viewprjstate_prjname option:selected").index();
      if ((e.which == 38 && sel1 == 1 && s1 == 0) ||(e.which == 38 && sel1 == 1 && s1 == 1) || (e.which == 38 && sel1 == 0))
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          e.preventDefault();
          f[prevIndex].focus();
          f[prevIndex].select();
        }
      }
    });
  $("#viewprjstate_prjname").keydown(function(event) {
    if (event.which==13) {
      $("#viewprjstate_submit").click();
    }
  });

  $("#viewprjstate_submit").click(function(event) {
    if ($("#viewprjstate_prjname").val()==null) {
      return false;
    }
    if (($("#viewprjstate_fromdate").val()=="" || $("#viewprjstate_frommonth").val()=="" || $("#viewprjstate_fromyear").val()=="" || $("#viewprjstate_todate").val()=="" || $("#viewprjstate_tomonth").val()=="" || $("#viewprjstate_toyear").val()=="") && $("#viewprjstate_monthly").is(":checked")==false) {
      return false;
    }
    $.ajax(
      {
        type: "POST",
        url: "/showprojectstatementreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"calculateto":$("#viewprjstate_toyear").val()+"-"+$("#viewprjstate_tomonth").val()+"-"+$("#viewprjstate_todate").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":$("#viewprjstate_prjname").val(),"projectname":$("#viewprjstate_prjname option:selected").text()},
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

  $("#viewprjstate_reset").click(function(event) {
    $("#showviewprjstate").click();
  });
  });
