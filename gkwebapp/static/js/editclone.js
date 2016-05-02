$(document).ready(function()
{
  $("#vctable").hide();
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


  var demodrsum = 0;
  var democrsum = 0;
  var drsum = 0;
  var crsum = 0;

  $(".demodramt").each(function()
  {
    demodrsum += +$(this).val();
    $('#demovctable tfoot tr:last td:eq(1) input').val(parseFloat(demodrsum).toFixed(2));
  });

  $(".democramt").each(function(){
    democrsum += +$(this).val();
    $('#demovctable tfoot tr:last td:eq(2) input').val(parseFloat(democrsum).toFixed(2));
  });


  $(".dramt").each(function()
  {
    drsum += +$(this).val();
    $('#vctable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
  });

  $(".cramt").each(function(){
    crsum += +$(this).val();
    $('#vctable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
  });



  $("#demovctable").find("input,select,textarea,button").prop("disabled",true);
  $("#vno").prop('disabled', true);
  $(".vdate").prop('disabled', true);
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
var ecflag;
  $("#edit").click(function(event)
  {
    ecflag="edit";
    $("#save").show();
    $("#lock").hide();
    $("#edit").hide();
    $("#clone").hide();
    $("#vno").prop('disabled', true);
    $(".ttl").prop('disabled', true);
    $(".vdate").prop('disabled', false);
    $("#vdate").focus().select();
    $("#vctable").show();
    $("#demovctable").hide();

  });

  $("#clone").click(function(event)
  {
    ecflag="clone";
    $("#lock").hide();
    $("#clone").hide();
    $("#edit").hide();
    $(".ttl").prop('disabled', true);
    $("#save").show();
    $("#vno").prop('disabled', false);
    $("#vno").focus().select();
    $("#vctable").show();
    $("#demovctable").hide();
    $(".vdate").prop('disabled', false);
  });



  $('.vdate').autotab('number');



  var diff = 0;

  $(document).off("change",".dramt").on("change", ".dramt", function() {
    drsum=0;
    $(".dramt").each(function(){
      drsum += +$(this).val();
      $('#vctable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
    });
  });

  $(document).off("change",".cramt").on("change", ".cramt", function() {
    crsum=0;
    $(".cramt").each(function(){
      crsum += +$(this).val();
      $('#vctable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
    });
  });

  $(document).off("click",".del").on("click", ".del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();
      drsum=0;
      crsum=0;
      $(".dramt").each(function(){
        drsum += +$(this).val();
        $('#vctable tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
      });
      $(".cramt").each(function(){
        crsum += +$(this).val();
        $('#vctable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
      });
      $('#vctable tbody tr:last input:enabled').focus();
    });
  });


  $(document).off("focusout",".dramt").on("focusout",".dramt",function(event)
  {
    if ($.trim($(this).val())=="" || $.trim($(this).val())==".") {
      $(this).val("0.00");
    }
    else{
      $(this).val((parseFloat($(this).val()).toFixed(2)));
    }
  });

  $(document).off("focusout",".cramt").on("focusout",".cramt",function(event)
  {
    if ($(this).val()=="" || $.trim($(this).val())==".") {
      $(this).val("0.00");
    }
    else{
      $(this).val((parseFloat($(this).val()).toFixed(2)));
    }
  });

  $('#vno').keydown(function(event) {
    if(event.which==13 && $('#vno').val()!=""){
      $('#vdate').select().focus();
    }
  });

  $('#vyear').keyup(function(event) {
    if(event.which==13 && $('#vyear').val()!=""){
      $('#vctable tbody tr:first td:eq(1) select').focus();
    }
  });

  $('#project').keyup(function(event) {
    if(event.which==13){
      $('#narr').select().focus();
    }
  });

  $('#narr').keydown(function(event) {
    if(event.which==13){
      $('#save').click();
      event.preventDefault();
    }
  });

  $(document).off("change",".crdr").on("change",".crdr",function(event)
  {
    var curindex = $(this).closest('tr').index();
    $('#vctable tbody tr:eq('+curindex+') input:disabled').val("0.00");
    $('#vctable tbody tr:eq('+curindex+') input:enabled').val("");
    $('#vctable tbody tr:eq('+curindex+') input').prop('disabled', function(i, v) { return !v; });
    if($(this).val()=="Cr"){
      $.ajax({
        url: '/getcjaccounts',
        type: 'POST',
        dataType: 'json',
        data: {"type": $('#vtype').val(),"side":"Cr"},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(jsonObj) {
          var accs = jsonObj["accounts"];
          $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').empty();
          for (i in accs ) {
            $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
          }
        }
      });
    }
    if($(this).val()=="Dr"){
      $.ajax({
        url: '/getcjaccounts',
        type: 'POST',
        dataType: 'json',
        data: {"type": $('#vtype').val(),"side":"Dr"},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(jsonObj) {
          var accs = jsonObj["accounts"];
          $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').empty();
          for (i in accs ) {
            $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
          }
        }
      });
    }
    drsum=0;
    $(".dramt").each(function(){
      drsum += +$(this).val();
      $('#vctable tfoot tr:last td:eq(1) input').val(drsum.toFixed(2));
    });
    crsum=0;
    $(".cramt").each(function(){
      crsum += +$(this).val();
      $('#vctable tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
    });
  });
  $(document).off("keyup",".accs").on("keyup",".accs",function(event){
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      $('#vctable tbody tr:eq('+curindex+') input:enabled').select().focus();
    }
  });

  $(document).off("keyup",".crdr").on("keyup",".crdr",function(event)
  {
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      $('#vctable tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
  });

  $(document).off("keyup",".dramt").on("keyup",".dramt",function(event)
  {
    $('.dramt').numeric({ negative: false });
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      if($('#vctable tbody tr:eq('+curindex+') td:eq(2) input:enabled').val()=="" || $('#vctable tbody tr:eq('+curindex+') td:eq(2) input:enabled').val()==0){
        return false;
      }
      var lastindex = $('#vctable tbody tr:last').index();
      if(drsum > crsum)
      {
        diff=drsum-crsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="" || $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()==0 || $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
            crsum=0;
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
            });
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            $("#project").focus();
            return false;
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Cr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('#vctable').append('<tr>'+
              '<td>'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr" selected>Cr</option>'+
              '<option value="Dr">Dr</option>'+
              '</select>'+
              '</td>'+
              '<td>'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td>'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td>'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vctable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vctable tbody tr:last td:eq(1) select').focus();
              $('#vctable tbody tr:last td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
              crsum=0;
              $(".cramt").each(function(){
                crsum += +$(this).val();
                $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
              });
            }
          });

        }

      }
      else if(drsum < crsum)
      {
        diff=crsum-drsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vctable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()=="" || $('#vctable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()==0 || $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val(parseFloat(diff).toFixed(2));
            drsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
            });
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Dr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('#vctable').append('<tr>'+
              '<td>'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr">Cr</option>'+
              '<option value="Dr" selected>Dr</option>'+
              '</select>'+
              '</td>'+
              '<td>'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td>'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td>'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vctable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vctable tbody tr:last td:eq(1) select').focus();
              $('#vctable tbody tr:last td:eq(2) input:enabled').val(parseFloat(diff).toFixed(2));
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
              });
            }
          });

        }

      }
      else {
        if (curindex<lastindex)
        {
          var nxtindex = curindex+1;
          $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
        }
        else
        {
          $("#project").focus();
        }
      }
      curindex=null;
      lastindex=null;
    }
  });

  $(document).off("keyup",".cramt").on("keyup",".cramt",function(event)
  {
      $('.cramt').numeric({ negative: false });
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      if($('#vctable tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()=="" || $('#vctable tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()==0 || $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
        return false;
      }
      var lastindex = $('#vctable tbody tr:last').index();
      if(drsum > crsum)
      {
        diff=drsum-crsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="" || $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()==0){
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
            crsum=0;
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
            });
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          if((diff).toFixed(2)==0){
            $("#project").focus();
            return false;
          }
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Cr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('#vctable').append('<tr>'+
              '<td>'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr" selected>Cr</option>'+
              '<option value="Dr">Dr</option>'+
              '</select>'+
              '</td>'+
              '<td>'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td>'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td>'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vctable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vctable tbody tr:last td:eq(1) select').focus();
              $('#vctable tbody tr:last td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
              crsum=0;
              $(".cramt").each(function(){
                crsum += +$(this).val();
                $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
              });
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('tfoot tr:last td:eq(1) input').val(drsum.toFixed(2));
              });
            }
          });

        }

      }
      else if(drsum < crsum)
      {
        diff=crsum-drsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vctable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()=="" || $('#vctable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()==0 || $('#vctable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val(diff.toFixed(2));
            drsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(drsum.toFixed(2));
            });
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
          }
        }
        else {
          $.ajax({
            url: '/getcjaccounts',
            type: 'POST',
            dataType: 'json',
            data: {"type": $('#vtype').val(),"side":"Dr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('#vctable').append('<tr>'+
              '<td>'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr">Cr</option>'+
              '<option value="Dr" selected>Dr</option>'+
              '</select>'+
              '</td>'+
              '<td>'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td>'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td>'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vctable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vctable tbody tr:last td:eq(1) select').focus();
              $('#vctable tbody tr:last td:eq(2) input:enabled').val(diff.toFixed(2));
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('tfoot tr:last td:eq(1) input').val(drsum.toFixed(2));
              });
            }
          });
        }

      }
      else {
        if (curindex<lastindex)
        {
          var nxtindex = curindex+1;
          $('#vctable tbody tr:eq('+nxtindex+') td:eq(1) select').select().focus();
        }
        else
        {
          $("#project").focus();
        }
      }
    }
  });

  $('#save').click(function(event) {
    var allow = true;
    if ($('#vno').val()=="") {
      $("#vno-alert").alert();
      $("#vno-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vno-alert").hide();
      });
      $('#vno').focus();
      return false;
    }
    if ($('#vdate').val()=="" || $('#vmonth').val()=="" || $('#vyear').val()=="") {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#date-alert").hide();
      });
      $('#vdate').focus();
      return false;
    }
    if ($('#drtotal').val()!=$('#crtotal').val()) {
      $("#balance-alert").alert();
      $("#balance-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#balance-alert").hide();
      });
      $('#vctable tbody tr:last input:enabled').focus()
      return false;
    }
    if ($('#drtotal').val()==0) {
      $("#zero-alert").alert();
      $("#zero-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#zero-alert").hide();
      });
      $("#vctable tbody tr:first input:enabled").focus();
      return false;
    }

    $("#vctable tbody tr").each(function() {
      var accountcode = $(".accs", this).val();
      var ccount=0;
      $("#vctable tbody tr").each(function() {
        if(accountcode==$(".accs", this).val()){
          ccount =ccount +1;
        }
      });
      if (ccount>1) {
        allow= false;
        return false;
      }
    });

    if(!allow){
      $("#accs-alert").alert();
      $("#accs-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#accs-alert").hide();
      });
      $("#vctable tbody tr:first td:eq(1) select").focus();
      return false;
    }

    var output = [];
    $("#vctable tbody tr").each(function() {
      if ($(".cramt", this).val()==0 && $(".dramt", this).val()=="" || $(".cramt", this).val()=="" && $(".dramt", this).val()==0 ) {
        allow= false;
        return false;
      }
      var obj = {};
      obj.side=$('.crdr',this).val();
      obj.accountcode = $(".accs", this).val();
      obj.cramount = $(".cramt", this).val();
      obj.dramount = $(".dramt", this).val();
      output.push(obj);
    });
    if(!allow){
      output.length = 0;
      $("#vctable tbody tr:first input:enabled").focus();
      $("#zerorow-alert").alert();
      $("#zerorow-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#zerorow-alert").hide();
      });
      return false;
    }
    var details = {}
    details.vno=$('#vno').val();
    details.vdate=$('#vyear').val()+"-"+$('#vmonth').val()+"-"+$('#vdate').val();
    details.projectcode=$('#project').val();
    details.narration=$('#narr').val();
    details.vtype=$('#vtype').val();
    var answer = confirm('Are you sure?');

    if(answer)
    {
      if(ecflag=="clone")
      {

        $.ajax({
        type: "POST",
        url: "/addvoucher",
        global: false,
        async: false,
        datatype: "json",
        data: {"vdetails":JSON.stringify(details),"transactions":JSON.stringify(output)},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          if(resp.gkstatus){

            $('#myModal').modal('hide');
          }
          else {
            $("#failure-alert").alert();
            $("#nt").append('Cloned')
            $("#failure-alert").fadeTo(2000, 500).slideUp(500, function(){
              $("#failure-alert").hide();
            });
          }

        }
      });
    }
    else if (ecflag=="edit")
    {

      details.vcode=$('#vcode').val();
      $.ajax({
      type: "POST",
      url: "/editvoucher",
      global: false,
      async: false,
      datatype: "json",
      data: {"vdetails":JSON.stringify(details),"transactions":JSON.stringify(output)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp)
      {
        if(resp.gkstatus){

          $('#myModal').modal('hide');
        }
        else {
          $("#failure-alert").alert();
          $("#nt").append('Edited')
          $("#failure-alert").fadeTo(2000, 500).slideUp(500, function(){

            $("#failure-alert").hide();
          });
        }

      }
    });
    }
    }

  });

  $('.close').click(function() {

    $(this).parent().hide();

  })






});
