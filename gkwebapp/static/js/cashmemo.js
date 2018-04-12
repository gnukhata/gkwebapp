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
   "Mohd. Talha Pawaty" <mtalha456@gmail.com>
   "Sachin Patil" <sachin619patil@rediffmail.com>
 */

$(document).ready(function() {

    //This ajax will call 'Record Cash Memo' Tab with 'status'='in'.
    $("#cashmemo_record").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/cashmemos?action=showadd&status=in",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#cashmemo_div").html(resp);
    }
    }
  );
  });
    
  //This ajax will call 'Create cash memo' Tab with 'status'='out'.
  $("#cashmemo_create").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/cashmemos?action=showadd&status=out",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#cashmemo_div").html(resp);
    }
    }
  );
  });
  $("#cashmemo_view").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/cashmemos?action=showedit",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#cashmemo_div").html(resp);
    }
    }
  );
  });

  $("#cashmemo_record").click();

    return false;
});
