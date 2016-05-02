$(document).ready(function() {
  $("#vno").focus();
  $('.vdate').autotab('number');
  $('.dramt').numeric({ negative: false });
  $('.cramt').numeric({ negative: false });
  var drsum = 0;
  var crsum = 0;
  var diff = 0;

  $(document).off("change",".dramt").on("change", ".dramt", function() {
    drsum=0;
    $(".dramt").each(function(){
      drsum += +$(this).val();
      $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
    });
  });

  $(document).off("change",".cramt").on("change", ".cramt", function() {
    crsum=0;
    $(".cramt").each(function(){
      crsum += +$(this).val();
      $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
    });
  });

  $(document).off("click",".del").on("click", ".del", function() {
    $(this).closest('tr').fadeOut(200, function(){
            $(this).closest('tr').remove();
            drsum=0;
            crsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
            });
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
            });
            $('tbody tr:last input:enabled').focus();
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

  $('#vno').keyup(function(event) {
    if(event.which==13 && $('#vno').val()!=""){
      $('#vdate').select().focus();
    }
  });

  $('#vyear').keyup(function(event) {
    if(event.which==13 && $('#vyear').val()!=""){
      $('#vtable tbody tr:first td:eq(1) select').focus();
    }
  });

  $('#project').keyup(function(event) {
    if(event.which==13){
      $('#narration').select().focus();
    }
  });

  $('#narration').keydown(function(event) {
    if(event.which==13){
      $('#save').click();
      event.preventDefault();
    }
  });

  $(document).off("change",".crdr").on("change",".crdr",function(event)
  {
    var curindex = $(this).closest('tr').index();
    $('#vtable tbody tr:eq('+curindex+') input:disabled').val("0.00");
    $('#vtable tbody tr:eq('+curindex+') input:enabled').val("");
    $('#vtable tbody tr:eq('+curindex+') input').prop('disabled', function(i, v) { return !v; });
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
          $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty();
          for (i in accs ) {
            $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
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
          $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty();
          for (i in accs ) {
            $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
          }
        }
      });
    }
    drsum=0;
    $(".dramt").each(function(){
      drsum += +$(this).val();
      $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
    });
    crsum=0;
    $(".cramt").each(function(){
      crsum += +$(this).val();
      $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
    });
  });
  $(document).off("keyup",".accs").on("keyup",".accs",function(event){
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      $('#vtable tbody tr:eq('+curindex+') input:enabled').select().focus();
    }
  });

  $(document).off("keyup",".dramt").on("keyup",".dramt",function(event)
  {
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      if($('#vtable tbody tr:eq('+curindex+') td:eq(2) input:enabled').val()=="" || $('#vtable tbody tr:eq('+curindex+') td:eq(2) input:enabled').val()==0){
        return false;
      }
      var lastindex = $('#vtable tbody tr:last').index();
      if(drsum > crsum)
      {
        diff=drsum-crsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()==0 || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
            crsum=0;
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') input:enabled').select().focus();
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
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr" selected>Cr</option>'+
              '<option value="Dr">Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="0.00">'+
              '</td class="col-xs-1">'+
              '<td><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
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
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()==0 || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val(parseFloat(diff).toFixed(2));
            drsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') input:enabled').select().focus();
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
            data: {"type": $('#vtype').val(),"side":"Dr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr">Cr</option>'+
              '<option value="Dr" selected>Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(2) input:enabled').val(parseFloat(diff).toFixed(2));
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
        $("#project").focus();
      }
      curindex=null;
      lastindex=null;
    }
  });

  $(document).off("keyup",".cramt").on("keyup",".cramt",function(event)
  {
    if(event.which==13)
    {
      var curindex = $(this).closest('tr').index();
      if($('#vtable tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()=="" || $('#vtable tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()==0 || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
        return false;
      }
      var lastindex = $('#vtable tbody tr:last').index();
      if(drsum > crsum)
      {
        diff=drsum-crsum;
        if(curindex<lastindex)
        {
          var nxtindex = curindex+1
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()==0){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
            crsum=0;
            $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') input:enabled').select().focus();
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
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr" selected>Cr</option>'+
              '<option value="Dr">Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
              crsum=0;
              $(".cramt").each(function(){
                crsum += +$(this).val();
                $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
              });
              drsum=0;
              $(".dramt").each(function(){
                drsum += +$(this).val();
                $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
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
          if($('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()=="" || $('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()==0 || $('#vtable tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="NaN"){
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val(diff.toFixed(2));
            drsum=0;
            $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
            });
            $('#vtable tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
          }
          else{
            $('#vtable tbody tr:eq('+nxtindex+') input:enabled').select().focus();
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
            data: {"type": $('#vtype').val(),"side":"Dr"},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
            success: function(jsonObj) {
              var accs = jsonObj["accounts"];
              $('.table').append('<tr>'+
              '<td class="col-xs-1">'+
              '<select class="form-control input-sm crdr">'+
              '<option value="Cr">Cr</option>'+
              '<option value="Dr" selected>Dr</option>'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-4">'+
              '<select class="form-control input-sm accs">'+
              '</select>'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm dramt rightJustified" type="text" value="0.00">'+
              '</td>'+
              '<td class="col-xs-3">'+
              '<input class="form-control input-sm cramt rightJustified" type="text" value="" disabled>'+
              '</td>'+
              '<td class="col-xs-1"><a href="#" class="del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>'+
              '</tr>');
              for (i in accs ) {
                $('#vtable tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
              }
              $('#vtable tbody tr:last td:eq(1) select').focus();
              $('#vtable tbody tr:last td:eq(2) input:enabled').val(parseFloat(diff).toFixed(2));
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
        $("#project").focus();
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
      $('#vtable tbody tr:last input:enabled').focus()
      return false;
    }
    if ($('#drtotal').val()==0) {
      $("#zero-alert").alert();
      $("#zero-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#zero-alert").hide();
      });
      $("#vtable tbody tr:first input:enabled").focus();
      return false;
    }

    $("#vtable tbody tr").each(function() {
      var accountcode = $(".accs", this).val();
      var ccount=0;
      $("#vtable tbody tr").each(function() {
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
      $("#vtable tbody tr:first td:eq(1) select").focus();
      return false;
    }

    var output = [];
    $("#vtable tbody tr").each(function() {
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
      $("#vtable tbody tr:first input:enabled").focus();
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
    details.narration=$('#narration').val();
    details.vtype=$('#vtype').val();
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
          $('#voucher')[0].reset();
          drsum = 0;
          crsum = 0;
          diff = 0;
          $("#vtable tbody").find("tr:gt(1)").remove();
          $("#success-alert").alert();
          $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#success-alert").hide();
          });
        }
        else {
          $("#failure-alert").alert();
          $("#failure-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#failure-alert").hide();
          });
        }
        $('#vno').focus();
      }
    });
  });

  $('.close').click(function() {

    $(this).parent().hide();

  })
  $('#popup').click(function (e) {
    $.ajax(
      {
        type: "POST",
        url: "/accountpopup",
        global: false,
        async: false,
        datatype: "text/html",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
          $("#viewacc").html(resp);
          $('#m_accmodal').modal('show');
          $('#m_accmodal').on('shown.bs.modal', function (e)
          {
            $('#m_groupname').focus();
          });
          $('#m_accmodal').on('hidden.bs.modal', function (e)
          {
            $('#viewacc').html("");
            $(".accs").each(function(){
              var curindex = $(this).closest('tr').index();
              var tmp = $("#vtable tbody tr:eq("+curindex+") td:eq(1) select").val();
              if($("#vtable tbody tr:eq("+curindex+") td:eq(0) select").val()==="Cr"){
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
                    $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty();
                    for (i in accs ) {
                      if(accs[i].accountcode==tmp){
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '" selected>' +accs[i].accountname+ '</option>');
                      }
                      else {
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
                      }
                    }
                  }
                });
              }
              if($("#vtable tbody tr:eq("+curindex+") td:eq(0) select").val()==="Dr"){
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
                    $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').empty();
                    for (i in accs ) {
                      if(accs[i].accountcode==tmp){
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '" selected>' +accs[i].accountname+ '</option>');
                      }
                      else {
                        $('#vtable tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
                      }
                    }
                  }
                });
              }

            });
          });
        }
      }
    );
  });

  $('#reset').click(function(event) {
    $('#voucher')[0].reset();
    drsum = 0;
    crsum = 0;
    diff = 0;
    $("#vtable tbody").find("tr:gt(1)").remove();
    $('#vno').focus();
  });
});
