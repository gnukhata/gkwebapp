// $(document).ready(function() {

//     $('#showviewledger').click(function (e) {
//     // calls view page for ledger report.
//     $("#msspinmodal").modal();
//     $.ajax(
//       {

// 	type: "POST",
// 	url: "/showviewledger",
// 	global: false,
// 	async: false,
// 	datatype: "text/html",
// 	beforeSend: function(xhr)
//         {
//           xhr.setRequestHeader('gktoken',sessionStorage.gktoken );
//         },
// 	success: function(resp)
// 	{
//           $("#info").html(resp);
// 	}
//       }
//     );
//   });

//   $("#showbalancesheetaa").click(function(event){// calls view page for balance sheet report.
//     $("#showbalancesheet").click()
//   });


// });