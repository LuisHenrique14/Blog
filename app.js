//Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require('./routes/admin');
    const path = require('path');
    const mongoose = require('mongoose'); //biblioteca para trabalhar com o mongo db
    const session = require('express-session');
    const flash = require('connect-flash');
    require("./models/Postagem");
    const Postagem = mongoose.model("postagens")
    
//Configurações
    //Session
        app.use(session({
            secret: "qualquer coisa",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    //Middleware
        app.use((req, res, next)=> {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            next()
        })
    //Body Parser - serve para pegar os dados do formulário/cliente
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
    app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
        app.set('view engine', 'handlebars');
            
    //Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/blogapp").then(()=>{
            console.log("Banco de dados conectado")
        }).catch((err)=>{
            console.log("Alguma coisa deu errado!!" + err)
        })
    //Public
        app.use(express.static(path.join(__dirname, 'public')));    


        app.use((req,res,next) =>{
            //console.log('Eu sou um middleware');
            next();
        });
//Rotas
app.get('/', (req, res) => {
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render('index', {postagens: postagens});
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro interno")
        res.redirect('/404')
    })
})

app.get('/404', (req, res)=> {{
    res.send("Erro 404")
}})
//app.post('/admin/categorias/nova', (req, res) => {
    //res.send('Nome: ' + req.body.nome + ' - Slug: ' + req.body.slug)
//})
app.use('/admin', admin);
//Outros
        const PORT = 8081 
        app.listen(PORT, () => {
            console.log('Servidor conectado na porta 8081')
        })
