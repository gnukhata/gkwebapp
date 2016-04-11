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
    });
});

$(document).on("change", ".cramt", function() {
  crsum=0;
  $(".cramt").each(function(){
      crsum += +$(this).val();
  });
});


$(document).on("keyup",".dramt",function(event)
{
	if(event.which==13)
	{
		var curindex = $(this).closest('tr').index();

		var lastindex = $('#vtable tr:last').index();
		if(drsum > crsum)
		{
			diff=drsum-crsum;
			if(curindex<lastindex)
			{
				 var nxtindex = curindex+1
				if($('tr:eq('+nxtindex+') td:eq(3) input').val()=="" || $('tr:eq('+nxtindex+') td:eq(3) input').val()=="0.00"){
          $('tr:eq('+nxtindex+') td:eq(3) input').val(diff);
          $('.table .accs').focus();
        }
        else{
          $('tr:eq('+nxtindex+') td:eq(3) input').focus();
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
				if($('tr:eq('+nxtindex+') td:eq(2) input').val()=="" || $('tr:eq('+nxtindex+') td:eq(2) input').val()=="0.00"){
          $('tr:eq('+nxtindex+') td:eq(2) input').val(diff);
          $('.table .accs').focus();
        }
        else{
          $('tr:eq('+nxtindex+') td:eq(2) input').focus();
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

		var lastindex = $('#vtable tr:last').index();
		if(drsum > crsum)
		{
			diff=drsum-crsum;
			if(curindex<lastindex)
			{
				 var nxtindex = curindex+1
				if($('tr:eq('+nxtindex+') td:eq(3) input').val()=="" || $('tr:eq('+nxtindex+') td:eq(3) input').val()=="0.00"){
          $('tr:eq('+nxtindex+') td:eq(3) input').val(diff);
          $('.table .accs').focus();
        }
        else{
          $('tr:eq('+nxtindex+') td:eq(3) input').focus();
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
				if($('tr:eq('+nxtindex+') td:eq(2) input').val()=="" || $('tr:eq('+nxtindex+') td:eq(2) input').val()=="0.00"){
          $('tr:eq('+nxtindex+') td:eq(2) input').val(diff);
          $('.table .accs').focus();
        }
        else{
          $('tr:eq('+nxtindex+') td:eq(2) input').focus();
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
          }
        });

      }

		}

	}
});
});
