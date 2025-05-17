import express from 'express';
import path from 'path';    //DEFINI OS CAMINHOS DAS PASTA DE FORMA 'DINAMICA'
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars'; 

//import { engine } from 'express-handlebars';
//import axios from 'axios';      //COMUNICAÇÃO COM API
//import { CookieJar } from 'tough-cookie'; //SALVAR EM COOKIES PARA MANTER LOGADO APLICAÇÃO
//import { wrapper } from 'axios-cookiejar-support'; //DEPENDECIAS PARA API FICAR LOGADA

//imports do banco de dados para uso
import Usuario from './models/database/Usuario.js'

const PORTA = process.env.PORT || 8081; //Apenas uma configuração auxiliar a subir as aplicações, aqui o site sobe na porta e caso a informação não vier automaticamente para outra porta
const app = express();
const TOKEN_API = '0000000000000';
const __dirname = path.resolve();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Handlebars
    app.engine('handlebars', engine({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    //res.sendFile(__dirname + '/html/Home.html');
    res.render('Login')
});

app.get('/Login', function(req, res) {
    //res.sendFile(__dirname + '/html/Login.html')
    res.render('Login')
})

app.get('/cadastro', function(req,res){
    res.render('Cadastro')
})

app.post('/Cadastrar', async function(req,res){
 try {
    const novoUsuario = await Usuario.create({
      Nome: req.body.nome,
      SobreNome: req.body.sobrenome,
      email: req.body.email,
      telefone: req.body.telefone,
      Estado: req.body.estado,
      Cidade: req.body.cidade,
      Cep: req.body.cep,
      Lagradouro: req.body.lagradouro,
      N_casa: req.body.n_casa,
      Complemento: req.body.complemento,
      senha: req.body.senha
    });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

app.post('/Logar', function(req,res) {
    let email , senha;
    email = req.body.email;
    senha = req.body.password;
    res.render('Home')
})

app.get('/Formulario', function(req,res){
    //res.sendFile(__dirname + '/html/Formulario.html')
    res.render('Formulario')
})
app.get('/Especialista', function(req,res){
    res.render('Cadastro_Especialista')
})
app.post('/auto_avaliacao', function(req, res) {
    const {
        objetivo,
        frequencia,
        altura,
        peso,
        'percentual-gordura': gordura,
        tipo_fisico,
        biotipo,
        'medidas-superior': medidasSuperior,
        'medidas-inferior': medidasInferior,
        limitacao,
        medicamentos,
        problemas,
        sono,
        preferencia,
        periodo
    } = req.body;

    // Caso "objetivo" seja apenas 1 checkbox marcado, ele vem como string. Convertemos sempre para array.
    const objetivos = Array.isArray(objetivo) ? objetivo : [objetivo];

    res.send(`
        <h1>Autoavaliação Recebida</h1>
        <p><strong>Objetivos:</strong> ${objetivos.join(', ')}</p>
        <p><strong>Frequência semanal:</strong> ${frequencia}x</p>
        <p><strong>Altura:</strong> ${altura} cm</p>
        <p><strong>Peso:</strong> ${peso} kg</p>
        <p><strong>Percentual de gordura:</strong> ${gordura}%</p>
        <p><strong>Tipo físico:</strong> ${tipo_fisico}</p>
        <p><strong>Biotipo:</strong> ${biotipo}</p>
        <p><strong>Medidas superiores:</strong> ${medidasSuperior}</p>
        <p><strong>Medidas inferiores:</strong> ${medidasInferior}</p>
        <p><strong>Limitações físicas/lesões:</strong> ${limitacao}</p>
        <p><strong>Medicamentos contínuos:</strong> ${medicamentos}</p>
        <p><strong>Problemas cardíacos/respiratórios:</strong> ${problemas}</p>
        <p><strong>Horas de sono:</strong> ${sono}</p>
        <p><strong>Preferência de treino:</strong> ${preferencia}</p>
        <p><strong>Período preferido:</strong> ${periodo}</p>
    `);
});

app.listen(PORTA, function(req,res){
    console.log('GYNKA RODANDO NA PORTA: '+ PORTA)
});