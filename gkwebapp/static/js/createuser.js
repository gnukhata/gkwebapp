$(document).ready(function(){
  $("#adduser").validate({
    rules: {
  uesrpassword: "required",
  cnfpassword: {
    equalTo: "#password"
  }
}
});
var inselect = 0;
$("#userrole").focus(function(){
  inselect = 1;
});
$("input,select").keydown(function(e) {
  var n = $("input,select").length;
  var f = $('input,select');
  var s1 = $("#userrole option:selected").index();
  if (e.which == 13)
  {
    var nextIndex = f.index(this) + 1;
    if(nextIndex < n){
      e.preventDefault();
      f[nextIndex].focus();}
  }
  if (e.which == 38 && ((inselect == 1 && s1 == 0) || inselect == 0))
  {
    var prevIndex = f.index(this) - 1;
    if(prevIndex < n){
      e.preventDefault();
      f[prevIndex].focus();}
  }
  });
  $("#adduser").submit(function(e)
  {
    var isvalidate=$("#adduser").valid();
    if(isvalidate)
        {
          $.ajax(
            {
              type: "POST",
              url: "/createuser",
              global: false,
              async: false,
              datatype: "json",
              data: $("#adduser").serialize(),
              beforeSend: function(xhr)
              {
                xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
              },
              success: function(resp)
              {

                alert(resp["gkstatus"])
              }

            }
          );

          e.preventDefault();
        }
    e.preventDefault();
  }
);
});
