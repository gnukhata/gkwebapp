/*
  Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
  Copyright (C) 2017 Digital Freedom Foundation & Accion Labs Pvt. Ltd.
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
"Krishnakant Mane" <kk@dff.org.in>
"Prajkta Patkar" <prajakta@dff.org.in>
"Abhijeet Balan" <abhijith@dff.org.in>
"Nitesh Chaughule" <nitesh@disroot.org>
*/


$(document).ready(function() {
  $("a[href ='#user_create']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/showuser?type=addtab",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#user_create").html(resp);
      $("#user_edit").html("");
    }
    }
  );
  });

   $("a[href ='#user_edit']").click(function() {
    $.ajax(
    {
    type: "POST",
    url: "/showuser?type=edittab",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#user_edit").html(resp);
      $("#user_create").html("");
    }
    }
  );
  });
    
  $("a[href ='#user_create']").click();
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.attributes.href.value=="#user_create"){
      $("#name").focus();
    }
  });
});
