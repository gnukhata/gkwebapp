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

$("#btnsubmit").click(function(event){
      event.preventDefault();
      var orgname = $("#orgname").val().replace(/\s/g, "+");

      var orgtype = $("#orgtype option:selected").val().replace(/\s/g, "+");
      var fdate = $("#fromyear").val()+"-"+$("#frommonth").val()+"-"+$("#fromday").val();
      var tdate = $("#toyear").val()+"-"+$("#tomonth").val()+"-"+$("#today").val();
      //alert("orgname="+orgname+"&orgtype="+orgtype+"&fdate="+fdate+"&tdate="+tdate);

      $("#createorg").load("/createadmin?orgname="+orgname+"&orgtype="+orgtype+"&fdate="+fdate+"&tdate="+tdate );

    });
  });
