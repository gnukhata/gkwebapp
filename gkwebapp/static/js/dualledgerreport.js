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
*/

$(document).ready(function() {
  $('#ledgertable1 tbody tr:first-child td:eq(1) a').focus();
  $('#ledgertable1 tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');
  var rcindex = 0
  var pyindex = 0
  var percentwid = 100*(($(".table-fixedheader").width()-12)/$(".table-fixedheader").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  var percentheigth = 100*(($("body").height()-$(".navbar").height()-158)/$("body").height());
  $('.table-fixedheader tbody').height(percentheigth+"%");
  $(document).off('focus' ,'.vno1').on('focus' ,'.vno1',function() {
    $('#ledgertable1 tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.vno1').on('blur' ,'.vno1',function() {
    $('#ledgertable1 tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;

  $(document).off('keydown' ,'.vno1').on('keydown' ,'.vno1',function(event) {
    curindex = $(this).closest('tr').index();
    rcindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#ledgertable1 tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#ledgertable1 tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }
    else if (event.which==39)
    {

      $('#ledgertable2 tbody tr:eq('+pyindex+') td:eq(1) a').focus();
    }
  });

  var urole = $("#urole").val();


  $("#ledgertable1").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#ledgertable1 tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#ledgertable1 tbody tr:eq('+currindex+') td:eq(1) a').focus();

  });

  $("#ledgertable1").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==13)
    {

    $('#ledgertable1 tbody tr:eq('+rindex+')').dblclick() ;
    }
});


  $("#ledgertable1 tbody tr").off('dblclick').on('dblclick',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    if (id=="")
    {
      return false;
    }

    $.ajax(
      {

        type: "POST",
        url: "/viewvoucher",
        global: false,
        async: false,
        datatype: "text/html",
        data : {"id":id},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        }
      }
    )
    .done(function(resp)
    {
      $("#viewvc").html("");
      $('.modal-backdrop').remove();
      $('.modal').modal('hide');
      $("#viewvc").html(resp);
      $('#myModal').modal('show');
      $('#myModal').on('shown.bs.modal', function (e)
      {
        $(".btnfocus:enabled:first").focus();

      });
      $('#myModal').on('hidden.bs.modal', function (e)
      {
        $("#viewvc").html("");

        $.ajax(
          {
            type: "POST",
            url: "/showdualledgerreport",
            global: false,
            async: false,
            datatype: "text/html",
            data: {"backflag":$("#backflag").val(),"accountcode2":$("#accountcode2").val(),"calculatefrom2":$("#calculatefrom2").val(),"calculateto2":$("#calculateto2").val(),"projectcode2":$("#projectcode2").val(),"monthlyflag2":"false","narrationflag2":$("#narrationflag2").val(),"accountcode1":$("#accountcode1").val(),"calculatefrom1":$("#calculatefrom1").val(),"calculateto1":$("#calculateto1").val(),"financialstart":$("#financialstart").val(),"projectcode1":$("#projectcode1").val(),"monthlyflag1":"false","narrationflag1":$("#narrationflag1").val()},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
          })
            .done(function(resp)
            {
              $(".modal-backdrop").remove();
              $("#info").html(resp);
            }
          );
      });
    });
  });


  $(document).off('focus' ,'.vno2').on('focus' ,'.vno2',function() {
    $('#ledgertable2 tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.vno2').on('blur' ,'.vno2',function() {
    $('#ledgertable2 tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;


  $(document).off('keydown' ,'.vno2').on('keydown' ,'.vno2',function(event) {
    curindex = $(this).closest('tr').index();
    pyindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#ledgertable2 tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#ledgertable2 tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }
    else if (event.which==37)
    {

      $('#ledgertable1 tbody tr:eq('+rcindex+') td:eq(1) a').focus();
    }


  });

  var urole = $("#urole").val();


  $("#ledgertable2").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#ledgertable2 tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#ledgertable2 tbody tr:eq('+currindex+') a').focus();

  });

  $("#ledgertable2").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==13)
    {

    $('#ledgertable2 tbody tr:eq('+rindex+')').dblclick() ;
    }
});


  $("#ledgertable2 tbody tr").off('dblclick').on('dblclick',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    if (id=="")
    {
      return false;
    }

    $.ajax(
      {

        type: "POST",
        url: "/viewvoucher",
        global: false,
        async: false,
        datatype: "text/html",
        data : {"id":id},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        }
      }
    )
    .done(function(resp)
    {
      $("#viewvc").html("");
      $('.modal-backdrop').remove();
      $('.modal').modal('hide');
      $("#viewvc").html(resp);
      $('#myModal').modal('show');
      $('#myModal').on('shown.bs.modal', function (e)
      {
        $(".btnfocus:enabled:first").focus();

      });
      $('#myModal').on('hidden.bs.modal', function (e)
      {
        $("#viewvc").html("");

        $.ajax(
          {
            type: "POST",
            url: "/showdualledgerreport",
            global: false,
            async: false,
            datatype: "text/html",
            data: {"backflag":$("#backflag").val(),"accountcode2":$("#accountcode2").val(),"calculatefrom2":$("#calculatefrom2").val(),"calculateto2":$("#calculateto2").val(),"projectcode2":$("#projectcode2").val(),"monthlyflag2":"false","narrationflag2":$("#narrationflag2").val(),"accountcode1":$("#accountcode1").val(),"calculatefrom1":$("#calculatefrom1").val(),"calculateto1":$("#calculateto1").val(),"financialstart":$("#financialstart").val(),"projectcode1":$("#projectcode1").val(),"monthlyflag1":"false","narrationflag1":$("#narrationflag1").val()},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            },
          })
            .done(function(resp)
            {
              $(".modal-backdrop").remove();
              $("#info").html(resp);
            }
          )
      });
    });
  });


  $("#dlback").click(function(event) {
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"financialstart":$("#financialstart").val(),"backflag":$("#backflag").val(),"accountcode":$("#accountcode2").val(),"calculatefrom":$("#calculatefrom2").val(),"calculateto":$("#calculateto2").val(),"projectcode":$("#projectcode2").val(),"monthlyflag":"false","narrationflag":$("#narrationflag2").val()},
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
