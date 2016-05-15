$(document).ready(function()
{
  $("#org-name").keyup(function(e) {
    e.preventDefault();
    if (e.which == 13)
    {
      $("#finalyears").focus();

    }
  });

  $("#finalyears").keyup( function(e) {
    e.preventDefault();
    var s1 = $("#finalyears option:selected").index();
    if (e.which == 38 && s1 == 0)
    {
      $("#org-name").focus();
    }
    if (e.which == 13)
    {
      $("#callLogin").click();
    }
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
