$(document).ready(function()
{
$("#username").focus();
$('input:not(:hidden),select,button').bind("keydown", function(e) {
  var n = $("input:not(:hidden),select,button").length;
  var f = $('input:not(:hidden),select,button');
  if (e.which == 13)
  {
    var nextIndex = f.index(this) + 1;
    if(nextIndex < n){
      e.preventDefault();
      f[nextIndex].focus();}

    }
  });
  $('input:not(:hidden),select,button').bind("keydown", function(e) {
    var n = $("input:not(:hidden),select,button").length;
    var f = $('input:not(:hidden),select,button');
    if (e.which == 38)
    {
      var prevIndex = f.index(this) - 1;
      if(prevIndex > 0){
        e.preventDefault();
        f[prevIndex].focus();}

      }
    });
$("#loginform").submit(function(e)
{

    $.ajax(
    {
    //alert("starting ajax");
    type: "POST",
    url: "/createorglogin",
    global: false,
    async: false,
    datatype: "json",
    data: $("#loginform").serialize(),
    success: function(resp)
    {
    var gt = resp['gktoken'];

    sessionStorage.gktoken = gt;

    window.location= "/showmainshell";
    }

    }
    );

    e.preventDefault();
}
);
}
);
