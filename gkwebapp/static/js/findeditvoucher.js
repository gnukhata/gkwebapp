$(document).ready(function() {
$("#searchby").focus();
$('.vdate').autotab('number');
$(".vtp").hide();
$(".vno").hide();
$(".amt").hide();
$(".vdate").hide();
$(".nar").hide();

$("#searchby").bind("change keyup",function(event) {

  var search = $("#searchby option:selected").val();
  if (search=="type")
  {
    $(".vtp").show();
    $(".vno").hide();
    $(".amt").hide();
    $(".vdate").hide();
    $(".nar").hide();

  }
  else if (search=="vnum")
  {
    $(".vno").show();
    $(".vtp").hide();
    $(".amt").hide();
    $(".vdate").hide();
    $(".nar").hide();

  }
  else if (search=="amount")
  {
    $(".vno").hide();
    $(".vtp").hide();
    $(".amt").show();
    $(".vdate").hide();
    $(".nar").hide();

  }
  else if (search=="date")
  {
    $(".vno").hide();
    $(".vtp").hide();
    $(".amt").hide();
    $(".vdate").show();
    $(".nar").hide();

  }

  else if (search=="narration")
  {
    $(".vno").hide();
    $(".vtp").hide();
    $(".amt").hide();
    $(".vdate").hide();
    $(".nar").show();

  }



});

$("#submit").click(function(event) {
var search = $("#searchby option:selected").val();
$.ajax({
        type: "POST",
        url: "/getvouchers",
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

        }
      });
});


})
