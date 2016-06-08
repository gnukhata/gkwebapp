$(document).ready(function() {


  var percentwid = 100*(($("table").width()-12)/$("table").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  var percentheigth = 100*(($("body").height()-$(".navbar").height()-148)/$("body").height());
  $('.table-fixedheader tbody').height(percentheigth+"%");

  $('#satable tbody tr:first-child td:eq(0) a').focus();
  $('#satable tbody tr:first-child td:eq(0) a').closest('tr').addClass('selected');


  $(document).off('focus' ,'.libgname').on('focus' ,'.libgname',function() {
    $('#satable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.libgname').on('blur' ,'.libgname',function() {
    $('#satable tr').removeClass('selected');

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
      $('#satable tbody tr:eq('+nextindex+') td:eq(0) a').focus();
    }
    else if (event.which==38)
    {
      event.preventDefault();
      if(previndex>-1)
      {
        $('#satable tbody tr:eq('+previndex+') td:eq(0) a').focus();
      }
    }

  });


  $("#satable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#satable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#satable tbody tr:eq('+currindex+') a').focus();

  });


  $("#saback").click(function(event) {
    $("#showbalancesheet").click();
  });

  $(".cbalsheettable tbody tr").dblclick(function(event) {
      event.preventDefault();
      var grpcode = $(this).attr('value');
      //alert("vanita");
      if(grpcode==""){
        return false;
      }
      else{
        $("."+grpcode).slideToggle();
      }
  });

$("#cbalbutn").click(function(event) {

  $.ajax(
    {
      type: "POST",
      url: "/showbalancesheetreport",
      global: false,
      async: false,
      datatype: "text/html",
      data: {"balancesheettype":$("#balancesheettype").val(),"calculateto":$("#cto").val(),"orgtype":sessionStorage.orgt},
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
