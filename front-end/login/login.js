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
        let enviar = await fetch('http://localhost:3000/login', {
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
        let popupTexto = popup.querySelector('p')
        if (popupTexto && dados.mensagem) {
            popupTexto.textContent = dados.mensagem
        }

        
        popup.style.display = 'flex'
        
        console.log(dados.mensagem)
    } 
    catch (error) {
        console.log(error)
    }
})