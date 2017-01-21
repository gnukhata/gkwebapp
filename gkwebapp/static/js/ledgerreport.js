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
"Sachin Patil" <sachpatil@openmailbox.org>
*/
// This script is for ledger report.
// refer listofstockitems.js file for documentation.
$(document).ready(function() {
  $('.modal-backdrop').remove();
  $("#msspinmodal").modal("hide");
  $(".fixed-table-loading").remove();

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
    var id = $(this).attr('data-value');
    var rindex = $(this).index();

    if(e.which==13)
    {

      $('#ledgertable tbody tr:eq('+rindex+')').dblclick() ;
    }

    if(e.which==32)
    {
      // On space key press the following code checks user's role
      // if user is an admin or a manager then it checks whether the text in the third coloumn(index 2) is blank or '***'
      // If its '***' then the selected voucher was locked so pressing space means user wants to unlock it, so vstatus variable is set to False and vice versa.
      // In short the following code toggles the lock status of the selected voucher.
      e.preventDefault();

      if($(this).find('td:eq(2)').val()=="na")
      {
        return false;
      };

      if(urole =="-1" || urole=="0")
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
        $("#ua-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#ua-alert").alert('close');
        });

        return false;

      }
    }
  });


  $("#ledgertable").off('click','tr').on('click','tr',function(e){
    e.preventDefault();
    var id = $(this).attr('data-value');
    var currindex = $(this).index();
    $('#ledgertable tr').removeClass('selected');
    $(this).toggleClass('selected');
    $('#ledgertable tbody tr:eq('+currindex+') a').focus();

  });

  $("#ledgertable ").off('dblclick','tr').on('dblclick','tr',function(e){
  // This function opens a modal of the selected voucher.
  // It shows the complete details of the selected voucher along with option to edit, delete and clone.
    e.preventDefault();
    var id = $(this).attr('data-value');
    if (id=="")
    {
      return false;
    }
    $("#modalindex").val($(this).index());
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
        // A variable is set to indicate from which report this modal is loaded.
        // Depending on the value of #side item, the report is displayed.
        if ($("#side").val()=="dr") {// if its dr then only drs report is shown after modal is closed.
          $.ajax(
            {
              type: "POST",
              url: "/showledgerreport",
              global: false,
              async: false,
              datatype: "text/html",
              data: {"backflag":$("#backflag").val(),"side":"dr","accountcode":$("#accountcode").val(),"calculatefrom":$("#calculatefrom").val(),"calculateto":$("#calculateto").val(),"financialstart":$("#financialstart").val(),"projectcode":$("#projectcode").val(),"monthlyflag":$("#monthlyflag").val(),"narrationflag":$("#narrationflag").val()},
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
        }
        else if ($("#side").val()=="cr") {// if its cr then only crs report is shown after modal is closed.
          $.ajax(
            {
              type: "POST",
              url: "/showledgerreport",
              global: false,
              async: false,
              datatype: "text/html",
              data: {"backflag":$("#backflag").val(),"side":"cr","accountcode":$("#accountcode").val(),"calculatefrom":$("#calculatefrom").val(),"calculateto":$("#calculateto").val(),"financialstart":$("#financialstart").val(),"projectcode":$("#projectcode").val(),"monthlyflag":$("#monthlyflag").val(),"narrationflag":$("#narrationflag").val()},
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
        }
        else {// else the complete ledger is shown.
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
        }

      });
    });
  });

$("#dualledger").click(function(event) {
  /* shows an option to open another ledger in the same page. i.e dual ledger. */
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
    $("#viewvc").html("");
    $('.modal-backdrop').remove();
    $('.modal').modal('hide');
    $("#viewvc").html(resp);
    $('#m_dualledger').modal('show');
    $('#m_dualledger').on('shown.bs.modal', function (e)
    {
      $("#viewdualledger_accname").focus();

    });
    $('#m_dualledger').on('hidden.bs.modal', function (e)
    {
      $("table tbody tr:first a").focus();
    });

  });


});

$('#lclearfields').click(function(){
  $(this).siblings(".bootstrap-table").find(".form-control").val("");
});

$(".search").children(".form-control").keyup(function(event){
  if (event.keyCode == 27) {
    $(this).val("");
  }
});

$("#printledger").click(function(event) {
  // shows printable version of the report.
  var printdata = {"orgname": sessionStorage.getItem('orgn'), "fystart":sessionStorage.getItem('year1'), "fyend": sessionStorage.getItem('year2'), "backflag":$("#backflag").val(),"accountcode":$("#accountcode").val(),"calculatefrom":$("#calculatefrom").val(), "calculateto":$("#calculateto").val(),"financialstart":sessionStorage.yyyymmddyear1,"projectcode":$("#projectcode").val(),"monthlyflag":false,"narrationflag":$("#narrationflag").val()}
  if ($("#side").val()!="") {
    printdata.side=$("#side").val();
  }
  $("#msspinmodal").modal("show");
  $.ajax({
    url: '/printledger',
    type: 'POST',
    dataType: 'html',
    data: printdata,
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  })
  .done(function(resp) {
    $("#info").html(resp);
    console.log("success");
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

});

  $("#drsonly").click(function(event) {
  // shows only debit side of the ledger.
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":$("#backflag").val(),"side":"dr","accountcode":$("#accountcode").val(),"calculatefrom":$("#calculatefrom").val(),"calculateto":$("#calculateto").val(),"financialstart":$("#financialstart").val(),"projectcode":$("#projectcode").val(),"monthlyflag":$("#monthlyflag").val(),"narrationflag":$("#narrationflag").val()},
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

  $("#crsonly").click(function(event) {
  // shows only credit side of the ledger.
    $.ajax(
      {
        type: "POST",
        url: "/showledgerreport",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"backflag":$("#backflag").val(),"side":"cr","accountcode":$("#accountcode").val(),"calculatefrom":$("#calculatefrom").val(),"calculateto":$("#calculateto").val(),"financialstart":$("#financialstart").val(),"projectcode":$("#projectcode").val(),"monthlyflag":$("#monthlyflag").val(),"narrationflag":$("#narrationflag").val()},
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

  $("#back").click(function(event) {
    // this button only appears if this ledger is called from some other page rather than the ledger view page.
    if ($("#side").val()!="") {
    // if side items value is not blank then the complete ledger is called on back button.
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
    }
    else{
      if ($("#backflag").val()<=3) {// is backflag value is 1 or 2 or 3 then trial balance report is called.
      $.ajax(
        {
          type: "POST",
          url: "/showtrialbalancereport",
          global: false,
          async: false,
          datatype: "text/html",
          data: {"financialstart":sessionStorage.yyyymmddyear1,"calculateto":$("#calculateto").val(),"trialbalancetype":$("#backflag").val()},// net = 1, gross = 2, extended = 3
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
    else if ($("#backflag").val()==4) {// if value is 4 then cash flow report is called.
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
    else if ($("#backflag").val()==5){// if value is 5 then ledger report is called.
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
    else if ($("#backflag").val()==6) {// for 6 project statement report is called.
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
    else if ($("#backflag").val()==7) {// for 7 profit and loss report is called.
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
    else if ($("#backflag").val()==8) {// for 8 vertical balance sheet report i.e sources and applications of funds reports is called.
      $.ajax(
        {
          type: "POST",
          url: "/showbalancesheetreport",
          global: false,
          async: false,
          datatype: "text/html",
          data: {"balancesheettype":"verticalbalancesheet","calculateto":$("#calculateto").val(),"orgtype":sessionStorage.orgt},
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
    else if ($("#backflag").val()==9) {// for 9 conventionalbalancesheet report is called.
      $.ajax(
        {
          type: "POST",
          url: "/showbalancesheetreport",
          global: false,
          async: false,
          datatype: "text/html",
          data: {"balancesheettype":"conventionalbalancesheet","calculateto":$("#calculateto").val(),"orgtype":sessionStorage.orgt},
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
    }}
  });
  $("#print").click(function(event) {
      event.preventDefault();
  		var orgname = sessionStorage.getItem('orgn');
  		var orgtype = sessionStorage.getItem('orgt');
  		var xhr = new XMLHttpRequest();

  		xhr.open('GET', '/printledgerreport?orgname='+ orgname+'&fystart='+sessionStorage.yyyymmddyear1+'&fyend='+sessionStorage.getItem('year2')+'&accountcode='+$("#accountcode").val()+'&calculatefrom='+$("#calculatefrom").val()+'&calculateto='+$("#calculateto").val()+'&projectcode='+$("#projectcode").val(), true);
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

  });

  $("#anotherledger").click(function(event) {
    $("#showviewledger").click();
  });


});
