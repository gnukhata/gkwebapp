$(document).ready(function()
{
  var inselect=0;
  $("#callLogin").hide();
  $("#finalyears").focus(function(){
    inselect = 1;
    if($("#finalyears").val())
    {
      $("#callLogin").show();
    }
  });
  $("#finalyears").blur(function(){
    inselect = 0;
  });
  $("#org-name").bind("change keyup", function(){
    var org = $("#org-name option:selected").val();
    var orgobj = eval('('+org+')');
    $.ajax({
      type: "POST",
      url: "/yearcode",
      data: orgobj,
      global: false,
      async: false,
      dataType: "json",
      success: function(jsonObj) {
        ListofYears = jsonObj["gkresult"],
        $('#finalyears').empty();
        for (i in ListofYears ) {
          $('#finalyears').append('<option value="' + ListofYears[i].orgcode + '">' + ListofYears[i].yearstart+' to '+ListofYears[i].yearend + '</option>');
        }
      }

    });
  });

  $('input:text,select,button').bind("keydown", function(e) {
    var n = $("input:text,select,button").length;
    var f = $('input:text,select,button');
    if (e.which == 13)
    {
      var nextIndex = f.index(this) + 1;
      if(nextIndex < n){
        e.preventDefault();
        f[nextIndex].focus();}

      }
    });

  $('input:text,select,button').bind("keydown", function(e) {
    var n = $("input:text,select,button").length;
    var f = $('input:text,select,button');
    var s = $("#finalyears option:selected").index();
    if ((e.which == 38 && inselect == 1 && s == 0) || (e.which == 38 && inselect == 0))
    {
      var prevIndex = f.index(this) - 1;
      if(prevIndex < n){
        e.preventDefault();
        f[prevIndex].focus();}
    }
    });

  $("#callLogin").click(function(event){
    event.preventDefault();

    var orgcode = $("#finalyears option:selected").val();
          $("#selectorg").load("/login?orgcode="+ orgcode );

    var financialyears = $("#finalyears option:selected").html();
    var org = $("#org-name option:selected").val();
    var orgobj = eval('('+org+')');
    var oname = orgobj.orgname;
    var otype = orgobj.orgtype;
    var syear = financialyears[6]+financialyears[7]+financialyears[8]+financialyears[9];
    var eyear = financialyears[22]+financialyears[23];
    sessionStorage.setItem('orgn', oname);
    sessionStorage.setItem('orgt', otype);
    sessionStorage.setItem('year1', syear);
    sessionStorage.setItem('year2', eyear);

  });
});
