$(document).ready(function()
{
  $("#editaccountname").focus();
  $("#editaccountform").validate();
  $("#editaccountform").hide();
  $("#alertmsg").hide();
  $("#submit").hide();
  $("#delete").hide();
  $("#editaccountname").bind("change keyup", function()
  {
    var acccode = $("#editaccountname option:selected").val();
    var accname= $("#editaccountname option:selected").text();
    if(accname=="Closing Stock" || accname=="Stock at the Beginning" ||  accname=="Opening Stock" ||  accname=="Income & Expenditure" ||  accname=="Profit & Loss" )
        {
            $("#alertmsg").show();
            $("#delete").hide();

        }
        else
        {
          $("#alertmsg").hide();
          $("#delete").show();
        }
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
     {  if($("#editaccountname option:selected").text()=="Closing Stock" || $("#editaccountname option:selected").text()=="Stock at the Beginning" ||  $("#editaccountname option:selected").text()=="Opening Stock" ||  $("#editaccountname option:selected").text()=="Income & Expenditure" ||  $("#editaccountname option:selected").text()=="Profit & Loss" )
          {
              $("#alertmsg").show();
          }
        else
         {
           $("#submit").show();
           $("#alertmsg").hide();
           $("#editaccountname").hide();
           $("#accname").hide();
           $("#accountname").prop("disabled",false);
           $("#openingbal").prop("disabled", false);
           $("#accountname").focus().select();
        }
     }
    }

  });

$("#reset").click(function()
{
  $.ajax(
  {

  type: "POST",
  url: "/showeditaccount",
  global: false,
  async: false,
  datatype: "text/html",
  beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  success: function(resp)
  {
    $("#info").html(resp);
  }
  }
  );
}
);


$("#delete").click(function()
{
  var answer = confirm('Are you sure?');
  if (answer)
  {
      var code = $("#editaccountname option:selected").val();
      $.ajax(
      {

          type: "POST",
          url: "/deleteaccount",
          global: false,
          async: false,
          datatype: "json",
          data:{"accountcode":code},
          beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
          success: function(resp)
          {
            if(resp["gkstatus"])
            {
            alert("Account Deleted Successfully");
            $("#reset").click();
            }
            else
            {
              alert("Account Could Not Be Deleted");
            }
          }
      }
      );
    }
    else
    {
      $("#editaccountname").focus();
    }
}
);



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
              alert("Account Edited Successfully");
              $("#reset").click();
              }
              else
              {
                alert("Account Could Not Be Edited");
              }

            }

          }
        );
    }
    e.preventDefault();
});

});
