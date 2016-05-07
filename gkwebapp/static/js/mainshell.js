shortcut.add("f1",function() {
document.getElementById("toolbar").click();
});
shortcut.add("Alt+G",function() {
document.getElementById("gnukhata").click();
});
shortcut.add("Alt+M",function() {
document.getElementById("master").click();
});
shortcut.add("Alt+T",function() {
document.getElementById("transaction").click();
});
shortcut.add("Alt+R",function() {
document.getElementById("report").click();
});
shortcut.add("Alt+A",function() {
document.getElementById("administration").click();
});
shortcut.add("Alt+H",function() {
document.getElementById("help").click();
});
shortcut.add("f2",function() {
document.getElementById("addaccounttb").click();
});
shortcut.add("f4",function() {
document.getElementById("contratb").click();
});
shortcut.add("f5",function() {
document.getElementById("paymenttb").click();
});
shortcut.add("f6",function() {
document.getElementById("receipttb").click();
});
shortcut.add("f7",function() {
document.getElementById("journaltb").click();
});
shortcut.add("f8",function() {
document.getElementById("salestb").click();
});
shortcut.add("f9",function() {
document.getElementById("purchasetb").click();
});
shortcut.add("Ctrl+F2",function() {
document.getElementById("creditnotetb").click();
});
shortcut.add("Ctrl+F3",function() {
document.getElementById("debitnotetb").click();
});
shortcut.add("Ctrl+F4",function() {
document.getElementById("salesreturntb").click();
});
shortcut.add("Ctrl+F5",function() {
document.getElementById("purchasereturntb").click();
});
shortcut.add("Ctrl+F",function() {
document.getElementById("findvouchertb").click();
});
$(document).ready(function(){
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



  var orname = sessionStorage.getItem('orgn');
  var ortype = sessionStorage.getItem('orgt');
  var styear = sessionStorage.getItem('year1');
  var enyear = sessionStorage.getItem('year2');
  var orgdata = orname + " (" + ortype + ")";
  var yeardata = "Financial Year : " + styear + "-" + enyear;
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
