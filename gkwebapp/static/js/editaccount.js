$(document).ready(function()
{
  $('.modal-backdrop').remove();
  $("#editaccountname").focus();
  $("#editaccountform").validate();
  $("#editaccountform").hide();
  $("#alertmsg").hide();
  $("#submit").hide();
  $("#delete").hide();
  $("#editaccountname").bind("change keyup", function()
  {
    $("#alertmsg").hide();
    var acccode = $("#editaccountname option:selected").val();
    var accname= $("#editaccountname option:selected").text();
    if(accname=="Income & Expenditure" ||  accname=="Profit & Loss" )
    {
      $("#accnamenoedit").hide();
      $("#alertmsg").show();
      $("#delete").hide();
      $("#edit").hide();

    }
    else if(accname=="Closing Stock" || accname=="Stock at the Beginning" || accname=="Opening Stock"){
      $("#accnamenoedit").show();
      $("#alertmsg").hide();
      $("#delete").hide();
      $("#edit").show();
    }
    else
    {
      $("#accnamenoedit").hide();
      $("#alertmsg").hide();
      $("#delete").show();
      $("#edit").show();
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

  $("#edit").click(function(event)
  {
    event.preventDefault();
    var grpname= $("#groupname").val();

    $("#submit").show();
    $("#alertmsg").hide();
    $("#accname").hide();
    $("#edit").hide();
    var acccode = $("#editaccountname option:selected").val();
    var accname= $("#editaccountname option:selected").text();
    //$("#editaccountname").hide();
    if (accname=="Closing Stock" || accname=="Stock at the Beginning" || accname=="Opening Stock"){
      $("#accountname").prop("disabled", true);
      $("#openingbal").prop("disabled", false);
      $("#openingbal").focus().select();
    }
    else{
      if (grpname=="Direct Expense"|| grpname=="Direct Income"||grpname=="Indirect Expense"|| grpname=="Indirect Income") {
        $("#openingbal").prop("disabled", true);
      }
      else {
        $("#openingbal").prop("disabled", false);

      }
      $("#accountname").prop("disabled",false);
      $("#accountname").focus().select();

    }


  }
);

$("#editaccountname").keyup(function(e) {
  if($("#editaccountform").is(':visible'))
  {
    if(e.which == 13)
    {  if( $("#editaccountname option:selected").text()=="Income & Expenditure" ||  $("#editaccountname option:selected").text()=="Profit & Loss" )
    {
      $("#alertmsg").show();
    }
    else
    {
      $("#edit").click();
    }
  }
}

});

$("#accountname").keydown(function(event) {
  /* Act on the event */

  if (event.which==40)
  {

    $("#openingbal").select().focus();
  }
  if (event.which==13) {
    if (!$("#openingbal").is(':disabled')) {

      event.preventDefault();
      $("#openingbal").focus();
      $("#openingbal").select();
    }
  }
});

$("#openingbal").keydown(function(event) {
  /* Act on the event */

  if (event.which==38)
  {
    $("#accountname").select();
    $("#accountname").focus();
  }
});


$("#reset").click(function()
{
  $('#editaccount').click();
}
);



$(document).off("click","#delete").on("click", "#delete", function(event)
{
  event.preventDefault();
  $('#m_confirmdel').modal('show').one('click', '#accdel', function (e)
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
          if (resp["gkstatus"]==0) {
            $("#reset").click();
            $('.modal-backdrop').remove();
            $("#delsuccess-alert").alert();
            $("#delsuccess-alert").fadeTo(2000, 500).slideUp(500, function(){
              $("#delsuccess-alert").hide();
            });
          }
          else if (resp["gkstatus"]==5) {
            $("#transaction-alert").alert();
            $("#transaction-alert").fadeTo(2000, 500).slideUp(500, function(){
              $("#transaction-alert").hide();
            });
            $("#editaccountname").focus().select();
          }

        }
      }
    );

  });
  $('#m_confirmdel').on('shown.bs.modal', function(event) {
    $("#m_cancel").focus();
  });
}
);



$("#editaccountform").submit(function(e)
{

  if ($.trim($("#accountname").val())=="") {
    $("#blank-alert").alert();
    $("#blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#blank-alert").hide();
    });
    $("#accountname").focus().select();
    return false;
  };

  var ob = $('#openingbal').val();
  if(ob=="")
  {
    $('#openingbal').val("0.00");
  }
  else {
    openingbal=$("#openingbal").val();
  }
  var acccode = $("#editaccountname option:selected").val();
  var accname= $("#editaccountname option:selected").text();
  if(accname=="Closing Stock" || accname=="Stock at the Beginning"){
    accountname=accname;
  }
  else{
    accountname=$("#accountname").val();
  }
  accountcode = $("#accountcode").val();
  $.ajax(
    {
      type: "POST",
      url: "/editaccount",
      global: false,
      async: false,
      datatype: "json",
      data: {"accountname":accountname, "accountcode":accountcode, "openingbal":openingbal},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp)
      {
        if(resp["gkstatus"]==0)
        {
          $("#reset").click();
          $("#success-alert").alert();
          $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#success-alert").hide();
          });
        }
        else if(resp["gkstatus"]==1)
        {
          $("#duplicate-alert").alert();
          $("#duplicate-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#duplicate-alert").hide();
          });
          $("#accountname").focus().select();
        }
        else
        {
          $("#failure-alert").alert();
          $("#failure-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#failure-alert").hide();
          });
          $("#accountname").focus().select();
        }
      }
    }
  );

  e.preventDefault();
});

});
