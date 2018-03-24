/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
"Reshma Bhatawadekar" <bhatawadekar1reshma@gmail.com>
"Vasudha Kadge" <kadge.vasudha@gmail.com>
*/

// This script is for the print page of Debit Note and Credit Note

$(document).ready(function() {
    ondrcr = 1;
    $("title").html("");
    window.scrollTo(0,0);
  $("#drcrprint").click(function(event) {
    window.print();
  });

    $("#drcrback").click(function(event) {
	$('#printdiv').hide();
	$('#printdiv').html("");
	$('#tabdiv').show();
	$('#sel_creditnote').focus();
      $('html,body').animate({scrollTop: ($("#orgdata").offset().top)},'slow');
  });

  
  (function() {
var beforePrint = function() {
// catch beforeprint event just before printing takes place and remove the organisation name from print.
  console.log("beforeprint");
  if (ondrcr==1) {
    $("#printorgnameyear").removeClass('visible-print').addClass('hidden-print');
  }
};
      
// set everything back like before after printing.
var afterPrint = function() {
  console.log("afterPrint");
    $("#printorgnameyear").removeClass('hidden-print').addClass('visible-print');
    $("#printyears").removeClass('hidden-print');
    $("#sublabel").html("Subject :");
    $("#notespara").html("Notes : ");
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
$.ajax({
        url: '/editorganisation?action=getattachment',
        type: 'POST',
        datatype: 'json',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        },
        data: {},
    })
    .done(function(resp) {
          var imagesrc = "data:image/png;base64,"+resp["logo"];


         if(resp["logo"]){
        $("#imgbox").attr("src", imagesrc);   
         }
         else{
           $("#logo_div").hide();
         }

        console.log("success");
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

});
