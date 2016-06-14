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
    curindex = $(this).closest('tr');
		nextindex = $(curindex).nextAll("tr:visible:first").index();
		previndex = $(curindex).prevAll("tr:visible:first").index();;
		if (event.which==40)
		{
			event.preventDefault();
			$('#satable tbody tr:eq('+nextindex+') td:eq(0) a').focus();
		}
		else if (event.which==38)
		{
			if(previndex>-1)
			{
				event.preventDefault();
				$('#satable tbody tr:eq('+previndex+') td:eq(0) a').focus();
			}
		}
    if (event.which == 13)
    {
      event.preventDefault();
      value = $(this).closest('tr').attr('value');
      classs = "."+value;
      $(classs).slideToggle(1);
    }
  });

  $(".cbalsheettable tbody tr").dblclick(function(event) {
      event.preventDefault();
      var grpcode = $(this).attr('value');
      if(grpcode==""){
        return false;
      }
      else{
        $("."+grpcode).slideToggle(1);
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
$("#print").click(function(event) {
    $.ajax(
      {
        type: "GET",
        url: "/printsourcesandappfundreport",
        global: false,
        async: false,
        dataType : 'text',
        data: {"orgname": sessionStorage.getItem('orgn'), "fystart":sessionStorage.getItem('year1'), "fyend": sessionStorage.getItem('year2'), "calculateto":$("#cto").val()},
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
