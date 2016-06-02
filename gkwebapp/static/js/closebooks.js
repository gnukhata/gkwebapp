$(document).ready(function()
{$('.modal-backdrop').remove();
$("#closebooks").click(function(event){
  event.preventDefault();
  if ($.trim($("#cbfromday").val())==""||$.trim($("#cbfrommonth").val())==""||$.trim($("#cbfromyear").val())==""||$.trim($("#cbtoday").val())==""||$.trim($("#cbtomonth").val())==""||$.trim($("#cbtoyear").val())=="") {
    $("#closebook-blank-alert").alert();
    $("#closebook-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#closebook-blank-alert").hide();
    });
    $("#cbfromday").focus();
    return false;
  }
  $('#m_close').modal('show')

});
$("#rollover").click(function(event){
  event.preventDefault();
  if ($.trim($("#rbfrom_day").val())==""||$.trim($("#rbfrom_month").val())==""||$.trim($("#rbfrom_year").val())==""||$.trim($("#rbto_day").val())==""||$.trim($("#rbto_month").val())==""||$.trim($("#rbto_year").val())=="") {
    $("#roll-blank-alert").alert();
    $("#roll-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#roll-blank-alert").hide();
    });
    $("#rbfrom_day").focus();
    return false;
  }
  $('#m_rollb').modal('show')
});
});
