$(document).ready(function()
{
  if (sessionStorage.booksclosedflag==1)
  {
    $(".closebooks").hide();
    $(".closebooks").remove();

  }
  else
  {
    $(".closebooks").show();
    $('.dis').attr('disabled', true);
  }




  $('.modal-backdrop').remove();
  $('.crdate').autotab('number');
  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#cbfromday").val(fromdatearray[2])
  $("#cbfrommonth").val(fromdatearray[1])
  $("#cbfromyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#cbtoday").val(todatearray[2])
  $("#cbtomonth").val(todatearray[1])
  $("#cbtoyear").val(todatearray[0])


  $("#rbfromday").val(fromdatearray[2])
  $("#rbfrommonth").val(fromdatearray[1])
  $("#rbfromyear").val(fromdatearray[0])

  $("#rbtoday").val(todatearray[2])
  $("#rbtomonth").val(todatearray[1])
  $("#rbtoyear").val(todatearray[0])


$("input:enabled:first").focus();
$(document).off("click","#closebooks").on("click", "#closebooks", function(event)
{

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

  $('#m_rollb').modal('show').one('click', '#m_remove', function (e)
  {

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

      $(".closebooks").remove();
      sessionStorage.booksclosedflag=1;
      sessionStorage.roflag=0;
      $(".dis").attr("disabled", false);
      $("#showclosebooks").click();

    }
    else {
      $("#booksnot-alert").alert();
      $("#booksnot-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#booksnot-alert").hide();
      });

    }
  });

});


});
$(document).off("click","#rollover").on("click", "#rollover", function(event)
{
  if ($.trim($("#rbfrom_day").val())==""||$.trim($("#rbfrom_month").val())==""||$.trim($("#rbfrom_year").val())==""||$.trim($("#rbto_day").val())==""||$.trim($("#rbto_month").val())==""||$.trim($("#rbto_year").val())=="")
  {
    $("#closebook-blank-alert").alert();
    $("#closebook-blank-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#closebook-blank-alert").hide();
    });

    return false;
  }
  $('#m_rollb').modal('show').one('click', '#m_remove', function (e)
  {

  $.ajax({
    url: '/rollover',
    type: 'POST',
    datatype: 'json',
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  })
  .done(function(jsonobj) {
    if (jsonobj["gkstatus"]==0) {

      $(".closebooks").remove();
      sessionStorage.booksclosedflag=1;
      sessionStorage.roflag=1;
      window.replace("/");

    }
    else {
      $("#booksnot-alert").alert();
      $("#booksnot-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#booksnot-alert").hide();
      });

    }
  });

});

});
$('#m_rollb').on('shown.bs.modal', function(event) {
  $("#m_cancel").focus();
});
});
