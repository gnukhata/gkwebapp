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
"Parabjyot Singh" <parabjyot1996@gmail.com>
"Rahul Chaurasiya" <crahul4133@gmail.com>
*/

$(document).ready(function() {

  oninvoice = 0;
  consolidateflag=0;
  $(".modal-backdrop").remove();

  $("#msspinmodal").modal("hide");

  $("#grpbtn").hide();
  $("#realprintbalance").hide();
  $('#liabtable tbody tr:first-child td:eq(0) a').focus();
  $('#liabtable tbody tr:first-child td:eq(0) a').closest('tr').addClass('selected');
  var rcindex = 0
  var pyindex = 0
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
    curindex = $(this).closest('tr');
    rcindex = $(this).closest('tr').index();
    nextindex = $(curindex).nextAll("tr:visible:first").index();
		previndex = $(curindex).prevAll("tr:visible:first").index();
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
  $('#liabtable tbody tr:first-child td:eq(0) a').focus();
});

  $("#sbgbtn").click(function(event){
    event.preventDefault();
      $(".groupacc").removeAttr('style');
      $(".subgroupacc").css("display", "none");
      $(this).hide();
      $("#grpbtn").show();
      $("#accbtn").show();
      sbgrpflag=1
      $('#liabtable tbody tr:first-child td:eq(0) a').focus();
  });

  $("#accbtn").click(function(event){
    event.preventDefault();
      $(".groupacc").removeAttr('style');
      $(".subgroupacc").removeAttr('style');
      $(this).hide();
      $("#grpbtn").show();
      $("#sbgbtn").show();
      accflag=1;
      $('#liabtable tbody tr:first-child td:eq(0) a').focus();
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
    curindex = $(this).closest('tr');
    pyindex = $(this).closest('tr').index();
    nextindex = $(curindex).nextAll("tr:visible:first").index();
		previndex = $(curindex).prevAll("tr:visible:first").index();
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
  $("#liabtable").off('keydown','tr').on('keydown','tr',function(event){
    var rindex = $(this).index();

    if (event.which == 13)
    {
      event.preventDefault();
      $("#liabtable tbody tr:eq("+rindex+")").dblclick();
    }
});
$("#patable").off('keydown','tr').on('keydown','tr',function(event){
  var rindex = $(this).index();

  if (event.which == 13)
  {
    event.preventDefault();
    $("#patable tbody tr:eq("+rindex+")").dblclick();
  }
});

  $("#patable tbody tr").dblclick(function(event) {
      event.preventDefault();
      var grpcode = $(this).attr('value');
      if(grpcode==""){
        return false;
      }
      else if (grpcode.indexOf("g") != -1) {
        $("."+grpcode).slideToggle(1);
        $("."+grpcode).removeAttr('style');
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
    				data: {"backflag":9,"accountcode":grpcode,"calculatefrom":newfromdate,"calculateto":$("#cto").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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

  $("#liabtable tbody tr").dblclick(function(event) {
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
    				data: {"backflag":9,"accountcode":grpcode,"calculatefrom":newfromdate,"calculateto":$("#cto").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":"","monthlyflag":false,"narrationflag":false},
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
  var urole = $("#urole").val();


  $("#patable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#patable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#patable tbody tr:eq('+currindex+') a').focus();

  });

  $("#sabutn").click(function(event) {

    $.ajax(
      {
        type: "POST",
        url: "/showbalancesheetreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"balancesheettype":$("#balancesheettype").val(),"calculateto":$("#cto").val(),"orgtype":sessionStorage.orgt,"flag":0},
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
    console.log($("#flag").val());
    if($("#flag").val() == 0)
    {
      console.log("conv");
      var orgname = sessionStorage.getItem('orgn');
      var orgtype = sessionStorage.getItem('orgt');
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/printconvbalsheetreport?type=conventionalbalancesheet&orgname='+ orgname+'&orgtype='+orgtype+'&fystart='+sessionStorage.getItem('year1')+'&fyend='+sessionStorage.getItem('year2')+'&calculateto='+$("#cto").val(), true);
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
    }
    else
    {
      console.log("cons");
      var sorgname1 = [];
      $("#sorgname > option").each(function() {
            sorgname1.push(this.text);
      });
      var selectedorg1 = [];
      $("#selectedorg > option").each(function() {
            selectedorg1.push(this.value);
      });
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/printconvbalsheetreport?type=consolidatedbalancesheet&orgname='+ $("#horgname").val()+'&sorgname='+JSON.stringify(sorgname1)+'&orgtype='+$("#orgtype").val()+'&fystart='+$("#yearstart").val()+'&fyend='+$("#calculateto").val()+'&calculateto='+$("#calculateto").val()+'&selectedorg='+JSON.stringify(selectedorg1), true);
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
    }
    });

  $("#balback").click(function(event) {
    if($("#flag").val() == 1)
    {
      $.ajax(
        {
        type: "POST",
        url: "/showconsolidationpopup",
        global: false,
        async: false,
        datatype: "text/html",
        beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
        success: function(resp)
        {
          $("#info").html(resp);
          //$("#holdingorg").modal("show");
        }
        });
    }
    else {
      if ($("#realprintbalance").is(":visible")) {
        if($("#flag").val() == 0)
        {
          $.ajax(
            {
              type: "POST",
              url: "/showbalancesheetreport",
              global: false,
              async: false,
              datatype: "text/html",
              data: {"balancesheettype":"conventionalbalancesheet","calculateto":$("#cto").val(),"orgtype":sessionStorage.orgt,"flag":$("#flag").val()},
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

        else
        {
          var selectedorg1 = [];
          $("#selectedorg > option").each(function() {
                selectedorg1.push(this.value);
          });
          var sorgname1 = [];
          $("#sorgname > option").each(function() {
                sorgname1.push(this.text);
          });
          var selectedorg = {"ds" : JSON.stringify(selectedorg1),"calculateto":$("#calculateto").val(),"orgcode":$("#orgcode").val(),"financialStart":$("#yearstart").val(),"orgtype":$("#orgtype").val()};
          $.ajax({
            type: "POST",
            url: "/listoforgselected?type=orgselected",
            global: false,
            async: false,
            datatype: "text/html",
            data: {"selectedorg" : JSON.stringify(selectedorg),"flag" : 1,"horgname" : $("#horgname").val(),"sorgname" : JSON.stringify(sorgname1)},
            beforeSend: function(xhr) {
                xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
            },
            })
            .done(function(resp){
              $("#info").html(resp);
            });
        }
      }
      else {
        $("#showbalancesheet").click();
      }

    }

  });


  $("#printconvbalance").click(function(event) {
    $("#liabtable").unbind('dblclick');
    $("#patable").unbind('dblclick');
    $("#sbgbtn").remove();
    $("#accbtn").remove();
    $("#grpbtn").remove();
    var tb;
    var tl;
    var lastrow;
    if ($("#liabtable tr:visible").length<$("#patable tr:visible").length) {
      tb = "patable";
      tl = "liabtable";
      lastrow = $("#liabtable tr:last").clone();
      $("#liabtable tr:last").remove();
    }
    else if ($("#liabtable tr:visible").length>$("#patable tr:visible").length) {
      tl = "patable";
      tb = "liabtable";
      lastrow = $("#patable tr:last").clone();
      $("#patable tr:last").remove();
    }
    for (var i = $("#"+tl+" tr:visible").length; i < $("#"+tb+" tr:visible").length-1; i++) {
      $("#"+tl+" tbody").append('<tr><td class="col-xs-6">&nbsp</td><td class="col-xs-2">&nbsp</td><td class="col-xs-2">&nbsp</td><td class="col-xs-2">&nbsp</td></tr>')
    }
    $("#"+tl+" tbody").append(lastrow);
    $('table a').contents().unwrap();
    $("table").removeClass('fixed-table').addClass('table-striped');
    $("#printconvbalance").hide();
    $("#realprintbalance").show();
  });
  $("#realprintbalance").click(function(event) {
    window.print();
  });

});
