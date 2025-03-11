
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));


const sites = [
  {
    siteId: "AB002",
    site: "Banff National Park",
    image: "https://example.com/image.jpg",
    date: "1885",
    dateType: "Established",
    designated: "1984",
    location: "Banff, Alberta",
    provinceOrTerritoryObj: { name: "Alberta" },
    region: "Western Canada",
    latitude: "51.4968",
    longitude: "-115.9281"
  }
];


app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});
app.get("/sites", (req, res) => {
  res.render("sites", { sites, page: "/sites" });
});


app.get("/sites/:id", (req, res) => {
  const site = sites.find(s => s.siteId === req.params.id);
  if (!site) {
    return res.status(404).render("404", { message: "Site bulunamadı!" });
  }
  res.render("site", { site });
});

app.use((req, res) => {
  res.status(404).render("404", { message: "Aradığınız sayfa bulunamadı." });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});
