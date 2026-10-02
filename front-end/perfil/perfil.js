async function testartoken(){

    let token = localStorage.getItem('token')
    if(!token){
        window.location.href = '../login/login.html'
        return
    }
    
    
    try {
        let enviarjwt = await fetch('http://localhost:3000/me',{
            method:'GET',
            headers:{
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            }
        })
        let dados = await enviarjwt.json()
        let status = await enviarjwt.status
        if(status===403){
            window.location.href = '../login/login.html'
        }
        console.log(dados)
        document.querySelector('.profile-name').textContent = dados.nome
    }   
    catch (error) {
        console.log(error)
    }

}
testartoken()