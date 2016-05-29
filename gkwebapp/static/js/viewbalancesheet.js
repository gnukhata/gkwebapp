$(document).ready(function() {

  if (sessionStorage.orgt=="Profit Making")
  {
    $(".panel-title").append(" Balance Sheet");
    $("#baltypelbl").prepend("Balance Sheet ");
    $(".cbl").show();
  }
  if (sessionStorage.orgt=="Not For Profit")
  {
    $(".panel-title").append(" Statement of Affairs");
    $("#baltypelbl").prepend("Statement of Affairs ");
    $(".csa").show();
  }


  $("#viewbalsht_todate").focus();
  $('.viewbalsht_date').autotab('number');
  var sel1 = 0;
  $("#viewbalsht_baltype").focus(function(){
    sel1 = 1;
  });
  $("#viewbalsht_baltype").blur(function(){
    sel1 = 0;
  });

  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewbalsht_fromdate").val(fromdatearray[2])
  $("#viewbalsht_frommonth").val(fromdatearray[1])
  $("#viewbalsht_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewbalsht_todate").val(todatearray[2])
  $("#viewbalsht_tomonth").val(todatearray[1])
  $("#viewbalsht_toyear").val(todatearray[0])
  $("#viewbalsht_todate").select();
  $('input:text:enabled,select:visible').keydown( function(e) {
    var n = $("input:text:enabled,select:visible").length;
    var f = $('input:text:enabled,select:visible');
    if (e.which == 13)
    {
      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        e.preventDefault();
        f[nextIndex].focus();
        f[nextIndex].select();
      }
    }
    var s1 = $("#viewbalsht_baltype option:selected").index();
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
  $(".cblsel").keydown(function(event) {
    if (event.which==13) {
      
      $("#viewbalsht_submit").click();
    }
  });

  $("#viewbalsht_submit").click(function(event) {
    if ($("#viewbalsht_baltype").val()==null) {
      return false;
    }
    if (($("#viewbalsht_fromdate").val()=="" || $("#viewbalsht_frommonth").val()=="" || $("#viewbalsht_fromyear").val()=="" || $("#viewbalsht_todate").val()=="" || $("#viewbalsht_tomonth").val()=="" || $("#viewbalsht_toyear").val()=="")) {
      return false;
    }
    $.ajax(
      {
        type: "POST",
        url: "/showbalancesheetreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"balancesheettype":$("#viewbalsht_baltype").val(),"calculateto":$("#viewbalsht_toyear").val()+"-"+$("#viewbalsht_tomonth").val()+"-"+$("#viewbalsht_todate").val(),"orgtype":sessionStorage.orgt},
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

  $("#viewbalsht_reset").click(function(event) {
    $("#showbalancesheet").click();
  });
});
