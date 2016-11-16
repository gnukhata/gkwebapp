
$(document).ready(function() {
  oninvoice = 1;
  $("#subject").focus();
  $("title").html("GNUKhata")
  $("#subject").keydown(function(event) {
    if (event.which==13) {
      $("#notes").focus().select();
    }
  });

  $("#invprint").click(function(event) {
    window.print();
  });
  (function() {
var beforePrint = function() {
  console.log("beforeprint");
  if (oninvoice==1) {
    $("#printorgnameyear").removeClass('visible-print').addClass('hidden-print');
  }
    $("#subject").hide();
    $("#notes").hide();
    if ($("#subject").val()!='') {
      $("#sublabel").html("Subject : "+$("#subject").val());
    } else {
      $("#sublabel").html("");
    }

    if ($("#notes").val()!='') {
      $("#notespara").html("<strong>Notes :</strong> "+$("#notes").val());
    } else {
      $("#notespara").html("");
    }
};
var afterPrint = function() {
  console.log("afterPrint");
    $("#printorgnameyear").removeClass('hidden-print').addClass('visible-print');
    $("#printyears").removeClass('hidden-print');
    $("#sublabel").html("Subject :");
    $("#notespara").html("Notes : ");
    $("#subject").show();
    $("#notes").show();
};

if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
        if (mql.matches) {
            beforePrint();
        } else {
            afterPrint();
        }
    });
}

window.onbeforeprint = beforePrint;
window.onafterprint = afterPrint;
}());
});
