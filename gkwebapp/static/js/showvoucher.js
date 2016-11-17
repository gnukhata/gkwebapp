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

$(document).ready(function(){
  $('.modal-backdrop').remove();
  (function($){
    $.fn.callvoucher = function(vtype){
        return this.each(function(){
          $("#msspinmodal").modal("show");
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
