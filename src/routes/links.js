
const express = require('express');
const router = express.Router();
const c = require('../controllers/linksController');
const prisma = require('../db');

router.get('/', async (req,res)=>{
  const search = req.query.search || "";
  const links = await prisma.link.findMany({
    where:{
      deleted:false,
      OR:[
        {code:{contains:search}},
        {url:{contains:search}}
      ]
    }
  });
  res.locals.title = 'Dashboard - TinyLink';
  res.render('index',{links,search});
});

router.post('/api/links', c.createLink);
router.get('/code/:code', c.getStats);
router.get('/:code', c.redirectCode);
router.post('/delete/:code', c.deleteLink);

module.exports = router;
