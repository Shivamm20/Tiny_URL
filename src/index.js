
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Set default title for all routes
app.use((req, res, next) => {
  res.locals.title = "TinyLink";
  next();
});

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"..","public")));

const linkRoutes = require('./routes/links');
app.use('/', linkRoutes);

app.get('/healthz',(req,res)=>res.json({ok:true,version:"1.0"}));

app.listen(PORT,()=>console.log("Server running on",PORT));
