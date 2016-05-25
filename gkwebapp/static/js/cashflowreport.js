$(document).ready(function() {
  $('#rctable tbody tr:first-child td:eq(1) a').focus();
  $('#rctable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');
  var rcindex = 0
  var pyindex = 0
  var percentwid = 100*(($("table").width()-12)/$("table").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  $(document).off('focus' ,'.rcaccname').on('focus' ,'.rcaccname',function() {
    $('#rctable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.rcaccname').on('blur' ,'.rcaccname',function() {
    $('#rctable tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;
  var date = $("#ledtodate").val().split("-");
  var newtodate = date[2]+"-"+date[1]+"-"+date[0];

  $(document).off('keydown' ,'.rcaccname').on('keydown' ,'.rcaccname',function(event) {
    curindex = $(this).closest('tr').index();
    rcindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {

      $('#rctable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        $('#rctable tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }
    else if (event.which==39)
    {

      $('#pytable tbody tr:eq('+pyindex+') td:eq(1) a').focus();
    }
  });

  var urole = $("#urole").val();


  $("#rctable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#rctable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#rctable tbody tr:eq('+currindex+') a').focus();

  });

  $("#rctable").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==13)
    {

    $('#rctable tbody tr:eq('+rindex+')').dblclick() ;
    }
});

  $("#rctable tbody tr").off('dblclick').on('dblclick',function(e){
    e.preventDefault();
    var acccode = $(this).attr('value');
    if (acccode=="")
    {
        return false;
    }
     var todatearray = $("#ledtodate").val().split("-");
     var fromdatearray = $("#ledfromdate").val().split("-");
     var newtodate = todatearray[2]+"-"+todatearray[1]+"-"+todatearray[0];
     var newfromdate = fromdatearray[2]+"-"+fromdatearray[1]+"-"+fromdatearray[0];
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":$("#backflag").val(),"accountcode":acccode,"calculatefrom":newfromdate,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      })
        .done(function(resp)
        {
          $("#info").html(resp);
        }
      );



  });

  $(document).off('focus' ,'.pyaccname').on('focus' ,'.pyaccname',function() {
    $('#pytable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.pyaccname').on('blur' ,'.pyaccname',function() {
    $('#pytable tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;
  var date = $("#ledtodate").val().split("-");
  var newtodate = date[2]+"-"+date[1]+"-"+date[0];

  $(document).off('keydown' ,'.pyaccname').on('keydown' ,'.pyaccname',function(event) {
    curindex = $(this).closest('tr').index();
    pyindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {

      $('#pytable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        $('#pytable tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }
    else if (event.which==37)
    {

      $('#rctable tbody tr:eq('+rcindex+') td:eq(1) a').focus();
    }


  });

  var urole = $("#urole").val();


  $("#pytable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#pytable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#pytable tbody tr:eq('+currindex+') a').focus();

  });

  $("#pytable").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==13)
    {

    $('#pytable tbody tr:eq('+rindex+')').dblclick() ;
    }
});

  $("#pytable tbody tr").off('dblclick').on('dblclick',function(e){
    e.preventDefault();
    var acccode = $(this).attr('value');
    if (acccode=="")
    {
        return false;
    }
    var todatearray = $("#ledtodate").val().split("-");
    var fromdatearray = $("#ledfromdate").val().split("-");
    var newtodate = todatearray[2]+"-"+todatearray[1]+"-"+todatearray[0];
    var newfromdate = fromdatearray[2]+"-"+fromdatearray[1]+"-"+fromdatearray[0];
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":$("#backflag").val(),"accountcode":acccode,"calculatefrom":newfromdate,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      })
        .done(function(resp)
        {
          $("#info").html(resp);
        }
      );



  });

  $("#cfback").click(function(event) {
    $("#showcashflow").click();
  });

});
