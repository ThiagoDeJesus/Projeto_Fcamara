"use strict"
// ==== Mecanismo de busca ====
const input = document.querySelector("[data-search]")
const pathPaginaToons = "/html/toons.html"

// Como o mesmo script está sendo usado para mais de uma página, esse if declara as váriaveis da página toons apenas se o script for chamado a partir dela.
if (window.location.pathname == pathPaginaToons){
    var h2Desenhos = document.querySelector("[data-desenhos]")
    var h2Acessados = document.querySelector("[data-h2-acessados]")
    var maisAcessados = document.querySelector("[data-acessados]")
    var desenhosElement = document.querySelector(".desenhos")
    var desenhosArray = desenhosElement.querySelectorAll(".item")
    var achados = 0
    if (window.localStorage.getItem("pesquisa") != null)
    {
        if (window.localStorage.getItem("pesquisa").length <= 2)
        {
            input.value = window.localStorage.getItem("pesquisa")
        } else {
            input.focus()
        }
    }

    // Se o usuário estiver vindo de outra página e algo tiver sido registrado na barra de pesquisa, lança um focus nela.
    if (input.value != "")
    {
        input.focus()
        pesquisar()
    }
}


// Adiciona um Event listener que aciona a função pesquisar sempre que é digitada uma letra nova
input.addEventListener('keydown', pesquisar)
input.addEventListener('keyup', pesquisar)

function pesquisar (event) {
    // Verifica se o usuário se encontra na página do catalógo, caso não se encontre, encaminha para ela.
    if (window.location.pathname != pathPaginaToons)
    {
        window.localStorage.setItem("pesquisa", event.key)
        return window.location.pathname = pathPaginaToons
    }
    const busca = input.value.toUpperCase();
    // Se a caixa de pesquisa tiver vazia ele restaura todos e retorna
    if (input.value == '')
    {
        h2Acessados.style.display = "block"
        maisAcessados.style.display = "grid"
        h2Desenhos.innerHTML = "Catálogo"
        for (let i = 0; i < desenhosArray.length; i++)
        {   
        const elemento = desenhosArray[i]
        elemento.style.display = "block"
        }
        return 
    }
    // Restaura todos os desenhos
    for (let i = 0; i < desenhosArray.length; i++)
    {   
        const elemento = desenhosArray[i]
        elemento.style.display = "block"
        achados++
    }
    // Esconde os que não estão de acordo com a pesquisa
    for (let i = 0; i < desenhosArray.length; i++)
    {   
        const elemento = desenhosArray[i]
        const nome = elemento.dataset.nome
        const genero = elemento.dataset.genero
        if ((nome.toUpperCase().indexOf(busca) == -1) && (genero.toUpperCase().indexOf(busca) == -1))
        {
            elemento.style.display = "none"
            achados--
        }
    }
    if (achados == 0) {
        h2Desenhos.innerHTML = `Desculpe, não encontramos nenhum desenho com base na pesquisa "${input.value}"`
    } else {
        h2Desenhos.innerHTML = `Foram encontrados ${achados} desenhos com base na pesquisa "${input.value}"`
    }
    maisAcessados.style.display = "none"
    h2Acessados.style.display = "none"
    achados = 0
}

// ==== Fim mecanismo de busca ====

// ==== Início do sistema de troca de avatar ====

const avatar = document.querySelector("[data-avatar]")
const divIcones = document.querySelector(["[data-icones]"])

// Verifica se o script está sendo acessado a partir da página index, pois o caminho para as imagens a partir dela é diferente.
if (window.location.pathname == "/index.html")
{
    var icones = ["/imagens/avatar-icons/default-avatar.png", "/imagens/avatar-icons/power-girl.jpg", "/imagens/avatar-icons/arnold.jpg", "/imagens/avatar-icons/coragem.jpg"]
    if (window.localStorage.getItem("avatar") != null)
    {
        const avatarPessoal = window.localStorage.getItem("avatar")
        avatar.src = ".." + avatarPessoal
    }
} else {
    var icones = ["../imagens/avatar-icons/default-avatar.png", "../imagens/avatar-icons/power-girl.jpg", "../imagens/avatar-icons/arnold.jpg", "../imagens/avatar-icons/coragem.jpg"]
    if (window.localStorage.getItem("avatar") != null)
    {
        const avatarPessoal = window.localStorage.getItem("avatar")
        avatar.src = avatarPessoal
    }
}

// Coloca o display da janela de escolha de avatares como "none" e adiciona uma função ao avatar para que ao ser clicado mude o display da janela de icones

atualizarIcones()
// gera a lista de avatares disponíveis com base nos avatares registrados na lista icones
function atualizarIcones() {
    for(let i = 0; i< icones.length; i++)
    {
        var element = document.createElement("li")
        element.className = "icone"
        var element2 = document.createElement("img")
        element2.className = "icones"
        element2.src = icones[i]
        element2.addEventListener('click', trocarAvatar)
        element.appendChild(element2)
        divIcones.appendChild(element)
    }
}

// realiza a troca do avatar

function trocarAvatar(element){
    element = element.target
    var temp = element.src
    element = avatar.src
    avatar.src = temp
    window.localStorage.setItem("avatar", avatar.src.slice(avatar.src.indexOf("/imagens")))
}

// ==== Fim do sistema de troca de avatar ====

// ==== Acessados recentemente ====

// Verifica se a página atual é a página do catálogo
if (window.location.pathname == pathPaginaToons)
{   
    // Verifica se há algum desenho recentemente acessado, se houver carrega eles.
    const acessadosRecente = document.querySelector("[data-acessados]")
    if (window.localStorage.getItem("recentes") != null)
    {
        var listaRecentes = JSON.parse(window.localStorage.getItem("recentes"))
        h2Acessados.style.display = "block"

    } else {
        h2Acessados.style.display = "none"
        var listaRecentes = []
    }
    
    atualizaRecentesNaTela(listaRecentes)  
}


function adicionaInteresse(element)
{
    // Verifica se o elemento clicado já está na lista de recentes
    if (listaRecentes.indexOf(element.dataset.nome) == -1)
    {
        listaRecentes.unshift(element.dataset.nome)
    } else {
        // Se já estiver, muda a posição dele na lista para 0
        listaRecentes.splice(listaRecentes.indexOf(element.dataset.nome), 1)
        listaRecentes.unshift(element.dataset.nome)
    }
    while(listaRecentes.length > 3)
    {
        listaRecentes.pop()
    }
    // Atualiza a lista de recentes na memória local
    window.localStorage.setItem("recentes", JSON.stringify(listaRecentes))
}

function atualizaRecentesNaTela(lista)
{
    for(let i = 0; i < lista.length; i++)
    {
        let desenhoInteresseNome = lista[i]
        for (let c = 0; c < desenhosArray.length; c++)
        {   
            var elemento = desenhosArray[c]
            const nome = elemento.dataset.nome
            if (desenhoInteresseNome.toUpperCase() == nome.toUpperCase())
            {
                var elemento = elemento.cloneNode(true)
                acessadosRecente.appendChild(elemento)
            }
    }
    }
}
// ==== Fim acessados recentemente ====

window.localStorage.setItem("pesquisa", "")