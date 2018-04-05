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
  Free Software Foundation, Inc.,51 Franklin Street, 
  Fifth Floor, Boston, MA 02110, United States


Contributors:
   "Krishnakant Mane" <kk@dff.org.in>
   "Prajkta Patkar"<prajkta@riseup.net>
   "Pravin Dake" <pravindake24@gmail.com>
*/

$(document).ready(function() {
    $("#msspinmodal").modal("hide");
    $('.modal-backdrop').remove();
    $('#printgstsummary').hide();

    $("#cfback").click(function(event) {
	$("#gstsummary").click();
    });
    
    // Click event to see Printableversion of GSTSummaryreport.
    $('#viewprintversion').click(function(event){	
	$("#rptt").unbind('dblclick');
	$(".fixed-table-toolbar").remove();
	$('table a').contents().unwrap();
	$("table").removeClass('fixed-table').addClass('table-striped');
	$('#printgstsummary').show();
	$('#viewprintversion').hide();

    });

    // Click event to Print of GSTSummaryreport
    $('#printgstsummary').click(function(event){
	window.print();
    });
    
});
