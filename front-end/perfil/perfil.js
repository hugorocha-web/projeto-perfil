async function testartoken(){

    let token = localStorage.getItem('token')
    if(!token){
        window.location.href = '../login/login.html'
        return
    }

    try {
        let enviarjwt = await fetch('https://projeto-perfil.onrender.com/me',{
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        let dados = await enviarjwt.json()

        document.querySelector('.profile-avatar').src = dados.foto || 'https://www.cartacapital.com.br/wp-content/uploads/2021/01/Bolsonaro-Impeachment-1.jpg'
        let status = await enviarjwt.status
        if(status===403 || status===401){
            window.location.href = '../login/login.html'
            return
        }

        document.querySelector('.profile-name').textContent = dados.nome
        document.querySelector('.profile-bio').textContent = dados.bio
        let btn = document.querySelector('.btnedit')
        btn.addEventListener('click', ()=>{
            document.querySelector('#fundopreto').style.display='flex'
        })
        let btnfoto = document.querySelector('#btnfoto')
        btnfoto.addEventListener('click', ()=>{
            document.querySelector('#enterimg-escuro').style.display='flex'
        })
        let popup = document.querySelector('.formimg')
        popup.addEventListener('click', (e) => {
            e.stopPropagation()
        })
        document.querySelector('#enterimg-escuro').addEventListener('click', ()=>{
            document.querySelector('#enterimg-escuro').style.display='none'
        })
        let popupConteudo = document.querySelector('.form')
        popupConteudo.addEventListener('click', (e) => {
            e.stopPropagation()
        })
        document.querySelector('#fundopreto').addEventListener('click',()=>{
            document.querySelector('#fundopreto').style.display='none'
        })
        let btnenviar = document.querySelector('#btnenviarfoto')

        let inputImagem = document.querySelector('#imagem')
        let nomeArquivo = document.querySelector('#nome-arquivo')
        const previewFoto = document.getElementById('previewFoto');
        btnenviar.addEventListener('click', async ()=>{
            let arquivo = inputImagem.files[0]
            if(arquivo){

                let formulario = new FormData()
                formulario.append('imagem', arquivo)
                try {
                    let enviar = await fetch('https://projeto-perfil.onrender.com/perfil',{
                        method:'PUT',
                        headers:{
                            'Authorization': `Bearer ${token}`
                        },
                        body: formulario
                    })
                    if(!enviar.ok){
                        return
                    }
                    location.reload();

                } catch (error) {
                    console.log(error)
                }
            }
            else{

            }
        })

        inputImagem.addEventListener('change', (e) => {
            let arquivo = e.target.files[0];
            if (inputImagem.files.length > 0) {
                nomeArquivo.textContent = inputImagem.files[0].name
            } else {
                nomeArquivo.textContent = 'Nenhuma imagem selecionada'
            }
            if (arquivo) {

                previewFoto.src = URL.createObjectURL(arquivo);
                previewFoto.style.display = 'block';
            } else {
                previewFoto.src = '';
                previewFoto.style.display = 'none';
            }

        })

        let btnedit = document.querySelector('#btn')
        btnedit.addEventListener('click', async ()=>{
            let text = document.querySelector('input').value
            if(text===''){
                return
            }
            try {
                let enviar = await fetch('https://projeto-perfil.onrender.com/me',{
                    method:'PUT',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        bio:text
                    })
                })

                if (!enviar.ok) {
                    throw new Error('Erro ao atualizar a bio')
                }

                location.reload();

            }
            catch (error) {
                console.log(error)
            }

            document.querySelector('#fundopreto').style.display='none'
        })
    }
    catch (error) {
        console.log(error)
    }

}
testartoken()