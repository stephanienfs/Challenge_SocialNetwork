const { response } = require('express');
const http = require('http');
const fetch = require("node-fetch");

const hostname = '127.0.0.1';
const port = 3000;

function getDelay() {
    return Math.floor(Math.random() * 20);
}

async function fetchData() {
    const promiseTwitter = new Promise((resolve, reject) => {
        const delay = getDelay();
        setTimeout(() => {
            const result = fetch('http://codefight.davidbanham.com/twitter').then((response) => response.json());
            resolve(result);
        }, delay);
    });

    
    const promiseFacebook = new Promise((resolve, reject) => {
        const delay = getDelay;
        setTimeout(() => {
          const result = fetch('http://codefight.davidbanham.com/facebook').then((response) => response.json());
          resolve(result);
        }, delay);
      });

    /*       const promiseInstagram = new Promise((resolve, reject) => {
            setTimeout(() => {
              const newValue = Math.floor(Math.random() * 20);
              resolve(newValue);
            }, newValue);
          }); */

    Promise.all([promiseTwitter,promiseFacebook]).then(values => {
        let responseObj = new Object();
        let twitterResponseObj = new Object();
        let facebookResponseObj = new Object();
        
        responseObj.twitter = [];
        console.log("VALUES" + values[1]);
        twitterResponseObj = JSON.parse(values[1]);
        console.log("TW RESPONSE OBJ" + twitterResponseObj);
        twitterResponseObj.forEach(tweet => {
            responseObj.twitter.push(tweet.tweet);
        });
        //responseObj.facebook = values[1].status;
        
        console.log("RESULT", JSON.stringify(responseObj)); // [3, 1337, "foo"]
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

const server = http.createServer((req, res) => {
    /*   res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello, World!\n'); */
    fetchData();
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});