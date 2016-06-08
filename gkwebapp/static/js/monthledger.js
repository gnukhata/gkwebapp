$(document).ready(function() {
  $('#mthltable tbody tr:first-child td:eq(0) a').focus();
  $('#mthltable tbody tr:first-child td:eq(0) a').closest('tr').addClass('selected');


  $(document).off('focus' ,'.monthname').on('focus' ,'.monthname',function() {
    $('#mthltable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.monthname').on('blur' ,'.monthname',function() {
    $('#mthltable tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;

  $(document).off('keydown' ,'.monthname').on('keydown' ,'.monthname',function(event) {
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {

      $('#mthltable tbody tr:eq('+nextindex+') td:eq(0) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        $('#mthltable tbody tr:eq('+previndex+') td:eq(0) a').focus();
      }
    }

  });

  var urole = $("#urole").val();


  $("#mthltable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#mthltable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#mthltable tbody tr:eq('+currindex+') a').focus();

  });

  $("#mthltable").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==13)
    {

    $('#mthltable tbody tr:eq('+rindex+')').dblclick() ;
    }
});

  $("#mthltable tbody tr").off('dblclick').on('dblclick',function(e){
    e.preventDefault();
     var date = $(this).attr('value').split(":");
     var newfromdate = date[0];
     var newtodate = date[1];
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":5,"accountcode":$("#accountcode").val(),"calculatefrom":newfromdate,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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

  $("#print").click(function(event) {
    $.ajax(
      {
        type: "GET",
        url: "/printmonthlyledgerreport",
        global: false,
        async: false,
        dataType : 'text',
        data: {"orgname": sessionStorage.getItem('orgn'), "fystart":sessionStorage.getItem('year1'), "fyend": sessionStorage.getItem('year2'), "accountcode":$("#accountcode").val(), "accname": $("#accname").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp) {
          window.open('data:application/pdf;charset=utf-8,' + encodeURIComponent(resp));
        }
      });

    });

  $("#mthlback").click(function(event) {
    $("#showviewledger").click();
  });

});
