/*
Copyright (C) 2013, 2014, 2015, 2016 Digital Freedom Foundation
Copyright (C) 2017, 2018, 2019 Digital Freedom Foundation & Accion Labs Pvt. Ltd.

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
   "Abhijith Balan" <abhijithb21@openmailbox.org>
   "prajkta Patkar" <prajkta@riseup.net>
   "Rupali Badgujar" <rupalibadgujar1234@gmail.com>

 */
$(document).ready(function() {
  var element;
    
$('.drawer').drawer({
  class: {
    nav: 'drawer-nav',
    toggle: 'drawer-toggle',
    overlay: 'drawer-overlay',
    open: 'drawer-open',
    close: 'drawer-close',
    dropdown: 'drawer-dropdown'
  },
  iscroll: {
    // Configuring the iScroll
    // https://github.com/cubiq/iscroll#configuring-the-iscroll
    mouseWheel: true,
    preventDefault: false
  },
  showOverlay: true
});


$("#dashboard_li").click(function(e){
  location.reload();
});

$(".submenuitem").hide();
$(".submenuitem,#iconbar").click(function(event){$('.drawer').drawer('close');});

$(".reportpage").click(function(event){$('.drawer').drawer('close');});

$(".submenuli").click(function(event){
  event.preventDefault();
 var tog = $(this).data("menuname");
  $('.'+tog).toggle();
});

$("#sidebar").click(function(e){
  $("#dashboard_a").focus();
  $('.kmd:first').closest('li').addClass('liclass');
});

var currentindex;
var rowcount;
var currentrow;
$(document).off('keydown' ,'.kmd').on('keydown' ,'.kmd',function(event) {
  event.preventDefault();
  currentrow = $(this).closest("li");
  currentindex = $(currentrow).index();
  rowcount =$(".kmd").length-1;

  if (event.which == 13){
    $(this).closest("li").click();
  }
  if (event.which == 40 && currentindex != rowcount) {
    $(currentrow).removeClass("liclass");
    var tog = $(this).data("menuname");
    $('.'+tog).show();
    $(currentrow).next().find("a").focus(); 
    $(currentrow).next().addClass("liclass");
  }
    if (event.which == 38 && currentindex != 0) {
      $(currentrow).removeClass("liclass");
      $(currentrow).prev().find("a").focus(); 
      $(currentrow).prev().addClass("liclass");
}
});

  $("#exportledger").click(function(){
  $("#exportdata").modal("show");
});
$("#shortcuts").click(function(){
  $("#gnukhatashortcuts").modal("show");
});
$("#authors").click(function(){
  $("#gnukhataauthors").modal("show");
});
$("#license").click(function(){
  $("#gnukhatalicense").modal("show");
});
$("#about").click(function(){
  $("#aboutgnukhata").modal("show");
});
$("#shownews").click(function(){
  $("#newsmodal").modal("show");
});

  $('#make_payment').click(function(){
  $('#showpayment').click();
  });
  $('#receipt_payment').click(function(){
    $('#showreceipt').click();
  });
  $(".add_custsup").click(function() {
    $("#customersupplier").click();
  });
  $("#add_invoice").click(function() {
    $("#invoice").click();
  });
  $("#Adjustable_purchase_bill").click(function() {
    $("#showbillwiseaccounting").click();
  });
  $("#Adjustable_sale_bill").click(function() {
    $("#showbillwiseaccounting").click();
  });
  $('#my_profile').click(function(){
    $('#showeditorg').click();
});
$(".add_prod").click(function() {
  if (sessionStorage.invflag == 1){
    $("#product").click();
  }
  else{
    $("#productinmaster").click();
  }
});
$("#profit_loss").click(function() {
  $("#showprofitloss").click();
});
$("#balance_sheet").click(function(){
$("#showbalancesheet").click();
});

$("#add_receipt").click(function(){
  $('#showreceipt').click();
});

$("#add_payment").click(function(){
  $('#showpayment').click();
});

$("#add_journal").click(function(){
  $('#showjournal').click();
});

$("#add_contra").click(function(){
  $('#showcontra').click();
});

$(document.body).on('hide.bs.modal,hidden.bs.modal', function () {
  $('body').css('padding-right','0');
});

$.ajax(
  {
    type: "POST",
    url: "/dashboard?action=profitlosschart",
    global: false,
    async: false,
    datatype: "json",
      data: {"calculatefrom":sessionStorage.yyyymmddyear1,"calculateto":sessionStorage.yyyymmddyear2},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
    success: function(resp){  
    var canvas = document.getElementById("pieChart");
    // Global Options:
     Chart.defaults.global.defaultFontColor = 'black';
    var data = {
        labels: ["Direct Income", "Indirect Income","Direct Expence", "Indirect Expence"],
          datasets: [
            {
                fill: true,
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
                data: [resp["DirectIncome"],resp["InDirectIncome"],resp["DirectExpense"],resp["InDirectExpense"]],
            }
        ]
    };
    // Notice the rotation from the documentation.
    var options = {
                  responsive: true,
          maintainAspectRatio: true,
            rotation: -0.7 * Math.PI
    };
    var ctx = canvas.getContext('2d');
    // Chart declaration:
    var myBarChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });

  }
});

  $.ajax(
    {
      type: "POST",
      url: "/dashboard?action=balancesheetchart",
      global: false,
      async: false,
      datatype: "json",
      data: {"calculateto":sessionStorage.yyyymmddyear2},
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp){  
       new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
          labels: ["Capital and Liabilities","Property and Assets"],
          datasets: [
            {
              fill: true,
              backgroundColor: ["#3e95cd","#8e5ea2"],
              data: [resp["data"][0],resp["data"][1]],
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        }
        
    });
       
      }
    })
  
      $("#godownwisestock").change(function(e){
        goid=$("#godownwisestock option:selected").val()
        $.ajax({
          type: "POST",
          url: "/dashboard?action=stockonhandforgodownincharge",
          global: false,
          async: false,
          data:{"calculateto":enddate=sessionStorage.yyyymmddyear2,"goid":goid},
          datatype: "json",
          beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
          success: function(resp)
          { 
            $('#stock_on_hand').html("");      
            for (let i=0; i<5; i++){      
              $('#stock_on_hand').append('<tr> <td  style="font-weight:normal;" class="col-sm-8">'+resp["proddesc"][i]["proddesc"]+'</td> <td  style="font-weight:normal;text-align:right;" class="col-sm-4">'+resp["gkresult"][i]["balance"]+'</td> </tr>');                  
              
            }
        }
        });
      });
    
      function transfernotechart(indata,outdata){
        document.getElementById("transfernotediv").innerHTML = '&nbsp;';
        document.getElementById("transfernotediv").innerHTML = '<canvas id="transfer_note"></canvas>';
    var ctx = document.getElementById("transfer_note").getContext("2d");
       var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
            datasets: [{
                label: 'No. of Quantity In',
                data: indata,
                backgroundColor: [
                    'rgba(51, 51, 51)',
                    'rgba(51, 51, 51)',
                    'rgba(51, 51, 51)',
                    'rgba(51, 51, 51)',
                    'rgba(51, 51, 51)',
                    'rgba(51, 51, 51)',
                    'rgba(51, 51, 51)',
                    'rgba(51, 51, 51)',
                    'rgba(51, 51, 51)',
                    'rgba(51, 51, 51)',
                    'rgba(51, 51, 51)', 
                    'rgba(51, 51, 51)', 
    
                ],
            
            },
            {
            labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
            label: 'No. of Quantity Out',
            data: outdata,
            backgroundColor: [
              'rgba(100, 100, 100)',
              'rgba(100, 100, 100)',
              'rgba(100, 100, 100)',
              'rgba(100, 100, 100)',
              'rgba(100, 100, 100)',
              'rgba(100, 100, 100)',
              'rgba(100, 100, 100)',
              'rgba(100, 100, 100)',
              'rgba(100, 100, 100)',
              'rgba(100, 100, 100)',
              'rgba(100, 100, 100)', 
              'rgba(100, 100, 100)', 
          ],
           },]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                    //     stepSize: 50,
                    //       suggestedMin: 1,
                    //       suggestedMax: 100,
                    }
                }]
            },
            responsive: true,
            maintainAspectRatio: true,
        }
    });
    }
      $("#godownwise").change(function(e){
        goid=$("#godownwise option:selected").val()
        $.ajax(
        {
        type: "POST",
        url: "/dashboard?action=transfernotecount",
        global: false,
        async: false,
        data:{"goid":goid},
        datatype: "json",
        beforeSend: function(xhr)
          {
            xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
          },
        success: function(resp)
        {
          indata=resp["innotecount"];
          outdata=resp["outnotecount"]
          transfernotechart(indata,outdata);
      }
      });
    });   
    
      $.ajax({
        type: "POST",
        url: "/dashboard?action=godowndesc",
        global: false,
        async: false,
        datatype: "json",
        beforeSend: function(xhr)
        {
          xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
        },
        success: function(resp)
        {
        for(let i in resp["goname"]){
          $('#godownwise').append('<option value="'+resp["goname"][i]["goid"]+'">'+resp["goname"][i]["goname"]+'</option>')
          $('#godownwisestock').append('<option value="'+resp["goname"][i]["goid"]+'">'+resp["goname"][i]["goname"]+'</option>')
    
      }
      $("#godownwise").change();
      $("#godownwisestock").change();
      
    }
      });

$("#accountsbal").click(function(e){
  $.ajax({
    url: "/dashboard?action=cashbankaccbal",
    type: 'POST',
    global: false,
    async: false,
    datatype: 'text/html',
    beforeSend: function(xhr)
    {
xhr.setRequestHeader('gktoken', sessionStorage.gktoken);
    },
    success: function(resp)
    {
$('#info').html(resp);
    }
  });
});


function monthlyinvoice(inoutflag,invoicedata){
  if (inoutflag==9){
    var ctx = document.getElementById("chart_content_purchase").getContext('2d');
    }
  else{
    var ctx = document.getElementById("chart_content_sale").getContext('2d');
      }
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
          datasets: [{
            label: 'Total Amount',
            data: invoicedata,
            backgroundColor: [
                  'rgba(51, 51, 51)',
                  'rgba(51, 51, 51)',
                  'rgba(51, 51, 51)',
                  'rgba(51, 51, 51)',
                  'rgba(51, 51, 51)',
                  'rgba(51, 51, 51)',
                  'rgba(51, 51, 51)',
                  'rgba(51, 51, 51)',
                  'rgba(51, 51, 51)',
                  'rgba(51, 51, 51)',
                  'rgba(51, 51, 51)', 
                  'rgba(51, 51, 51)', 
                ],
                
          }]
        },
      options: {
        scales: {
            yAxes: [{
              ticks: {
                  beginAtZero:true,
                  // stepSize: 1,
                  // suggestedMin: 1,
                  // suggestedMax: 5,
                  }
                }]
              },
              responsive: true,
              maintainAspectRatio: true,
            }
        });
        }
        
function topfivecustsup(inoutflag, custsupdata){
    var tablediv="";
    if (inoutflag == 9){
        tablediv=$('#topfivesup');
      }
    else{
        tablediv=$('#topfivecust');
      }
        var list = custsupdata;
        tablediv.html("");
        for (let index in list ){
            tablediv.append('<tr> <td  style="font-weight:normal;" class="col-sm-8">'+list[index].custname+'</td> <td  style="font-weight:normal;text-align:right;" class="col-sm-4">'+ list[index].data+' </td> </tr>');                  
            }
        }

  function paymentdata(inoutflag,dataset){
    var tablediv="";
    if (inoutflag == 9){
      tablediv=$('#fivepurchaseinvoicelist');
    }
    else{
      tablediv=$('#fivesaleinvoicelist');
    }
    var list = dataset;
    tablediv.html("");
    for (let index in list ){
      tablediv.append('<tr style="table-layout:fixed;"> <td  style="font-weight:normal;" class="col-xs-8">'+list[index].invoiceno+','+ list[index].invoicedate+','+ list[index].custname+' </td> <td  style="font-weight:normal;text-align:right;" class="col-xs-4">'+ list[index].balanceamount+' </td> </tr>');                  
    }
  }
 
function mostboughtprodsev(dataset){
  for (let index in dataset ){
    $('#topfiveboughtprod').append('<tr> <td  style="font-weight:normal;" class="col-sm-8">'+dataset[index].proddesc+'</td> <td  style="font-weight:normal;text-align:right;" class="col-sm-4">'+ dataset[index].count+' </td> </tr>');  
}
}
function monthlydelchal(inoutflag,delchaldata){
  if (inoutflag==9){
  var ctx = document.getElementById("deliveryin_id").getContext('2d');
  }
  else{
  var ctx = document.getElementById("deliveryout_id").getContext('2d');
  }
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
        datasets: [{
            label: 'Product Quantity',
            data: delchaldata,
            backgroundColor: [
                'rgba(51, 51, 51)',
                'rgba(51, 51, 51)',
                'rgba(51, 51, 51)',
                'rgba(51, 51, 51)',
                'rgba(51, 51, 51)',
                'rgba(51, 51, 51)',
                'rgba(51, 51, 51)',
                'rgba(51, 51, 51)',
                'rgba(51, 51, 51)',
                'rgba(51, 51, 51)',
                'rgba(51, 51, 51)', 
                'rgba(51, 51, 51)', 
            ],
        
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    // stepSize: 50,
                    // suggestedMin: 1,
                    // suggestedMax: 100,

                }
            }]
        },
        responsive: true,
        maintainAspectRatio: true,
    }
});
}

function stockonhand(stockonhanddata){
    for (let item in stockonhanddata["stockresultlist"]){
      list =stockonhanddata["stockresultlist"][item].gkstatus
      if (list == 3){
      $('#topfivesoldprod').append('<tr> <td  style="font-weight:normal;" class="col-sm-8">'+stockonhanddata["productname"][item].prodname+'</td> <td  style="font-weight:normal;text-align:right;" class="col-sm-4">--</td> </tr>');                  
      }
      else{
           list =stockonhanddata["stockresultlist"][item].gkresult
            for (let index in list) {
            $('#topfivesoldprod').append('<tr> <td  style="font-weight:normal;" class="col-sm-8">'+stockonhanddata["productname"][item].prodname+'</td> <td  style="font-weight:normal;text-align:right;" class="col-sm-4">'+list[index].balance+' </td> </tr>');                  
        }}
      }
}

function accbalance(balancedataset){
  var ctx = document.getElementById('linechart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: balancedataset["monthname"],
        datasets: [{
            label: 'Bank Balance',
            borderColor: '#3e95cd',
            data: balancedataset["bankbalancedata"]
        },
        {
          label: 'Cash Balance',
          borderColor: '#8e5ea2',
          data: balancedataset["cashbalancedata"]
      }]
    },

    // Configuration options go here
    options: {}
});

}

function dashboard(){
    $.ajax({
      type: "POST",
      url: "/dashboard?action=dashboarddata",
      global: false,
      async: false,
      datatype: "json",
      beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
      success: function(resp)
      {
      respdata=resp["gkresult"]


    if(resp["userrole"] == -1 || resp["userrole"] == 0 || resp["userrole"] == 1){


    $("#pur_amount_wise").click(function(){
      $("#pur_date_wise").removeClass("active");
      $("#pur_amount_wise").addClass("active");
      paymentdata(9,respdata["amtwisepurinv"]);
    });
  
    $("#pur_date_wise").click(function(){
      $("#pur_amount_wise").removeClass("active");
      $("#pur_date_wise").addClass("active");
      paymentdata(9,respdata["datewisepurinv"]);
    });
    $("#pur_amount_wise").click();

    $("#sale_amount_wise").click(function(){
    $("#sale_date_wise").removeClass("active");
    $("#sale_amount_wise").addClass("active");
      paymentdata(15,respdata["amtwisesaleinv"]);
    });
 
    $("#sale_date_wise").click(function(){
    $("#sale_amount_wise").removeClass("active");
    $("#sale_date_wise").addClass("active");
      paymentdata(15,respdata["datewisesaleinv"]);
    });
    $("#sale_amount_wise").click();
    
    topfivecustsup(9,respdata["topfivesuplist"]);
    topfivecustsup(15,respdata["topfivecustlist"]);
    mostboughtprodsev(respdata["mostboughtprodsev"]);
    stockonhand(respdata["stockonhanddata"]);
    accbalance(respdata["balancedata"]);
  }
  if(resp["userrole"] == -1 || resp["userrole"] == 0 || resp["userrole"] == 1 || resp["userrole"] == 2){
    monthlyinvoice(9,respdata["puchaseinvcount"]);
    monthlyinvoice(15,respdata["saleinvcount"]);
   }
    if(resp["userrole"] == 1 || resp["userrole"] == 2 || resp["userrole"] == 3){
      monthlydelchal(9,respdata["delchalout"]);
      monthlydelchal(15,respdata["delchalin"]);
     }

  }
    
    }); 
  }
  dashboard();
  });
