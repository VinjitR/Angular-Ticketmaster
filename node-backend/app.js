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

const publicPath = path.join(__dirname, "/dist/tm-angular");

app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/tm-angular/index.html"));
});


app.get('/getticket', function(req, res) {
  //  var keyword=req.query.keyword;
  
  //http://localhost:8080/getticket?keyword=pop&category=All&distance=10&location=othloc&location2=Ny
  //http://localhost:8080/auto_complete?keyword=Suns
  //http://localhost:8080/getdetails?id=vv1AaZAqUGkdLRJxS

  // res.setHeader("Access-Control-Allow-Origin","*");
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
      });
    }
      
    
  async function getcall(){
    // ticketurl+="&sort=relevance,date,asc";
    console.log(ticketurl);
    axios.get(ticketurl)
    .then(async (response) => {
     let data = await getevents(response.data);
     console.log(data);
     res.send(data);
    
    })
    .catch(console.error)
 
  }

  

  async function getevents(ticketinfo){
    
    event_data = {"events":[]}
    genres_list = ""
    if (ticketinfo==!undefined){
      return {"error":true}
    }
    if(ticketinfo.page.totalElements==0){
      return event_data;
    }
    ticketinfo = ticketinfo["_embedded"]["events"]
    

    for(var i in ticketinfo)
    {

      cat = ""
      if ('subGenre' in ticketinfo[i]['classifications'][0])
      {
        if(ticketinfo[i]['classifications'][0]['subGenre']['name'] != "Undefined")
            cat = cat + ticketinfo[i]['classifications'][0]['subGenre']['name']+" | "
      }

      if ('genre' in ticketinfo[i]['classifications'][0])
      {
        if(ticketinfo[i]['classifications'][0]['genre']['name'] != "Undefined")
           cat = cat + ticketinfo[i]['classifications'][0]['genre']['name']+" | "
      }

      if ('segment' in ticketinfo[i]['classifications'][0])
      {
        if(ticketinfo[i]['classifications'][0]['segment']['name'] != "Undefined")
           cat = cat + ticketinfo[i]['classifications'][0]['segment']['name']+" | "
      }

      if ('subType' in ticketinfo[i]['classifications'][0])
      {
        if(ticketinfo[i]['classifications'][0]['subType']['name'] != "Undefined")
           cat = cat + ticketinfo[i]['classifications'][0]['subType']['name']+" | "
      }

      if ('type' in ticketinfo[i]['classifications'][0])
      {
        if(ticketinfo[i]['classifications'][0]['type']['name'] != "Undefined")
           cat = cat + ticketinfo[i]['classifications'][0]['type']['name']
      }

      cat = cat.substring(0, cat.length-3);
      //console.log(cat)

      event_data['events'].push({'datetime' : ticketinfo[i]['dates']['start']['localDate'],
                                   'event' : ticketinfo[i]['name'],
                                   'id':ticketinfo[i]['id'],
                                   'genre' : cat,
                                   'venue': ticketinfo[i]['_embedded']['venues'][0]['name']})

    }
    event_data['events'].sort(function(a,b){                  //Sort in ascending order according to dates
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.datetime) - new Date(b.datetime);
    });
    // console.log(event_data)
    return event_data; 
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
    //console.log('Search artists', data.body);
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

  axios.get(autourl)
    .then( (response) => {
      res.send(response.data._embedded.attractions);
    })
    .catch(console.error);



});





app.get('/getvenue',function(req,res){
  var params=req.query;
  var venurl='https://app.ticketmaster.com/discovery/v2/venues.json?apikey=s8R7CnAgaR6EFkySWAVDsmg8W757S4Yc&keyword='+params.key;
  https.get(venurl,function(requ,resp)
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



// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;