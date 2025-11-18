const fetch = require("node-fetch");
const { DOMParser } = require("@xmldom/xmldom");

exports.handler = async () => {
  try {
    const xml = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml")
      .then(r => r.text());

    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "text/xml");

    function getRate(code) {
      const list = doc.getElementsByTagName("Currency");
      for (let i = 0; i < list.length; i++) {
        if (list[i].getAttribute("CurrencyCode") === code) {
          const node = list[i].getElementsByTagName("ForexSelling")[0];
          return parseFloat(node.textContent.replace(",", "."));
        }
      }
      return null;
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        USD: getRate("USD"),
        EUR: getRate("EUR"),
        GBP: getRate("GBP")
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: true, message: err.toString() })
    };
  }
};
