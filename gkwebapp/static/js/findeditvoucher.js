$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#searchby").focus();
  $('.vcdate').autotab('number');
  $(".vtp").hide();
  $(".vn").hide();
  $(".amt").hide();
  $(".vdate").hide();
  $(".nar").hide();
  $("#vct").hide();

  var fromdatearray = sessionStorage.yyyymmddyear1.split(/\s*\-\s*/g)
  $("#fday").val(fromdatearray[2])
  $("#fmonth").val(fromdatearray[1])
  $("#fyear").val(fromdatearray[0])
  var todatearray = sessionStorage.yyyymmddyear2.split(/\s*\-\s*/g)
  $("#tday").val(todatearray[2])
  $("#tmonth").val(todatearray[1])
  $("#tyear").val(todatearray[0])



  $("#vtype").keyup(function(event)
  {
    if (event.which==13)
    {
      $("#submit").click();
    }
  });


  $("#fday").keydown(function(event)
  {
    if (event.which==13)
    {
      event.preventDefault();
      $("#fmonth").focus();
      $("#fmonth").select();
    }
  });

  $("#fmonth").keydown(function(event)
  {
    if (event.which==13)
    {
      event.preventDefault();
      $("#fyear").focus();
      $("#fyear").select();
    }
  });

  $("#fyear").keydown(function(event)
  {
    if (event.which==13)
    {
      event.preventDefault();
      $("#tday").focus();
      $("#tday").select();
    }
  });

  $("#tday").keydown(function(event)
  {
    if (event.which==13)
    {
      event.preventDefault();
      $("#tmonth").focus();
      $("#tmonth").select();
    }
  });

  $("#tmonth").keydown(function(event)
  {
    if (event.which==13)
    {
      event.preventDefault();
      $("#tyear").focus();
      $("#tyear").select();
    }
  });


  $("#searchby").bind("change keyup",function(event) {


    var search = $("#searchby option:selected").val();

    if (search=="type")
    {
      $(".vtp").show();

      $(".vn").hide();
      $(".amt").hide();
      $(".vdate").hide();
      $(".nar").hide();

      if (event.which==13)
      {
        $("#vtype").focus();
      }

    }
    else if (search=="vnum")
    {
      $(".vn").show();

      $(".vtp").hide();
      $(".amt").hide();
      $(".vdate").hide();
      $(".nar").hide();

      if (event.which==13)
      {
        $("#vnum").focus();
      }

    }
    else if (search=="amount")
    {
      $(".vn").hide();
      $(".vtp").hide();
      $(".amt").show();

      $(".vdate").hide();
      $(".nar").hide();

      if (event.which==13)
      {
        $("#amount").focus();
      }

    }
    else if (search=="date")
    {
      $(".vn").hide();
      $(".vtp").hide();
      $(".amt").hide();
      $(".vdate").show();

      $(".nar").hide();

      if (event.which==13)
      {
        $("#fday").focus();
        $("#fday").select();
      }

    }

    else if (search=="narration")
    {
      $(".vn").hide();
      $(".vtp").hide();
      $(".amt").hide();
      $(".vdate").hide();
      $(".nar").show();


      if (event.which==13)
      {
        $("#narration").focus();

      }

    }



  });

  $("#narration").keydown(function(event) {
    if (event.which==13)
    {
      event.preventDefault();
      $("#submit").click();
    }
  });


  $("#reset").click(function()
  {
    $('#fevoucher').click();
  }
);


$("#findvoucher").submit(function(event) {



  var search = $("#searchby option:selected").val();
  if (search=="vnum")
  {
    if ($('#vnum').val()=="") {
      $("#vno-alert").alert();
      $("#novn").focus();
      $("#vno-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vno-alert").hide();
      });
      $('#vnum').focus();
      return false;
    }
  }
  else if (search=="amount")
  {
    if ($('#amount').val()=="") {
      $("#vamt-alert").alert();
      $("#noamt").focus();
      $("#vamt-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vamt-alert").hide();
      });
      $('#amount').focus();
      return false;
    }
  }
  else if (search=="date")
  {
    if ($('#fday').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#fday').focus();
      return false;
    }

    if ($('#fmonth').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#fmonth').focus();
      return false;
    }

    if ($('#fyear').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#fyear').focus();
      return false;
    }

    if ($('#tday').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#tday').focus();
      return false;
    }

    if ($('#tmonth').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#tmonth').focus();
      return false;
    }
    if ($('#tyear').val()=="") {
      $("#vdt-alert").alert();
      $("#nodt").focus();
      $("#vdt-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vdt-alert").hide();
      });
      $('#tyear').focus();
      return false;
    }

  }

  else if (search=="narration")
  {
    if ($('#narration').val()=="") {
      $("#vnar-alert").alert();
      $("#nonar").focus();
      $("#vnar-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vnar-alert").hide();
      });
      $('#narration').focus();
      return false;
    }

  }

  $("#vct").show();
  $(".table").empty();

  var search = $("#searchby option:selected").val();

  $.ajax({
    type: "POST",
    url: "/getvouchers",
    data: $("#findvoucher").serialize(),
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
    success: function(resp)
    {
      $("#vct").html(resp);

    }
  });
  event.preventDefault();
});


})
