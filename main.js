"use strict";

const openModal = () =>
    document.getElementById("modal").classList.add("active");

//-=-=-limpa os campos e depois fecha o modal-=-=-
const closeModal = () => {
    clearInputs(); //limpa os campos
    document.getElementById("modal").classList.remove("active");
};

//-=-=-=-VARIAVEL GLOBAL de aluno temporario-=-=-=-
/*
const tempAluno = {
  nome: "emerson pessoa",
  notaFinal: "10",
  celular: "(99)9999-9999",
  dataNascimento: "09/01/1974",
};
*/

//-=-=-=-CREATE-=-=-=-
const createAluno = (aluno) => {
    // const db_aluno = []; //não deve ser um array vazio
    const db_aluno = readAluno();
    console.log(db_aluno);
    db_aluno.push(aluno); //inseri o aluno ao banco de dados
    localStorage.setItem("aluno", JSON.stringify(db_aluno)); //envia para o banco de dados
};
//para criar no console: createAluno(tempAluno)

//-=-=-=-READ-=-=-=-
const readAluno = () => JSON.parse(localStorage.getItem("aluno")) ?? []; //faz a leitura ao banco de dados
//??[]  - interrogacao significa que for falso ou nulo ou vazio retorna um array vazio
//para ler no console: readAluno(tempAluno)

//-=-=-=-UPDATE-=-=-=-
const updateAluno = (index, aluno) => {
    const db_aluno = readAluno(); //faz a leitura do banco de dados, no caso o array.
    db_aluno[index] = aluno; //db_aluno(array) na posicao index recebe um novo aluno
    localStorage.setItem("aluno", JSON.stringify(db_aluno)); //envia o novo aluno ao banco de dados
};
//para atualizar no console: updateAluno(1,tempAluno)

//-=-=-=-DELETE-=-=-=-
const deleteAluno = (index) => {
    const db_aluno = readAluno(); //faz a leitura do banco de dados
    db_aluno.splice(index, 1); //pega o banco de dados a partir do seu index desejado e exclui somente 1
    localStorage.setItem("aluno", JSON.stringify(db_aluno)); //atualiza o banco de dados
};
//para deletar no console: deleteAluno(2) = o "2" como exemplo do index;

//-=-=-=-INTEGRAÇÃO COM O LAYOUT-=-=-=-=-

const clearInputs = () => {
    //chama todos os campos
    const inputs = document.querySelectorAll(".modal-field"); //vai buscar todos os campos do input com array vazio
    inputs.forEach((input) => {
        input.value = "";
    }); //para varrer todos os campos e retornar os campos vazios
};

const isValid = () => {
    return document.getElementById("form").reportValidity(); //essa função reportValidity() retorna verdadeiro para todos requisitos do HTML que foram atendidos
};
const saveAluno = () => {
    //verifica se os campos foram preenchidos
    if (isValid()) {
        //captura todos do dados dos campos e converte em json
        const aluno = {
            nome: document.getElementById("name").value,
            notaFinal: document.getElementById("number").value,
            celular: document.getElementById("celular").value,
            dataNascimento: document.getElementById("dateBirth").value,
        };
        const index = document.getElementById("name").dataset.index; //invés de pegar o value, pega o dataset.index no input do HTML
        //através do index, dá pra saber se pode salvar ou editar
        if (index == "new") {
            //e depois,cadatra o aluno
            createAluno(aluno);
            // clearInputs(); //limpa os campos
            updateTable(); //para atualizar os dados no HTML
            alert(
                `Aluno(a) ${capitalizeFirst(
                    aluno.nome,
                )}, cadastrado com sucesso!`,
            );
            closeModal(); //fecha o modal
            // console.log("Cadastrado com sucesso!"); //só entra se todos os requisitos do form forem atendidos
        } else {
            // console.log("Editando...")
            updateAluno(index, aluno); //atualiza o aluno
            updateTable(); //atualiza a tabela
            closeModal(); //fecha a modal
        }
    }
};

//configuração de data
/*.toLocaleString("pt-br", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
})
*/
//-=-=-=-Adicionar máscara no input-=-=-=-
const celular = document.querySelector("#celular");

celular.addEventListener("keyup", (event) => {
  let start = celular.selectionStart; 
  let end = celular.selectionEnd; 
  if (start == end) {
    formMask("_______-____", "_", event, start);
  }
});

function formMask(mask, char, event, cursor) {
  const vetMask = mask.split(""); 
  const onlyNumbers = celular.value
    .split("")
    .filter((value) => !isNaN(value) && value != " ");
  const key = event.keyCode || event.which;
  const backspaceAndArrowKeys = [8, 37, 38, 39, 40]; 
  const clickedOnTheBackspaceOrArrowsKeys =
    backspaceAndArrowKeys.indexOf(key) >= 0;
  const charNoMod = [".", "-"]; 
  const cursorIsCloseToCharNoMod = charNoMod.indexOf(vetMask[cursor]) >= 0;

  onlyNumbers.forEach((value) =>
    vetMask.splice(vetMask.indexOf(char), 1, value)
  ); 

  celular.value = vetMask.join("");

  if (!clickedOnTheBackspaceOrArrowsKeys && cursorIsCloseToCharNoMod) {
    celular.setSelectionRange(cursor + 1, cursor + 1);
  } else {
    celular.setSelectionRange(cursor, cursor);
  }
}

//-=-=-converter a 1a letra de cada palavra em maiúscula-=-=-
const capitalizeFirst = (string) => {
    const substitute = string.toLowerCase().replace(/(?:^|\s)\S/g, (item) => {
        return item.toUpperCase();
    });
    return substitute;
};
//-=-=-=-TRAZER OS DADOS PARA O HTML para preencher a tabela
//toda vez que a tela carregar, já chama o método para atualizar a tabela
const row = ({ nome, notaFinal, celular, dataNascimento }, index) => {
    //os elementos e indice
    //não existe na memória(no HTML), ou melhor, não existe no DOM
    const newRow = document.createElement("tr"); //criando uma tr vazia
    //campos do array aluno de saveAluno()
    //preenche com newRow
    //<td>${celular.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}</td>
    newRow.innerHTML = `
        <td>${capitalizeFirst(nome)}</td>
        <td>${Intl.NumberFormat("pt-br").format(notaFinal)}</td>
        <td>${celular}</td>
        <td>${dataNascimento.split("-").reverse().join("/")}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
            
        </td>
        
    `;
    //<button type="button" class="button green" data-action="edit">Editar</button>
    //<button type="button" class="button red" data-action="delete">Excluir</button>
    //obs: data-action: é dataset substituido por id

    //atributo personalizado: data-action="edit"
    //atributo personalizado: data-action="delete"

    //capturando a tbody e inserir dentro da tbody da tabela um filho que são a novas linhas
    document.querySelector("#tableAluno>tbody").appendChild(newRow); //tableAluno id do form
    //executar no console: updateTable()
};

//-=-=-LIMPAR A TABELA PARA DUPLICAR APÓS ATUALIZAR A TABELA
const clearTable = () => {
    const rows = document.querySelectorAll("#tableAluno>tbody tr"); //captura as linhas e converte em nodeList
    //testando no console: document.querySelectorAll("#tableAluno>tbody tr");
    rows.forEach((item) => {
        //pega o pai da linha que é tbody(parentNode)
        item.parentNode.removeChild(item); //removeChild() - remove o filho chamado de item
    });
};
//-=-=-=-ATUALIZAR TABELA-=-=-=-
const updateTable = () => {
    //apaga tabela anterior e cria
    //faz leitura e cria uma linha com cada um dos alunos
    const db_aluno = readAluno(); //faz leitura dos dados do locastorage
    clearTable(); //para não duplicar a tabela
    db_aluno.forEach(row); // preenche a tabela onde cada um dos alunos deve ser uma linha
};
updateTable(); //para chamar a função após definir o método
//para atualizar no console: updateAluno()

//-=-=-=-EDITAR A TABELA-=-=-=-

//para preecher os campos
const completeInput = ({ nome, notaFinal, celular, dataNascimento, index }) => {
    document.getElementById("name").value = nome;
    document.getElementById("number").value = notaFinal;
    document.getElementById("celular").value = celular;
    document.getElementById("dateBirth").value = dataNascimento;
    document.getElementById("name").dataset.index = index; //captura o dataset do name para mandar o index do aluno
};

const editIndex = (index) => {
    const aluno = readAluno()[index]; //ler os alunos apontando pelo index do array(readAluno)
    aluno.index = index; //atribuindo o index ao aluno
    console.log(aluno);
    completeInput(aluno); //preencher campos
    openModal(); //após preencher os campos, abri o modal
};
//-=-=-=-EDITA E DELETA-=-=-=-
const edit = (event) => {
    //pega o evento do click
    // console.log(event)
    // console.log(event.target);
    if (event.target.type == "button") {
        //para pegar somente o click do evento do tipo button
        // console.log(event.target.type); //captura o evento com alvo do tipo type
        // console.log(event.target.dataset.action); //dataset - é o nome da propriedade que pega os dados e action nome da propriedade especificado no data
        // console.log(event.target.id.split("-")); //split converte o evento em array
        const [action, index] = event.target.id.split("-");
        console.log(action, index);
        if (action == "edit") {
            editIndex(index);
            // console.log("Editando o(a) aluno(a)");
        } else {
            const aluno = readAluno()[index]; //faz a leitura do array e captura o aluno pelo index
            const response = confirm(
                `Tem certeza que deseja excluir ${capitalizeFirst(
                    aluno.nome,
                )}?`,
            );

            //testando se for verdadeiro
            if (response) {
                // console.log("Deletando o(a) aluno(a)");
                deleteAluno(index); //deleta mandando o index
                updateTable(); //após excluir, atualiza a tabela
                // alert("Aluno(a) excluído com sucesso!");
            }
        }
    }
    //dataset - é o nome da propriedade onde pega os dados e action mostra o tipo de ação que eu quero
};

//-=-=-=-=- Eventos -=-=-=-=-
document.getElementById("cadastrarAluno").addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveAluno);

document.getElementById("cancelar").addEventListener("click", closeModal);

document.querySelector("#tableAluno>tbody").addEventListener("click", edit);
//capturar botão editar através do pai que é o tbody dentro da tabela
