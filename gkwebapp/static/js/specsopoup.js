/* -----------------------Spec key events start----------------------------------------- */
  //All the navigation events where pressing enter shifts focus to the next element and pressing the up arrow key focuses the previous element
     $('#category_spec_name').focus();
$('#addspecmodal').on('shown', function () {
          $('#category_spec_name').focus();
 });
  $(document).off("keydown",".spec_name").on("keydown",".spec_name",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#category_spec_table tbody tr:eq('+nextindex+') td:eq(0) input').focus().select();
    }
    else if (event.which==38) {
      event.preventDefault();
      if (curindex == 0) {
        $("#category_name").focus().select();
      }
      else {
        $('#category_spec_table tbody tr:eq('+previndex+') td:eq(0) input').focus().select();
      }
    }
    else if (event.which==13) {
      event.preventDefault();
      $('#category_spec_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
    }
    else if (event.ctrlKey && event.which==190) {
      $('#category_spec_table tbody tr:eq('+curindex+') td:eq(1) select').focus();
      event.preventDefault();
    }
    else if (event.ctrlKey && event.which==188) {
      if (previndex>-1) {
        $('#category_spec_table tbody tr:eq('+previndex+') td:eq(1) select').focus().select();
      }
      else {
        $('#category_spec_table tbody tr:eq('+curindex+') td:eq(1) select').focus().select();
      }
      event.preventDefault();
    }
  });


  $(document).off("keydown",".spec_type").on("keydown",".spec_type",function(event)
  {
    var curindex1 = $(this).closest('tr').index();
    var nextindex1 = curindex1+1;
    var previndex1 = curindex1-1;
    if (event.which==13) {
      event.preventDefault();
      if (curindex1 != ($("#category_spec_table tbody tr").length-1)) {
        $('#category_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
      else {
        if ($('#category_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').val()=="") {
          $("#spec-blank-alert").alert();
          $("#spec-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
            $("#spec-blank-alert").hide();
          });
          $('#category_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus();
          return false;
        }
        // appending a new row for adding another spec to category
        $('#category_spec_table tbody').append('<tr>'+
        '<td class="col-xs-8">'+
        '<input type="text" class="form-control input-sm spec_name" placeholder="Spec Name">'+
        '</td>'+
        '<td class="col-xs-3">'+
        '<select id="category_spec_type" class="form-control input-sm spec_type">'+
        '<option value="0">Text</option>'+
        '<option value="1">Number</option>'+
        '<option value="2">Date</option>'+
        '<option value="3">Option</option>'+
        '</select>'+
        '</td>'+
        '<td class="col-xs-1">'+
        '<a href="#" class="spec_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
        '</td>'+
        '</tr>');
        $('#category_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
      }
    }
    else if (event.ctrlKey && event.which==188) {
      event.preventDefault();
      if (previndex1>-1) {
        $('#category_spec_table tbody tr:eq('+previndex1+') td:eq(0) input').focus().select();
      }
      else {
        $('#category_spec_table tbody tr:eq('+curindex1+') td:eq(0) input').focus().select();
      }
    }
    else if (event.ctrlKey && event.which==190) {
      event.preventDefault();
      $('#category_spec_table tbody tr:eq('+nextindex1+') td:eq(0) input').focus().select();
    }
    else if (event.which==27) {
      event.preventDefault();
      $(".tax_name:first").focus();
    }
  });
  /* -----------------------Spec key events end----------------------------------------- */
