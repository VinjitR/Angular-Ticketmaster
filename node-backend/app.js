const express = require('express');
const cors=require('cors');
var path=require('path');

var geohash=require('ngeohash');
var https=require('https');
var axios=require('axios');
const app = express();

app.use(cors())



app.get('/getticket', function(req, res) {
  //  var keyword=req.query.keyword;
  
  //http://localhost:8080/getticket?keyword=pop&category=All&distance=10&location=9qh1w
  //http://localhost:8080/auto_complete?keyword=Suns
  //http://localhost:8080/getdetails?id=vv1AaZAqUGkdLRJxS

  // res.setHeader("Access-Control-Allow-Origin","*");
  var location='';
   var params=req.query;
   var ticketurl='https://app.ticketmaster.com/discovery/v2/events.json?apikey=s8R7CnAgaR6EFkySWAVDsmg8W757S4Yc&keyword='+params.keyword;
   if (params.category!="All"){
      ticketurl+='&segmentId='+params.category;
    }
    if (params.distance!=""){
      ticketurl+='&radius='+params.distance;
    }
    else{
      ticketurl+='&radius=10';
    }
    if (params.units='miles'){
      ticketurl+='&unit=miles';
    }
    else{
      ticketurl+='&unit=kilometers';
    }

    if (params.location=="curloc"){
      var locs=params.location2.split(',');
      var lat=parseFloat(locs[0]);
      var lng=parseFloat(locs[1]);
      location=geohash.encode(lat, lng);
      ticketurl+='&geoPoint='+location;
    }
    else{
      glink="https://maps.googleapis.com/maps/api/geocode/json?address="+params.location2+"&key=AIzaSyBI0GnlzzsYuP8axXFFjZdUleXhUvmXMzA";
      axios.get(glink)
      .then(function(response){
        console.log(response.data);
        var lat=response.data.results[0].geometry.location.lat;
        var lng=response.data.results[0].geometry.location.lng;
        console.log(response.data.results[0].formatted_address);
        location=geohash.encode(lat,lng);
        console.log(location);
        ticketurl+='&geoPoint='+location;
      })
      

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

app.get('/googleloc',function(req,res){
  var params=req.query
  glink="https://maps.googleapis.com/maps/api/geocode/json?address="+params.address+"&key=AIzaSyBI0GnlzzsYuP8axXFFjZdUleXhUvmXMzA"
  // https.get({url:glink}, function(err, response, body) {
  //   if(err) { console.log(err); return; }
  //   console.log("Get response: " + response.text);
  // });
  https.get(glink,function(requ,resp)
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

})

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