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
$(".submenuitem").hide();
$(".submenuitem").click(function(event){$('.drawer').drawer('close');});

$(".submenuli").click(function(event){
  event.preventDefault();
 var tog = $(this).data("menuname");
  $('.'+tog).toggle();
  console.log("voucher call");
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
  $("#product").click();
});
$("#profit_loss").click(function() {
  $("#showprofitloss").click();
});
$("#balance_sheet").click(function(){
$("#showbalancesheet").click();
});

$(document.body).on('hide.bs.modal,hidden.bs.modal', function () {
  $('body').css('padding-right','0');
});

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

function calldata(dataset){
  $.ajax(
  {

  type: "POST",
  url: "/dashboard?action=showlist",
  global: false,
  async: false,
  datatype: "json",
  data: dataset,
  beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  success: function(resp)
  {
    var tablediv="";
    if (dataset["inoutflag"] == 9){
      tablediv=$('#fivepurchaseinvoicelist');
    }
    else{
      tablediv=$('#fivesaleinvoicelist');
    }
    var list = resp["gkresult"];
    tablediv.html("");
    for (let index in list ){
      tablediv.append('<tr> <td  style="font-weight:normal;" class="col-xs-8">'+list[index].invoiceno+','+ list[index].invoicedate+','+ list[index].custname+' </td> <td  style="font-weight:normal;text-align:right;" class="col-xs-4">'+ list[index].balanceamount+' </td> </tr>');                  
    }
  }
  });
}   
    $("#pur_amount_wise").click(function(){
      dataset={
        "inoutflag": 9,
        "typeflag": 1
        };
    $("#pur_date_wise").removeClass("active");
    $("#pur_amount_wise").addClass("active");
    calldata(dataset);
  });

  $("#pur_date_wise").click(function(){
    dataset={
      "inoutflag": 9,
      "typeflag": 4
      };
    $("#pur_amount_wise").removeClass("active");
    $("#pur_date_wise").addClass("active");
    calldata(dataset);
  });
    $("#pur_amount_wise").click();

  $("#sale_amount_wise").click(function(){
   dataset={
      "inoutflag": 15,
      "typeflag": 1
      };
  $("#sale_date_wise").removeClass("active");
  $("#sale_amount_wise").addClass("active");
  calldata(dataset);
});

$("#sale_date_wise").click(function(){
 dataset={
    "inoutflag": 15,
    "typeflag": 4
    };
  $("#sale_amount_wise").removeClass("active");
  $("#sale_date_wise").addClass("active");
  calldata(dataset);
});
$("#sale_amount_wise").click();

function monthlyinvoice(inoutflag){
$.ajax(
  {

  type: "POST",
  url: "/dashboard?action=countinvoice",
  global: false,
  async: false,
  datatype: "json",
  data: {"inoutflag":inoutflag},
  beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  success: function(resp)
  {
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
            data: resp["invcount"],
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
});
}
monthlyinvoice(9);
monthlyinvoice(15);


function monthlydelchal(inoutflag){
  $.ajax(
    {
  
    type: "POST",
    url: "/dashboard?action=countdelchal",
    global: false,
    async: false,
    datatype: "json",
    data: {"inoutflag":inoutflag},
    beforeSend: function(xhr)
      {
        xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
      },
    success: function(resp)
    {
    if (inoutflag==9){
    var ctx = document.getElementById("delivery_in").getContext('2d');
    }
    else{
    var ctx = document.getElementById("delivery_out").getContext('2d');
    }
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],
          datasets: [{
              label: 'Product Quantity',
              data: resp["delchalcount"],
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
  
  });
  }
  monthlydelchal(9);
  monthlydelchal(15);

function topfivecustsup(inoutflag){
  $.ajax(
  {

  type: "POST",
  url: "/dashboard?action=topcustlist",
  global: false,
  async: false,
  datatype: "json",
  data: {"inoutflag":inoutflag},
  beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  success: function(resp)
  {
    var tablediv="";
    if (inoutflag == 9){
      tablediv=$('#topfivesup');
    }
    else{
      tablediv=$('#topfivecust');
    }
    var list = resp["gkresult"];
    tablediv.html("");
    for (let index in list ){
      tablediv.append('<tr> <td  style="font-weight:normal;width:200px" class="col-sm-8">'+list[index].custname+'</td> <td  style="font-weight:normal;text-align:right;width:113px" class="col-sm-4">'+ list[index].data+' </td> </tr>');                  
    }
 }
  });
}
topfivecustsup(15);
topfivecustsup(9);


function topfiveprod(inoutflag){
  $.ajax(
  {

  type: "POST",
  url: "/dashboard?action=topfiveproduct",
  global: false,
  async: false,
  datatype: "json",
  data: {"inoutflag":inoutflag},
  beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
  success: function(resp)
  {
    element=resp["gkresult"]
    for (let index in element ){
      $('#topfiveboughtprod').append('<tr> <td  style="font-weight:normal;width:200px" class="col-sm-8">'+element[index].proddesc+'</td> <td  style="font-weight:normal;text-align:right;width:113px" class="col-sm-4">'+ element[index].count+' </td> </tr>');                  
  
 }
 }
 });
}
topfiveprod(9);

$.ajax({
  type: "POST",
  url: "/dashboard?action=stockonhandfordashboard",
  global: false,
  async: false,
  data:{"calculateto":enddate=sessionStorage.yyyymmddyear2},
  datatype: "json",
  beforeSend: function(xhr)
  {
    xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
  },
  success: function(resp)
  {
    for (let item in resp["gkresult"]){
      list =resp["gkresult"][item].gkstatus
      if (list == 3){
      $('#topfivesoldprod').append('<tr> <td  style="font-weight:normal;width:200px" class="col-sm-8">'+resp["productname"][item].prodname+'</td> <td  style="font-weight:normal;text-align:right;width:113px" class="col-sm-4">--</td> </tr>');                  
      }
      else{
           list =resp["gkresult"][item].gkresult
            for (let index in list) {
            $('#topfivesoldprod').append('<tr> <td  style="font-weight:normal;width:200px" class="col-sm-8">'+resp["productname"][item].prodname+'</td> <td  style="font-weight:normal;text-align:right;width:113px" class="col-sm-4">'+list[index].balance+' </td> </tr>');                  
        }}
      }
}

});
$.ajax(
  {
    type: "POST",
    url: "/dashboard?action=profitlosschart",
    global: false,
    async: false,
    datatype: "json",
    data: {"calculateto":sessionStorage.yyyymmddyear2},
    beforeSend: function(xhr)
    {
      xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
    },
    success: function(resp){  
    var canvas = document.getElementById("pieChart");
    var ctx = canvas.getContext('2d');
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
            $('#stock_on_hand').append('<tr> <td  style="font-weight:normal;width:200px" class="col-sm-8">'+resp["proddesc"][i]["proddesc"]+'</td> <td  style="font-weight:normal;text-align:right;width:113px" class="col-sm-4">'+resp["gkresult"][i]["balance"]+'</td> </tr>');                  
            
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
  });