$(document).ready(function() {
  $('#expensetbl tbody tr:first-child td:eq(1) a').focus();
  $('#expensetbl tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');
  var rcindex = 0
  var pyindex = 0
  var percentwid = 100*(($(".table-fixedheader").width()-12)/$(".table-fixedheader").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  var percentheigth = 100*(($("body").height()-$(".navbar").height()-148)/$("body").height());
  $('.table-fixedheader tbody').height(percentheigth+"%");
  $(document).off('focus' ,'.rcaccname').on('focus' ,'.rcaccname',function() {
    $('#expensetbl tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.rcaccname').on('blur' ,'.rcaccname',function() {
    $('#expensetbl tr').removeClass('selected');

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
      event.preventDefault();
      $('#expensetbl tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#expensetbl tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }
    else if (event.which==39)
    {

      $('#incometbl tbody tr:eq('+pyindex+') td:eq(1) a').focus();
    }
  });

  var urole = $("#urole").val();


  $("#expensetbl").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#expensetbl tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#expensetbl tbody tr:eq('+currindex+') a').focus();

  });

  $("#expensetbl").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==13)
    {

    $('#expensetbl tbody tr:eq('+rindex+')').dblclick() ;
    }
});

  $("#expensetbl tbody tr").off('dblclick').on('dblclick',function(e){
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
        data: {"backflag":7,"accountcode":acccode,"calculatefrom":newfromdate,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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
    $('#incometbl tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.pyaccname').on('blur' ,'.pyaccname',function() {
    $('#incometbl tr').removeClass('selected');

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

      $('#incometbl tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        $('#incometbl tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }
    else if (event.which==37)
    {

      $('#expensetbl tbody tr:eq('+rcindex+') td:eq(1) a').focus();
    }


  });

  var urole = $("#urole").val();


  $("#incometbl").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#incometbl tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#incometbl tbody tr:eq('+currindex+') a').focus();

  });

  $("#incometbl").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==13)
    {

    $('#incometbl tbody tr:eq('+rindex+')').dblclick() ;
    }
});

  $("#incometbl tbody tr").off('dblclick').on('dblclick',function(e){
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
        data: {"backflag":7,"accountcode":acccode,"calculatefrom":newfromdate,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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
  $("#print").click(function(event){
      var todatearray = $("#ledtodate").val().split("-");
      var fromdatearray = $("#ledfromdate").val().split("-");
      var newtodate = todatearray[2]+"-"+todatearray[1]+"-"+todatearray[0];
      var newfromdate = fromdatearray[2]+"-"+fromdatearray[1]+"-"+fromdatearray[0];
      $.ajax(
        {
          type: "GET",
          url: "/printprofitandloss",
          global: false,
          async: false,
          dataType : 'text',
          data: {"headingprofit":$("#headingprofit").val(),"orgname": sessionStorage.getItem('orgn'), "fystart":sessionStorage.getItem('year1'), "fyend": sessionStorage.getItem('year2'), "calculateto": newtodate, "calculatefrom": newfromdate},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp) {
            win = window.open('data:application/pdf;charset=utf-8,' + encodeURIComponent(resp));
          }
        });
    });
  $("#pnlback").click(function(event) {
    $("#showprofitloss").click();
  });

});
