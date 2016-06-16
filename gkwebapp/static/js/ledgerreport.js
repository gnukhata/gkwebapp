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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
*/

$(document).ready(function() {

  var percentwid = 100*(($(".table-fixedheader").width()-12)/$(".table-fixedheader").width());
  $('.table-fixedheader thead').width(percentwid+"%");
  var percentheigth = 100*(($("body").height()-$(".navbar").height()-148)/$("body").height());
  $('.table-fixedheader tbody').height(percentheigth+"%");

  $(' #ledgertable tbody tr:first-child td:eq(1) a').focus();
  $('#ledgertable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');


  $(document).off('focus' ,'.vno').on('focus' ,'.vno',function() {
    $('#ledgertable tr').removeClass('selected');
    $(this).closest('tr').addClass('selected');
  });

  $(document).off('blur' ,'.vno').on('blur' ,'.vno',function() {
    $('#ledgertable tr').removeClass('selected');

  });
  var curindex ;
  var nextindex;
  var previndex;


  $(document).off('keydown' ,'.vno').on('keydown' ,'.vno',function(event) {
    curindex = $(this).closest('tr').index();
    nextindex = curindex+1;
    previndex = curindex-1;
    if (event.which==40)
    {
      event.preventDefault();
      $('#ledgertable tbody tr:eq('+nextindex+') td:eq(1) a').focus();
    }
    else if (event.which==38)
    {
      if(previndex>-1)
      {
        event.preventDefault();
        $('#ledgertable tbody tr:eq('+previndex+') td:eq(1) a').focus();
      }
    }

  });

  var urole = $("#urole").val();

  $("#ledgertable").off('keydown','tr').on('keydown','tr',function(e){
    var id = $(this).attr('value');
    var rindex = $(this).index();

    if(e.which==13)
    {

      $('#ledgertable tbody tr:eq('+rindex+')').dblclick() ;
    }

    if(e.which==32)
    {
      e.preventDefault();

      if($(this).find('td:eq(2)').val()=="na")
      {
        return false;
      };

      if(urole =="-1")
      {
        var stat = $(this).find('td:eq(2)').html();

        if(stat=="***")
        {

          vstatus = "False";

        }
        else
        {

          vstatus = "True";
        }
        $.ajax({
          type: "POST",
          url: "/lockvoucher",
          data: {"id":id,"vstatus":vstatus},
          global: false,
          async: false,
          dataType: "json",
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(jsonObj)
          {
            gkstatus=jsonObj["gkstatus"]
            if(gkstatus)
            {
              if(stat=="***")
              {

                $('#ledgertable tbody tr:eq('+rindex+') td:eq(2)').html(" ");

              }
              else
              {
                $('#ledgertable tbody tr:eq('+rindex+') td:eq(2)').html("***");
              }
            }
          }
        });
      }
      else
      {
        $("#ua-alert").alert();
        $("#ua").focus();
        $("#ua-alert").fadeTo(2000, 500).slideUp(500, function(){
          $("#ua-alert").alert('close');
        });

        return false;

      }
    }
  });


  $("#ledgertable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('value');
    var currindex = $(this).index();
    $('#ledgertable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#ledgertable tbody tr:eq('+currindex+') a').focus();

  });

  $("#ledgertable tbody tr").off('dblclick').on('dblclick',function(e){
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
            url: "/showledgerreport",
            global: false,
            async: false,
            datatype: "text/html",
            data: {"backflag":$("#backflag").val(),"accountcode":$("#accountcode").val(),"calculatefrom":$("#calculatefrom").val(),"calculateto":$("#calculateto").val(),"financialstart":$("#financialstart").val(),"projectcode":$("#projectcode").val(),"monthlyflag":$("#monthlyflag").val(),"narrationflag":$("#narrationflag").val()},
            beforeSend: function(xhr)
            {
              xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
            }
          })
          .done(function(resp)
          {
            $("#info").html("");
            $("#info").html(resp);
          }
        );
      });
    });
  });

$("#dualledger").click(function(event) {
  /* Act on the event */
  $.ajax({
    url: '/viewdualledger',
    type: 'POST',
    datatype: 'text/html',
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  })
  .done(function(resp) {
    $("#viewvc").html(resp);
    $('#m_dualledger').modal('show');
    $('#m_dualledger').on('shown.bs.modal', function (e)
    {
      $("#viewdualledger_accname").focus();

    });

  });


});

  $("#back").click(function(event) {
    if ($("#backflag").val()<=3) {
      $.ajax(
        {
          type: "POST",
          url: "/showtrialbalancereport",
          global: false,
          async: false,
          datatype: "text/html",
          data: {"financialstart":sessionStorage.yyyymmddyear1,"calculateto":$("#calculateto").val(),"trialbalancetype":$("#backflag").val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          }
        })
        .done(function(resp) {
          $("#info").html(resp);
        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });
    }
    else if ($("#backflag").val()==4) {
      $.ajax(
        {
          type: "POST",
          url: "/showcashflowreport",
          global: false,
          async: false,
          datatype: "text/html",
          data: {"financialstart":sessionStorage.yyyymmddyear1,"orgtype":sessionStorage.orgt,"calculateto":$("#calculateto").val(),"calculatefrom":$("#calculatefrom").val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          }
        })
        .done(function(resp) {
          $("#info").html(resp);
        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });

    }
    else if ($("#backflag").val()==5){
      $.ajax(
        {
          type: "POST",
          url: "/showledgerreport",
          global: false,
          async: false,
          datatype: "text/html",
          data: {"backflag":0,"accountcode":$("#accountcode").val(),"calculatefrom":$("#calculatefrom").val(),"calculateto":$("#calculateto").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":$("#projectcode").val(),"monthlyflag":true,"narrationflag":false},
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
    else if ($("#backflag").val()==6) {
      $.ajax(
        {
          type: "POST",
          url: "/showprojectstatementreport",
          global: false,
          async: false,
          datatype: "text/html",
          data: {"calculateto":$("#calculateto").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":$("#projectcode").val(),"projectname":$("#projectname").val()},
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
    else if ($("#backflag").val()==7) {
      $.ajax(
        {
          type: "POST",
          url: "/showprofitlossreport",
          global: false,
          async: false,
          datatype: "text/html",
          data: {"financialstart":sessionStorage.yyyymmddyear1,"orgtype":sessionStorage.orgt,"calculateto":$("#calculateto").val()},
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          }
        })
        .done(function(resp) {
          $("#info").html(resp);
        })
        .fail(function() {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });
    }
  });
  $("#print").click(function(event) {
    $.ajax(
      {
        type: "GET",
        url: "/printledgerreport",
        global: false,
        async: false,
        dataType : 'text',
        data: {"orgname": sessionStorage.getItem('orgn'), "fystart":sessionStorage.getItem('year1'), "fyend": sessionStorage.getItem('year2'), "backflag":0,"accountcode":$("#accountcode").val(),"calculatefrom":$("#calculatefrom").val(), "calculateto":$("#calculateto").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":$("#projectcode").val(),"monthlyflag":false,"narrationflag":false},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp) {
          window.open('data:application/pdf;charset=utf-8,' + encodeURIComponent(resp));
        }
      });

  });

  $("#anotherledger").click(function(event) {
    $("#showviewledger").click();
  });


});
