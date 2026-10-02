import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config';
import cors from 'cors'
import jwt from 'jsonwebtoken';

const app = express()


app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{console.log('banco conectado com sucesso!')})
    .catch((erro)=>{console.log('erro ao conectar banco', erro)})

const UserSchema = new mongoose.Schema({
    nome: String,
    email: {type: String, unique:true},
    senha: String
})

const User = mongoose.model('user', UserSchema)


function verifyJWT(req, res, next){
    let token = req.headers["authorization"]
    if(!token){
        return res.status(401).json({
            mensagem:'não existe token'
        })
    }
    token = token.replace('Bearer ' ,'')
    
    
    try {
        
        let decoded = jwt.verify(token, process.env.JWT_KEY)
        if (!decoded) return res.status(403).json({ message: "Invalid token." });
        res.locals.token = decoded
        next()

        
    } 
    catch (error) {
        return res.status(403).json({
            mensagem: error.message
        })
    }
}

app.get('/me', verifyJWT, async (req, res)=>{
    let id = res.locals.token.userId
    
    let usuario = await User.findById(id)
    res.json(usuario)


})

app.post('/criarconta',  async (req, res)=>{
    let dados = req.body
    console.log(dados)
    
    

    try {
        const novoUsuario = await User.create({
            nome: dados.nome,
            email: dados.email,
            senha: dados.senha
        });
        if (novoUsuario) {
            res.status(201).json({
                mensagem:'Conta criada com sucesso!'
            })
        } else {
            res.status(400).json({
                mensagem:'Erro ao criar a conta!'
            })
        }

        
    } 
    catch (error) {
        console.log(error)
    }




})
app.post('/login', async (req, res)=>{
    let dados = req.body
    

    try {
        let userEmail = await User.findOne({ email: dados.email })
        
        if(userEmail){
            
            if(userEmail.senha === dados.senha){
                
                let token = jwt.sign(
                    { userId: userEmail._id },
                    process.env.JWT_KEY,
                    {expiresIn: process.env.JWT_TEMP }
                )

                res.status(200).json({
                    mensagem:'Login feito com sucesso!',
                    token:token
                })
            }
            else{
                res.status(401).json({
                    mensagem:'Email ou senha incorretos! Tente Novamente.'
                })
            }
        }
        else{
            res.status(401).json({
                mensagem:'Email ou senha incorretos! Tente Novamente.'
            })
        }


    } 
    catch (error) {
        console.log(error)
    }
})

const port = process.env.PORT || 3000


app.listen(port, ()=>{
    console.log('rodando na porta', port)
})