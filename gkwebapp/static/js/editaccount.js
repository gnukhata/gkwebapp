$(document).ready(function()
{
  $("#editaccountform").validate();
  $("#editaccountform").hide();

  $("#editaccountname").bind("change keyup", function()
  {
    var acccode = $("#editaccountname option:selected").val();

    $.ajax({
            type: "POST",
            url: "/getaccdetails",
            data: {"accountcode":acccode},
            global: false,
            async: false,
            dataType: "json",
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj)
            {
              accdetails=jsonObj["gkresult"];
              $("#editaccountform").show();

              $("#groupname").val(accdetails["groupname"]);
              $("#groupname").prop("disabled", true);
              $("#subgroupname").val(accdetails["subgroupname"]);
              $("#subgroupname").prop("disabled", true);
              $("#accountname").val(accdetails["accountname"]);
              $("#accountname").prop("disabled", true);
              $("#openingbal").val(accdetails["openingbal"]);
              $("#openingbal").prop("disabled", true);
              $("#accountcode").val(accdetails["accountcode"]);
            }
          });
  });

  $("#editaccountname").keypress(function(e) {
    if($("#editaccountform").is(':visible'))
    {
      if(e.which == 13)
     {
       $("#editaccountname").hide();
       $("#accname").hide();
       $("#accountname").prop("disabled",false);
       $("#openingbal").prop("disabled", false);
       $("#accountname").focus(function() { $(this).select(); } );
     }
    }

  });

$("#editaccountform").submit(function(e)
{
    var isvalidate=$("#editaccountform").valid();
    if(isvalidate)
    {
        var ob = $('#openingbal').val();
        if(ob=="")
        {
          $('#openingbal').val("0.00");
        }
        $.ajax(
          {

            type: "POST",
            url: "/editaccount",
            global: false,
            async: false,
            datatype: "json",
            data: $("#editaccountform").serialize(),
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(resp)
            {
              if(resp["gkstatus"])
              {
              alert(resp["gkstatus"]);
              }
              else
              {
                alert(resp["gkstatus"]);
              }

            }

          }
        );
    }
    e.preventDefault();
});

});
