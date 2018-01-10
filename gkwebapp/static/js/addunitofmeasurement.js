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
  $('#unit_name').focus();
  $("#conversion_rate").numeric();


  $("#unit_name").keydown(function(event) {
    if (event.which==13) {
      event.preventDefault();
      $("#sub_unit_of").focus().select();
    }
  });

  $("#sub_unit_of").keydown(function(event) {
    if (event.which==13 && $("#sub_unit_of option:selected").val()=='') {
      event.preventDefault();
      $("#unit_save").click();
    }
    else if(event.which==13 && $("#sub_unit_of option:selected").val()!='') {
      event.preventDefault();
      $("#conversion_rate").focus().select();

    }
    if (event.which==38 && $("#sub_unit_of option:selected").index()==0) {
      event.preventDefault();
      $("#unit_name").focus().select();
    }
  });
  $("#conversion_rate").keydown(function(event) {
    if (event.which==13){
      event.preventDefault();
      $("#unit_save").click();
    }
    if (event.which==38){
      event.preventDefault();
      $("#sub_unit_of").focus().select();
    }
  });

  $("#sub_unit_of").change(function(event) {
    if ($("#sub_unit_of option:selected").val()!='') {
      $("#conversion_div").show();
    }
    else  {
      $("#conversion_div").hide();
    }
  });
  $("#add_unit_reset").click(function(event) {
    $("a[href='#unit_create']").click();
  });
  $(document).keyup(function(event) {
    if(event.which == 45) {
      $("#unit_save").click();
      event.preventDefault();
      return false;
    }
  });
  $("#unit_save").click(function(event) {
    if ($.trim($('#unit_name').val())=="") {
      $("#unit-blank-alert").alert();
      $("#unit-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#unit-blank-alert").hide();
      });
      $('#unit_name').focus().select();
      return false;
    }

    if ($("#unit_name").val()==$("#sub_unit_of option:selected").text()){
      $("#sameUnit-alert").alert();
      $("#sameUnit-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#sameUnit-alert").hide();
      });
      $('#sub_unit_of').focus().select();
      return false;
    }

    if ($("#conversion_rate").val()=='' && $("#sub_unit_of option:selected").val()!=''){
      $("#conversion-alert").alert();
      $("#conversion-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#conversion-alert").hide();
      });
      $('#conversion_rate').focus().select();
      return false;
    }

    if ($("#conversion_rate").val()==0 && $("#conversion_rate").val()==0.00 && $("#sub_unit_of option:selected").val()!=''){
      $("#conversion-rate-alert").alert();
      $("#conversion-rate-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#conversion-rate-alert").hide();
      });
      $('#conversion_rate').focus().select();
      return false;
    }

    $.ajax({
      url: '/unitofmeasurements?action=save',
      type: 'POST',
      dataType: 'json',
      async : false,
      data: {"unitname": $("#unit_name").val(),"conversionrate":$("#conversion_rate").val(),"subunitof":$("#sub_unit_of option:selected").val()},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      }
    })
    .done(function(resp) {
      if(resp["gkstatus"] == 0){
        $("a[href='#unit_create']").click();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
        return false;
      }
      else if(resp["gkstatus"] == 1){
        $("a[href='#unit_create']").click();
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("duplicate-alert").hide();
        });
        return false;
      }
      else {
        $("#unit_name").focus();
        $("#failure-alert").alert();
        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#failure-alert").hide();
        });
        return false;
      }
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    event.stopPropogation();
  });
});
