$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#trialbal_todate").focus();
  $('.trialbal_autotab').autotab('number');
  var financialstart = Date.parseExact(sessionStorage.yyyymmddyear1, "yyyy-MM-dd");
  var financialend = Date.parseExact(sessionStorage.yyyymmddyear2, "yyyy-MM-dd");
  var sel1 = 0;
  $("#trialbal_type").focus(function(){
    sel1 = 1;
  });
  $("#trialbal_type").blur(function(){
    sel1 = 0;
  });
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

  $("#trialbal_todate").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#trialbal_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#trialbal_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  $('input:text:enabled,select').keydown( function(e) {
    var n = $("input:text:enabled,select").length;
    var f = $('input:text:enabled,select');
      if (e.which == 13)
      {
        var nextIndex = f.index(this) + 1;
        if(nextIndex < n){
          e.preventDefault();
          f[nextIndex].focus();
          f[nextIndex].select();
        }
      }
      var s1 = $("#trialbal_type option:selected").index();
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

  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#trialbal_fromdate").val(fromdatearray[2])
  $("#trialbal_frommonth").val(fromdatearray[1])
  $("#trialbal_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#trialbal_todate").val(todatearray[2])
  $("#trialbal_tomonth").val(todatearray[1])
  $("#trialbal_toyear").val(todatearray[0])
  $("#trialbal_todate").select();

  $("#trialbal_type").keydown(function(event) {
    if (event.which==13) {
      $("#trialbal_view").click();
    }
  });

  $("#trialbal_view").click(function(event) {
    var todate = $("#trialbal_toyear").val()+$("#trialbal_tomonth").val()+$("#trialbal_todate").val();
    if(!Date.parseExact(todate, "yyyyMMdd")){
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#trialbal_todate').focus().select();
      return false;
    }

    if (!Date.parseExact(todate,"yyyyMMdd").between(financialstart,financialend)) {
      $("#between-date-alert").alert();
      $("#between-date-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#between-date-alert").hide();
      });
      $('#trialbal_todate').focus().select();
      return false;
    }
    $.ajax(
      {
        type: "POST",
        url: "/showtrialbalancereport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"financialstart":sessionStorage.yyyymmddyear1,"calculateto":$("#trialbal_toyear").val()+"-"+$("#trialbal_tomonth").val()+"-"+$("#trialbal_todate").val(),"trialbalancetype":$("#trialbal_type").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        }
      })
      .done(function(resp) {
        $("#info").html(resp);
      })
      .fail(function() {
        console.log("error");
      })
      .always(function() {
        console.log("complete");
      });

  });
});
