const express = require('express');
const cors=require('cors');
var path=require('path');

var geohash=require('ngeohash');
var https=require('https');
var url=require('url');
const app = express();

app.use(cors())



app.get('/getticket', function(req, res) {
  //  var keyword=req.query.keyword;
  var location='9qh1w';
  //http://localhost:8080/getticket?keyword=pop&category=All&distance=10&location=9qh1w
  //http://localhost:8080/auto_complete?keyword=Suns
  //http://localhost:8080/getdetails?id=vv1AaZAqUGkdLRJxS

  // res.setHeader("Access-Control-Allow-Origin","*");
   var params=req.query;
   var ticketurl='https://app.ticketmaster.com/discovery/v2/events.json?apikey=s8R7CnAgaR6EFkySWAVDsmg8W757S4Yc&keyword='+params.keyword+'&unit=miles&geoPoint='+location;
   if (params.category!="All"){
      ticketurl+='&segmentId='+params.segmentId;
    }
    if (params.distance!=""){
      ticketurl+='&radius='+params.distance;
    }
    else{
      ticketurl+='&radius=10';
    }

  https.get(ticketurl,function(requ,resp)
		{
        var res_text = "";
        requ.on('data',function(data)
		{
            res_text+=data;
			
        });
        requ.on('end',function()
		{
            return res.send(res_text);
        });

		});
  });



app.get('/getdetails',function(req,res){

  var params=req.query;
  deturl= "https://app.ticketmaster.com/discovery/v2/events/"+params.id+".json?apikey=s8R7CnAgaR6EFkySWAVDsmg8W757S4Yc"
  https.get(deturl,function(requ,resp)
  {
      var res_text = "";
      requ.on('data',function(data)
  {
          res_text+=data;
    
      });
      requ.on('end',function()
  {
          return res.send(res_text);
      });

  });
});


app.get('/auto_complete',function(req,res){


  var params=req.query;
  var autourl='https://app.ticketmaster.com/discovery/v2/suggest?apikey=s8R7CnAgaR6EFkySWAVDsmg8W757S4Yc&keyword='+params.keyword;
  https.get(autourl,function(requ,resp)
  {
      var res_text = "";
      requ.on('data',function(data)
  {
          res_text+=data;
    
      });
      requ.on('end',function()
  {
          return res.send(res_text);
      });

  });

});


// app.get('/google_venue',function(req,res){


//   var
// });



// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;