const https = require('https');
const fs = require('fs');
const {EOL} = require('os');

class Dog {

    constructor(bd, sb) {
        this.breed = bd;
        this.subbreed = sb;
    }
    breed;
    subbreed;
    image;
}

const dogServerURL = 'https://dog.ceo/api/breeds/list/all';

function downloadData(url) {
    return new Promise((resolve, reject) =>{
        https.get(url, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
    
            let error;

            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                                `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                                `Expected application/json but received ${contentType}`);
            }
            if (error) {
                res.resume();
               reject(error.message);
            }
    
            res.setEncoding('utf8');
            let rawData = '';
    
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
          
                try {
                    const parsedData = JSON.parse(rawData);
                    if (!parsedData || typeof parsedData.message == 'undefined') {
                        reject('invalid data response');
                    }
    
                    resolve(parsedData);
                } catch (e) {
                    reject(e.message);
                }
            });
            }).on('error', (e) => {
                reject(`Got error: ${e.message}`);
            });
    });
}

function saveDogPictures(fnm ='dogs.txt',dogsToFetch = 3, serverUrl = dogServerURL) 
{
    return downloadData(serverUrl)
        .then((parsedData)=>{
            var darray=[];
            Object.keys(parsedData.message).forEach((pdk)=>{
                if (!Array.isArray(parsedData.message[pdk])) {
                    throw new Error('invalid data received for ' + pdk)
                }
                if (!!parsedData.message[pdk].length)  {
                    for(var i=0;i<parsedData.message[pdk].length; i++) {
                        darray.push(new Dog(pdk,parsedData.message[pdk][i]));
                    }
                } else {
                    darray.push(new Dog(pdk,''));
                }
            });
            var threeDogs =[],
                resultDogs = []; 
            while(threeDogs.length < dogsToFetch){
                var r = Math.floor(Math.random() * darray.length);
                if(threeDogs.indexOf(r) === -1) {
                    threeDogs.push(r);
                    resultDogs.push(darray[r]);
                }
            }
            return resultDogs;
        })
        .then((dogsToWrite)=>{
            return Promise.all(dogsToWrite.map((dg)=>{
                var url =  'https://dog.ceo/api/breed/'+ dg.breed+ (!!dg.subbreed ?'/'+ dg.subbreed: '') +'/images/random';

                return downloadData(url)
                    .then(dt=>{
                        if (!dt || dt.status != 'success')
                            return Promise.reject('invalid result');

                        dg.image = dt.message;
                        return dg;
                    });

            }))
            .then((dgimgs)=>{
                var stw = '';

                for(var i=0;i<dgimgs.length;i++) {
                    stw = stw + dgimgs[i].image + ' (' + (!!dgimgs[i].subbreed ? dgimgs[i].subbreed + ' ': '') + dgimgs[i].breed + ')'+ EOL;
                }
                
                return new Promise((resolve, reject)=> {
                    fs.writeFile(fnm,stw, function(err) {
                        if (err) {
                            reject(err);
                        }
                        resolve(stw);
                    });
                });
            });
        });
}

module.exports = {
    saveDogPictures : saveDogPictures
}