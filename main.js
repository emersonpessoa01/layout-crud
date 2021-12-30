"use strict";

const openModal = () =>
  document.getElementById("modal").classList.add("active");

const closeModal = () => {
  clearFields();
  document.getElementById("modal").classList.remove("active");
};

const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("db_aluno")) ?? [];
const setLocalStorage = (dbAluno) =>
  localStorage.setItem("db_aluno", JSON.stringify(dbAluno));

// CRUD - create read update delete
const deleteAluno = (index) => {
  const dbAluno = readAluno();
  dbAluno.splice(index, 1);
  setLocalStorage(dbAluno);
};

const updateAluno = (index, aluno) => {
  const dbAluno = readAluno();
  dbAluno[index] = aluno;
  setLocalStorage(dbAluno);
};

const readAluno = () => getLocalStorage();

const createAluno = (aluno) => {
  const dbAluno = getLocalStorage();
  dbAluno.push(aluno);
  setLocalStorage(dbAluno);
};

const isValidFields = () => {
  return document.getElementById("form").reportValidity();
};

//Interação com o layout

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
  document.getElementById("nome").dataset.index = "new";
};

const saveAluno = () => {
  debugger;
  if (isValidFields()) {
    const aluno = {
      nome: document.getElementById("nome").value,
      number: document.getElementById("number").value,
      celular: document.getElementById("celular").value,
      dataNascimento: document.getElementById("dataNascimento").value,
    };
    const index = document.getElementById("nome").dataset.index;
    if (index == "new") {
      createAluno(aluno);
      updateTable();
      closeModal();
    } else {
      updateAluno(index, aluno);
      updateTable();
      closeModal();
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
//Adicionar máscara no input
const celular = document.querySelector("#celular");

celular.addEventListener("keyup", (event) => {
  let start = celular.selectionStart; //initial cursor position
  let end = celular.selectionEnd; //final cursor position
  //if the start and end positions of the cursor are the same, it means that there is no selection range
  if (start == end) {
    //this conditional prevents the function call when the user makes a selection range in the input EX:. keys (Ctrl + A)
    formMask("__ _____-____", "_", event, start);
  }
});

function formMask(mask, char, event, cursor) {
  const vetMask = mask.split(""); //transform mask into vector to use specific functions, like filter()
  const onlyNumbers = celular.value
    .split("")
    .filter((value) => !isNaN(value) && value != " ");
  const key = event.keyCode || event.which;
  const backspaceAndArrowKeys = [8, 37, 38, 39, 40]; //code backspace and arrow keys
  const clickedOnTheBackspaceOrArrowsKeys =
    backspaceAndArrowKeys.indexOf(key) >= 0;
  const charNoMod = [".", "-"]; //characters that do not change
  const cursorIsCloseToCharNoMod = charNoMod.indexOf(vetMask[cursor]) >= 0;

  onlyNumbers.forEach((value) =>
    vetMask.splice(vetMask.indexOf(char), 1, value)
  ); //change '#' to numbers

  celular.value = vetMask.join("");

  if (!clickedOnTheBackspaceOrArrowsKeys && cursorIsCloseToCharNoMod) {
    //increment the cursor if it is close to characters that do not change
    celular.setSelectionRange(cursor + 1, cursor + 1);
  } else {
    celular.setSelectionRange(cursor, cursor);
  }
}
// converter a 1a letra de cada palavra em maiúscula
const capitalizeFirst = (str) => {
  const subst = str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
  return subst;
};

const createRow = ({ nome, number, celular, dataNascimento }, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td>${capitalizeFirst(nome)}</td>
        <td>${number}</td>
        <td>${celular.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")}</td>
        <td>${dataNascimento.split("-").reverse().join("/")}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `;
  document.querySelector("#tableAluno>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableAluno>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbAluno = readAluno();
  clearTable();
  dbAluno.forEach(createRow);
};

const fillFields = (aluno) => {
  document.getElementById("nome").value = aluno.nome;
  document.getElementById("number").value = aluno.number;
  document.getElementById("celular").value = aluno.celular;
  document.getElementById("dataNascimento").value = aluno.dataNascimento;
  document.getElementById("nome").dataset.index = aluno.index;
};

const editClient = (index) => {
  const aluno = readAluno()[index];
  aluno.index = index;
  fillFields(aluno);
  openModal();
};

const editDelete = (event) => {
  if (event.target.type == "button") {
    const [action, index] = event.target.id.split("-");

    if (action == "edit") {
      editClient(index);
    } else {
      const aluno = readAluno()[index];
      const response = confirm(
        `Deseja realmente excluir o aluno ${aluno.nome}`
      );
      if (response) {
        deleteAluno(index);
        updateTable();
      }
    }
  }
};

updateTable();

// Eventos
document.getElementById("cadastrarAluno").addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("salvar").addEventListener("click", saveAluno);

document
  .querySelector("#tableAluno>tbody")
  .addEventListener("click", editDelete);

document.getElementById("cancelar").addEventListener("click", closeModal);
