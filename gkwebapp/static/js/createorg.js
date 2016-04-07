$(document).ready(function()
{

$('input:text:first,select').focus();

$('input:text,select').bind("keydown", function(e) {
  var n = $("input:text,select").length;
  var f = $('input:text,select');
  if (e.which == 13)
  {

    var nextIndex = f.index(this) + 1;
    if(nextIndex < n){
      e.preventDefault();
      f[nextIndex].focus();}

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
    $("#btnsubmit").focus();
    });

$("#btnsubmit").click(function(event){
      event.preventDefault();
      var orgname = $("#orgname").val().replace(/\s/g, "+");

      var orgtype = $("#orgtype option:selected").val().replace(/\s/g, "+");
      var fdate = $("#fromyear").val()+"-"+$("#frommonth").val()+"-"+$("#fromday").val();
      var tdate = $("#toyear").val()+"-"+$("#tomonth").val()+"-"+$("#today").val();
      var financialyears = fdate+tdate;
      var oname = $("#orgname").val();
      var otype = $("#orgtype option:selected").val();
      var syear = financialyears[0]+financialyears[1]+financialyears[2]+financialyears[3];
      var eyear = financialyears[10]+financialyears[11]+financialyears[12]+financialyears[13];
      sessionStorage.setItem('orgn', oname);
      sessionStorage.setItem('orgt', otype);
      sessionStorage.setItem('year1', syear);
      sessionStorage.setItem('year2', eyear);
      //alert("orgname="+orgname+"&orgtype="+orgtype+"&fdate="+fdate+"&tdate="+tdate);

      $("#createorg").load("/createadmin?orgname="+orgname+"&orgtype="+orgtype+"&fdate="+fdate+"&tdate="+tdate );

    });
  });
