/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.and old.stockflag = 's'

  GNUKhata is distributed in the hope that it will be useful, but
  WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License along with GNUKhata (COPYING); if not, write to the
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
  Boston, MA  02110-1301  USA59 Temple Place, Suite 330,


Contributors:
"Krishnakant Mane" <kk@gmail.com>
"Ishan Masdekar " <imasdekar@dff.org.in>
"Navin Karkera" <navin@dff.org.in>
"Vanita Rajpurohit" <vanita.rajpurohit9819@gmail.com>
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
*/

$(document).ready(function() {

  $("#grpbtn").hide();

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

  var visiblesubgroup = $(".groupacc:visible").length;
  var visibleaccount = $(".subgroupacc:visible").length;
  var account = $(".subgroupacc").length;
  var subgroup = $(".groupacc").length;
  var accflag=0
  var sbgrpflag=0

$("#grpbtn").click(function(event){
  event.preventDefault();
  $(".subgroupacc").css("display", "none");
  $(".groupacc").css("display", "none");
  $(this).hide();
  visiblesubgroup = $(".groupacc:visible").length;
  visibleaccount = $(".subgroupacc:visible").length;
  if(sbgrpflag==1 || visibleaccount==0)
  {
    $("#accbtn").show();
  }
  if(accflag==1 || visiblesubgroup==0)
  {$("#sbgbtn").show();}
  $('#satable tbody tr:first-child td:eq(0) a').focus();
});

  $("#sbgbtn").click(function(event){
    event.preventDefault();
      $(".groupacc").css("display", "block");
      $(".subgroupacc").css("display", "none");
      $(this).hide();
      $("#grpbtn").show();
      $("#accbtn").show();
      sbgrpflag=1
      $('#satable tbody tr:first-child td:eq(0) a').focus();
  });

  $("#accbtn").click(function(event){
    event.preventDefault();
      $(".groupacc").css("display", "block");
      $(".subgroupacc").css("display", "block");
      $(this).hide();
      $("#grpbtn").show();
      $("#sbgbtn").show();
      accflag=1;
      $('#satable tbody tr:first-child td:eq(0) a').focus();
  });

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

  });

  $("#satable").off('keydown','tr').on('keydown','tr',function(event){
    var rindex = $(this).index();

    if (event.which == 13)
    {
      event.preventDefault();
      $(".cbalsheettable tbody tr:eq("+rindex+")").dblclick();
    }
  });

  $(".cbalsheettable tbody tr").dblclick(function(event) {
      event.preventDefault();
      var grpcode = $(this).attr('value');
      if(grpcode==""){
        return false;
      }
      else if (grpcode.indexOf("g") != -1) {
        $("."+grpcode).slideToggle(1);
        $("."+grpcode).each(function(index) {
          code = $(this).attr('value')
          if ($("."+code).is(":visible")){
            $("."+code).slideToggle(1);
          }

        });
      }
      else {
    		var newfromdate = sessionStorage.yyyymmddyear1;
    		$.ajax(
    			{
    				type: "POST",
    				url: "/showledgerreport",
    				global: false,
    				async: false,
    				datatype: "text/html",
    				data: {"backflag":8,"accountcode":grpcode,"calculatefrom":newfromdate,"calculateto":$("#cto").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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

  event.preventDefault();
  var orgname = sessionStorage.getItem('orgn');
  var orgtype = sessionStorage.getItem('orgt');
  var xhr = new XMLHttpRequest();

  xhr.open('GET', '/printsourcesandappfundreport?orgname='+ orgname+'&fystart='+sessionStorage.getItem('year1')+'&fyend='+sessionStorage.getItem('year2')+'&calculateto='+$("#cto").val(), true);
  xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
  xhr.responseType = 'blob';

  xhr.onload = function(e) {
  if (this.status == 200) {
  // get binary data as a response
    var blob = this.response;
    var url = window.URL.createObjectURL(blob);
    window.location.assign(url)
  }
};

xhr.send();
/*
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
      });*/
});

});
