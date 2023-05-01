const express = require('express');
const app = express();
const port = 30001;
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const cheerio = require('cheerio');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
let textSearch = 'SOFT';
let jsonResponse = [];
async function postWithAjax(page, myajax) {
  const { url, type, data, dataType } = myajax;
  const result = await page.evaluate((url, type, data, dataType) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        type,
        data,
        dataType,
        complete: function (jqXHR) {
          if (jqXHR.status == 0) {
            reject(new Error("Request failed"));
          } else if (jqXHR.status >= 200 && jqXHR.status < 300) {
            resolve(jqXHR);
          } else if (jqXHR.status >= 400) {
            reject(new Error("Request failed"));
          }
        },
      }).always(function () {
        console.log("Request completed.");
      });
    });
  }, url, type, data, dataType);
  return result;
}


async function postWithFetch(page, myajax) {
  const { url, headers, body } = myajax;
  return page.evaluate((url, headers, body) => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        type: 'POST',
        headers,
        data: body,
        success: resolve,
        error: reject,
      });
    });
  }, url, headers, body)
    .then((responseText) => {
      const response = new Response(responseText);
      if (!response.ok) {
        return '';
      }
      return response.text();
    });
}
async function generateTokens(page) {
  let gKey = '6LfMt-4aAAAAAFCp1MN-6MsZlVJAjVVVnpnVrpSV';
  let gCap = 'submit';
  //await new Promise(resolve => setTimeout(resolve, 3000));
  await page.waitForFunction(() => typeof grecaptcha !== 'undefined' && grecaptcha.enterprise);
  const generateCaptcha = await page.evaluate(() => {
    return new Promise(resolve => {
      grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise.execute('6LfMt-4aAAAAAFCp1MN-6MsZlVJAjVVVnpnVrpSV', { action: 'submit' }).then(function (token) {
          resolve(token);
        });
      });
    });
  });

  const generateToken = await page.evaluate(() => {
    return new Promise(resolve => {
      grecaptcha.enterprise.ready(function () {
        grecaptcha.enterprise.execute('6LfMt-4aAAAAAFCp1MN-6MsZlVJAjVVVnpnVrpSV', { action: 'submit' }).then(function (token) {
          resolve(token);
        });
      });
    });
  });

  return { token: generateToken, captcha: generateCaptcha };
}


async function eventPost(page, textSearch, pagesCount) {
  const generatedKeys = await generateTokens(page);

  const generateToken = generatedKeys.token;
  const generateCaptcha = generatedKeys.captcha;

  const myajax = {
    url: "//repse.stps.gob.mx/app/dataconsulta.php",
    type: "POST",
    data: { Ce1: '1', name: '', rsoc: textSearch, page: pagesCount, token: generateToken, grecaptcha: generateCaptcha },
    dataType: "json",
  };

  let response = await postWithAjax(page, myajax);
  return response;
}

function objectToFormData(obj) {
  const formData = new FormData();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      formData.append(key, obj[key]);
    }
  }
  return formData;
}

async function eventPostRow(page, id, generateToken, generateCaptcha, repempdet) {
  //const formData = objectToFormData({ iem:id , gcap: generateCaptcha, tokensec:generateToken, repempdet: repempdet });
  const myajax = {
    url: "//repse.stps.gob.mx/app/",
    body: { iem: id, gcap: generateCaptcha, tokensec: generateToken, repempdet: repempdet }
  };

  let response = await postWithFetch(page, myajax);
  return response;
}

async function extractInfoRow(htmlContent, element, pagesCount) {

  const htmlString = htmlContent;
  const $ = cheerio.load(htmlString);
  const data = [];
  $('div[class="row justify-content-md-center"]').each((i, row) => {
    const ps = $(row).find('p[class="highlightname"]');
    const number = $(row).find('div[class="titlereg"] h3');
    const pValues = [];

    number.each((j, number) => {
      pValues.push($(number).text().replace(/\n/g, '').replace(/^REGISTRO LOCALIZADO FOLIO: /, "").trimStart().trimEnd());
    });
    ps.each((j, p) => {
      pValues.push($(p).text().replace(/\n/g, '').trimStart().trimEnd());
    });

    data.push(pValues);
  });
  fs.appendFileSync(`${textSearch}_ROW.log`, JSON.stringify(data) + '\n');
  const tempObject = {
    BusinessName: element[0],
    RegisterNumber: element[1],
    Folio: data[0][0],
    PageInfo: pagesCount,
    Information: {
      BusinessName: data[1][0],
      City: data[1][1],
      RegisterDate: data[1][2]
    }
  };
  jsonResponse.push(tempObject);
}

async function extractInfoData(page, arrayData, pagesCount) {

  arrayData.forEach(async (element, index) => {

    const key = Number.parseInt(element[1]);
    const generatedKeys = await generateTokens(page);
    const generateToken = generatedKeys.token;
    const generateCaptcha = generatedKeys.captcha;
    const repempdet = 1;

    //console.log(key);
    //console.log(generateToken);
    //console.log(generateCaptcha);

    //await new Promise(resolve => setTimeout(resolve, 3000));
    const response = await eventPostRow(page, key, generateToken, generateCaptcha, repempdet);
    await extractInfoRow(response, element, pagesCount);
    //console.log(response);

  });
}


const launchConfig = {
  headless: false,
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: [
    '--start-maximized',
  ],
  defaultViewport: null,
};


app.get('/api/repse', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  const browser = await puppeteer.launch(launchConfig);
  const page = await browser.newPage();
  try {
  textSearch = req.query.search;
  console.log(textSearch);
  const fechaActual = new Date();
  const day = fechaActual.getDate();
  const month = fechaActual.getMonth() + 1;
  const year = fechaActual.getFullYear();
  const browser = await puppeteer.launch(launchConfig);
  
  let pagesCount = 0;
  let iteratorPage = 1;

  
    await page.goto('https://repse.stps.gob.mx/', { timeout: 120000 });
    await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.6.0.min.js' });
    await page.addScriptTag({ url: 'https://www.google.com/recaptcha/enterprise.js?render=6LfMt-4aAAAAAFCp1MN-6MsZlVJAjVVVnpnVrpSV' });


    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    const arrowButton = await page.waitForSelector('#act-consulta', { visible: true });
    await page.evaluate((btn) => {
      btn.click();
      serverresponse(btn);
    }, arrowButton);

    await page.waitForSelector('#res-accion', { visible: true });


    const searchButton = await page.waitForSelector('button[type="submit"]', { visible: true });
    await Promise.all([
      searchButton.click(),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 120000 }),
    ]);


    do {

      await page.waitForSelector(`input[id="rsoc"]`, { visible: true, timeout: 30000 });
      await page.type('input[id="rsoc"]', textSearch);
      const reponseApi = await eventPost(page, textSearch, (pagesCount + 1));
      await new Promise(resolve => setTimeout(resolve, 3000));
      iteratorPage = reponseApi.total_pag;
      const htmlString = `<table>${reponseApi.data}</table>`;
      const $ = cheerio.load(`<table>${htmlString}</table>`);
      const tdArray = [];
      $('tr').each((i, row) => {
        const tds = $(row).find('td');
        const tdValues = [];

        tds.each((j, td) => {
          tdValues.push($(td).text().replace(/\n/g, '').trimStart().trimEnd());
        });

        tdArray.push(tdValues);
      });
      fs.appendFileSync(`${textSearch}_INDEX.log`, JSON.stringify(tdArray) + '\n');
      await extractInfoData(page, tdArray, (pagesCount + 1));
      pagesCount++;
      await page.waitForSelector(`input[id="rsoc"]`, { visible: true, timeout: 30000 });
      await page.type('input[id="rsoc"]', '');
    }
    while (pagesCount <= iteratorPage);

    console.log(jsonResponse);
    fs.appendFileSync(`response${day}-${month}-${year}.json`, JSON.stringify(jsonResponse) + '\n');
    res.status(200).json({
      success: true,
      message: 'Datos obtenidos correctamente',
      data: jsonResponse
    });
  }
  catch(err) {
    res.status(500).json({
      success: false,
      message: 'Ocurrió un error al obtener los datos',
      error: `Ocurrió un error de tipo ${err.message}`,
      data: []
    });
    console.log(jsonResponse);
  }
  finally{
    jsonResponse = [];
    browser.close();
  }
});
function myApi() {
  return app;
}
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
module.exports = myApi;
