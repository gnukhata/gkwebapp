/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018, 2019, 2020 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
  Free Software Foundation, Inc.,51 Franklin Street, 
  Fifth Floor, Boston, MA 02110, United States


   Contributors:
   "Krishnakant Mane" <kk@gmail.com>
   "Karan Kamdar" <kamdar.karan@gmail.com>
   "Prajkta Patkar" <prajkta@riseup.com>
   "Abhijith Balan" <abhijith@dff.org.in>
   "rohan khairnar" <rohankhairnar@gmail.com>
 */
// This js is use in budget.jinja2 file.
$(document).ready(function() {
  $("a[href ='#budget_create']").click(function() {
    
    
    $.ajax(
    {

    type: "POST",
    url: "/budget?type=addtab",
    global: false,
    async: false,
    datatype: "text/html", 
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#budget_create").html(resp);
      $("#budget_edit").html("");
    }
    }
  );
  });

  $("a[href ='#budget_edit']").click(function() {
    $.ajax(
    {

    type: "POST",
    url: "/budget?type=edittab",
    global: false,
    async: false,
    datatype: "text/html",
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
      $("#budget_edit").html(resp);
      $("#budget_create").html("");
      $("#budget_list").html("");
    }
    }
  );
  });

  $("a[href ='#budget_report']").click(function (e) {
    // Loads list of all budget to view budget report.
    $.ajax({
      url: '/budget?type=viewbudgetreportpage',
      type: 'POST',
      global: false,
      async: false,
      datatype: 'text/html',
      data: {"menuflag":1},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }

    })
     .done(function(resp) {
       $("#budget_report").html(resp);
       $("#budget_edit").html("");
      $("#budget_create").html("");
      $("#budget_list").html("");
     });
  });

  $("a[href ='#budget_create']").click();
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    if(e.target.attributes.href.value=="#budget_create"){
      $("#c_btype").focus();
    }
    else if(e.target.attributes.href.value=="#budget_edit"){
      $("#e_cash").focus();
    }
    else if(e.target.attributes.href.value=="#budget_report"){
      $("#cash").focus();
    }
  });
  $("a[href ='#budget_edit']").click(function(event) {
    $("#e_cash").focus();
  });
  $("a[href ='#budget_report']").click(function(event) {
    $("#cash").focus();
  });
  });
