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
"Rohini Baraskar" <robaraskar@gmail.com>
*/

$(document).ready(function() {

  var listofselectedorg = [];
  var horgname;
  var sorgname = [];
  var authuser = 1;
  var authuser1 = 1;
    $("#holdingorglist").focus();
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
        $('.option_li').empty();
         for(i in ListofOrgs)
         {
         $('#holdingorglist-ul').append('<li class="option_li"><a class="holdingorglist-option selectdropdown" href="#" data-value="' + ListofOrgs[i].orgcode + '">' +ListofOrgs[i].orgname+ '</a></li>');		

         }
       }
   });
   $(".holdingorglist-option").click(function(){
		$("#holdingorglist").data("value", $(this).data("value"));
		$("#holdingorglist").text($(this).text());
    $("#holdingorglist").focus();
  });

    $("#holdingorglist-input").keyup(function(event) {
      let searchtext = $("#holdingorglist-input").val().toLowerCase();
        if (searchtext != "") {
          $(".holdingorglist-option").each(function(index){
      if (index != -1) {
        let rowtext = $(this).text().toLowerCase();
        if (rowtext.indexOf(searchtext) != -1) {
          $(this).parent().show();
          $(this).show();
        }
        else {
          $(this).parent().hide();
          $(this).hide();
        }
      }
          });
        }
        else{
          $(".holdingorglist-option").each(function(index){
      $(this).parent().show();
      $(this).show();
          });
        }
      });
    
      $(document).off('keydown' ,'#holdingorglist-input').on('keydown' ,'#holdingorglist-input',function(event) {
        if (event.which == 13 || event.which == 40){
          event.preventDefault();
          $("#holdingorglist-input").parent().parent().find("a:visible").first().focus();
        }
      });

      $(".searchabledropdown").on("shown.bs.dropdown", function () {
        let searchinput = $(this).data("input-id");
          document.getElementById(searchinput).focus();
        });

 $(document).off('focusin', '#holdingorglist').on('focusin', '#holdingorglist',function(event) {
$("#subsidiary_div").hide();
 });
    $("#holdingorglist").keydown(function(event) {
     if (event.which==13) {
       event.preventDefault();

         if ($.trim($("#holdingorglist").data('value'))=="") {
           $("#selorg-blank-alert").alert();
           $("#selorg-blank-alert").fadeTo(1000, 500).slideUp(100, function(){
             $("#selorg-blank-alert").hide();
            });
            $("#holdingorglist").focus();
            }
          else{

          $("#authenticate").modal('show');
          $(document).off("click","#submit").on('click', '#submit', function(event) {
            if($("#user_name").val() == '' || $("#user_pwd").val()== ''){
              $("#danger-alert").alert();
                      $("#danger-alert").fadeTo(1000, 500).slideUp(100, function(){
                      $("#danger-alert").hide();
                      $("#user_name").focus().select();
                    });
                    return false;
            }
          $.ajax({  //used to authenticate the selected subsidiary organisation.
                type: "POST",
                url: "/userlogin",
                global: false,
                async: false,
                datatype: "json",
                data: {"username":$("#user_name").val(), "userpassword":$("#user_pwd").val(), "orgcode":$("#holdingorglist").data('value')},
                success: function(resp)
                {
                  if(resp["gkstatus"]==0)
                  {
                      //alert("Organisation Authentication Successful");
                      authuser = 0;
                      $("#success-alert").alert();
                      $("#success-alert").fadeTo(1000, 500).slideUp(100, function(){
                      $("#success-alert").hide();
                      $('#authenticate').modal("hide");
                      $("#confirm1").focus();
                      $("#confirm1").click();
                      $("#confirm1").hide();
                      horgname =$('#holdingorglist').text();
                    });
                  }
                  else
                  {
                      //alert("Organisation Authentication UnSuccessful");
                      authuser = 1;
                      $("#wrong-alert").alert();
                      $("#wrong-alert").fadeTo(1000, 500).slideUp(100, function(){
                      $("#wrong-alert").hide();
                      $("#user_name").focus();
                    });
                  }
                }
              });
            });
            $(document).off("click","#cancel").on('click', '#cancel', function(event) {
                        $("#holdingorglist").focus();
                    });
          }
      }
      else {
        if (!$("#holdingorglist").hasClass("open")){
        $("#holdingorglist").click();
        }
        }
          });


//Coding of Next button
  $("#confirm1").click(function(){

    if ($.trim($("#holdingorglist").data('value'))=="") {
      $("#selorg-blank-alert").alert();
      $("#selorg-blank-alert").fadeTo(1000, 500).slideUp(100, function(){
      $("#selorg-blank-alert").hide();
      });
      $("#holdingorglist").focus();
    }
    else if(authuser==1)
    {
      $("#authenticate").modal("show");
      $(document).off("click","#submit").on('click', '#submit', function(event) {
        if($("#user_name").val() == '' || $("#user_pwd").val()== ''){
          $("#danger-alert").alert();
                  $("#danger-alert").fadeTo(1000, 500).slideUp(100, function(){
                  $("#danger-alert").hide();
                  $("#user_name").focus().select();
                });
                return false;
        }
      $.ajax({  //used to authenticate the selected subsidiary organisation.
            type: "POST",
            url: "/userlogin",
            global: false,
            async: false,
            datatype: "json",
            data: {"username":$("#user_name").val(), "userpassword":$("#user_pwd").val(), "orgcode":$("#holdingorglist").data('value')},
            success: function(resp)
            {
              if(resp["gkstatus"]==0)
              {
                  //alert("Organisation Authentication Successful");
                  authuser = 0;
                  $("#success-alert").alert();
                  $("#success-alert").fadeTo(1000, 500).slideUp(100, function(){
                  $("#success-alert").hide();
                  $('#authenticate').modal("hide");
                });
              }
              else
              {
                  //alert("Organisation Authentication UnSuccessful");\
                  authuser = 1;
                  $("#wrong-alert").alert();
                  $("#wrong-alert").fadeTo(1000, 500).slideUp(100, function(){
                  $("#wrong-alert").hide();
                  $("#user_name").focus().select();
                });
              }
            }
          });
        });
    }
    else if(authuser == 0)
    {
      $("#subsidiary_div").show();
      $("#list").focus();
      $("#confirm1").hide();
    //  $("#holdingorg").modal("hide");
      //$("#listoforg").modal();
      //Brings all the subsidiary organisations into the list according to holdingorg
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
          horgcode = $('#holdingorglist').data('value');
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
          orgdetails =  $('#holdingorglist').data('value');
          listofselectedorg.push($('#holdingorglist').data('value'));
          ListofOrgs = resp["gkresult"];
          $('.option_subli').empty();
        //  $('#selected').append('<li class="list-group-item" value=" " disabled selected hidden>Selected Organisation</li>');
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
                $('#list-ul').append('<li class="option_subli"><a class="list-option selectdropdown" href="#" data-value="' + ListofOrgs[i].orgcode + '">' +ListofOrgs[i].orgname+ '</a></li>');		
                $( "#list-ul" ).prop( "disabled", false );

              }
              else
              {
                
                $('#list-ul').append('<li class="option_subli"><a class="list-option selectdropdown" href="#" data-value="' + ListofOrgs[i].orgcode + '">' +ListofOrgs[i].orgname+ '</a></li>');		
                $( "#list-ul" ).prop( "disabled", false );

              }
            }
          }
          $(".list-option").click(function(){
            $("#list").data("value", $(this).data("value"));
            $("#list").text($(this).text());  
            $("#list").focus();
          });
        }
      });
      }
      });

      $("#list-input").keyup(function(event) {
        let searchtext = $("#list-input").val().toLowerCase();
          if (searchtext != "") {
            $(".list-option").each(function(index){
        if (index != -1) {
          let rowtext = $(this).text().toLowerCase();
          if (rowtext.indexOf(searchtext) != -1) {
            $(this).parent().show();
            $(this).show();
          }
          else {
            $(this).parent().hide();
            $(this).hide();
          }
        }
            });
          }
          else{
            $(".list-option").each(function(index){
        $(this).parent().show();
        $(this).show();
            });
          }
        });
      
        $(document).off('keydown' ,'#list-input').on('keydown' ,'#list-input',function(event) {
          if (event.which == 13 || event.which == 40){
            event.preventDefault();
            $("#list-input").parent().parent().find("a:visible").first().focus();
          }
        });

    
      $("#list").keydown(function(event) {        
    if(event.which==13 ){
      event.preventDefault();
      if($('#list').data('value') == 0)
      {
        $("#confirm").focus();
      }
      else {

      var selectedorg = $(this).find(':selected').text();//this will give the selected option's organisation
      $("#authenticate").modal("show");

      //$('#user').focus();
      $(document).off("click","#submit").on('click', '#submit', function(event) {
        if($("#user_name").val() == '' || $("#user_pwd").val()== ''){
          $("#danger-alert").alert();
                  $("#danger-alert").fadeTo(1000, 500).slideUp(100, function(){
                  $("#danger-alert").hide();
                  $("#user_name").focus().select();
                });
                return false;
        }
        orgcode1=$("#list").data('value');
      $.ajax({  //used to authenticate the selected subsidiary organisation.
            type: "POST",
            url: "/userlogin",
            global: false,
            async: false,
            datatype: "json",
            data: {"username":$("#user_name").val(), "userpassword":$("#user_pwd").val(), "orgcode":$("#list").data('value')},
            success: function(resp)
            {
              if(resp["gkstatus"]==0)
              {
                  authuser1 = 0;
                  $("#span1").hide();
                  $('#selected').append('<li class="list-group-item selectedorgs disabled">'+ $("#list").text() +'</li>'); //add selected organisation in the selected organisation dropdown.
                  sorgname.push($('#list').text());
                  if($('#list').data('value') != 0)
                  {
                  listofselectedorg.push($('#list').data('value'));
                  $(".list-option[data-value="+ orgcode1 +"]").remove();

                  // $('#list option:selected').remove(); //to remove authenticated organisation from the list of organisation.
                  }
                  $('#list').val(0);
                  $("#success-alert").alert();
                  $("#success-alert").fadeTo(1000, 500).slideUp(100, function(){
                  $("#success-alert").hide();
                  $("#authenticate").modal("hide");
                  $("#list").focus();
                });
              }
              else
              {
                  authuser1 = 1;
                  $("#wrong-alert").alert();
                  $("#wrong-alert").fadeTo(1000, 500).slideUp(100, function(){
                  $("#wrong-alert").hide();
                  $("#user_name").focus().select();
                });
              }
            }//sucess ends
          });//
        });
        $(document).off("click","#cancel").on('click', '#cancel', function(event) {
                    $("#list").focus();
                });

      }
    }
    else {
      if (!$("#list").hasClass("open")){
      $("#list").click();
      }
      }
    });
//
$(document).off("click","#confirm").on('click', '#confirm', function(event) {

      if ($(".selectedorgs").length==0) {
        $("#selorg-blank-alert1").alert();
        $("#selorg-blank-alert1").fadeTo(1000, 500).slideUp(100, function(){
          $("#selorg-blank-alert1").hide();
        });
        $("#list").focus();
      }
      else{
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


//Authentication modal show and hidden code
$('#authenticate').on('shown.bs.modal', function() {
    $('#user_name').val("");
    $('#user_pwd').val("");
      $('#user_name').focus();

      $("#user_name").keydown(function(event) {
          if (event.which == 13) {
              event.preventDefault();

              if($("#user_name").val()==''){
                $("#user-alert").alert();
                $("#user-alert").fadeTo(1000, 500).slideUp(100, function(){
                $("#user-alert").hide();
                $('#user_name').focus();
              });
              }
              else{
                $("#user_pwd").focus();
              }
              }

      });
      $("#user_pwd").keydown(function(event) {
          if (event.which == 13) {
              event.preventDefault();

              if($("#user_pwd").val()==''){
                $("#password-alert").alert();
                $("#password-alert").fadeTo(1000, 500).slideUp(100, function(){
                $("#password-alert").hide();
                $('#pwd').focus();
              });
              }
              else{
                $("#submit").focus();
              //  $("#submit").click();
              }
              }
              if (event.which==38) {
                event.preventDefault();
                $('#user_name').focus();
              }
      });
  });

  $('#authenticate').on('hidden.bs.modal', function() {

    $('#user_name').val("");
    $('#user_pwd').val("");
  });
  $(document).off("click","#cancel_btn").on('click', '#cancel_btn', function(event) {
    $.ajax(
      {
      type: "POST",
      url: "/showconsolidationpopup",
      global: false,
      async: false,
      datatype: "text/html",
      beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
      success: function(resp)
      {
        $("#info").html(resp);
        //$("#holdingorg").modal("show");
      }
      });

  });

});
