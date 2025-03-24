require('dotenv').config();
require('pg');

const Sequelize = require('sequelize');

let sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

// ProvinceOrTerritory
const ProvinceOrTerritory = sequelize.define('ProvinceOrTerritory', {
  code: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING,
  type: Sequelize.STRING,
  region: Sequelize.STRING,
  capital: Sequelize.STRING
}, {
  createdAt: false,
  updatedAt: false
});

// Site
const Site = sequelize.define('Site', {
  siteId: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  site: Sequelize.STRING,
  description: Sequelize.TEXT,
  date: Sequelize.INTEGER,
  dateType: Sequelize.STRING,
  image: Sequelize.STRING,
  location: Sequelize.STRING,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
  designated: Sequelize.INTEGER,
  provinceOrTerritoryCode: Sequelize.STRING,
  worldHeritageSite: Sequelize.BOOLEAN
}, {
  createdAt: false,
  updatedAt: false
});


Site.belongsTo(ProvinceOrTerritory, {
  foreignKey: 'provinceOrTerritoryCode'
});


const initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize.sync({ force: true }) // force:true
      .then(async () => {
        await ProvinceOrTerritory.bulkCreate([
          {
            code: "AB",
            name: "Alberta",
            type: "Province",
            region: "Western Canada",
            capital: "Edmonton"
          },
          {
            code: "ON",
            name: "Ontario",
            type: "Province",
            region: "Central Canada",
            capital: "Toronto"
          }
        ]);

        await Site.bulkCreate([
          {
            siteId: "AB002",
            site: "Banff National Park",
            description: "A beautiful national park in Alberta.",
            date: 1885,
            dateType: "Established",
            image: "https://example.com/image.jpg",
            location: "Banff, Alberta",
            latitude: 51.4968,
            longitude: -115.9281,
            designated: 1984,
            provinceOrTerritoryCode: "AB",
            worldHeritageSite: true
          }
        ]);

        resolve();
      })
      .catch((err) => reject(err));
  });
};

// All data
const getAllSites = () => {
  return Site.findAll({
    include: [{
      model: ProvinceOrTerritory
    }]
  });
};


const addSite = (siteData) => {
    return Site.create(siteData);
};
  

const getSiteById = (id) => {
    return Site.findOne({
      where: { siteId: id }
    });
};
  
const editSite = (id, newData) => {
    return Site.update(newData, {
      where: { siteId: id }
    });
};
  
const deleteSite = (id) => {
    return Site.destroy({
      where: { siteId: id }
    });
};
  
module.exports = {
    initialize,
    getAllSites,
    addSite,
    getSiteById,
    editSite,
    deleteSite
};
 
  
  
