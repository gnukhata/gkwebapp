/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
  This file is part of GNUKhata:A modular,robust and Free Accounting System.

  GNUKhata is Free Software; you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation; either version 3 of
  the License, or (at your option) any later version.

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
// This script is for the print page of invoice.

$(document).ready(function() {
  oninvoice = 1;
  
    $("title").html("");
    window.scrollTo(0,0);
    
  $("#invprint_origin").click(function(event) {
    $("#print_heading").text("TAX INVOICE - ORIGINAL FOR RECIPIENT");
    window.print();
  });
  $("#invprint_duplicate").click(function(event) {
    $("#print_heading").text("TAX INVOICE - DUPLICATE FOR TRANSPORTER");
    window.print();
  });
  $("#invprint_triplicate").click(function(event) {
    $("#print_heading").text("TAX INVOICE - TRIPLICATE FOR SUPPLIER");
    window.print();
  });
  $("#invback").click(function(event){
      if ($("#invload").length == 0) {
          sessionStorage.editprint = 1;
          $("#info").load("/invoice");
          $("#info").data("invid",$("#invid").val());
          return false;
      }
    $.ajax(
      {
        type: "POST",
        url: "/invoice?action=showinv",
        global: false,
        async: false,
        datatype: "text/html",
        data: {"invid":$("#invid").val()},
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      })
        .done(function(resp)
        {
          $("#invload").html(resp).show();
          $('#listdiv').hide();
          $("#printload").html("");
          $("#buttondiv").show();
        }
      );
  });

  (function() {
var beforePrint = function() {
// catch beforeprint event just before printing takes place and remove the organisation name from print.
  console.log("beforeprint");
  if (oninvoice==1) {
    $("#printorgnameyear").removeClass('visible-print').addClass('hidden-print');
  }
  $("#notes").hide();


    if ($("#notes").val()!='') {// same as subject
      $("#notespara").html("<strong>Notes :</strong> "+$("#notes").val());
    } else {

      $("#notespara").html("");
    }
};
// set everything back like before after printing.
var afterPrint = function() {
  console.log("afterPrint");
    $("#printorgnameyear").removeClass('hidden-print').addClass('visible-print');
    $("#printyears").removeClass('hidden-print');
    $("#sublabel").html("Subject :");
    $("#notespara").html("Notes : ");

    $("#notes").show();
};

if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function(mql) {
        if (mql.matches) {
// fires beforeprint function just before printing
            beforePrint();
        } else {
// fires afterprint function after printing
            afterPrint();
        }
    });
}

// for compatibility with other browsers.
window.onbeforeprint = beforePrint;
window.onafterprint = afterPrint;
}());

    $("a[href='#printinvoice2']").click(function() {
   
      $.ajax(
      {
      type: "POST",
      url: "/invoice?action=print",
  
      datatype: "html",
      data: {"invid":$("#invid").val(),"pflag":'2'}, 
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
       
        $("#printinvoice2").html(resp);
        $("#printinvoice3").html("");
        $("#printinvoice1").html("");
          $("#printinvoice4").html("");
          $("#printinvoice5").html("");

      }
      }
    );
    });

    $("a[href='#printinvoice3']").click(function() {
      
      $.ajax(
      {
      type: "POST",
      url: "/invoice?action=print",

      datatype: "html",
      data: {"invid":$("#invid").val(),"pflag":'3'}, 
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        $("#printinvoice3").html(resp);
        $("#printinvoice2").html("");
        $("#printinvoice1").html("");
          $("#printinvoice4").html("");
          $("#printinvoice5").html("");
      }
      }
    );
    });

    $("a[href='#printinvoice1']").click(function() {
     
      $.ajax(
      {
      type: "POST",
      url: "/invoice?action=print",
      datatype: "html",
      data: {"invid":$("#invid").val(),"pflag":'1'}, 
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        $("#printinvoice1").html(resp);
        $("#printinvoice2").html("");
        $("#printinvoice3").html("");
          $("#printinvoice4").html("");
          $("#printinvoice5").html("");
      }
      }
    );
    });

    $("a[href='#printinvoice4']").click(function() {
      
      $.ajax(
      {
      type: "POST",
      url: "/invoice?action=print",
   
      datatype: "html",
      data: {"invid":$("#invid").val(),"pflag":'4'}, 
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        $("#printinvoice4").html(resp);
        $("#printinvoice2").html("");
        $("#printinvoice1").html("");
          $("#printinvoice3").html("");
          $("#printinvoice5").html("");
      }
      }
    );
    });

    $("a[href='#printinvoice5']").click(function() {
      
      $.ajax(
      {
      type: "POST",
      url: "/invoice?action=print",
   
      datatype: "html",
      data: {"invid":$("#invid").val(),"pflag":'5'}, 
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        $("#printinvoice5").html(resp);
        $("#printinvoice4").html("");
        $("#printinvoice2").html("");
        $("#printinvoice1").html("");
          $("#printinvoice3").html("");
      }
      }
    );
    });
    
    $("a[href='#printinvoice1']").click();

});
