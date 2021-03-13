let codeArray = [];

const fetch = require("node-fetch");

const url = `http://contesttrackerapi.herokuapp.com/`;

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const fetchData = async (platform) => {
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const dataObjects = data.result.ongoing;
      dataObjects.map((dataObject) => {
        const time = dataObject.EndTime;
        const timeSplit = time.split(" ");
        const date = new Date();
        const day = date.getDate();
        if (timeSplit[1] == day) {
          if (dataObject.Platform === platform) codeArray.push(dataObject);
        }
        if (codeArray.length === 0)
          codeArray.push({ Error: "No Upcoming Contest Today" });
      });
    })
    .catch((e) => {
      codeArray = [];
    });
};

async function codechefHandler() {
  codeArray = [];
  await fetchData("CODECHEF");
  return codeArray;
}

async function hackerearthHandler(req, res) {
  codeArray = [];
  await fetchData(" HACKEREARTH");
  return codeArray;
}

async function codeforcesHandler(req, res) {
  codeArray = [];
  await fetchData("CODEFORCES");
  return codeArray;
}

module.exports = { codechefHandler, codeforcesHandler, hackerearthHandler };
