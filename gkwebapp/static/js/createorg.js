$(document).ready(function()
{
  $('#orgname').focus();
  var sel1 = 0;
  var sel2 = 0;
  $("#orgcase").focus(function(){
    sel1 = 1;
  });
  $("#orgcase").blur(function(){
    sel1 = 0;
  });
  $("#orgtype").focus(function(){
    sel2 = 1;
  });
  $("#orgtype").blur(function(){
    sel2 = 0;
  });
  var forname = "";
  $("#orgname").focusout(function(){
    forname = $("#orgname").val();
  });

  $('.vdate').autotab('number');
  $('input:text,select').keydown( function(e) {
    var n = $("input:text,select").length;
    var f = $('input:text,select');
    if (e.which == 13)
    {

      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        e.preventDefault();
        f[nextIndex].focus();}

      }

      var s1 = $("#orgcase option:selected").index();
      var s2 = $("#orgtype option:selected").index();
      if ((e.which == 38 && sel1 == 1 && s1 == 0) || (e.which == 38 && sel2 == 1 && s2 == 0) || (e.which == 38 && (sel1 == 0 && sel2==0)))
      {
        var prevIndex = f.index(this) - 1;
        if(prevIndex < n){
          e.preventDefault();
          f[prevIndex].focus();}
        }
      });


      $("#orgcase").bind("change keyup", function(e){
        var ocase = $("#orgcase option:selected").val();
        var oname = "";
        if(ocase == "As-Is")
        {
          sessionStorage.setItem('orgn', forname);
          $("#orgname").val(forname);
        }
        if(ocase == "Upper Case")
        {
          oname = forname.toUpperCase();
          $("#orgname").val(oname);
          sessionStorage.setItem('orgn', oname);
        }
        if(ocase == "Lower Case")
        {
          oname = forname.toLowerCase();
          $("#orgname").val(oname);
          sessionStorage.setItem('orgn', oname);
        }
        if(ocase == "Title Case")
        {
          oname = (forname[0].toUpperCase())+(forname.substr(1).toLowerCase())
          $("#orgname").val(oname);
          sessionStorage.setItem('orgn', oname);
        }
      });

      $("#fromyear").blur(function(){
        var startday = $("#fromday").val();
        var startmonth = $("#frommonth").val();
        var startyear = $("#fromyear").val();
        var startdate = startday+startmonth+startyear;
        var enddate = Date.parseExact(startdate, "ddMMyyyy").add({days: -1, years: 1}).toString("ddMMyyyy");
        var endday = enddate[0]+enddate[1];
        var endmonth = enddate[2]+enddate[3];
        var endyear = enddate[4]+enddate[5]+enddate[6]+enddate[7];
        $("#today").val(endday);
        $("#tomonth").val(endmonth);
        $("#toyear").val(endyear);
      });

      $("#btnsubmit").click(function(event){
        event.preventDefault();
        var orgname = $("#orgname").val().replace(/\s/g, "+");
        var orgtype = $("#orgtype option:selected").val().replace(/\s/g, "+");
        var fdate = $("#fromyear").val()+"-"+$("#frommonth").val()+"-"+$("#fromday").val();
        var tdate = $("#toyear").val()+"-"+$("#tomonth").val()+"-"+$("#today").val();
        var financialyears = fdate+tdate;
        var otype = $("#orgtype option:selected").val();
        var syear = financialyears[0]+financialyears[1]+financialyears[2]+financialyears[3];
        var eyear = financialyears[12]+financialyears[13];
        sessionStorage.setItem('orgt', otype);
        sessionStorage.setItem('year1', syear);
        sessionStorage.setItem('year2', eyear);
        //alert("orgname="+orgname+"&orgtype="+orgtype+"&fdate="+fdate+"&tdate="+tdate);

        $("#createorg").load("/createadmin?orgname="+orgname+"&orgtype="+orgtype+"&fdate="+fdate+"&tdate="+tdate );

      });
    });
