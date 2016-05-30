$(document).ready(function() {
  $("#pnl_todate").focus();
  $('.pnl_autotab').autotab('number');

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
  $("#pnl_fromdate").val(fromdatearray[2])
  $("#pnl_frommonth").val(fromdatearray[1])
  $("#pnl_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#pnl_todate").val(todatearray[2])
  $("#pnl_tomonth").val(todatearray[1])
  $("#pnl_toyear").val(todatearray[0])
  $("#pnl_todate").select();

  $("#pnl_toyear").keydown(function(event) {
    if (event.which==13) {
      $("#pnl_view").click();
    }
  });

  $("#pnl_view").click(function(event) {
    if ($("#pnl_todate").val()=="" || $("#pnl_tomonth").val()=="" || $("#pnl_toyear").val()==""||$("#pnl_fromdate").val()=="" || $("#pnl_frommonth").val()=="" || $("#pnl_fromyear").val()=="") {
      return false;
    }
    $.ajax(
      {
        type: "POST",
        url: "/showprofitlossreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"financialstart":sessionStorage.yyyymmddyear1,"orgtype":sessionStorage.orgt,"calculateto":$("#pnl_toyear").val()+"-"+$("#pnl_tomonth").val()+"-"+$("#pnl_todate").val()},
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
  $("#pnl_reset").click(function(event) {
    $("#showprofitloss").click();
  });
});
