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
"Krishnakant Mane" <kk@gmail.com>
"Navin Karkera" <navin@dff.org.in>
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
"Sachin Patil" <sachin619patil@rediffmail.com>
*/

$(document).ready(function() {

  $("a[href ='#category_create']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/category?action=showadd",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#category_create").html(resp);
      $("#category_edit").html("");
    }
    }
  );
  });
  $("a[href ='#category_edit']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/category?action=showedit",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#category_edit").html(resp);
      $("#category_create").html("");
    }
    }
  );
  });
  $("a[href ='#category_create']").click();

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.attributes.href.value=="#category_create"){
      $("#category_under").focus();
    }
    else if(e.target.attributes.href.value=="#category_edit"){
      $("#category_edit_list").focus();
    }
  });
  $("a[href ='#category_edit']").click(function(event) {
    $("#category_edit_list").focus();
  });
});
