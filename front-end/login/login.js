let btn = document.querySelector('.btn')
let popup = document.querySelector('.popup-overlay')

function fecharPopup() {
    popup.style.display = 'none'
}

popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        fecharPopup()
    }
})

let botoesFechar = popup.querySelectorAll('button')
botoesFechar.forEach(botao => {
    botao.addEventListener('click', fecharPopup)
})

btn.addEventListener('click', async ()=>{
    let email = document.querySelector('#email').value
    let senha = document.querySelector('#password').value

    try {
        let enviar = await fetch('https://projeto-perfil.onrender.com/login', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                email:email,
                senha:senha
            })
        })
        let dados = await enviar.json()
        let status = await enviar.status
        let popupTexto = popup.querySelector('h2')
        if (popupTexto && dados.mensagem) {
            popupTexto.textContent = dados.mensagem
        }

        popup.style.display = 'flex'
        if(status === 200){
            localStorage.setItem('token', dados.token)
            window.location.href = '../perfil/perfil.html'
        }

    }
    catch (erro) {
        console.log(erro)
    }
})