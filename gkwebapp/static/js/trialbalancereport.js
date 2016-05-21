$(document).ready(function() {
  $('.trialbaltable tbody tr:first-child td:eq(1) a').focus();
  $('.trialbaltable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');


  $(document).off('focus' ,'.accname').on('focus' ,'.accname',function() {
    $('.trialbaltable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.accname').on('blur' ,'.accname',function() {
    $('.trialbaltable tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;


  $(document).off('keydown' ,'.accname').on('keydown' ,'.accname',function(event) {
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {

      $('.trialbaltable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        $('.trialbaltable tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }

  });

  var urole = $("#urole").val();


  $(".trialbaltable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('.trialbaltable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('.trialbaltable tbody tr:eq('+currindex+') a').focus();

  });

  $(".trialbaltable").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==13)
    {

    $('.trialbaltable tbody tr:eq('+rindex+')').dblclick() ;
    }
});

  $(".trialbaltable tbody tr").off('dblclick').on('dblclick',function(e){
    e.preventDefault();
    var acccode = $(this).attr('value');
    if (acccode=="")
    {
        return false;
    }
     var date = $("#ledtodate").val().split("-");
     var newtodate = date[2]+"-"+date[1]+"-"+date[0];
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":$("#trialbaltype").val(),"accountcode":acccode,"calculatefrom":sessionStorage.yyyymmddyear1,"calculateto":newtodate,"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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





});
