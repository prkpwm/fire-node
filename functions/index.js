const functions = require("firebase-functions");
const express = require('express');
const PORT = 3000;
const app = express();

const { MongoClient, ServerApiVersion } = require('mongodb');
const passwd = encodeURIComponent('@uth0rizedIsByPa$$=???')
const url = `mongodb+srv://prkpwm:${passwd}@cluster0.5zkwnn4.mongodb.net/?retryWrites=true&w=majority`;
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/:ip', (req, res, next) => {
    console.info(req.params);
    const ip = req.params.ip;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("meta");
        const query = {};
        const pipeline = { "key": ip };
        dbo.collection("todos").find(pipeline).toArray(function (err, result) {
            if (err) throw err;
            res.send(
                result
            );
            db.close();
        });
    });
});



app.listen(PORT, () => {
    console.info('Server is running on PORT:', PORT);
});

exports.app = functions.https.onRequest(app);


