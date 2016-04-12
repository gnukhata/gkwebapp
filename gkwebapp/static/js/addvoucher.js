$(document).ready(function() {
  $("#vno").focus();
  $('.vdate').autotab('number');
$('.crs').keypress(function(event) {
  if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57) && (event.which < 36 || event.which > 41) && event.which==8 && event.which==46 && event.which==46 ) {
    event.preventDefault();
  }
});
var drsum = 0;
var crsum = 0;
var diff = 0;

 $(document).on("change", ".dramt", function() {
   drsum=0;
    $(".dramt").each(function(){
        drsum += +$(this).val();
        $('tfoot tr:last td:eq(1) input').val(parseFloat(drsum).toFixed(2));
    });
});

$(document).on("change", ".cramt", function() {
  crsum=0;
  $(".cramt").each(function(){
      crsum += +$(this).val();
      $('tfoot tr:last td:eq(2) input').val(parseFloat(crsum).toFixed(2));
  });
});

$(document).on("focusout",".dramt",function(event)
{
  $(this).val((parseFloat($(this).val()).toFixed(2)));
});

$(document).on("focusout",".cramt",function(event)
{
  $(this).val((parseFloat($(this).val()).toFixed(2)));
});

$(document).on("change",".crdr",function(event)
{
  var curindex = $(this).closest('tr').index();
  $('tbody tr:eq('+curindex+') input:disabled').val("0.00");
  $('tbody tr:eq('+curindex+') input:enabled').val("");
  $('tbody tr:eq('+curindex+') input').prop('disabled', function(i, v) { return !v; });
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


$(document).on("keyup",".dramt",function(event)
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
          $('tbody tr:eq('+nxtindex+') input:enabled').focus();
        }
			}
      else {
        $.ajax({
          url: '/getcjaccounts',
          type: 'POST',
          dataType: 'json',
          data: {type: $('#vtype').val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(jsonObj) {
            var accs = jsonObj["accounts"];
            $('.table').append('<tr>'+
              '<td>'+
                '<select class="form-control input-sm crdr" name="type">'+
                  '<option value="Cr" selected>Cr</option>'+
                  '<option value="Dr">Dr</option>'+
                '</select>'+
              '</td>'+
              '<td>'+
                '<select class="form-control input-sm accs" name="type">'+
                '</select>'+
              '</td>'+
              '<td>'+
                '<input class="form-control input-sm dramt" type="text" name="dr" value="" disabled>'+
              '</td>'+
              '<td>'+
                '<input class="form-control input-sm cramt" type="text" name="cr" value="0.00">'+
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
    else if(crsum > drsum)
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
          $('tbody tr:eq('+nxtindex+') input:enabled').focus();
        }
			}
      else {
        $.ajax({
          url: '/getcjaccounts',
          type: 'POST',
          dataType: 'json',
          data: {type: $('#vtype').val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(jsonObj) {
            var accs = jsonObj["accounts"];
            $('.table').append('<tr>'+
              '<td>'+
                '<select class="form-control input-sm crdr" name="type">'+
                  '<option value="Cr">Cr</option>'+
                  '<option value="Dr" selected>Dr</option>'+
                '</select>'+
              '</td>'+
              '<td>'+
                '<select class="form-control input-sm accs" name="type">'+
                '</select>'+
              '</td>'+
              '<td>'+
                '<input class="form-control input-sm dramt" type="text" name="dr" value="0.00">'+
              '</td>'+
              '<td>'+
                '<input class="form-control input-sm cramt" type="text" name="cr" value="" disabled>'+
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

	}
});

$(document).on("keyup",".cramt",function(event)
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
          $('tbody tr:eq('+nxtindex+') input:enabled').focus();
        }
			}
      else {
        $.ajax({
          url: '/getcjaccounts',
          type: 'POST',
          dataType: 'json',
          data: {type: $('#vtype').val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(jsonObj) {
            var accs = jsonObj["accounts"];
            $('.table').append('<tr>'+
              '<td>'+
                '<select class="form-control input-sm crdr" name="type">'+
                  '<option value="Cr" selected>Cr</option>'+
                  '<option value="Dr">Dr</option>'+
                '</select>'+
              '</td>'+
              '<td>'+
                '<select class="form-control input-sm accs" name="type">'+
                '</select>'+
              '</td>'+
              '<td>'+
                '<input class="form-control input-sm dramt" type="text" name="dr" value="" disabled>'+
              '</td>'+
              '<td>'+
                '<input class="form-control input-sm cramt" type="text" name="cr" value="0.00">'+
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
    else if(crsum > drsum)
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
          $('tbody tr:eq('+nxtindex+') input:enabled').focus();
        }
			}
      else {
        $.ajax({
          url: '/getcjaccounts',
          type: 'POST',
          dataType: 'json',
          data: {type: $('#vtype').val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(jsonObj) {
            var accs = jsonObj["accounts"];
            $('.table').append('<tr>'+
              '<td>'+
                '<select class="form-control input-sm crdr" name="type">'+
                  '<option value="Cr">Cr</option>'+
                  '<option value="Dr" selected>Dr</option>'+
                '</select>'+
              '</td>'+
              '<td>'+
                '<select class="form-control input-sm accs" name="type">'+
                '</select>'+
              '</td>'+
              '<td>'+
                '<input class="form-control input-sm dramt" type="text" name="dr" value="0.00">'+
              '</td>'+
              '<td>'+
                '<input class="form-control input-sm cramt" type="text" name="cr" value="" disabled>'+
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

	}
});
});
