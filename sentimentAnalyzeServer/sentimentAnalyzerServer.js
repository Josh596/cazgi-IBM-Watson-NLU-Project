const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
const app = new express();


function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version:'2020-08-01',
        authenticator: new IamAuthenticator({
            apikey:api_key,
        }),
        serviceUrl:api_url,
    });

    return naturalLanguageUnderstanding
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion': {},            
        },
    };
    NLUInstance = getNLUInstance();

    NLUInstance.analyze(analyzeParams)
    .then(
        analysisResults =>{
            console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(analysisResults.result.emotion.document.emotion);
        }
    )
    .catch(
        error =>{
            console.log(error)
        }
    )

});

app.get("/url/sentiment", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment': {},            
        },
    };
    NLUInstance = getNLUInstance();

    NLUInstance.analyze(analyzeParams)
    .then(
        analysisResults =>{
            console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(analysisResults.result.sentiment.document.label);
        }
    )
    .catch(
        error =>{
            console.log(error)
        }
    )
});

app.get("/text/emotion", (req,res) => {
    const analyzeParams = {
        "text": "I love apples! I do not like oranges.",
        "features": {
          "emotion": {}
          },
    };

    NLUInstance = getNLUInstance();

    NLUInstance.analyze(analyzeParams)
    .then(
        analysisResults =>{
            console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(analysisResults.result.emotion.document.emotion);
        }
    )
    .catch(
        error =>{
            console.log(error)
        }
    );

});

app.get("/text/sentiment", (req,res) => {
    
    const analyzeParams = {
        "text": "I love apples! I do not like oranges.",
        "features": {
          "sentiment": {}
          },
    };
    NLUInstance = getNLUInstance();

    NLUInstance.analyze(analyzeParams)
    .then(
        analysisResults =>{
            console.log(JSON.stringify(analysisResults, null, 2));
            return res.send(analysisResults.result.sentiment.document.label);
        }
    )
    .catch(
        error =>{
            console.log(error)
        }
    )

});

let server = app.listen(3030, () => {
    console.log('Listening', server.address().port)
})

