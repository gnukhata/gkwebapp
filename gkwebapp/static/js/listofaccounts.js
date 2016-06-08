$(document).ready(function() {
  $(".modal-backdrop").remove();
  var percentwid = 100*(($("table").width()-12)/$("table").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  var percentheigth = 100*(($("body").height()-$(".navbar").height()-148)/$("body").height());
  $('.table-fixedheader tbody').height(percentheigth+"%");

  $('#latable tbody tr:first-child td:eq(1) a').focus();
  $('#latable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');


  $(document).off('focus' ,'.libgname').on('focus' ,'.libgname',function() {
    $('#latable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.libgname').on('blur' ,'.libgname',function() {
    $('#latable tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;


  $(document).off('keydown' ,'.libgname').on('keydown' ,'.libgname',function(event) {
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#latable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#latable tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }

  });


  $("#latable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#latable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#latable tbody tr:eq('+currindex+') a').focus();

  });
  $("#print").click(function(event) {
      $.ajax(
        {
          type: "POST",
          url: "/printlistofaccounts",
          global: false,
          async: false,
          dataType : 'text',
          data: {"orgname": sessionStorage.getItem('orgn'), "fystart":sessionStorage.getItem('year1'), "fyend": sessionStorage.getItem('year2')},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp){
            window.open('data:application/pdf;charset=utf-8,' + encodeURIComponent(resp));
          }
        });
  });

});
