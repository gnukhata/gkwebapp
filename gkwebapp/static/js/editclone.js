$(document).ready(function()
{

$("#save").hide();

  if ($("#urole").val()!="-1")
  {
    $("#lock").hide();

    if ($("#lock").html()=="Unlock")
    {
      $("#edit").attr("disabled", "disabled");
      $("#clone").attr("disabled", "disabled");

    }

  }


  var drsum = 0;
  var crsum = 0;

  $(".dramt").each(function()
  {
    drsum += +$(this).val();
    $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
  });

  $(".cramt").each(function(){
    crsum += +$(this).val();
    $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
  });

  $('#viewvoucher').find('input, textarea, select').attr('disabled','disabled');

  $("#lock").click(function(event)
  {

    var id = $("#vcode").val();

    if($("#lock").html()=="Unlock")
    {

      var  vstatus = "False";

    }
    else
    {

      var  vstatus = "True";
    }
    alert(id);
    $.ajax({
      type: "POST",
      url: "/lockvoucher",
      data: {"id":id,"vstatus":vstatus},
      global: false,
      async: false,
      dataType: "json",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(jsonObj)
      {
        gkstatus=jsonObj["gkstatus"]
        if(gkstatus)
        {
          if ($("#lock").html()=="Unlock")
          {
            $("#lock").html("Lock");
          }
          else
          {
            $("#lock").html("Unlock");
          }
        }
      }
    });

  });


});
