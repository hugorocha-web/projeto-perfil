let btn = document.querySelector('.btn')
let popup = document.querySelector('.popup-overlay')

function fecharPopup() {
    popup.style.display = 'none'
    window.location.href = '../login/login.html'
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
    let nome = document.querySelector('#name').value
    let email = document.querySelector('#email').value
    let senha = document.querySelector('#password').value

    try {
        let enviar = await fetch('http://localhost:3000/criarconta', {
            method:'POST',
            headers:{
                'Content-Type':'application/json', 
            },
            body: JSON.stringify({
                nome:nome,
                email:email,
                senha:senha,
                bio:'Desenvolvedor Web apaixonado por tecnologia e criação de interfaces modernas.',
                foto: 'https://www.cartacapital.com.br/wp-content/uploads/2021/01/Bolsonaro-Impeachment-1.jpg'
            })
        })
        let dados = await enviar.json()
        let popupTexto = popup.querySelector('h2')
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