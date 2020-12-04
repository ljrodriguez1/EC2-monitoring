// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { render } from './views/widget'
const request = require('request')


function app(window) {
    console.log('CW-Widget');

    let configurations = {};

    let queue = window[window['CW-Widget']].q;
    if (queue) {
        for (var i = 0; i < queue.length; i++) {
            
            configurations = addParams(configurations, queue[i][1]);
            apiHandler(queue[i][0], configurations);
        }
    }
}

function apiHandler(api, params) {

    console.log(`API Handler ${api}`, params);

    params.widget.forEach((val) => {

        let accountId = val.accountId?val.accountId:"" ;
        
        var options = {
            url: params.url+'?role=CloudWatchSnapshotGraphs&accountId='+accountId+ '&widgetDefinition='+encodeURIComponent(JSON.stringify(val.widgetDefinition)),
            headers: {
                    'x-api-key' : params.api_key,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept' : 'image/png'
            }
        };
        console.log(options.url)
    	request(options, function (error, response, body) {
      		console.log('error:', error); 
      		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      		console.log('body:', body)

            var img = new Buffer(body, 'base64');
      		render(img);

    	});
    });
           
}

function addParams(a, b) {
    for (var key in b)
        if (b.hasOwnProperty(key))
            a[key] = b[key];
    return a;
}

app(window);