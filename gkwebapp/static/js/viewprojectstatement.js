$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#viewprjstate_todate").focus();
  $('.viewprjstate_date').autotab('number');
  var sel1 = 0;
  $("#viewprjstate_prjname").focus(function(){
    sel1 = 1;
  });
  $("#viewprjstate_prjname").blur(function(){
    sel1 = 0;
  });
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
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

  $("#viewprjstate_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewprjstate_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewprjstate_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
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
      $("#account-blank-alert").alert();
      $("#account-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#account-blank-alert").hide();
      });
      $('#viewprjstate_prjname').focus()
      return false;
    }
    var todate = $("#viewprjstate_toyear").val()+$("#viewprjstate_tomonth").val()+$("#viewprjstate_todate").val();
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#viewprjstate_todate').focus().select();
      return false;
    }

    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#viewprjstate_todate').focus().select();
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
