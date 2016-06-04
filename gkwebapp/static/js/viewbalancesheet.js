$(document).ready(function() {
  $('.modal-backdrop').remove();

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

  $("#viewbalsht_today").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });
  $("#viewbalsht_tomonth").blur(function(event) {
    $(this).val(pad($(this).val(),2));
  });

  $("#viewbalsht_toyear").blur(function(event) {
    $(this).val(yearpad($(this).val(),4));
  });

  var sel1 = 0;
  var s1 ;
  if (sessionStorage.orgt=="Profit Making")
  {
    $(".panel-title").append(" Balance Sheet");
    $("#baltypelbl").prepend("Balance Sheet ");
    $(".cbl").show();


    $("#viewbalsht_baltype").focus(function(){
      sel1 = 1;
    });
    $("#viewbalsht_baltype").blur(function(){
      sel1 = 0;
    });
  }
  if (sessionStorage.orgt=="Not For Profit")
  {
    $(".panel-title").append(" Statement of Affairs");
    $("#baltypelbl").prepend("Statement of Affairs ");
    $(".csa").show();


    $("#viewsa_baltype").focus(function(){
      sel1 = 1;
    });
    $("#viewsa_baltype").blur(function(){
      sel1 = 0;
    });
  }


  $("#viewbalsht_today").focus();
  $('.viewbalsht_date').autotab('number');




  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#viewbalsht_fromday").val(fromdatearray[2])
  $("#viewbalsht_frommonth").val(fromdatearray[1])
  $("#viewbalsht_fromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#viewbalsht_today").val(todatearray[2])
  $("#viewbalsht_tomonth").val(todatearray[1])
  $("#viewbalsht_toyear").val(todatearray[0])
  $("#viewbalsht_today").select();
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

    if (sessionStorage.orgt=="Profit Making")
    {
      s1 = $("#viewbalsht_baltype option:selected").index();

    }
    if (sessionStorage.orgt=="Not For Profit")
    {
      s1 = $("#viewsa_baltype option:selected").index();

    }
    if ((e.which == 38 && sel1 == 1 && s1 == 0) || (e.which == 38 && sel1 == 0))
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

    var todate = $("#viewbalsht_toyear").val()+$("#viewbalsht_tomonth").val()+$("#viewbalsht_today").val();
    var fstart = Date.parseExact(sessionStorage.yyyymmddyear1,"yyyy-MM-dd");
    var fend = Date.parseExact(sessionStorage.yyyymmddyear2,"yyyy-MM-dd");
    if (!Date.parseExact(todate,"yyyyMMdd"))
    {
      $("#improperdate-alert").alert();
      $("#improperdate-alert").fadeTo(2000, 400).slideUp(500, function(){
        $("#improperdate-alert").hide();
      });
      $("#viewbalsht_today").focus();
      $("#viewbalsht_today").select();
      return false;
    };
    if (!Date.parseExact(todate,"yyyyMMdd").between(fstart,fend))
    {
      $("#betweendate-alert").alert();
      $("#betweendate-alert").fadeTo(2000, 400).slideUp(500, function(){
        $("#betweendate-alert").hide();
      });

      $("#viewbalsht_today").focus();
      $("#viewbalsht_today").select();
      return false;

    }


    var btyp;
    if (sessionStorage.orgt=="Profit Making")
    {
      if ($("#viewbalsht_baltype").val()==null) {
        return false;
      }
      btyp = $("#viewbalsht_baltype").val();
    }
    if (sessionStorage.orgt=="Not For Profit")
    {

      if ($("#viewsa_baltype").val()==null) {
        return false;
      }

      btyp = $("#viewsa_baltype").val();
    }


    if (($("#viewbalsht_viewbalsht_fromday").val()=="" || $("#viewbalsht_frommonth").val()=="" || $("#viewbalsht_fromyear").val()=="" || $("#viewbalsht_today").val()=="" || $("#viewbalsht_tomonth").val()=="" || $("#viewbalsht_toyear").val()=="")) {
      return false;
    }
    $.ajax(
      {
        type: "POST",
        url: "/showbalancesheetreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"balancesheettype":btyp,"calculateto":$("#viewbalsht_toyear").val()+"-"+$("#viewbalsht_tomonth").val()+"-"+$("#viewbalsht_today").val(),"orgtype":sessionStorage.orgt},
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
