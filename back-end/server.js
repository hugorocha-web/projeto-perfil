import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config';
import cors from 'cors'
import jwt from 'jsonwebtoken';

const app = express()


app.use(express.json())
app.use(cors())

if (!process.env.MONGODB_URI) {
    console.error('ERRO CRÍTICO: MONGODB_URI não foi definida no arquivo .env!');
}
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{console.log('banco conectado com sucesso!')})
    .catch((erro)=>{console.log('erro ao conectar banco', erro)})

const UserSchema = new mongoose.Schema({
    nome: String,
    email: {type: String, unique:true},
    senha: String,
    bio: String,
    foto: {
        type: String,
        default: ''
    }
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
        .select('nome email bio foto')
    res.json(usuario)


})

app.put('/me', verifyJWT, async (req, res)=>{
    let novaBio = req.body.bio

    let usuario = res.locals.token.userId

    console.log(usuario)
    
    try {
        const result = await User.updateOne(
        { _id: usuario }, 
        { $set: {bio: novaBio} } 
        );
        if(result.matchedCount===0){
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            })
        }
        res.status(200).send('Documento atualizado com sucesso!');
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }
    
    
})
//importo o multer pra passar as imagens pro cloudinary
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
//cloudinary salva e entrega a url da foto

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
app.put('/perfil', verifyJWT, upload.single('imagem'), async (req, res)=>{
    let img = req.file
    
    try {
        
        if (!img) {
            return res.status(400).json({
                mensagem: 'Nenhuma imagem enviada'
            })
        }

        if (!img.mimetype.startsWith('image/')) {
            return res.status(400).json({
                mensagem: 'O arquivo precisa ser uma imagem'
            })
        }
        const resultado = await enviarImagem(req.file.buffer)

        const usuario = await User.findByIdAndUpdate(
            res.locals.token.userId,
            { foto: resultado.secure_url },
            { new: true }
        ).select('nome email bio foto')

        if (!usuario) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado'
            })
        }

        res.json({
            mensagem: 'Foto atualizada!',
            foto: usuario.foto
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensagem: 'Erro ao atualizar a foto'
        })
    }
})
import { Readable } from 'node:stream'

function enviarImagem(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'fotos-perfil' },
            (error, resultado) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(resultado)
                }
            }
        )

        Readable.from(buffer).pipe(stream)
    })
}
//


app.post('/criarconta',  async (req, res)=>{
    let dados = req.body
    console.log(dados)
    
    

    try {
        const novoUsuario = await User.create({
            nome: dados.nome,
            email: dados.email,
            senha: dados.senha,
            bio: dados.bio,
            foto:dados.foto
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