const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categorias");
const Categoria = mongoose.model('categorias');
require("../models/Postagem");
const Postagem = mongoose.model('postagens');


router.get('/', (req, res) => {
    res.render("index")
});


router.get('/categorias', (req, res) =>{
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) =>{    
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao listar categorias")
        res.redirect('/admin')     
    })
    
});

router.get('/categorias/add', (req, res)=>{
    res.render('admin/addcategorias')
});

router.get('/categorias/add/nova', (req, res)=>{
    res.render('admin/categorias')
});

router.post('/categorias/edit', (req, res) => {
    
    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if (erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com SUCESSO!")
            res.redirect('/admin/categorias')
            //console.log('nome: ' + req.body.nome)
            //console.log('Slug: ' + req.body.slug)   Aqui o nome e slug aparecem no terminal (nodemon)
    
        }).catch((err) => {
            req.flash('error_msg', "Houve um erro ao salvar categoria")
            console.log("Alguma coisa deu errado na hora de salvar a categoria! " + err)
        })
    }
    
})

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) =>{
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", 'Essa categoria não existe')
        res.redirect('/admin/categorias')
    })
    
})

router.post('/categoria/edit', (req, res) => {
    Categoria.findOne({_id: req.body.id}).lean().then((categoria) =>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() =>{
            req.flash('success_msg', 'Categoria editada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((error) =>{
            req.flash("error_msg", 'Erro em salvar a categoria')
            res.redirect('/admin/categorias')
        })
    }).catch((err) => {
        req.flash("error_msg", 'Erro em editar a categoria ' + err)
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/deletar', (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).lean().then(() =>{
        req.flash('success.msg', 'Categoria deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao deletar a categoria')
        res.redirect('/admin/categorias')
    })
})

router.post('/admin/categorias/nova', (req, res) => {
    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }

    if (erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    }
    
    new Categoria(novaCategoria).save().then(() => {
        req.flash("success_msg", "Categoria criada com SUCESSO!")
        res.redirect('/admin/categorias')
    })
});

router.get('/postagens', (req, res)=>{

    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens)=>{
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar a postagem")
        res.redirect("/admin")
    })
})

router.get('/postagens/add', (req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um error ao carregar o formulário")
        res.redirect("/admin")
    })
    
})

router.post('/postagens/nova', (req, res) =>{
    var erros = []
    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagens", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg","Postagem criada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro na hora de criar a postagem")
            res.redirect("/admin/postagens")
        })
    }

})

module.exports = router;