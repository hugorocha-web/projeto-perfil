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
        let popupConteudo = document.querySelector('.form')
        popupConteudo.addEventListener('click', (e) => {
            e.stopPropagation()
        })
        document.querySelector('#fundopreto').addEventListener('click',()=>{
            document.querySelector('#fundopreto').style.display='none'
        })
        let btnedit = document.querySelector('#btn')
        btnedit.addEventListener('click', async ()=>{
            let text = document.querySelector('input').value
            if(text===''){
                return
            }
            try {
                let enviar = await fetch('http://localhost:3000/me',{
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