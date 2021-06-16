const express = require('express');
const cors=require('cors');
var path=require('path');
var SpotifyWebApi = require('spotify-web-api-node');
var geohash=require('ngeohash');
var https=require('https');
var axios=require('axios');
const { response } = require('express');
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
   var ticketurl='https://app.ticketmaster.com/discovery/v2/events.json?apikey=s8R7CnAgaR6EFkySWAVDsmg8W757S4Yc&keyword='+params.keyword.replace(' ','+');
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
      let clocation=geohash.encode(lat, lng);
      ticketurl+='&geoPoint='+clocation;
      getcall();
    }
    else if(params.location=="othloc"){
      glink="https://maps.googleapis.com/maps/api/geocode/json?address="+params.location2.replace(/ /g,"+")+"&key=AIzaSyBI0GnlzzsYuP8axXFFjZdUleXhUvmXMzA";
      var glat=0;
      var glng=0;
      var gloc='';
      axios.get(glink)
      .then(response=>{
        glat=response.data['results'][0]['geometry']['location'].lat;
        glng=response.data['results'][0]['geometry']['location'].lng;
        gloc= geohash.encode(glat,glng);
        ticketurl+='&geoPoint='+gloc;
        getcall();
      })
      

      
  //     (async () => {
  //       try {
  //       const response = await axios.get(glink);
  //       let lat=response.data.results[0].geometry.location.lat;
  //       let lng=response.data.results[0].geometry.location.lng;
  //       let glocation=geohash.encode(lat,lng);
  //       console.log(glocation);
  //       ticketurl+='&geoPoint='+glocation;
  //   }
  //   catch (error) {
  //     console.log(error.response.body);
  //   }
  // })();
      
      
    }
    
  async function getcall(){
    console.log(ticketurl);
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
  }
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
  console.log('details');
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

var spotifyApi = new SpotifyWebApi({
  clientId: '05089d44727d4e4db2a6a4f7904b134b',
  clientSecret: '83d11159f25142d8aeaa37fff3bccc4a',
  redirectUri: 'http://www.example.com/callback'
});

app.get('/spotify',function(req, res)
{
  var params = req.query;
	var url_text_spotify= "https://api.spotify.com/v1/search?q="+params.Keyword+"type=artist";
	console.log( "https://api.spotify.com/v1/search?q="+params.Keyword+"type=artist");
	
	// https.get(url_text_spotify,function(requ,resu)
	// {
  //       var res_text = "";
  //       requ.on('data',function(data)
	// 	{
  //           res_text+=data;
			
  //       });
  //       requ.on('end',function(){
  //           return res.send(res_text);
  //       });

  //   });
  async function getacess(){
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
  
      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
}

  async function get_artist(){
    if (spotifyApi.access_token==""){
      getacess();  
    }
    
  spotifyApi.searchArtists(params.Keyword)
  .then(function(data) {
    console.log('Search artists by "Love"', data.body);
    res.send(data.body);
  }, function(err) {
    getacess();
    get_artist();
    console.error(err);
  });      			
}

  get_artist();
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