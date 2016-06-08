
$(document).ready(function(){

  $(document).keydown(function(event) {
        if(event.ctrlKey && event.keyCode == 71) {
          $("#gnukhata").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 77) {
          $("#master").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 84) {
          $("#transaction").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 82) {
          $("#report").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 68) {
          $("#administration").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 72) {
          $("#help").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 76) {
          $("#logout").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 79) {
          $("#changeorg").click();
          event.preventDefault();
          }
        if(event.ctrlKey && event.keyCode == 81) {
          $("#quit").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 80) {
          $("#showproject").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 82) {
          $("#BRS").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 78) {
          $("#createuser").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 85) {
          $("#REMOVEuser").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 67) {
          $("#changepassword").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 76) {
          $("#showclosebooks").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 73) {
          $("#deleteorg").click();
          event.preventDefault();
          }
        if(event.altKey && event.keyCode == 77) {
          $("#manual").click();
          event.preventDefault();
          }
        if(event.keyCode == 112) {
          $("#toolbar").click();
          event.preventDefault();
        }
        if(event.keyCode == 113) {
          $("#addaccounttb").click();
          event.preventDefault();
          }
        if(event.keyCode == 114) {
          $("#editaccount").click();
          event.preventDefault();
          }
        if(event.keyCode == 115) {
          $("#showviewledger").click();
          event.preventDefault();
          }
        if(event.keyCode == 116) {
          $("#showtrialbalance").click();
          event.preventDefault();
          }
        if(event.keyCode == 117) {
          $("#showprjstate").click();
          event.preventDefault();
          }
        if(event.keyCode == 118) {
          $("#showcashflow").click();
          event.preventDefault();
          }
        if(event.keyCode == 119) {
          $("#showbalancesheet").click();
          event.preventDefault();
          }
        if(event.keyCode == 120) {
          $("#showprofitloss").click();
          event.preventDefault();
          }
        if(event.keyCode == 121) {
          $("#fevoucher").click();
          event.preventDefault();
          }
        if(event.keyCode == 122) {
          $("#listofaccounts").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 49 || event.keyCode == 97)) {
          $("#showcontra").click();
          event.preventDefault();
        }
        if(event.ctrlKey && (event.keyCode == 50 || event.keyCode == 98)) {
          $("#showpayment").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 51 || event.keyCode == 99)) {
          $("#showreceipt").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 52 || event.keyCode == 100)) {
          $("#showjournal").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 53 || event.keyCode == 101)) {
          $("#showsales").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 54 || event.keyCode == 102)) {
          $("#showpurchase").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 55 || event.keyCode == 103)) {
          $("#showcreditnote").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 56 || event.keyCode == 104)) {
          $("#showdebitnote").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 57 || event.keyCode == 105)) {
          $("#showsalesreturn").click();
          event.preventDefault();
          }
        if(event.ctrlKey && (event.keyCode == 48 || event.keyCode == 96)) {
          $("#showpurchasereturn").click();
          event.preventDefault();
          }
      });

  var orname = sessionStorage.getItem('orgn');
  var ortype = sessionStorage.getItem('orgt');
  var styear = sessionStorage.getItem('year1');
  var enyear = sessionStorage.getItem('year2');
  var orgdata = orname + " (" + ortype + ")";
  var yeardata = "Financial Year : " + styear + " to " + enyear;

$("title").append(orname);

$("#showedituser").click(function(e){

$.ajax({
  url: '/showedituser',
  type: 'POST',
  global: false,
  async: false,
  datatype: 'text/html',
  beforeSend: function(xhr)
  {
    xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
  },
  success: function(resp)
  {
    $('#info').html(resp);
  }
});
});

  $("#showeditorg").click(function (e){

    $.ajax({
      type:"POST",
      url: "/showeditOrg",
      global: false,
      async: false,
      datatype: "text/html",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      },
      success: function(resp)
      {
        $('#info').html(resp);
      }
    });
  });


  $('#REMOVEuser').click(function (e) {
      $.ajax(
      {

      type: "POST",
      url: "/removeuser",
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
      }
      }
    );
    });

  $('#editaccount').click(function (e) {

      $.ajax(
      {

      type: "POST",
      url: "/showeditaccount",
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
      }
      }
    );
    });

    $('#changeorg').click(function (e) {
      sessionStorage.clear();
      $("body").load("/");

      });

    $('#listofaccounts').click(function (e) {
      $.ajax(
        {

        type: "POST",
        url: "/showlistofaccounts",
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
        }
        }
      );
      });


  $('#fevoucher').click(function (e) {

      $.ajax(
      {

      type: "POST",
      url: "/findeditvoucher",
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
      }
      }
    );
    });


  if(orgdata!=""||yeardata!="")
  {
  $("#orgdata").html(orgdata);
  $("#yeardata").html(yeardata);
  }
  $('#addaccount').click(function (e) {
    $.ajax(
    {

    type: "POST",
    url: "/showaccount",
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
    }
    }
  );
  });

  $('#createuser').click(function (e) {

    $.ajax({
      url: '/showuser',
      type: 'POST',
      datatype: 'text/html',

    })
    .done(function(resp) {
      $("#info").html(resp);
    })

    });


/*$(document).bind('keydown', 'alt+t', function(event) {


$("#transaction").click();
});*/


  $('#showviewledger').click(function (e) {

      $.ajax(
      {

      type: "POST",
      url: "/showviewledger",
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
      }
      }
    );
    });

    $('#BRS').click(function (e) {

        $.ajax(
        {

        type: "POST",
        url: "/showviewbankrecon",
        global: false,
        async: false,
        datatype: "text/html",
        beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          }
        })
        .done(function(resp){
            $("#info").html(resp);
        });
      });

    $('#showprjstate').click(function (e) {

        $.ajax(
        {

        type: "POST",
        url: "/showviewprojectstatement",
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
        }
        }
      );
      });

  $('#showproject').click(function (e) {
    $.ajax(
    {

    type: "POST",
    url: "/showproject",
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
    }
    }
  );
  });

  $("#showtrialbalance").click(function(event){
    $("#info").load("/showtrialbalance");
  });

  $("#showcashflow").click(function(event){
    $("#info").load("/showcashflow");
  });
  $("#showprofitloss").click(function(event){
    var orgtype = sessionStorage.orgt.replace(/\s/g, "+");
    $("#info").load("/showprofitloss?orgtype="+orgtype);
  });

    $("#showbalancesheet").click(function(event){
      $("#info").load("/showbalancesheet");
    });

  $("#showclosebooks").click(function(event){
    $("#info").load("/showclosebooks");
  });

  $('#addaccounttb').click(function(){
    $('#addaccount').click();
  });
  $('#findvouchertb').click(function(){
    $('#fevoucher').click();
  });
  $('#contratb').click(function(){
    $('#showcontra').click();
  });
  $('#paymenttb').click(function(){
    $('#showpayment').click();
  });
  $('#receipttb').click(function(){
    $('#showreceipt').click();
  });
  $('#journaltb').click(function(){
    $('#showjournal').click();
  });
  $('#salestb').click(function(){
    $('#showsales').click();
  });
  $('#purchasetb').click(function(){
    $('#showpurchase').click();
  });
  $('#creditnotetb').click(function(){
    $('#showcreditnote').click();
  });
  $('#debitnotetb').click(function(){
    $('#showdebitnote').click();
  });
  $('#salesreturntb').click(function(){
    $('#showsalesreturn').click();
  });
  $('#purchasereturntb').click(function(){
    $('#showpurchasereturn').click();
  });

});
