const { response } = require('express');
const http = require('http');
const fetch = require("node-fetch");

const hostname = '127.0.0.1';
const port = 3000;

function getDelay() {
    return Math.floor(Math.random() * 20);
}

function getObj(values, attrName) {

    let networkResponseArr = new Array();

    values.forEach(value => {
        const valueObj = new Object();
        valueObj[attrName] = value[attrName];
        networkResponseArr.push(valueObj);
    });

    return networkResponseArr;

}

function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}

async function fetchData() {

    const promiseTwitter = new Promise((resolve, reject) => {
        const delay = getDelay();
        setTimeout(() => {

            fetch('http://codefight.davidbanham.com/twitter').then(response => {
                return response.json();
            }).then(data => {
                resolve(data);
            }).catch(error => {
                console.log("-------------- HUBO UN ERROR TWITTER -------------");
                console.log(error);
                return error;
            });

        }, delay);
    });


      const promiseFacebook = new Promise((resolve, reject) => {
        const delay = getDelay();
        setTimeout(() => {

            fetch('http://codefight.davidbanham.com/facebook').then(response => {
                return response.json();
            }).then(data => {
                resolve(data);
            }).catch(error => {
                console.log("-------------- HUBO UN ERROR FACBEOOK -------------");
                console.log(error);
                return error;
            });

        }, delay);
     });
 
     const promiseInstagram = new Promise((resolve, reject) => {
        const delay = getDelay();
        setTimeout(() => {

            fetch('http://codefight.davidbanham.com/instagram').then(response => {
                return response.json();
            }).then(data => {
                resolve(data);
            }).catch(error => {
                console.log("-------------- HUBO UN ERROR INSTAGRAM-------------");
                console.log(error);
                return error;
            });

        }, delay);
     }); 

    return Promise.all([promiseTwitter,promiseFacebook,promiseInstagram]).then(values => {

        let responseObj = new Object(); // responseObj = {}
        let twitterResponseObj = new Object(); // twitterResponseObj = {}
        let facebookResponseObj = new Object(); // facebookResponseObj = {}
        let instagramResponseObj = new Object();  // instagramResponseObj = {}
      
        if(values[0])
            twitterResponseObj = getObj(values[0], 'tweet'); // twitterResponseObj = [{tweet: ...}, {tweet: ...}]
        if(values[1])
            facebookResponseObj = getObj(values[1], 'status');
        if(values[2])
            instagramResponseObj = getObj(values[2], 'picture');

        responseObj.twitter = twitterResponseObj; // responseObj = {twtter: [{tweet: ..}]}
        responseObj.facebook = facebookResponseObj;
        responseObj.instagram = instagramResponseObj;

        console.log("THIS IS THE RESULT FOR RESPONSE--------------------\n");
        console.log(responseObj); 

        return JSON.stringify(responseObj);
    });

    /* try {
        const results = await Promise.allSettled(
            [
                fetch('http://codefight.davidbanham.com/twitter').then((response) => response.json()),
                fetch('http://codefight.davidbanham.com/facebook').then((response) => response.json()),
                fetch('http://codefight.davidbanham.com/instagram').then((response) => response.json()),
            ]
        );
        console.log(results);
    } catch (error) {
        console.log(error);
    } */
}

const server = http.createServer();

server.on('request', async (req, res) => {

    let response = await fetchData();

    console.log('----response\n' + JSON.stringify(response));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    // Check if JSON, and return without JSON.stringify
    if(isJson(response))
        res.end(JSON.stringify(response));
    else
        res.end(response);

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});