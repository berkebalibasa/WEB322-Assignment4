const HTTP_PORT = process.env.PORT || 8080;
const data = require("./data-service");
const express = require('express');
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: true }));
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

app.get("/sites", (req, res) => {
  data.getAllSites().then((data) => {
    res.render("sites", { sites: data, page: "Sites" });
  }).catch((err) => {
    res.render("sites", { sites: [], page: "Sites", error: err });
  });
});


app.use((req, res) => {
  res.status(404).render("404", { message: "Aradığınız sayfa bulunamadı." });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});

data.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server is running on port ${HTTP_PORT}`);
  });
}).catch((err) => {
  console.log("Unable to start server: " + err);
});


app.get("/addSite", (req, res) => {
  res.render("addSite", { page: "Add" });
});

app.post("/addSite", (req, res) => {
  const siteData = req.body;
  siteData.worldHeritageSite = req.body.worldHeritageSite ? true : false;
  data.addSite(siteData).then(() => {
    res.redirect("/sites");
  }).catch((err) => {
    res.status(500).send("Unable to add site: " + err);
  });
});



app.get("/editSite/:id", (req, res) => {
  data.getSiteById(req.params.id).then((site) => {
    if (site) {
      res.render("editSite", { site });
    } else {
      res.status(404).send("Site not found");
    }
  }).catch(() => {
    res.status(500).send("Error loading site");
  });
});

app.post("/editSite", (req, res) => {
  const updated = req.body;
  updated.worldHeritageSite = req.body.worldHeritageSite ? true : false;
  data.editSite(updated.siteId, updated).then(() => {
    res.redirect("/sites");
  }).catch(() => {
    res.status(500).send("Unable to update site");
  });
});

app.get("/deleteSite/:id", (req, res) => {
  data.deleteSite(req.params.id).then(() => {
    res.redirect("/sites");
  }).catch((err) => {
    res.status(500).send("Unable to delete site: " + err);
  });
});
