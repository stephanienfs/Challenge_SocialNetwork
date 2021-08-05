const { response } = require('express');
const http = require('http');
const fetch = require("node-fetch");

const hostname = '127.0.0.1';
const port = 3000;

function getDelay() {
    return Math.floor(Math.random() * 20);
}

function createSocialNetworkObject(values, attrName) {

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

            fetch('http://codefight.davidbanham.com/twitter')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err);
                });
        }, delay);
    });


    const promiseFacebook = new Promise((resolve, reject) => {
        const delay = getDelay();
        setTimeout(() => {

            fetch('http://codefight.davidbanham.com/facebook')
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err);
                });
        }, delay);
    });

    const promiseInstagram = new Promise((resolve, reject) => {
        const delay = getDelay();
        setTimeout(() => {

            fetch('http://codefight.davidbanham.com/instagram')
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        }, delay);
    });

    return Promise.all([promiseTwitter, promiseFacebook, promiseInstagram])
        .then(values => {

            let responseObj = new Object();
            let twitterResponseObj = new Object();
            let facebookResponseObj = new Object();
            let instagramResponseObj = new Object();


            twitterResponseObj = createSocialNetworkObject(values[0], 'tweet');
            facebookResponseObj = createSocialNetworkObject(values[1], 'status');
            instagramResponseObj = createSocialNetworkObject(values[2], 'picture');

            responseObj.twitter = twitterResponseObj;
            responseObj.facebook = facebookResponseObj;
            responseObj.instagram = instagramResponseObj;

            return responseObj;
        }).catch(error => {
            errorObj = new Object();
            errorObj.error = new Object();
            errorObj.error.code = '500';
            errorObj.error.message = 'Internal Server Error';

            return errorObj;
        });;
}

const server = http.createServer();

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

server.on('request', async (req, res) => {

    fetchData().then((data) => {

        if (data.error) {

            res.statusCode = 500;

        } else {

            res.statusCode = 200;

        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));

    });

});