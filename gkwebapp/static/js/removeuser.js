$(document).ready(function() {

  $("#username").focus();
  var username = $("username option:selected").val();

  $.ajax({
    type: "POST",
    url: "/removeuser",
    data: {"user":username},
    global: false,
    async: false,
    dataType: "json",
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    },
    success: function(jsonObj)
    {
      if (jsonObj["gkstatus"]==2)
      {
        $("#removeUserform").hide();
        $("#unauthorizedaccess").show();
      }
      else if(jsonObj["gkstatus"]==3){
        $("#removeUserform").hide();
        $("#connectionFailed").show();
      }
    }

  });

  $("#remove").click(function(event){
      alert("vjgjhdjdjf");
      event.preventDefault();
      var dialog = $('<p> Are you sure?').dialog({
        buttons: {
          "Yes": function(){
            $.ajax({
              type: "POST",
              url: "/deleteuser",
              global: false,
              async: false,
              datatype: "json",
              data: {"userid":userid}
              beforeSend: function(xhr)
              {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
              }
              success: function(resp)
              {
                if (resp["gkstatus"]==0){
                $("#removeuser").click();
                $("#remsuccess-alert").alert();
                $("#remsuccess-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#remsuccess-alert").hide();
              });
              }
              else if (resp["gkstatus"]==4) {
                $("#accessdenied-alert").alert();
                $("#accessdenied-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#accessdenied-alert").hide();
                });
                $("#username").focus();
              }
              else if (resp["gkstatus"]==5) {
                $("#actiondisallowed-alert").alert();
                $("#actiondisallowed-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#actiondisallowed-alert").hide();
                });
                $("#username").focus();
              }
              else if (resp["gkstatus"]==3) {
                $("#connectionfailed-alert").alert();
                $("#connectionfailed-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#connectionfailed-alert").hide();
                });
                $("#username").focus();
              }

              }
            });
          }
          "No": function (){
            dialog.dialog('close');
            $("#username").focus();
          }
        }
      })



    });


});
