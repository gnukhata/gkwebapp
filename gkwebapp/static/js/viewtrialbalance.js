$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#trialbal_todate").focus();
  $('.trialbal_autotab').autotab('number');
  var sel1 = 0;
  $("#trialbal_type").focus(function(){
    sel1 = 1;
  });
  $("#trialbal_type").blur(function(){
    sel1 = 0;
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
    if ($("#trialbal_todate").val()=="" || $("#trialbal_tomonth").val()=="" || $("#trialbal_toyear").val()=="") {
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
