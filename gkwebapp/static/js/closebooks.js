$(document).ready(function()
{
  $('.modal-backdrop').remove();
  $('.crdate').autotab('number');
  $('.dis').attr('disabled', true);
  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#cbfromday").val(fromdatearray[2])
  $("#cbfrommonth").val(fromdatearray[1])
  $("#cbfromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#cbtoday").val(todatearray[2])
  $("#cbtomonth").val(todatearray[1])
  $("#cbtoyear").val(todatearray[0])


$("input:enabled:first").focus();
$("#closebooks").click(function(event){
  event.preventDefault();
  $(".closebooks").attr("disabled",true)
  if ($.trim($("#cbfromday").val())==""||$.trim($("#cbfrommonth").val())==""||$.trim($("#cbfromyear").val())==""||$.trim($("#cbtoday").val())==""||$.trim($("#cbtomonth").val())==""||$.trim($("#cbtoyear").val())=="")
  {
    $("#closebook-blank-alert").alert();
    $("#closebook-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#closebook-blank-alert").hide();
    });
    $("#cbtoday").focus();
    return false;
  }
  var cbl= confirm("Are you sure?")
if (cbl) {
  $.ajax({
    url: '/closebooks',
    type: 'POST',
    datatype: 'json',
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  })
  .done(function(jsonobj) {
    if (jsonobj["gkstatus"]==0) {
      alert("booksclosed");
      $(".closebooks").remove();

    }
    else {
      $("#booksnot-alert").alert();
      $("#booksnot-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#booksnot-alert").hide();
      });

    }
  });

}


});
$("#rollover").click(function(event){

  if ($.trim($("#rbfrom_day").val())==""||$.trim($("#rbfrom_month").val())==""||$.trim($("#rbfrom_year").val())==""||$.trim($("#rbto_day").val())==""||$.trim($("#rbto_month").val())==""||$.trim($("#rbto_year").val())=="")
  {
    $("#roll-blank-alert").alert();
    $("#roll-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#roll-blank-alert").hide();
    });

    return false;
  }


});
});
