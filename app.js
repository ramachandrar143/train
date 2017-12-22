require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var Cloudant = require('cloudant');
var app = express();
var request = require('request');
var nodemailer = require('nodemailer');
var smtp = require('nodemailer-smtp-transport');
var date = require('./Date.js');
var user = 'ramachandrar143'
var passwd = 'Ramachandrar143@gmail.com'
var cloudant = Cloudant({ account: user, password: passwd });
var db = cloudant.db.use('railway')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var transport = nodemailer.createTransport(smtp({
    service: 'hotmail',
    auth: {
        user: "ramachandrar143@hotmail.com",
        pass: "Music.143"
    }
}));
var d = new Date();
var weekday = new Array(7);
weekday[0] = "SUN";
weekday[1] = "MON";
weekday[2] = "TUE";
weekday[3] = "WED";
weekday[4] = "THU";
weekday[5] = "FRI";
weekday[6] = "SAT";
var n = weekday[d.getDay()];
var images = new Array(10);
images[0] = 'https://www.railrider.in/blog/wp-content/uploads/2015/12/1433317533GatimaanExpress.jpg'
images[1] = 'https://www.thebetterindia.com/wp-content/uploads/2015/09/traintoilet.jpg'
images[2] = 'https://www.bahn.com/en/view/mdb/pv/agenturservice/2011/mdb_22990_ice_3_schnellfahrstrecke_nuernberg_-_ingolstadt_1000x500_cp_0x144_1000x644.jpg'
images[3] = 'https://d1srlirzdlmpew.cloudfront.net/wp-content/uploads/sites/92/2015/12/06023356/train-hack-featured-1.jpg'
images[4] = 'https://www.lakesiderailway.co.uk/wp-content/uploads/2016/05/train2-0x560.jpg'
images[5] = 'http://www.mulierchile.com/train-pictures/train-pictures-020.jpg'
images[6] = 'http://media2.intoday.in/indiatoday/images/stories/railway-4_647_080716084935.jpg'
images[7] = 'http://media2.intoday.in/indiatoday/images/stories/railway-4_647_080716084935.jpg'
images[8] = 'http://wonderfulmumbai.com/wp-content/uploads/2013/01/Indian_Railway.jpg'
images[9] = 'https://i.ytimg.com/vi/tBZRI-u1Q94/maxresdefault.jpg'
/**
 * Required modules for Bot 
 */
app.listen(3000, function () {
    console.log('Indian Railways are running on track 3000')
})
app.get('/', function (req, res) {
    return res.json({ "hello": "hello" })
})
app.post('/api', function (req, res) {
    console.log(req.body.result.contexts)
    /* if (req.body.result.action == "validate") {
         if ((req.body.result.parameters.pnumber).length != 10) {
             console.log('Error')
             return res.json({
                 speech: 'Please Enter a valid mobile number',
                 displayText: 'Here you go..!',
                 contextOut: [
                     {
                         "name": "call",
                         "parameters": {
                             "pnumber": " "
                         },
                         "lifespan": 5
                     }
                 ]
             })
         }
     }/*/
    var intentName = req.body.result.metadata.intentName;
    console.log(intentName);
    if (intentName == "TrainsBwStations") {
        var fromsta = req.body.result.parameters.fromStations;
        var tosta = req.body.result.parameters.toStations;
        var options = {
            url: 'https://api.railwayapi.com/v2/between/source/' + fromsta + '/dest/' + tosta + '/date/' + date.getDate() + '/apikey/' + process.env.APIKEY
        }
        request(options, function (err, resp, body) {
            if (err) {
                console.log(err)
            }
            var jsonObj = eval('(' + body + ')');
            console.log(body)
            var o = {};
            var key = 'elements'
            o[key] = []
            if (jsonObj.trains.length >= 9)
                var x = 9
            else
                var x = jsonObj.trains.length
            console.log('No of trains are ' + x)
            for (var i = 0; i < x; i++) {
                var a = {
                    'title': jsonObj.trains[i].name,
                    'subtitle': 'arriving at ' + jsonObj.trains[i].dest_arrival_time,
                    "image_url": images[i],
                    'buttons': [
                        {
                            'type': 'postback',
                            'title': 'Live Status ',
                            'payload': 'where is the train ' + jsonObj.trains[i].number + ''
                        }, {
                            'type': 'postback',
                            'title': 'Turn on notifications',
                            'payload': 'Noify me to when ' + jsonObj.trains[i].number + 'is near '
                        }
                    ]
                }
                o[key].push(a);
            }
            return res.json({
                speech: 'hello',
                displayText: 'Here you go..!',
                'data': {
                    'facebook': {
                        'attachment': {
                            'type': 'template',
                            'payload': {
                                'template_type': 'generic',
                                'elements': o.elements
                            }
                        }
                    }
                }
            })
        })
    }
    if (intentName == "NXTTRAIN") {
        console.log(req.body.result.contexts)
        var timeRange = req.body.result.parameters.number;
        var stcode = req.body.result.parameters.any;
        var options = {
            url: 'http://api.railwayapi.com/v2/arrivals/station/' + stcode + '/hours/' + timeRange + '/apikey/' + process.env.APIKEY
        }
        request(options, function (err, resp, body) {
            if (err) {
                console.log(err)
            }
            var jsonObj = eval('(' + body + ')');
            //console.log(jsonObj.trains[2].number)
            var o = {};
            var key = 'elements'
            o[key] = []
            if (jsonObj.trains.length >= 9)
                var x = 9
            else
                var x = jsonObj.trains.length
            console.log('No of trains are ' + x)
            for (var i = 0; i < x; i++) {
                var a = {
                    'title': jsonObj.trains[i].name,
                    'subtitle': 'arriving at ' + jsonObj.trains[i].actarr,
                    "image_url": images[i],
                    'buttons': [
                        {
                            'type': 'postback',
                            'title': 'Live Status ',
                            'payload': 'where is the train ' + jsonObj.trains[i].number + ''
                        }, {
                            'type': 'postback',
                            'title': 'Turn on notifications',
                            'payload': 'Noify me to when ' + jsonObj.trains[i].number + 'is near '
                        }
                    ]
                }
                o[key].push(a);
            }
            console.log('Hello' + JSON.stringify(o.elements))
            return res.json({
                speech: 'hello',
                displayText: 'Here you go..!',
                'data': {
                    'facebook': {
                        'attachment': {
                            'type': 'template',
                            'payload': {
                                'template_type': 'generic',
                                'elements': o.elements
                            }
                        }
                    }
                }
            })
        })
    }
    if (intentName == "PNR") {
        console.log(req.body.result.parameters)
        var Pno = req.body.result.parameters.pnumber;  //User parameters from dialogflow.com
        var options = {
            url: 'http://api.railwayapi.com/v2/pnr-status/pnr/' + Pno + '/apikey/' + process.env.APIKEY
        }
        var o = {};
        var key = 'elements'
        o[key] = []
        request(options, function (err, resp, body) {
            //Indian Railway API call
            if (body) {
                console.log('' + body);
                var jsonObj = eval('(' + body + ')');
                console.log(jsonObj.passengers.length)
                var o = {};
                var key = 'elements'
                o[key] = []
                for (var i = 0; i < jsonObj.passengers.length; i++) {
                    if ((jsonObj.passengers[i].current_status).slice(0, 2) == "WL" || (jsonObj.passengers[i].current_status).slice(0, 2) == 'RL') {
                        var a = {
                            "title": 'Passenger ' + i,
                            "subtitle": "Your Tickets are not yet confirmed and your status is" + jsonObj.passengers[i].current_status,
                            "image_url": 'http://www.institut-clement-ader.org/photo.php?id=ocherrier.png'
                        }
                        o[key].push(a);
                    }
                    else {
                        var a = {
                            "title": 'Passenger ' + i,
                            "subtitle": "Your Tickets are confirmed  and your current status is :" + jsonObj.passengers[i].current_status,
                            "image_url": "http://www.institut-clement-ader.org/photo.php?id=ocherrier.png"
                        }
                        o[key].push(a);
                    }
                }
                console.log(JSON.stringify(o))
                console.log('heloo test');
                return res.json(
                    {
                        "speech": "hello test",
                        "messages": [
                            {
                                "type": "simple_response",
                                "platform": "google",
                                "textToSpeech": "hello test"
                            },
                            {
                                "type": "basic_card",
                                "platform": "google",
                                "title": "rose",
                                "formattedText": "they are red",
                                "image": {
                                    "url": ""
                                },
                                "buttons": [
                                    {
                                        "title": "google",
                                        "openUrlAction": {
                                            "url": "https://www.google.com"
                                        }
                                    }
                                ]
                            },
                            {
                                "type": 0,
                                "speech": "hello test"
                            }
                        ]
                    })
            }
        })
    }




    if (intentName == "callme") {
        var stname = req.body.result.parameters.stations;
        var tno = req.body.result.parameters.number;
        var phone = req.body.result.parameters.email;
        console.log("sta name = " + stname.toUpperCase() + "  train no = " + tno)
        var options = {
            url: 'http://api.railwayapi.com/v2/live/train/' + tno + '/date/' + date.getDate() + '/apikey/' + process.env.APIKEY
        }
        request(options, function (err, resp, body) {
            var jsonObj = eval('(' + body + ')');
            //  console.log((jsonObj.route[10].station))
            for (var i = 0; i < (jsonObj.route).length; i++) {
                if (jsonObj.route[i].station.code == stname.toUpperCase()) {
                    //console.log('Sch arr is :' + jsonObj.route[i].actarr)
                    var scharr = jsonObj.route[i].actarr;
                    db.insert({ _id: scharr, pno: phone, trainno: tno, stationname: stname }, function (err, data) {
                        if (err) {
                            console.log(err)
                            return res.json({
                                speech: 'Technical Error...! please try again...',
                                displayText: 'Here you go..!'
                            })
                        }
                        else {
                            var message = {
                                from: 'ramachandrar143@hotmail.com',
                                to: phone,
                                subject: 'Train Notification',
                                text: 'We\'ll notify you when your train is at ' + stname + '. ' + scharr
                            };
                            transport.sendMail(message, function (error, success) {
                                if (error) {
                                    console.log('Error occured');
                                    console.log(error.message);
                                }
                                else
                                    console.log('Message sent successfully!');
                            });

                            return res.json({
                                speech: 'Ok, we\'ll place a call for you! ',
                                displayText: 'Here you go..!'
                            })

                        }
                    })
                }
            }

        })
    }
    if (intentName == "LIVE") {
        var tno = req.body.result.parameters.number;
        console.log('Helo  ' + tno);
        var options = {
            url: 'http://api.railwayapi.com/v2/live/train/' + tno + '/date/' + date.getDate() + '/apikey/' + process.env.APIKEY
        }
        request(options, function (err, resp, body) {
            var jsonObj = eval('(' + body + ')');
            console.log(jsonObj)
            var st = jsonObj.position
            if (st) {
                console.log(st)
                return res.json({
                    "speech": "Your results:",
                    "displayText": "Your results:",
                    "data": {
                        "facebook": {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": [
                                        {
                                            'title': jsonObj.train.name,
                                            'subtitle': jsonObj.position,
                                            'image_url': 'http://www.qygjxz.com/data/out/192/3960366-railway.png',
                                            'buttons': [
                                                {
                                                    'type': 'postback',
                                                    'title': 'Thank You!',
                                                    'payload': 'Thank you!'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                })
            }
        })
    }
})

var notification = setInterval(function () {
    var time = date.getTime()
    console.log(time)
    db.get(time, function (err, data) {
        if (err) {

        }
        else {

            console.log(data)
            var message = {
                from: 'ramachandrar143@hotmail.com',
                to: data.pno,
                subject: 'Train Notification',
                text: 'Your Train' + data.trainno + ' is just arrived at ' + data.stationname + '. Get ready..! Happy Journey'
            };
            transport.sendMail(message, function (error, success) {
                if (error) {
                    console.log('Error occured');
                    console.log(error.message);
                }
                else
                    console.log('Message sent successfully!');
            });



        }
    })
}, 60000)