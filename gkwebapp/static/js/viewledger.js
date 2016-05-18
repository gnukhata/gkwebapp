$(document).ready(function() {
  $("#viewledger_accname").focus();
  $('.viewledger_date').autotab('number');
  var sel1 = 0;
  $("#viewledger_prjname").focus(function(){
    sel1 = 1;
  });
  $("#viewledger_prjname").blur(function(){
    sel1 = 0;
  });
  $('input:text,input:checkbox,select').keydown( function(e) {
    var n = $("input:text,input:checkbox,select").length;
    var f = $('input:text,input:checkbox,select');
      if (e.which == 13)
      {
        var nextIndex = f.index(this) + 1;
        if(nextIndex < n){
          e.preventDefault();
          f[nextIndex].focus();}
      }
      var s1 = $("#viewledger_prjname option:selected").index();
      if (e.which == 38 && sel1 == 1 && s1 == 0 || (e.which == 38 && sel1 == 0))
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          e.preventDefault();
          f[prevIndex].focus();}
      }
    });
  $("#viewledger_submit").click(function(event) {
    if ($("#viewledger_accname").val()==null) {
      return false;
    }
    if ($("#viewledger_fromdate").val()=="" || $("#viewledger_frommonth").val()=="" || $("#viewledger_fromyear").val()=="" || $("#viewledger_todate").val()=="" || $("#viewledger_tomonth").val()=="" || $("#viewledger_toyear").val()=="") {
      return false;
    }
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"accountcode":$("#viewledger_accname").val(),"calculatefrom":$("#viewledger_fromyear").val()+"-"+$("#viewledger_frommonth").val()+"-"+$("#viewledger_fromdate").val(),"calculateto":$("#viewledger_toyear").val()+"-"+$("#viewledger_tomonth").val()+"-"+$("#viewledger_todate").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":$("#viewledger_prjname").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          $("#info").html(resp);
        }
      });
  });

  });
