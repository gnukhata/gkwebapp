$(document).ready(function() {
  $('#ledgertable tbody tr:first-child td:first-child a').focus();
  $('#ledgertable tbody tr:first-child td:first-child a').closest('tr').addClass('selected');

  $(document).off('focus' ,'.vno').on('focus' ,'.vno',function() {
    $('#ledgertable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.vno').on('blur' ,'.vno',function() {
    $('#ledgertable tr').removeClass('selected');

  });

  var curindex ;
  var nextindex;
  var previndex;


  $(document).off('keydown' ,'.vno').on('keydown' ,'.vno',function(event) {
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {

      $('#ledgertable tbody tr:eq('+nextindex+') td:eq(0) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        $('#ledgertable tbody tr:eq('+previndex+') td:eq(0) a').focus();
      }
    }

  });
});
