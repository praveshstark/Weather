const port=process.env.PORT || 8000;
const http=require('http');
const fs=require('fs');
var requests=require('requests');

const homeFile=fs.readFileSync('home.html','utf-8');

const replaceVal=(tempVal,orgVal)=>{
    let temprature=tempVal.replace("{%tempval%}", orgVal.main.temp);
    temprature=temprature.replace("{%tempmin%}", orgVal.main.temp_min);
    temprature=temprature.replace("{%tempmax%}", orgVal.main.temp_max);
    temprature=temprature.replace("{%location%}", orgVal.name);
    temprature=temprature.replace("{%country%}", orgVal.sys.country);
    temprature=temprature.replace("{%tempStatus%}", orgVal.weather[0].main);
    
return temprature;
}

const server=http.createServer((req,res)=>{
    if(req.url='/'){
            requests(
                "http://api.openweathermap.org/data/2.5/weather?q=Etah&appid=9270ea351549f7646ac47a71735107d2&units=metric")
            .on('data',(chunk)=>{
                const objdata=JSON.parse(chunk);
                const arrData=[objdata]
               //    console.log(arrData[0].main.temp); 
               const realTimeData=arrData
               .map((val)=> replaceVal(homeFile,val))
               .join("");
                res.write(realTimeData);
            })
            .on('end',(err)=>{
                if(err) return console.log('connection close due to error');
                res.end();
            });
    }
});

//server.listen(8000,"127.0.0.1");
server.listen((port),()=>{
    console.log(`listing to the port no. at ${port}`);
})
//api.openweathermap.org/data/2.5/weather?q=Etah&appid=9270ea351549f7646ac47a71735107d2
//api.openweathermap.org/data/2.5/weather?q=etah&appid=9270ea351549f7646ac47a71735107d2units=metric