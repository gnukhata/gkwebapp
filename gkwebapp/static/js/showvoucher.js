$(document).ready(function(){
  (function($){
    $.fn.callvoucher = function(vtype){
        return this.each(function(){
          $.ajax(
          {
          type: "POST",
          url: "/showvoucher",
          global: false,
          async: false,
          datatype: "json",
          data : {"type":vtype},
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
    }
})(jQuery);

  $('#showcontra').unbind("click").click(function(){
    $(this).callvoucher("contra");
  });
  $('#showjournal').unbind("click").click(function(){
    $(this).callvoucher("journal");
  });
  $('#showpayment').unbind("click").click(function(){
    $(this).callvoucher("payment");
  });
  $('#showreceipt').unbind("click").click(function(){
    $(this).callvoucher("receipt");
  });
  $('#showdebitnote').unbind("click").click(function(){
    $(this).callvoucher("debitnote");
  });
  $('#showcreditnote').unbind("click").click(function(){
    $(this).callvoucher("creditnote");
  });
  $('#showsales').unbind("click").click(function(){
    $(this).callvoucher("sales");
  });
  $('#showpurchase').unbind("click").click(function(){
    $(this).callvoucher("purchase");
  });
  $('#showsalesreturn').unbind("click").click(function(){
    $(this).callvoucher("salesreturn");
  });
  $('#showpurchasereturn').unbind("click").click(function(){
    $(this).callvoucher("purchasereturn");
  });
});
