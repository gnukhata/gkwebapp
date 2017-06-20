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
"Abhijith Balan" <abhijithb21@openmailbox.org>
*/
// This script is for list of godowns report.
// refer listofstockitems.js file for documentation.

$(document).ready(function() {
  $('.model-backdrop').remove();

  $(".fixed-table-loading").remove();
  $('#latable tbody tr:first-child td:eq(1) a').focus();
  $('#latable tbody tr:first-child td:eq(1) a').closest('tr').addClass('selected');

  $('#laclearfields').click(function(){
    $(".search").children(".form-control").val("");
    $("#laclearfields").hide();
		$(".search").children(".form-control").focus();
  });
  $(".search").children(".form-control").keyup(function(event){
  	$("#laclearfields").show();
      if (event.keyCode == 27) {
        $(this).val("");
  			$("#laclearfields").hide();
      }
  		else if ($(this).val() == "") {
  			$("#laclearfields").hide();
  		}
    });
});
