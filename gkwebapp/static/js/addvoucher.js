$(document).ready(function() {
  $("#vno").focus();
  $('.vdate').autotab('number');

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

$(document).off("focusout",".dramt").on("focusout",".dramt",function(event)
{
  $(this).val((parseFloat($(this).val()).toFixed(2)));
});

$(document).off("focusout",".cramt").on("focusout",".cramt",function(event)
{
  $(this).val((parseFloat($(this).val()).toFixed(2)));
});

$('#vno').keyup(function(event) {
  if(event.which==13 && $('#vno').val()!=""){
    $('#vdate').select().focus();
  }
});

$('#vyear').keyup(function(event) {
  if(event.which==13 && $('#vyear').val()!=""){
    $('tbody tr:first td:eq(1) select').focus();
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
  $('tbody tr:eq('+curindex+') input:disabled').val("0.00");
  $('tbody tr:eq('+curindex+') input:enabled').val("");
  $('tbody tr:eq('+curindex+') input').prop('disabled', function(i, v) { return !v; });
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
        $('tbody tr:eq('+curindex+') td:eq(1) select').empty();
        for (i in accs ) {
          $('tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
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
        $('tbody tr:eq('+curindex+') td:eq(1) select').empty();
        for (i in accs ) {
          $('tbody tr:eq('+curindex+') td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
        }
      }
    });
  }
  drsum=0;
   $(".dramt").each(function(){
       drsum += +$(this).val();
       $('tfoot tr:last td:eq(1) input').val(drsum.toFixed(2));
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
    $('tbody tr:eq('+curindex+') input:enabled').select().focus();
  }
});

$(document).off("keyup",".dramt").on("keyup",".dramt",function(event)
{
	if(event.which==13)
	{
		var curindex = $(this).closest('tr').index();
    if($('tbody tr:eq('+curindex+') td:eq(2) input:enabled').val()=="" || $('tbody tr:eq('+curindex+') td:eq(2) input:enabled').val()==0){
      return false;
    }
		var lastindex = $('#vtable tbody tr:last').index();
		if(drsum > crsum)
		{
			diff=drsum-crsum;
			if(curindex<lastindex)
			{
				 var nxtindex = curindex+1
				if($('tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="" || $('tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()==0){
          $('tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
          crsum=0;
          $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
          });
          $('tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
        }
        else{
          $('tbody tr:eq('+nxtindex+') input:enabled').select().focus();
        }
			}
      else {
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
            '</tr>');
            for (i in accs ) {
              $('tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
            }
            $('tbody tr:last td:eq(1) select').focus();
            $('tbody tr:last td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
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
				if($('tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()=="" || $('tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()==0){
          $('tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val(parseFloat(diff).toFixed(2));
          drsum=0;
          $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
          });
          $('tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
        }
        else{
          $('tbody tr:eq('+nxtindex+') input:enabled').select().focus();
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
            $('.table').append('<tr>'+
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
            '</tr>');
            for (i in accs ) {
              $('tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
            }
            $('tbody tr:last td:eq(1) select').focus();
            $('tbody tr:last td:eq(2) input:enabled').val(parseFloat(diff).toFixed(2));
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
    if($('tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()=="" || $('tbody tr:eq('+curindex+') td:eq(3) input:enabled').val()==0){
      return false;
    }
		var lastindex = $('#vtable tbody tr:last').index();
		if(drsum > crsum)
		{
			diff=drsum-crsum;
			if(curindex<lastindex)
			{
				 var nxtindex = curindex+1
				if($('tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()=="" || $('tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val()==0){
          $('tbody tr:eq('+nxtindex+') td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
          crsum=0;
          $(".cramt").each(function(){
              crsum += +$(this).val();
              $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
          });
          $('tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
        }
        else{
          $('tbody tr:eq('+nxtindex+') input:enabled').select().focus();
        }
			}
      else {
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
            '</tr>');
            for (i in accs ) {
              $('tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
            }
            $('tbody tr:last td:eq(1) select').focus();
            $('tbody tr:last td:eq(3) input:enabled').val(parseFloat(diff).toFixed(2));
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
         if($('tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()=="" || $('tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val()==0){
          $('tbody tr:eq('+nxtindex+') td:eq(2) input:enabled').val(diff.toFixed(2));
          drsum=0;
          $(".dramt").each(function(){
              drsum += +$(this).val();
              $('tfoot tr:last td:eq(1) input').val(drsum.toFixed(2));
          });
          $('tbody tr:eq('+nxtindex+') td:eq(1) select').focus();
        }
        else{
          $('tbody tr:eq('+nxtindex+') input:enabled').select().focus();
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
            $('.table').append('<tr>'+
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
            '</tr>');
            for (i in accs ) {
              $('tbody tr:last td:eq(1) select').append('<option value="' + accs[i].accountcode + '">' +accs[i].accountname+ '</option>');
            }
            $('tbody tr:last td:eq(1) select').focus();
            $('tbody tr:last td:eq(2) input:enabled').val(diff.toFixed(2));
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
      $("#project").focus();
    }
	}
});
$('#save').click(function(event) {
    var allow = true;
    if ($('#vno').val()=="") {
      $("#vno-alert").alert();
      $("#vno-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#vno-alert").alert('close');
      });
      $('#vno').focus();
      return false;
    }
    if ($('#vdate').val()=="" || $('#vmonth').val()=="" || $('#vyear').val()=="") {
      $("#date-alert").alert();
      $("#date-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#date-alert").alert('close');
      });
      $('#vdate').focus();
      return false;
    }
    if ($('#drtotal').val()!=$('#crtotal').val()) {
      $("#balance-alert").alert();
      $("#balance-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#balance-alert").alert('close');
      });
      $('tbody tr:last td:eq(1) select').focus()
      return false;
    }
    if ($('#drtotal').val()==0) {
      $("#zero-alert").alert();
      $("#zero-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#zero-alert").alert('close');
      });
      return false;
    }

  $("tbody tr").each(function() {
      var accountcode = $(".accs", this).val();
      var count=0;
      $("tbody tr").each(function() {
            if(accountcode==$(".accs", this).val()){
              count =count +1;
            }
      });
      if (count>1) {
        allow= false;
        return false;
      }
  });

  if(!allow){
    $("#accs-alert").alert();
    $("#accs-alert").fadeTo(2000, 500).slideUp(500, function(){
      $("#accs-alert").alert('close');
    });
    return false;
  }

  var output = [];
    $("tbody tr").each(function() {
        var obj = {};
        obj.side=$('.crdr',this).val();
        obj.accountcode = $(".accs", this).val();
        obj.cramount = $(".cramt", this).val();
        obj.dramount = $(".dramt", this).val();
        output.push(obj);
    });
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
            $("#success-alert").alert();
            $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
              $("#success-alert").alert('close');
            });
          }
          else {
            $("#failure-alert").alert();
            $("#failure-alert").fadeTo(2000, 500).slideUp(500, function(){
              $("#failure-alert").alert('close');
            });
          }
          $('#vno').focus();
        }
      });
});

$('#reset').click(function(event) {
  $('#voucher')[0].reset();
  $('#vno').focus();
});
});
