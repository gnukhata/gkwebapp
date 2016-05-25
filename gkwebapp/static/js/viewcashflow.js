$(document).ready(function() {
  $("#cashfl_fromdate").focus();
  $('.cashfl_autotab').autotab('number');

  $('input:text:enabled').keydown( function(e) {
    var n = $("input:text:enabled").length;
    var f = $('input:text:enabled');
      if (e.which == 13)
      {
        var nextIndex = f.index(this) + 1;
        if(nextIndex < n){
          e.preventDefault();
          f[nextIndex].focus();
          f[nextIndex].select();
        }
      }

      if (e.which == 38)
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
  $("#cashfl_fromdate").val(fromdatearray[2])
  $("#cashfl_frommonth").val(fromdatearray[1])
  $("#cashfl_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#cashfl_todate").val(todatearray[2])
  $("#cashfl_tomonth").val(todatearray[1])
  $("#cashfl_toyear").val(todatearray[0])
  $("#cashfl_fromdate").select();

  $("#cashfl_toyear").keydown(function(event) {
    if (event.which==13) {
      $("#cashfl_view").click();
    }
  });

  $("#cashfl_view").click(function(event) {
    if ($("#cashfl_todate").val()=="" || $("#cashfl_tomonth").val()=="" || $("#cashfl_toyear").val()==""||$("#cashfl_fromdate").val()=="" || $("#cashfl_frommonth").val()=="" || $("#cashfl_fromyear").val()=="") {
      return false;
    }
    $.ajax(
      {
        type: "POST",
        url: "/showcashflowreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"financialstart":sessionStorage.yyyymmddyear1,"orgtype":sessionStorage.orgt,"calculateto":$("#cashfl_toyear").val()+"-"+$("#cashfl_tomonth").val()+"-"+$("#cashfl_todate").val(),"calculatefrom":$("#cashfl_fromyear").val()+"-"+$("#cashfl_frommonth").val()+"-"+$("#cashfl_fromdate").val()},
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
  $("#cashfl_reset").click(function(event) {
    $("#showcashflow").click();
  });
});
