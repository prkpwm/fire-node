const express = require('express');
const PORT = 3000;
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');


const whitelist = ['https://resume-prkpwm.web.app', 'https://resume-prkpwm.firebaseapp.com', 'http://localhost:4200'];


const corsOption = (req, callback) => {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) corsOptions = { origin: true, credentials: true };
  else corsOptions = { origin: false, credentials: true };
  callback(null, corsOptions);
};
app.use(cors(corsOption));
app.use(
  bodyParser.urlencoded({
    limit: '1mb',
    extended: true,
  }),
  );
  
  
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  
  const passwd = encodeURIComponent('@uth0rizedIsByPa$$=???')
  const url = `mongodb+srv://prkpwm:${passwd}@cluster0.5zkwnn4.mongodb.net/?retryWrites=true&w=majority`;

app.get("/", (req, res) => res.type('html').send(html));

app.get("/test", (req, res) => res.type('html').send('test'));

app.get('/chat/:ip', (req, res, next) => {
  console.info(req.params);
  const ip = req.params.ip;
  const pipeline = { key: ip };
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const dbo = db.db("meta");
      dbo.collection("todos").find(pipeline).toArray(function (err, result) {
        if (err) throw err;
        res.send(result)
      });
    });

  }
  catch (err) {
    console.error(err);
  }

});

app.get('/allchat', (req, res, next) => {
  const pipeline = {};
  try {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const dbo = db.db("meta");
      dbo.collection("todos").find(pipeline).toArray(function (err, result) {
        if (err) throw err;
        res.send(result)
      });
    });

  }
  catch (err) {
    console.error(err);
  }
});


app.post('/chat', (req, res, next) => {
  const body = req.body
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db("meta");
    dbo.collection("todos").insertOne(body, function (err, result) {
      if (err) throw err;
      res.send(
        result
      );
    });
  });
});




app.listen(PORT, () => {
  console.info('Server is running on PORT:', PORT);
});



const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello!, This is a test page for the API
    </section>
  </body>
</html>
`


