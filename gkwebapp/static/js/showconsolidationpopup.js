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
"Parabjyot Singh" <parabjyot1996@gmail.com>
"Rahul Chaurasiya" <crahul4133@gmail.com>
*/

$(document).ready(function() {

  var listofselectedorg = [];
  var horgname;
  var sorgname = [];
  var authuser = 1;
  var authuser1 = 1;
 // $("#bankRecModal1").click(function(){
 // $("#bankRecModal").modal();
 // });
    console.log("modal");
    $.ajax({              //To retreive org details.
       type:"POST",
       url:"/allorgcode?type=orgcodelist",
       global:false,
       async:false,
       datatype:"json",
       beforeSend: function(xhr) {
           xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
       },
       success: function(resp)
       {
         ListofOrgs = resp["gkresult"];
         $('#holdingorglist').empty();
         $('#holdingorglist').append('<option value="0" disabled selected hidden>List of Organisations</option>');
         for(i in ListofOrgs)
         {
         $('#holdingorglist').append('<option value="' + ListofOrgs[i].orgcode + '">'+ ListofOrgs[i].orgname +'</option>');
         }
       }
   });



 $(document).off('keydown', '#holdingorglist').on('keydown', '#holdingorglist',function(event) {
   if (event.which==13) {
     event.preventDefault();

    if ($.trim($("#holdingorglist").val())=="") {
      $("#selorg-blank-alert").alert();
      $("#selorg-blank-alert").fadeTo(1000, 500).slideUp(100, function(){
      $("#selorg-blank-alert").hide();
      });
      $("#holdingorglist").focus();
    }
    else{
        $("#authenticate").modal('show');
    }
   }
 });
  $(document).off("change","#holdingorglist").on('change', '#holdingorglist', function(event) {
    horgname =$('#holdingorglist option:selected').text();//this will give the selected option's organisation
    $(document).off("click","#submit").on('click', '#submit', function(event) {
    $.ajax({  //used to authenticate the selected subsidiary organisation.
          type: "POST",
          url: "/userlogin",
          global: false,
          async: false,
          datatype: "json",
          data: {"username":$("#user").val(), "userpassword":$("#pwd").val(), "orgcode":$("#holdingorglist option:selected").val()},
          success: function(resp)
          {
            if(resp["gkstatus"]==0)
            {
                //alert("Organisation Authentication Successful");
                authuser = 0;
                console.log(authuser);
                $("#success-alert").alert();
                $("#success-alert").fadeTo(1000, 500).slideUp(100, function(){
                $("#success-alert").hide();
                $('#authenticate').modal("hide");
              });
            }
            else
            {
                //alert("Organisation Authentication UnSuccessful");
                authuser = 1;
                console.log(authuser);
                $("#danger-alert").alert();
                $("#danger-alert").fadeTo(1000, 500).slideUp(100, function(){
                $("#danger-alert").hide();
              });
            }
          }
        });
      });
  });


  $("#confirm1").click(function(){

    if ($.trim($("#holdingorglist").val())=="") {
      $("#selorg-blank-alert").alert();
      $("#selorg-blank-alert").fadeTo(1000, 500).slideUp(100, function(){
      $("#selorg-blank-alert").hide();
      });
      $("#holdingorglist").focus();
    }
    else if(authuser == 0)
    {
      $("#subsidiary_div").show();
      $("#list").focus();
      $("#confirm1").hide();
    //  $("#holdingorg").modal("hide");
      //$("#listoforg").modal();
      $.ajax({
        type: "POST",
        url: "/allorgcode?type=orgcodelist",
        global: false,
        async: false,
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        },
        success: function(resp) {
          horgcode = $('#holdingorglist option:selected').val();
          ListofOrgs = resp["gkresult"];
          for(i in ListofOrgs){
              if(horgcode == ListofOrgs[i].orgcode)
              {
                horgtype = ListofOrgs[i].orgtype;
                hyearstart = ListofOrgs[i].yearstart;
                hyearend = ListofOrgs[i].yearend;
              }
          }
        }
      });
      $.ajax({    //used to retreive organisations details [orgcode , orgname , orgtype]
        type: "POST",
        url: "/allorgcode?type=orgcodelist",
        global: false,
        async: false,
        dataType: "json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
        },
        success: function(resp) {
          orgdetails =  $('#holdingorglist option:selected').val();
          listofselectedorg.push($('#holdingorglist option:selected').val());
          ListofOrgs = resp["gkresult"];
          $('#list').empty();
          $('#list').append('<option value="0" disabled selected hidden>List Of Organisations</option>');
          $('#selected').append('<li value=" " disabled selected hidden>Selected Organisation</li>');
          for (i in ListofOrgs ) {
            if(orgdetails == ListofOrgs[i].orgcode) //To remove logged in organisation from dropdown list.
            {
                console.log("Do Nothing");
            }
            else
            {
              var yearstart = new Date(ListofOrgs[i].yearstart);
              var yearend = new Date(ListofOrgs[i].yearend);
              var d1 = new Date(hyearstart);
              var d2 = new Date(hyearend);
              if((horgtype != ListofOrgs[i].orgtype) || (d1.getTime() != yearstart.getTime()) || (d2.getTime() != yearend.getTime()))
              {
                $('#list').append('<option value="' + ListofOrgs[i].orgcode + '" disabled>'+ ListofOrgs[i].orgname +'</option>');
              }
              else
              {
                $('#list').append('<option value="' + ListofOrgs[i].orgcode + '">'+ ListofOrgs[i].orgname +'</option>');
              }
            }
          }
        }
      });
      }
      });

    $(document).off("change","#list").on('change', '#list', function(event) {
    var selectedorg = $(this).find(':selected').text();//this will give the selected option's organisation
    $("#authenticate").modal("show");

    //$('#user').focus();
    $(document).off("click","#submit").on('click', '#submit', function(event) {
    $.ajax({  //used to authenticate the selected subsidiary organisation.
          type: "POST",
          url: "/userlogin",
          global: false,
          async: false,
          datatype: "json",
          data: {"username":$("#user").val(), "userpassword":$("#pwd").val(), "orgcode":$("#list option:selected").val()},
          success: function(resp)
          {
            if(resp["gkstatus"]==0)
            {
                authuser1 = 0;
                $('#selected').append('<option value="" disabled>'+ $("#list option:selected").text() +'</option>'); //add selected organisation in the selected organisation dropdown.
                sorgname.push($('#list option:selected').text());
                if($('#list').val() != 0)
                {
                listofselectedorg.push($('#list option:selected').val());
                $('#list option:selected').remove(); //to remove authenticated organisation from the list of organisation.
                }
                $('#list').val(0);
                $("#success-alert").alert();
                $("#success-alert").fadeTo(1000, 500).slideUp(100, function(){
                $("#success-alert").hide();
                $("#authenticate").modal("hide");
              });
            }
            else
            {
                authuser1 = 1;
                $("#danger-alert").alert();
                $("#danger-alert").fadeTo(1000, 500).slideUp(100, function(){
                $("#danger-alert").hide();
              });
            }
          }
        });
      });
    });

  $("#confirm").click(function(){
    if ($.trim($("#selected > option").length)==1) {
      $("#selorg-blank-alert1").alert();
      $("#selorg-blank-alert1").fadeTo(1000, 500).slideUp(100, function(){
      $("#selorg-blank-alert1").hide();
      });
      $("#list").focus();
    //  $("#confirm1").hide();
    }
    else if(authuser1 == 0)
    {
    var selectedorg = {"ds" : JSON.stringify(listofselectedorg),"calculateto":hyearend,"orgcode":horgcode,"financialStart":hyearstart,"orgtype":horgtype};
    $.ajax({
      type: "POST",
      url: "/listoforgselected?type=orgselected",
      global: false,
      async: false,
      datatype: "text/html",
      data: {"selectedorg" : JSON.stringify(selectedorg),"flag" : 1,"horgname" : horgname,"sorgname" : JSON.stringify(sorgname)},
      beforeSend: function(xhr) {
          xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
      },
      })
      .done(function(resp){
        $("#info").html(resp);
      });
    }
  });

  $('#authenticate').on('shown.bs.modal', function() {
    $('#user').empty();
    $('#pwd').empty();
      $('#user').focus();

      $("#user").keydown(function(event) {
          if (event.which == 13) {
              event.preventDefault();

              if($("#user").val()==''){
                $("#user-alert").alert();
                $("#user-alert").fadeTo(1000, 500).slideUp(100, function(){
                $("#user-alert").hide();
                $('#user').focus();
              });
              }
              else{
                $("#pwd").focus();
              }
              }
      });
      $("#pwd").keydown(function(event) {
          if (event.which == 13) {
              event.preventDefault();

              if($("#pwd").val()==''){
                $("#password-alert").alert();
                $("#password-alert").fadeTo(1000, 500).slideUp(100, function(){
                $("#password-alert").hide();
                $('#pwd').focus();
              });
              }
              else{
                $("#submit").focus();
                $("#submit").click();
              }
              }
      });
  });

  $('#authenticate').on('hidden.bs.modal', function() {
    $("#confirm1").focus();
  });

/*  $('#holdingorg').on('shown.bs.modal', function() {
$("#holdingorglist").focus();
  });

  $('#holdingorg').on('hidden.bs.modal', function() {
$("#holdingorglist").focus();
  });*/
});
