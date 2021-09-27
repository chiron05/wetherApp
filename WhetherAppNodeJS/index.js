const http=require('http');
const fs= require('fs');
var requests=require('requests')

const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal,orgVal)=>
{
    let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature=temperature.replace("{%location%}",orgVal.name);
    temperature= temperature.replace("{%country%}",orgVal.sys.country);
    temperature=temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature= temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    return temperature;
}
const server=http.createServer((req,res)=>
{
    if(req.url=="/")
    {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Goa&appid=8d88cc0c1add8e0ed452d6fa830b3fb9')
        .on('data',(chunk_data)=>
        {
            const obj_Data= JSON.parse(chunk_data);
            const arraydata=[obj_Data];
          
            // array of an object
            const realTimeData=arraydata.map((val)=> replaceVal(homeFile,val)).join("");
           
            // const realTimeData=replaceVal(homeFile,arraydata[0]);
            // console.log(realTimeData.toString())
            res.write(realTimeData);
        
        })
        .on('end',(err)=>
        {
            if(err) return console.log("Error in connection"+ err);
            res.end();
          
        });
        
    }
});

server.listen(8000,"127.0.0.1");