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
"Sachin Patil" <sachpatil@openmailbox.org>
*/
/*
This script is for the view base page of Unit of measurement.
*/
$(document).ready(function() {

  $("a[href ='#unit_create']").click(function() {
    // loads create unit of measurement page.
    $.ajax(
    {

    type: "POST",
    url: "/unitofmeasurements?action=showadd",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#unit_create").html(resp);
      $("#unit_edit").html("");

    }
    }
  );
  });
  $("a[href ='#unit_edit']").click(function() {
    // loads edit unit of measurement page.
    $.ajax(
    {

    type: "POST",
    url: "/unitofmeasurements?action=showedit",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#unit_edit").html(resp);
      $("#unit_create").html("");
    }
    }
  );
  });
  $("a[href ='#unit_create']").click(); // load create unit of measurement on laoding this page.

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    // setting focus on the first field of the loaded page.
    if(e.target.attributes.href.value=="#unit_create"){ // depending on the href value of the selected link focus is set.
      $("#unit_name").focus();
    }
    else if(e.target.attributes.href.value=="#unit_edit"){
      $("#unit_edit_list").focus();
    }
  });
});
