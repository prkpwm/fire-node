const express = require('express');
const PORT = 3000;
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
const http = require("http");

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
        db.close();

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
        db.close();
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
      db.close();

    });
  });
});


async function checkLocation(ip) {
  try {
    return await new Promise((resolve, reject) => {
      http.get(`http://ipinfo.io/${ip}?token=6e2a87a9ba4e14`, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
          body += data;
        });
        res.on("end", () => {
          try {
            const dataPoint = JSON.parse(body);
            resolve(splitLocation(dataPoint.loc));
          } catch (e) {
            reject(e);
          }
        });
      });
    });
  } catch (e) {
    console.log("error send get location request:", e);
    return ["ESGL", "ESGL"]; // Error send get location request
  }
}

function splitLocation(loc) {
  return loc.split(",");
}

function findClosestStation(lat, lng, stations) {
  let closest = null;
  let closestDistance = null;
  for (let i = 0; i < stations.length; i++) {
    const station = stations[i];
    const distance = Math.sqrt(
      Math.pow(lat - station.lat, 2) + Math.pow(lng - station.long, 2)
    );
    if (closestDistance === null || distance < closestDistance) {
      closest = station;
      closestDistance = distance;
    }
  }
  return closest;
}


async function checkWeather(lat, long) {
  try {
    const apiKeys = "7c12a791bd19806a6d1fde2ff0af8824";
    return await new Promise((resolve, reject) => {
      http.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKeys}&lang=th`, res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
          body += data;
        });
        res.on("end", () => {
          try {
            const dataPoint = JSON.parse(body);
            resolve(dataPoint);
          } catch (e) {
            reject(e);
          }
        });
      });
    });
  }
  catch (e) {
    console.log("error send get weather request:", e);
    return ["ESGL", "ESGL"]; // Error send get location request
  }
}


async function checkWeatherPM25(ip) {
  // check pm 2.5
  try {
    return await new Promise((resolve, reject) => {
      http.get("http://air4thai.pcd.go.th/services/getNewAQI_JSON.php", res => {
        res.setEncoding("utf8");
        let body = "";
        res.on("data", data => {
          body += data;
        });
        res.on("end", async () => {
          try {
            const dataPoint = JSON.parse(body);
            const [lat, lng] = await checkLocation(ip)
            const station = findClosestStation(lat, lng, dataPoint.stations)
            const weather = await checkWeather(lat, lng)
            const weatherDescription = [
              station.AQILast.PM25.value,
              station.areaTH,
              weather,

            ];
            resolve(weatherDescription)
          } catch (e) {
            reject(e);
          }
        });
      });
    });
  } catch (e) {
    console.log("error send get location request:", e);
    return ["ESGL", "ESGL"]; // Error send get location request
  }

}

app.get('/weather/:ip', async (req, res, next) => {
  const ip = req.params.ip;
  const weather = await checkWeatherPM25(ip);
  res.send(weather);
});

app.get('/location', async (req, res, next) => {
  const [lat, lng] = await checkLocation();
  res.send({ lat, lng });
});


app.get('/getBlockedList', async (req, res, next) => {
  res.type('html').send(tm_html)
});


app.listen(PORT, () => {
  setInterval(() => {
    console.log('Server is running on PORT:', PORT);
  }
    , 1000 * 60);
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


const tm_html = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Document</title>
  <style type="text/css">
    .remove {
      background-color: red;
      color: white;
      width: 10%;
      height: 100%;
      font-weight: bold;
      font-size: 20px;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid black;
      cursor: pointer;
    }

    .remove:hover {
      background-color: white;
      color: red;
    }

    input {
      width: 80%;
      height: 100%;
      font-size: 20px;
      font-weight: bold;
    }

    input:focus {
      outline: none;
    }

    input::placeholder {
      color: red;
    }

    div.content {
      width: 400px;
      height: 50px;
    }


    .flex-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      column-gap: 1rem;
    }

    .add {
      background-color: green;
      color: white;
      height: 100%;
      font-weight: bold;
      font-size: 20px;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid black;
      cursor: pointer;
    }

    .add:hover {
      background-color: white;
      color: green;
    }

    .add>div {
      transform: rotate(225deg);
    }
  </style>

  <script type="text/javascript">
    let BLOCKED = [
      ".player-container > div",
      '.GoogleActiveViewInnerContainer',
      '.GoogleActiveViewElement',
      ".dfp-container",
      '[alt="Advertisement"]',
      '.ads-column',
      '.ads-bottom',
      '.ads-left',
      '.ads-right',
      '.ads-top',
      '.right-floating-banana-container',
      '.left-floating-banana-container',
      '.floating-banana-container',
      '.header-banana_container',
      '.horizontal-ad-bar100-h360',
      '.horizontal-ad-bar100-small',
      '.style-scope ytd-ad-slot-renderer'
    ];

    loadBlocked = () => {
      const cookies = getCookies()
      if (cookies) {
        BLOCKED = cookies.split(',')
      }
      BLOCKED.forEach((value) => {
        addEl(value)
      })
    }

    addEl = (value) => {
      const el = document.createElement('div')
      el.className = 'content'
      const input = document.createElement('input')
      input.type = 'text'
      input.value = value
      el.appendChild(input)
      const button = document.createElement('button')
      button.innerText = 'X'
      button.className = 'remove'
      button.addEventListener('click', () => {
        const index = BLOCKED.indexOf(value)
        BLOCKED.splice(index, 1)
        setCookie('BLOCKED', BLOCKED.join(','), 365)
        el.remove()
      })
      el.appendChild(button)
      document.body.appendChild(el)
    }

    onAddEl = () => {
      const el = document.createElement('div')
      el.className = 'content'
      const input = document.createElement('input')
      input.type = 'text'
      input.placeholder = 'Enter CSS Selector'
      el.appendChild(input)
      const button = document.createElement('button')
      button.innerText = 'X'
      button.className = 'remove'
      button.addEventListener('click', () => {
        el.remove()
      })

      input.addEventListener('change', () => {
        if (!BLOCKED.find((value) => value === input.value)) {
          BLOCKED.push(input.value)
          setCookie('BLOCKED', BLOCKED.join(','), 365)
        }
      })
      el.appendChild(button)
      document.body.appendChild(el)
    }

    setCookie = (cname, cvalue, exdays) => {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookies = () => {
      var name = "BLOCKED=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }



  </script>

</head>

<body>
  <div class="flex-row">
    <h1>
      BLOCKED LIST
    </h1>
    <div>
      <button class="add" onclick="onAddEl()">
        <div>
          X
        </div>
      </button>
    </div>
    <script charset="UTF-8">
      loadBlocked()
    </script> 
  </div>
</body>
</html>
`;