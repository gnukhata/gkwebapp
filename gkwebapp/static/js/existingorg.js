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
*/

$(document).ready(function()
{
  $("#org-name").focus();

  $("#org-name").keyup(function(e) {
    e.preventDefault();
    if (e.which == 13)
    {
      $("#finalyears").focus();

    }
  });

  $("#finalyears").keydown( function(e) {

    var s1 = $("#finalyears option:selected").index();
    if (e.which == 38 && s1 == 0)
    {
      e.preventDefault();
      $("#org-name").focus();
    }
    if (e.which == 13)
    {
      e.preventDefault();
      $("#callLogin").click();
    }
  });

  $("#org-name").bind("change keyup focusin", function(){
    var org = $("#org-name option:selected").val();
    var orgobj = eval('('+org+')');
    $.ajax({
      type: "POST",
      url: "/yearcode",
      data: orgobj,
      global: false,
      async: false,
      dataType: "json",
      success: function(jsonObj) {
        ListofYears = jsonObj["gkresult"],
        $('#finalyears').empty();
        for (i in ListofYears ) {
          $('#finalyears').append('<option value="' + ListofYears[i].orgcode + '">' + ListofYears[i].yearstart+' to '+ListofYears[i].yearend + '</option>');
        }
      }

    });
  });
  $("#callLogin").click(function(event){
    event.preventDefault();
    if ($.trim($("#org-name").val())=="") {
      $("#selorg-blank-alert").alert();
      $("#selorg-blank-alert").fadeTo(2250, 500).slideUp(500, function(){
        $("#selorg-blank-alert").hide();
      });
      $("#org-name").focus();
      return false;
    }

    var orgcode = $("#finalyears option:selected").val();
          $("#selectorg").load("/login?orgcode="+ orgcode+"&flag=0", setTimeout( function() { $("#username").focus(); }, 500 ));

    var financialyears = $("#finalyears option:selected").html();
    var org = $("#org-name option:selected").val();
    var orgobj = eval('('+org+')');
    var oname = orgobj.orgname;
    var otype = orgobj.orgtype;
    var syear = financialyears[6]+financialyears[7]+financialyears[8]+financialyears[9]+"-"+financialyears[3]+financialyears[4]+"-"+financialyears[0]+financialyears[1];
    var eyear = financialyears[20]+financialyears[21]+financialyears[22]+financialyears[23]+"-"+financialyears[17]+financialyears[18]+"-"+financialyears[14]+financialyears[15];
    var yyddmmsyear = financialyears[0]+financialyears[1]+"-"+financialyears[3]+financialyears[4]+"-"+financialyears[6]+financialyears[7]+financialyears[8]+financialyears[9];
    var yyddmmeyear = financialyears[14]+financialyears[15]+"-"+financialyears[17]+financialyears[18]+"-"+financialyears[20]+financialyears[21]+financialyears[22]+financialyears[23];
    sessionStorage.setItem('orgn', oname);
    sessionStorage.setItem('orgt', otype);
    sessionStorage.setItem('year1', yyddmmsyear);
    sessionStorage.setItem('year2', yyddmmeyear);
    sessionStorage.setItem('yyyymmddyear1', syear );
    sessionStorage.setItem('yyyymmddyear2', eyear );

  });
});
