$(document).ready(function() {
  $('#liabtable tbody tr:first-child td:eq(0) a').focus();
  $('#liabtable tbody tr:first-child td:eq(0) a').closest('tr').addClass('selected');
  var rcindex = 0
  var pyindex = 0
  var percentwid = 100*(($(".table-fixedheader").width()-12)/$(".table-fixedheader").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  var percentheigth = 100*(($("body").height()-$(".navbar").height()-148)/$("body").height());
  $('.table-fixedheader tbody').height(percentheigth+"%");
  $(document).off('focus' ,'.libgname').on('focus' ,'.libgname',function() {
    $('#liabtable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.libgname').on('blur' ,'.libgname',function() {
    $('#liabtable tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;
  var date = $("#ledtodate").val().split("-");
  var newtodate = date[2]+"-"+date[1]+"-"+date[0];

  $(document).off('keydown' ,'.libgname').on('keydown' ,'.libgname',function(event) {
    curindex = $(this).closest('tr').index();
    rcindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#liabtable tbody tr:eq('+nextindex+') td:eq(0) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#liabtable tbody tr:eq('+previndex+') td:eq(0) a').focus();
      }
    }
    else if (event.which==39)
    {

      $('#patable tbody tr:eq('+pyindex+') td:eq(0) a').focus();
    }
  });

  var urole = $("#urole").val();


  $("#liabtable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#liabtable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#liabtable tbody tr:eq('+currindex+') a').focus();

  });


  $(document).off('focus' ,'.pagname').on('focus' ,'.pagname',function() {
    $('#patable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.pagname').on('blur' ,'.pagname',function() {
    $('#patable tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;
  var date = $("#ledtodate").val().split("-");
  var newtodate = date[2]+"-"+date[1]+"-"+date[0];

  $(document).off('keydown' ,'.pagname').on('keydown' ,'.pagname',function(event) {
    curindex = $(this).closest('tr').index();
    pyindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#patable tbody tr:eq('+nextindex+') td:eq(0) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#patable tbody tr:eq('+previndex+') td:eq(0) a').focus();
      }
    }
    else if (event.which==37)
    {

      $('#liabtable tbody tr:eq('+rcindex+') td:eq(0) a').focus();
    }


  });

  var urole = $("#urole").val();


  $("#patable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#patable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#patable tbody tr:eq('+currindex+') a').focus();

  });


  $("#balback").click(function(event) {
    $("#showbalancesheet").click();
  });

});
