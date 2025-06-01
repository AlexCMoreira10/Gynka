import express from 'express';
import path from 'path';    //DEFINI OS CAMINHOS DAS PASTA DE FORMA 'DINAMICA'
import bodyParser from 'body-parser';
import { engine } from 'express-handlebars'; 
import Handlebars from 'handlebars';
import moment from 'moment';
import Sequelize from 'sequelize'; 

//AQUI ESTOU CONFIGURANDO A SECAO DE USUARIO
import session from 'express-session';
import bcrypt from 'bcrypt';

//import axios from 'axios';      //COMUNICAÇÃO COM API
//import { CookieJar } from 'tough-cookie'; //SALVAR EM COOKIES PARA MANTER LOGADO APLICAÇÃO
//import { wrapper } from 'axios-cookiejar-support'; //DEPENDECIAS PARA API FICAR LOGADA

//imports do banco de dados para uso
import Usuario from './models/database/Usuario.js';
import Especialista from './models/database/Especialista.js';
import Habitos from  './models/database/Habitos.js';
import Medida_Corpo from './models/database/Medidas_Corpo.js';
import Agendamento from './models/database/Agendamento.js';


const PORTA = process.env.PORT || 8081; //Apenas uma configuração auxiliar a subir as aplicações, aqui o site sobe na porta e caso a informação não vier automaticamente para outra porta
const app = express();
const TOKEN_API = '0000000000000';
const __dirname = path.resolve();

//Configurações do BodyParse
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Handlebars configuracao
    app.engine('handlebars', engine({
        defaultLayout: 'main',
        helpers: { eq: (a, b) => a === b }
    }));
    app.set('view engine', 'handlebars');
    app.use(express.static(path.join(__dirname, 'public')));
    app.use("/img", express.static(path.join(__dirname, "/public/img")));


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

//Rotas de Login
    app.get('/Especialista', function(req, res){
        //res.sendFile(__dirname + '/html/Home.html');
        res.render('LoginEspecialista',{ showNavbar: false})
    });

    app.post('/LoginEspecialista', async function(req,res){
        const {email, senha} = req.body;
        console.log(senha)
        console.log(email)
        try {
            const usuario = await Especialista.findOne({
                where: {
                    Email: email,
                    senha: senha
                }
            });
            console.log('-----------')
            if(!usuario){
                return  res.status(401).send('Email ou senha incorretos');
            }

            req.session.usuario = {
                id: usuario.ID_ESPECIALISTA,
                email: usuario.email,
                nome: usuario.nome  // se você tiver esse campo
            };

            console.log("TESTE ..... ")
            //res.redirect('Home'); // corecao efetuada aqui
        } catch(error) {
            res.status(500).send('Erro de comunicaçao com servidor' + error);
        }
    })

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

//ROTAS DE CADASTROS

    app.get("/Cadastro",(req,res) => {
        res.render("Cadastro")
    });
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

//ROTA PAGINA PRINCIPAL
    app.get('/Home', autenticarUsuario, async function(req, res) {
        const idUsuario = req.session.usuario.id;
        try {
            const usuario = await Usuario.findOne({
                where: { ID_USUARIO: idUsuario }
            });

            if (!usuario) {
                return res.status(404).send('Usuário não encontrado.');
            }

            res.render('Home', { usuario: usuario.toJSON(), showNavbar: true });

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
                habitos: habitos ? habitos.toJSON() : {}, showNavbar: true
            });
        } catch (error) {
            // Em caso de erro, também retorna só uma resposta
            res.status(500).send('Erro ao carregar dados de hábitos.<br>' + error);
        }
    });
    //REGISTRAR MEDIDAS DO CORPO
    app.get('/RegistrarMedidas', function (req, res) {
        res.render('FormularioMedidasCorpo',{ showNavbar: true})
    })

//<<<<<<< HEAD
    //Comparar Evolução
    app.get('/dados-corporais', autenticarUsuario, async function(req, res)  {
            const idUsuario = req.session.usuario.id;
           
            Medida_Corpo.findAll({ 
                raw: true, where: { ID_Usuario: req.session.usuario.id }, 
                order: [['ID_DadosCorporais', 'ASC']] }).then(function (dados) {
                    res.render('dadosCorporais', { dados: dados, showNavbar: true });
            }).catch(function (erro) {
                    res.send("Erro ao carregar dados corporais: " + erro);
                });
        });

    app.post('/CadastrarDadosCorporais', autenticarUsuario, async function (req, res) {
        const idUsuario = req.session.usuario.id;
        const {
            Bra_Con_Di, Bra_Con_Es, Bra_Rx_Es, Bra_Rx_Di,
            Cx_Es, Cx_Di, Pt_Es, Pt_Di,
            Peitoral, Abdomen, Gluteo, Quadril
        } = req.body;

        if(!idUsuario) {
            return res.status(401).send("Usuario não Autenticado")
        }
        
        try {
            await Medida_Corpo.create({
                ID_Usuario: idUsuario,
                Bra_Con_Di, Bra_Con_Es, Bra_Rx_Es, Bra_Rx_Di,
                Cx_Es, Cx_Di, Pt_Es, Pt_Di,
                Peitoral, Abdomen, Gluteo, Quadril
            });

            return res.redirect('Home')
        } catch (erro) {
            console.error("Erro ao cadastrar dados corporais:", erro);
            res.status(500).send("Erro ao salvar os dados corporais.");
        }
    });

    app.get("/home_especialista", autenticarUsuario, function(req, res) {
        res.render('especialista_home');
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

app.get('/CadastroEspecialista', async (req, res) => {
    res.render('Cadastro_Especialista');
});

app.post('/CadastrarEspecialista', async (req, res) => {
    const {
        nome,
        sobrenome,
        email,
        senha,
        telefone,
        cod_conselho_classe,
        especialidade,
        termos
    } = req.body;

    try {
        // Validações
        if (!termos) {
            return res.status(400).send("Você deve aceitar os termos de uso.");
        }

        if (!senha || senha.length < 8) {
            return res.status(400).send("A senha deve ter no mínimo 8 caracteres.");
        }

        // Verifica se email já está cadastrado
        const especialistaExistente = await Especialista.findOne({ where: { Email: email } });
        if (especialistaExistente) {
            return res.status(409).send("Este email já está cadastrado.");
        }

        // Criptografa a senha
        //const senhaHash = await bcrypt.hash(senha, 10);

        // Criação do especialista
        const novoEspecialista = await Especialista.create({
            Nome: nome,
            Sobrenome: sobrenome,
            Email: email,
            senha: senha,
            Telefone: telefone,
            Cod_conselho_classe: cod_conselho_classe,
            Especialidade: especialidade
        });

        res.status(201).json({
            message: "Especialista cadastrado com sucesso!",
            especialista: novoEspecialista
        });
        return res.redirect('/LoginEspecialista');
    } catch (error) {
        console.error("Erro ao cadastrar especialista:", error);
        res.status(500).send("Erro no servidor.");
    }
});

//BUSCA PROFISSIONAL E AGENDAMENTO.
    app.get('/BuscaDeProfissionais', autenticarUsuario ,function(req,res) {
        const idUsuario = req.session.usuario.id
        console.log(idUsuario)
        res.render('BuscaDeProfissionais');
    });

    app.get('/BuscarProfissionais', async (req, res) => {
        const { profissao } = req.query;
        try {
            let especialistas = [];
            if (profissao) {
                especialistas = await Especialista.findAll({
                    raw: true,
                    where: { Especialidade: profissao },
                    order: [['Nome', 'ASC']]
                });
            }
            res.render('BuscaDeProfissionais', {
                especialistas,
                profissaoSelecionada: profissao
            });
        } catch (erro) {
            console.error('Erro ao buscar profissionais:', erro);
            res.status(500).send('Erro ao buscar profissionais');
        }
    });

    app.get('/agendar/:id', autenticarUsuario ,async (req, res) => {
        const idEspecialista = req.params.id;
        const idUsuario = req.session.usuario.id;

        try {
            const especialista = await Especialista.findByPk(idEspecialista, { raw: true });

            if (!especialista) {
                return res.status(404).send('Especialista não encontrado.');
            }

            res.render('Agendamento', { especialista });
        } catch (erro) {
            console.error('Erro ao carregar agendamento:', erro);
            res.status(500).send('Erro interno no servidor.');
        }
    });
    
   app.post('/agendar', autenticarUsuario, async function (req, res) {
    const { ID_ESPECIALISTA, DATA } = req.body;
    const ID_USUARIO = req.session.usuario.id;

    console.log("--------------- ", ID_USUARIO ," -------------------");
    console.log("--------------- ", ID_ESPECIALISTA ," -------------------");
    console.log("--------------- ", DATA ," -------------------");

    if (!ID_ESPECIALISTA || !DATA || !ID_USUARIO) {
        return res.status(400).send("Dados insuficientes para agendamento.");
    }

    try {
        // Verificar se já existe agendamento do usuário ou especialista na mesma data/hora
        const agendamentoExistente = await Agendamento.findOne({
            where: {
                DATA,
                [Sequelize.Op.or]: [
                    { ID_ESPECIALISTA },
                    { ID_USUARIO }
                ]
            }
        });

        if (agendamentoExistente) {
            return res.status(409).send("Já existe um agendamento neste horário.");
        }

        // Criar novo agendamento
        await Agendamento.create({
            ID_ESPECIALISTA,
            ID_USUARIO,
            DATA
        });

        return res.redirect('/home'); // ou renderize uma view de confirmação
    } catch (erro) {
        console.error("Erro ao criar agendamento:", erro);
        return res.status(500).send("Erro interno ao tentar agendar.");
    }
});



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