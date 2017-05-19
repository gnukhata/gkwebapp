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
   "Abhijith Balan" <abhijithb21@openmailbox.org.in>
 */

// This script is for bill wise accounting

$(document).ready(function() {
  $('.modal-backdrop').remove();
  $(document).off('focus', '.amountpaid').on('focus', '.amountpaid', function(event) {
    event.preventDefault();
    /* Act on the event */
    //being a dynamic generated field the numeric property is added on their focus
    $(".numtype").numeric({ negative : false });
  });
  $(document).off('keydown', '.amountpaid').on('keydown', '.amountpaid', function(event) {
    /* Act on the event */
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex + 1;
    var previndex = curindex - 1;
    var numberofrows = $("#latable tbody tr").length - 1;
    if (event.which == 13) {
      event.preventDefault();
      if (curindex == numberofrows) {
	$("#btclose").focus();
      }
      else {
	$("#latable tbody tr:eq("+nextindex+") td:eq(4) input").focus().select();
      }
    }
    if (event.which == 38) {
      event.preventDefault();
      $("#latable tbody tr:eq("+previndex+") td:eq(4) input").focus().select();
    }
  });
});
