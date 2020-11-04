const express = require("express")
const app = express()
app.use(express.json())

//Classe modelo
class Modelo{

    id = null
    empresa = null

    constructor(id,empresa){
        this.id = id,
        this.empresa = empresa
    }
}

//Classe de funções
class Funcoes{

    empresas = []

    buscarEmpresa(id){
        const pesquisa = this.empresas.filter( empresa => empresa.id == id )
        if(pesquisa.length == 0)
            return null
        return pesquisa[0]
    }

    validarEmpresa (empresa){     //nao esta verificando se empresa ja esta no array
        return("empresa" in empresa)
    }

    inserirEmpresa(empresa){
        this.empresas.push(empresa)
    }

    alterarEmpresa(indice, empresa){
        this.empresas[indice] = empresa
    }
    
    reordenarEmpresas(){
        var i = 0
        while(i < this.empresas.length){
            this.empresas[i]["id"] = (i+1)
            i++
        }
    }

    removerEmpresa(indice){
        this.empresas.splice(indice, 1)
        this.reordenarEmpresas()
    }

}

//Dados de teste
const funcoes = new Funcoes()
//const primeiraEmpresa = new Modelo(1, "Celso Lisboa")
//const segundaEmpresa = new Modelo(2, "Liga Educacional")
//funcoes.inserirEmpresa(primeiraEmpresa)
//funcoes.inserirEmpresa(segundaEmpresa)

//Mensagem de erro
erro_mensagem = {
    'erro.id.naoinformada': { 
        "erro": true, "mensagem":"Identificador não informado!" 
    },
    'erro.camposorbigatorios.naopreenchidos': { 
        "erro": true, "mensagem":" Todos os campos obrigatórios devem ser preenchidos! " 
    },
    'erro.empresa.jacadastrada': { 
        "erro": true, "mensagem": " Empresa já cadastrada! " 
    },
    'empresa.excluida.sucesso': { 
        "erro": false, "mensagem": " Empresa excluída com sucesso! " 
    }
}

//Rotas
app.get("/empresa",(req,res)=>{
    res.status(200).send(funcoes.empresas)
})

app.get("/empresa/:id",(req,res)=>{
    const {id} = req.params
    const indice = id - 1 

    if (id > funcoes.empresas.length){
        res.status(400).send(erro_mensagem['erro.id.naoinformada'])
        return
    }

    if (id == funcoes.empresas[indice].id){
        res.status(200).send(funcoes.buscarEmpresa(id))
        return
    }

})

app.post("/empresa",(req,res)=>{
    nova_empresa = req.body
    indice = (funcoes.empresas.length) - 1
    const ultimaId = funcoes.empresas[indice] ? (funcoes.empresas[indice].id) : 0
    nova_empresa["id"] = ultimaId + 1

    if (!funcoes.validarEmpresa(nova_empresa)){
        res.status(400).send(erro_mensagem['erro.camposorbigatorios.naopreenchidos'])
        return
    }

    const novaEmpresa = new Modelo(nova_empresa.id, nova_empresa.empresa)

    if (funcoes.repeticaoEmpresa(novaEmpresa.empresa)){
        res.status(400).send(erro_mensagem['erro.empresa.jacadastrada'])
        return
    }

    funcoes.inserirEmpresa(novaEmpresa)
    res.status(201).send(novaEmpresa)
})

app.patch("/empresa/:id",(req,res)=>{
    edit_empresa = req.body
    const {id} = req.params
    const indice = id - 1

    if (!funcoes.buscarEmpresa(id)){
        res.status(400).send(erro_mensagem['erro.id.naoinformada'])
        return
    }

    if (!funcoes.validarEmpresa(edit_empresa)){
        res.status(400).send(erro_mensagem['erro.camposorbigatorios.naopreenchidos'])
        return
    }

    const empresa = funcoes.buscarEmpresa(id)
    empresa.id = indice + 1
    empresa.empresa = edit_empresa.empresa
    funcoes.alterarEmpresa(indice, empresa)
    res.status(200).send(funcoes.empresas[indice])
})

app.delete("/empresa/:id",(req,res)=>{
    const {id} = req.params
    const indice = id - 1

    if (!funcoes.buscarEmpresa(id)){
        res.status(400).send(erro_mensagem['erro.id.naoinformada'])
        return
    }

    funcoes.removerEmpresa(indice)
    res.status(200).send(erro_mensagem['empresa.excluida.sucesso'])
})

//Outros
const port = 3000
app.listen(port, ()=>{
    console.log(`Iniciando servidor...`)
})