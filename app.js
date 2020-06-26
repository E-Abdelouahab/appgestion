const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
var fs = require("fs");
var multer  = require('multer');
app.use(bodyParser.urlencoded({ extended :false }));
app.use(express.static(path.join(__dirname,"/public")));
// app.use(multer({ dest: 'tmp/'}));   


app.set('view engine', 'ejs');
app.set('views', 'views');


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin1",
    database: "gestionstock"
});



const baseURL = 'http://localhost:3000/'


con.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database is Connected');
}); 

app.get('/', (req, res, next) => {
        const sql = "SELECT * FROM produit";
        const sql2 = "SELECT * FROM rayon";
        const sql3 = "SELECT * FROM fornisseur";
        const query = con.query(sql, (err, result) => {
        const query = con.query(sql2, (err, result1) => {
     const query = con.query(sql3, (err, result2) => {
            if(err)throw err;
                res.render('pages/produit', {
                        pageTitle : 'produit',
                        items : result,
                        items2 : result1,
                        items3 : result2
                }); 
            });       
        });
    });
    });

    app.get('/add',(req,res, next)=>{
        let sql = "SELECT * FROM  fornisseur,rayon";
        let query = con.query(sql, (err, result) => {
            if(err) throw err;
            res.render('pages/addProduit', {
                pageTitle : 'Add new produit',
                items : result
            });
        });

    });
    app.get('/addfornisseur',(req,res, next)=>{
       
            res.render('pages/addfournisseur', {
                pageTitle : 'addfornisseur'
                
          
        });

    });
    var upload = multer({ dest: '/img/'});
app.post('/addP', upload.single('file'), function(req, res) {
   
  var file = 'public/img' + '/' + req.file.originalname;
  fs.rename(req.file.path, file, function(err) {
    if (err) {
      console.log(err);
      res.send(500);
    } else {
        console.log(req.file.originalname);
         let data = {name_P: req.body.nameP,  category: req.body.categorie,  img: req.file.originalname,price: req.body.price,  quantite: req.body.quantité,  id_R: req.body.id_R ,id_F: req.body.id_F };
        let sql = "INSERT INTO produit SET ?";
        let query = con.query(sql, data,(err, results) => {
          if(err) throw err;

          res.redirect(baseURL);
        
        });   
    }
  });
});
    // app.post('/addP',(req, res) => { 
       
    //     let data = {name_P: req.body.nameP,  category: req.body.categorie,price: req.body.price,  quantite: req.body.quantité,  id_R: req.body.id_R ,id_F: req.body.id_F };
    //     let sql = "INSERT INTO produit SET ?";
    //     let query = con.query(sql, data,(err, results) => {
    //       if(err) throw err;

    //       res.redirect(baseURL);
        
    //     });
            
            
    // });
    app.post('/editProduct', upload.single('file') , function(req, res) {
        
        var file = 'public/img' + '/' + req.file.originalname;
        fs.rename(req.file.path, file, function(err) {
          if (err) {
            console.log(err);
            res.send(500);
          } else {
              console.log(req.file.originalname);
              let data = {name_P: req.body.nameP,  category: req.body.categorie,  img: req.file.originalname ,price: req.body.price,  quantite: req.body.quantité,  id_R: req.body.id_R ,id_F: req.body.id_F };
              let id = req.body.id_P
              let sql = `UPDATE produit SET ? WHERE id_P = ${id}`;
              let query = con.query(sql, data,(err, results) => {
                if(err) throw err;
      
                res.redirect(baseURL);
              
              });  
          }
        });
       
        
    });
    app.post('/editf', (req, res) => {
        let data = {name: req.body.name,  address: req.body.address,télé: req.body.tele,  email: req.body.email};
        let id = req.body.id_F
        let sql = `UPDATE fornisseur SET ? WHERE id_F = ${id}`;
        let query = con.query(sql, data,(err, results) => {
          if(err) throw err;

          res.redirect("/fornisseur");
        
        });
        
    });
    app.post('/updaterayon', (req, res) => {
        let data = {name1: req.body.name};
        let id = req.body.id
        let sql = `UPDATE rayon SET ? WHERE id_R = ${id}`;
        let query = con.query(sql, data,(err, results) => {
          if(err) throw err;

          res.redirect("/rayon");
        
        });
        
    });
    app.get('/delete/:id', (req, res) => {
        const userId = req.params.id;
        let sql = `DELETE from produit where id_P = ${userId}`;
        let query = con.query(sql,(err, result) => {
            if(err) throw err;
            res.redirect(baseURL);
        });
    });

    app.get('/fornisseur',(req, res) => {
       
        const sql = "SELECT * FROM fornisseur";
        let query = con.query(sql, (err, result) => {
            if(err) throw err;
            res.render('pages/fornisseur', {
             
                pageTitle : 'Provider',
                items : result
            });
        });
    });
    
    // ADD new fornisseur
    
    app.post('/addforni',(req, res) => {
        let data = {name: req.body.name,  address: req.body.address,télé: req.body.tele,  email: req.body.email };
        let sql = "INSERT INTO fornisseur SET ?";
        let query = con.query(sql, data,(err, results) => {
          if(err) throw err;

          res.redirect('fornisseur');
        
        });
    });
    app.post('/saverayon',(req, res) => {
        let data = {name1: req.body.name};
        let sql = "INSERT INTO rayon SET ?";
        let query = con.query(sql, data,(err, results) => {
          if(err) throw err;

          res.redirect('rayon');
        
        });
    });

    app.get('/delete-fournisseur/:id', (req, res) => {
        const userId = req.params.id;
        let sql = `DELETE from  fournisseur where id_P = ${userId}`;
        let query = con.query(sql,(err, result) => {
            res.redirect('/fournisseur');
        });
    });

    app.get('/',(req, res) => {
        let sql = "SELECT rayon.name, rayon.img, produit.id_P,  rayon.nameP, rayon.ID FROM rayon INNER JOIN produit ON produit.id_P = rayon.id_P ";
        let query = con.query(sql, (err, result) => {
            if(err) throw err;
            res.render('pages/rayon', {
            
                pageTitle : 'Stock Management',
                items : result
            });
        });
    });
    
    // ADD new rayon


    
app.get('/rayon', (req, res, next) => {
        const sql = "SELECT * FROM rayon";
        const query = con.query(sql, (err, result) => {
            if(err)throw err;
                res.render('pages/rayon', {
                       
                        items : result
                });
                    
        })
    });
    app.get('/addrayon',(req,res, next)=>{
             res.render('pages/addrayon',{
                 pageTitle : 'Add new rayon',
                 items:''      
             })

    });


    
      app.get('/delete-rayon/:id', (req, res) => {
        const userId = req.params.id;
        let sql = `DELETE from rayon where id_R = ${userId}`;
        let query = con.query(sql,(err, result) => {
            if(err) throw err;
            res.redirect('/rayon');
        });
    });




 

// app.get('/',function(req,res){
//         res.sendFile(path.join(__dirname + '/views/index.ejs'));
// });



app.listen(3000,()=>{
        console.log('rinning at localhost')
    
});