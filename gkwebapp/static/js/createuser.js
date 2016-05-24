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
  if (e.which == 38 && ((inselect == 1 && s1 == 1) || inselect == 0))
  {
    var prevIndex = f.index(this) - 1;
    if(prevIndex < n){
      e.preventDefault();
      f[prevIndex].focus();}
  }
  });
  $("#adduser").submit(function(e)
  {
    if ($.trim($("#name").val())=="") {
      $("#username-blank-alert").alert();
      $("#username-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#username-blank-alert").hide();
      });
      $("#name").focus();
      return false;
    }
    if ($.trim($("#password").val())=="") {
      $("#password-blank-alert").alert();
      $("#password-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#password-blank-alert").hide();
      });
      $("#password").focus();
      return false;
    }
    if ($.trim($("#confirm_password").val())=="") {
      $("#cnfpass-blank-alert").alert();
      $("#cnfpass-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#cnfpass-blank-alert").hide();
      });
      $("#confirm_password").focus();
      return false;
    }
    if ($.trim($("#userrole").val())=="") {
      $("#role-blank-alert").alert();
      $("#role-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#role-blank-alert").hide();
      });
      $("#userrole").focus();
      return false;
    }
    if ($.trim($("#question").val())=="") {
      $("#secque-blank-alert").alert();
      $("#secque-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#secque-blank-alert").hide();
      });
      $("#question").focus();
      return false;
    }
    if ($.trim($("#answer").val())=="") {
      $("#secans-blank-alert").alert();
      $("#secans-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#secans-blank-alert").hide();
      });
      $("#answer").focus();
      return false;
    }
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
                if(resp["gkstatus"]==0)
                {
                  $('#adduser')[0].reset();
                  $("#name").focus();
                  $("#success-blank-alert").alert();
                  $("#success-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
                    $("#success-blank-alert").hide();
                  });
                }
                if(resp["gkstatus"]==1)
                {
                  $("#name").focus();
                  $("#DuplicateEntry-blank-alert").alert();
                  $("#DuplicateEntry-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
                    $("#DuplicateEntry-blank-alert").hide();
                  });
                }
                if(resp["gkstatus"]==4)
                {
                  $('#adduser')[0].reset();
                  $("#name").focus();
                  $("#BadPrivilege-blank-alert").alert();
                  $("#BadPrivilege-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
                    $("#BadPrivilege-blank-alert").hide();
                  });
                }
              }

            }
          );

          e.preventDefault();
  }
);
});
