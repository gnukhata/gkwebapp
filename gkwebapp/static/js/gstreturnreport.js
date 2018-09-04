/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
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
"Akhil KP" <akhilkpdasan@protonmail.com>
*/

$(document).ready(function() {
  $("#msspinmodal").modal("hide");
  $('.modal-backdrop').remove();
  $('#r1-type').focus();


  $("#r1-type").on('change', function() {
    if ($(this).val() == "b2b") {
      $("#b2b-container").show();
      $("#b2cl-container").hide();
      $("#b2cs-container").hide();
      $("#cdnr-container").hide();
      $("#cdnur-container").hide();
    }
    if ($(this).val() == "b2cl") {
      $("#b2b-container").hide();
      $("#b2cl-container").show();
      $("#b2cs-container").hide();
      $("#cdnr-container").hide();
      $("#cdnur-container").hide();
    }
    if ($(this).val() == "b2cs") {
      $("#b2b-container").hide();
      $("#b2cl-container").hide();
      $("#b2cs-container").show();
      $("#cdnr-container").hide();
      $("#cdnur-container").hide();
    }
    if ($(this).val() == "cdnr") {
      $("#b2b-container").hide();
      $("#b2cl-container").hide();
      $("#b2cs-container").hide();
      $("#cdnr-container").show();
      $("#cdnur-container").hide();
    }
    if ($(this).val() == "cdnur") {
      $("#b2b-container").hide();
      $("#b2cl-container").hide();
      $("#b2cs-container").hide();
      $("#cdnr-container").hide();
      $("#cdnur-container").show();
    }
  })

  $('#spreadsheet').click(function (event) {
    event.preventDefault();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','/gstreturns?action=spreadsheet'+ '&start='+$("#start").val()+'&end='+$("#end").val(),true);
    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    xhr.responseType = 'blob';

    xhr.onload = function(e) {
      if (this.status == 200) {
        var blob = this.response;
        var url = window.URL.createObjectURL(blob);
        window.location.assign(url);
      }
    };
    xhr.send();
  });

});
