import express from 'express';
import path from 'path';    //DEFINI OS CAMINHOS DAS PASTA DE FORMA 'DINAMICA'
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars'; 
import Handlebars from 'handlebars';
//AQUI ESTOU CONFIGURANDO A SECAO DE USUARIO
import session from 'express-session';

//import axios from 'axios';      //COMUNICAÇÃO COM API
//import { CookieJar } from 'tough-cookie'; //SALVAR EM COOKIES PARA MANTER LOGADO APLICAÇÃO
//import { wrapper } from 'axios-cookiejar-support'; //DEPENDECIAS PARA API FICAR LOGADA

//imports do banco de dados para uso
import Usuario from './models/database/Usuario.js';
import Habitos from  './models/database/Habitos.js';
import MedidaCorpo from './models/database/Medidas_Corpo.js';

const PORTA = process.env.PORT || 8081; //Apenas uma configuração auxiliar a subir as aplicações, aqui o site sobe na porta e caso a informação não vier automaticamente para outra porta
const app = express();
const TOKEN_API = '0000000000000';
const __dirname = path.resolve();

//Configurações do BodyParse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Handlebars configuracao
    app.engine('handlebars', engine({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars', 'partials');
    
    app.engine('handlebars', engine({
        defaultLayout: 'main',
        helpers: {
            eq: (a, b) => a === b
        }
    }));

//CONFIGURACAO DE SESSAO
    app.use(session({
        secret: 'seu_segredo_seguro_aqui',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 1000 * 60 * 60} // secure: true se usar HTTPS e configuracao do tempo de cookie persistente
    }));

//MIDDLEWARE para protecao de rotas e autentica do usuario
    function autenticarUsuario(req, res, next) {
        if (req.session.usuario) {
            return next();
        } else {
            return res.redirect('/');
        }
    }


//APARTIR DAQUI APENAS ROTAS DA APLICAÇÃO
//ROTA PRINCIPAL
    app.get('/', function(req, res){
        //res.sendFile(__dirname + '/html/Home.html');
        res.render('Login')
    });

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

//LOGICA DE LOGIN
    app.post('/Logar', async function(req,res) {
        const {email, senha} = req.body;
        try {
            const usuario = await Usuario.findOne({
                where: {
                    email: email,
                    senha: senha
                }
            })
            if(!usuario){
                return  res.status(401).send('Email ou senha incorretos');
            }

            req.session.usuario = {
                id: usuario.ID_USUARIO,
                email: usuario.email,
                nome: usuario.nome  // se você tiver esse campo
            };

            console.log('Usuário logado:', req.session.usuario);
            res.redirect('Home'); // corecao efetuada aqui
        } catch(error) {
            res.status(500).send('Erro de comunicaçao com servidor' + error);
        }
    })

    app.get('/Home', autenticarUsuario, async function(req, res) {
        const idUsuario = req.session.usuario.id;
        try {
            const usuario = await Usuario.findOne({
                where: { ID_USUARIO: idUsuario }
            });

            if (!usuario) {
                return res.status(404).send('Usuário não encontrado.');
            }

            res.render('Home', { usuario: usuario.toJSON() });

        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
            res.status(500).send('Erro ao carregar dados do usuário.');
        }
    });

//DESLOGAR USUARIO
    app.get('/Logout', autenticarUsuario, function(req, res) {
        req.session.destroy((err) => {
            if (err) {
            return res.status(500).send("Erro ao deslogar");
            }
            res.redirect('/Home');
        });
    });

    app.get('/Formulario', autenticarUsuario , function(req,res){
        res.render('Formulario');
    });

//SEÇÃO DE  REGISTRO DE FORMULARIOS EM GERAL
    app.get('/Habitos_Formulario', autenticarUsuario , async function(req, res) {
        const idUsuario = req.session.usuario.id;
        try {
            const habitos = await Habitos.findOne({
                where: { ID_USUARIO: idUsuario }
            });

            // Só renderiza uma vez com os dados
            res.render('Habitos_Formulario', {
                habitos: habitos ? habitos.toJSON() : {}
            });
        } catch (error) {
            // Em caso de erro, também retorna só uma resposta
            res.status(500).send('Erro ao carregar dados de hábitos.<br>' + error);
        }
    });


    app.post('/Registrar_Habito', autenticarUsuario , async function(req,res){
        const { sono, preferencia, periodo } = req.body;
        const idUsuario = req.session.usuario.id;

        try {
            const habitoExiste = await Habitos.findOne({
                where: { ID_USUARIO: idUsuario }
            });

            if (habitoExiste) {
                await Habitos.update(
                    { sono, preferencia, periodo },
                    { where: { ID_USUARIO: idUsuario } }
                );
            } else {
                await Habitos.create({
                    ID_USUARIO: idUsuario,
                    sono,
                    preferencia,
                    periodo
                });
            }

            return res.redirect('/Home'); // Use 'return' para evitar múltiplos envios
        } catch (error) {
            console.error(error);
            return res.status(500).send("SERVIDOR CAGADO!! DESCULPE VAMOS MELHORAR");
        }
    });

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