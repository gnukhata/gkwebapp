$(document).ready(function() {

  var percentwid = 100*(($("table").width()-12)/$("table").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  var percentheigth = 100*(($("body").height()-$(".navbar").height()-148)/$("body").height());
  $('.table-fixedheader tbody').height(percentheigth+"%");

  $(' #prjsttable tbody tr:first-child td:eq(1) a').focus();
  $('#prjsttable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');


  $(document).off('focus' ,'.prjstaccs').on('focus' ,'.prjstaccs',function() {
    $('#prjsttable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.prjstaccs').on('blur' ,'.prjstaccs',function() {
    $('#prjsttable tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;


  $(document).off('keydown' ,'.prjstaccs').on('keydown' ,'.prjstaccs',function(event) {
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#prjsttable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#prjsttable tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }

  });


  $("#prjsttable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#prjsttable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#prjsttable tbody tr:eq('+currindex+') a').focus();

  });

  $("#prjsttable").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==13)
    {

      $('#prjsttable tbody tr:eq('+rindex+')').dblclick() ;
    }
  });

  $("#prjsttable tbody tr").off('dblclick').on('dblclick',function(e){
    e.preventDefault();
    var acccode = $(this).attr('value');
    if (acccode=="")
    {
        return false;
    }
     var date = $("#calculateto").val().split("-");
     var newtodate = date[2]+"-"+date[1]+"-"+date[0];
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":6,"accountcode":acccode,"calculatefrom":sessionStorage.yyyymmddyear1,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":$("#projectcode").val(),"monthlyflag":false,"narrationflag":false},
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

  $("#prjstback").click(function(event) {
    $("#showprjstate").click();
  });



});
