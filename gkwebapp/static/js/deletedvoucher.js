$(document).ready(function() {

  var percentwid = 100*(($(".table-fixedheader").width()-12)/$(".table-fixedheader").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  var percentheigth = 100*(($("body").height()-$(".navbar").height()-148)/$("body").height());
  $('.table-fixedheader tbody').height(percentheigth+"%");

  $(' #deletedvouchertable tbody tr:first-child td:eq(1) a').focus();
  $('#deletedvouchertable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');


  $(document).off('focus' ,'.vno').on('focus' ,'.vno',function() {
    $('#deletedvouchertable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
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
      event.preventDefault();
      $('#deletedvouchertable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#deletedvouchertable tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }

  });

});
