
const prisma = require('../db');

exports.createLink = async (req,res)=>{
  const {url, code} = req.body;
  if(!url) return res.status(400).json({error:"URL required"});

  try{
    const c = code && code.trim() !== "" ? code.trim() : Math.random().toString(36).substring(2,8);

    const exists = await prisma.link.findUnique({where:{code:c}});
    if(exists) return res.status(409).json({error:"Code exists"});

    const link = await prisma.link.create({
      data:{url,code:c}
    });

    res.redirect('/');
  }catch(e){
    res.status(500).json({error:e.message});
  }
};

exports.listLinks = async (req,res)=>{
  const links = await prisma.link.findMany({where:{deleted:false}});
  res.json(links);
};

exports.getStats = async (req,res)=>{
  const {code} = req.params;
  const link = await prisma.link.findUnique({where:{code}});
  if(!link || link.deleted) return res.status(404).send("Not found");
  res.locals.title = `Stats for ${code} - TinyLink`;
  res.render('stats',{link});
};

exports.deleteLink = async (req,res)=>{
  const {code} = req.params;
  await prisma.link.update({
    where:{code},
    data:{deleted:true}
  });
  res.locals.title = 'Dashboard - TinyLink';
  res.redirect('/');
};

exports.redirectCode = async (req,res)=>{
  const {code} = req.params;
  const link = await prisma.link.findUnique({where:{code}});
  if(!link || link.deleted) return res.status(404).send("Not found");

  await prisma.link.update({
    where:{code},
    data:{clicks:{increment:1}, lastClicked:new Date()}
  });

  res.redirect(302, link.url);
};
