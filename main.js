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
      email: document.getElementById("email").value,
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

const createRow = (aluno, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td>${aluno.nome}</td>
        <td>${aluno.email}</td>
        <td>${aluno.celular}</td>
        <td>${aluno.dataNascimento}</td>
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
  document.getElementById("email").value = aluno.email;
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
