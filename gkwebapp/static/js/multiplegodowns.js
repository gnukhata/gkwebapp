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
"Bhavesh Bawadhane" <bbhavesh07@gmail.com>
*/

$(document).ready(function() {
  $(document).off("keydown",".m_godname").on("keydown",".m_godname",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)
    {
        $('#m_godtable tbody tr:eq('+curindex+') td:eq(1) input').focus();
        $('#m_godtable tbody tr:eq('+curindex+') td:eq(1) input').select();
    }
    if (event.which==38)
    {
        $('#m_godtable tbody tr:eq('+previndex+') td:eq(2) input').focus();
        $('#m_godtable tbody tr:eq('+previndex+') td:eq(2) input').select();
    }
    if (event.which==13)
    {
        $('#m_godtable tbody tr:eq('+ curindex +') td:eq(1) input:enabled').focus();
        $('#m_godtable tbody tr:eq('+ curindex +') td:eq(1) input:enabled').select();
    }
  });

  $(document).off("keydown",".m_godaddress").on("keydown",".m_godaddress",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)
    {
        $('#m_godtable tbody tr:eq('+curindex+') td:eq(2) input').focus();
        $('#m_godtable tbody tr:eq('+curindex+') td:eq(2) input').select();
    }
    if (event.which==38)
    {
        $('#m_godtable tbody tr:eq('+ curindex +') td:eq(0) input').focus();
        $('#m_godtable tbody tr:eq('+ curindex +') td:eq(0) input').select();
    }
    if (event.which==13)
    {
        $('#m_godtable tbody tr:eq('+ curindex +') td:eq(2) input:enabled').focus();
        $('#m_godtable tbody tr:eq('+ curindex +') td:eq(2) input:enabled').select();
    }
  });

  $(document).off("keydown",".m_godcontact").on("keydown",".m_godcontact",function(event)
  {
    var curindex = $(this).closest('tr').index();
    var nextindex = curindex+1;
    var previndex = curindex-1;
    if (event.which==40)
    {
        $('#m_godtable tbody tr:eq('+ nextindex +') td:eq(0) input').focus();
        $('#m_godtable tbody tr:eq('+ nextindex +') td:eq(0) input').select();
    }
    if (event.which==38)
    {
        $('#m_godtable tbody tr:eq('+ curindex +') td:eq(1) input').focus();
        $('#m_godtable tbody tr:eq('+ curindex +') td:eq(1) input').select();
    }
    if (event.which==13)
    {
      if ($(this).closest('tr').is(":last-child"))
      {
        addRow(curindex);
      }
      else
      {
        $('#m_godtable tbody tr:eq('+nextindex+') td:eq(0) input:enabled').focus();
        $('#m_godtable tbody tr:eq('+nextindex+') td:eq(0) input:enabled').select();
      }
    }
  });

  function addRow(curindex)
  {
    var godname = $('#m_godtable tbody tr:eq('+curindex+') td:eq(0) input').val();
    var godaddress = $('#m_godtable tbody tr:eq('+curindex+') td:eq(1) input').val();
    var godcontact = $('#m_godtable tbody tr:eq('+curindex+') td:eq(2) input').val();
    if (godname == "" ){
      $("#m_blank-alert").alert();
      $("#m_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#m_blank-alert").hide();
      });
      $('#m_godtable tbody tr:eq('+ blankindex +') td:eq(0) input').focus().select();
      return false;
    }
    if(godaddress == ""){
      $("#m_addressblank-alert").alert();
      $("#m_addressblank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#m_addressblank-alert").hide();
      });
      $('#m_godtable tbody tr:eq('+ blankindex +') td:eq(1) input').focus().select();
      return false;
    }
    if(godcontact == ""){
      $("#m_contactblank-alert").alert();
      $("#m_contactblank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#m_contactblank-alert").hide();
      });
      $('#m_godtable tbody tr:eq('+ blankindex +') td:eq(2) input').focus().select();
      return false;
    }

    $.ajax({
      url: '/godownexists',
      type: 'POST',
      datatype: 'json',
      data: {"godownname": godname, "godownaddress": godaddress, "godowncontact": godcontact},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      }
    })
    .done(function(resp)
    {
      if (resp["gkstatus"]==1)
      {
        $("#m_duplicate-alert").alert();
        $("#m_duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#m_duplicate-alert").hide();
        });
        $('#m_godtable tbody tr:eq('+curindex+') td:eq(0) input').focus();
        $('#m_godtable tbody tr:eq('+curindex+') td:eq(0) input').select();
      }
      else if (resp["gkstatus"]==0)
      {
        $("#m_godtable").append('<tr>'+
        '<td class="col-xs-3">' +
        '<input type="text" id="m_alt_godname"class="form-control input-sm m_godname" placeholder="Godown Name">' +
        '</td>' +
        '<td class="col-xs-4">' +
          '<input type="text" id="m_alt_godaddress"class="form-control input-sm m_godaddress" placeholder="Godown Address">' +
        '</td>' +
        '<td class="col-xs-3">' +
          '<input type="text" id="m_alt_godcontact"class="form-control input-sm m_godcontact" placeholder="Godown Contact">' +
        '</td>' +
        '<td class="col-xs-2">' +
        '<a href="#" class="m_del"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'+
        '</td>'+
        '</tr>');
      }
    $('#m_godtable tbody tr:last td:eq(0) input').focus().select();
    });
  }

  $(document).off("click",".m_del").on("click", ".m_del", function() {
    $(this).closest('tr').fadeOut(200, function(){
      $(this).closest('tr').remove();	 //closest method gives the closest element specified
      $('#m_godtable tbody tr:last td:eq(0) input').focus().select();
    });
    $('#m_godtable tbody tr:last td:eq(0) input').select();
  });

  var blankindex = 0;
  var allow = true;
  $(document).off("click",".#god_add").on("click", "#god_add", function() {
    var output = [];	// This is an array which will contain dictionaries representing rows of the table.
    $("#m_godtable tbody tr").each(function() { //loop for the rows of the table body
      var godn = $(".m_godname", this).val();
      var goda = $(".m_godaddress", this).val();
      var godc = $(".m_godcontact", this).val();
      if (godn == "" ){
        blankindex = $(this).closest('tr').index();
        $("#m_blank-alert").alert();
        $("#m_blank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#m_blank-alert").hide();
        });
        $('#m_godtable tbody tr:eq('+ blankindex +') td:eq(0) input').focus().select();
        allow = false;
        return false;
      }
      if(goda == ""){
        blankindex = $(this).closest('tr').index();
        $("#m_addressblank-alert").alert();
        $("#m_addressblank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#m_addressblank-alert").hide();
        });
        $('#m_godtable tbody tr:eq('+ blankindex +') td:eq(1) input').focus().select();
        allow =false;
        return false;
      }
      if(godc == ""){
        blankindex = $(this).closest('tr').index();
        $("#m_contactblank-alert").alert();
        $("#m_contactblank-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#m_contactblank-alert").hide();
        });
        $('#m_godtable tbody tr:eq('+ blankindex +') td:eq(2) input').focus().select();
        allow = false;
        return false;
      }
      var obj = {};
      obj.godownname = godn;
      obj.godownaddress = goda;
      obj.godowncontact = godc;
      output.push(obj);
    });
    if(!allow){
      allow = true;
      return false;
    }
    $.ajax({
      url: '/addmultigodowns',
      type: 'POST',
      datatype: 'json',
      data: {"goddetails": JSON.stringify(output)},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      }
    })
    .done(function(resp) {

      if(resp["gkstatus"]==0)
      {
        $("#m_multigod").modal('hide');
        $("#reset").click();
        $('.modal-backdrop').remove();
        $("#success-alert").alert();
        $("#success-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#success-alert").hide();
        });
      }
      else if(resp["gkstatus"]==1)
      {
        $("#m_multigod").modal('hide');
        $("#duplicate-alert").alert();
        $("#duplicate-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#duplicate-alert").hide();
        });
      }
      else
      {
        $("#m_multigod").modal('hide');
        $("#failure-alert").alert();
        $("#failure-alert").fadeTo(2250, 500).slideUp(500, function(){
          $("#failure-alert").hide();
        });
      }
    });
  });
});
