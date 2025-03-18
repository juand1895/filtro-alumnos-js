const API_URL = "https://jsonplaceholder.typicode.com/users";

// Elementos del DOM
const studentsTable = document.getElementById("studentsTable");
const companyFilter = document.getElementById("companyFilter");
const cityFilter = document.getElementById("cityFilter");
const nameSearch = document.getElementById("nameSearch");
const sortButton = document.getElementById("sortButton");

let studentsData = []; // Guardar los datos originales
let filteredData = []; // Guardar los datos filtrados

// Función para obtener los datos de la API
async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        studentsData = await response.json(); // Guardamos los datos originales
        filteredData = [...studentsData]; // Inicializamos los datos filtrados
        displayStudents(filteredData);
        populateFilters(); // Llenamos los filtros con opciones únicas
    } catch (error) {
        console.error("Error al obtener los alumnos:", error);
    }
}

// Función para mostrar los alumnos en la tabla
function displayStudents(students) {
    const tbody = studentsTable.querySelector("tbody");
    tbody.innerHTML = ""; // Limpiar la tabla antes de agregar los nuevos datos

    students.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.username}</td>
            <td>${student.email}</td>
            <td>${student.company.name}</td>
            <td>${student.address.city}</td>
        `;
        tbody.appendChild(row);
    });
}

// Función para llenar los filtros con opciones únicas
function populateFilters() {
    const companies = new Set();
    const cities = new Set();

    studentsData.forEach(student => {
        companies.add(student.company.name);
        cities.add(student.address.city);
    });

    companyFilter.innerHTML = '<option value="">Seleccionar empresa</option>';
    cityFilter.innerHTML = '<option value="">Seleccionar ciudad</option>';

    companies.forEach(company => {
        companyFilter.innerHTML += `<option value="${company}">${company}</option>`;
    });

    cities.forEach(city => {
        cityFilter.innerHTML += `<option value="${city}">${city}</option>`;
    });
}

// Función para aplicar los filtros y actualizar la tabla
function applyFilters() {
    const companyValue = companyFilter.value.toLowerCase();
    const cityValue = cityFilter.value.toLowerCase();
    const searchValue = nameSearch.value.toLowerCase();

    filteredData = studentsData.filter(student => {
        const matchesCompany = companyValue ? student.company.name.toLowerCase().includes(companyValue) : true;
        const matchesCity = cityValue ? student.address.city.toLowerCase().includes(cityValue) : true;
        const matchesName = searchValue ? student.name.toLowerCase().includes(searchValue) : true;

        // Permitir que se muestren los resultados si uno de los filtros coincide
        return matchesCompany || matchesCity || matchesName;
    });

    displayStudents(filteredData);
}

// Función para ordenar los estudiantes de Z a A por nombre
function sortStudents() {
    filteredData.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) return 1; // Orden descendente (de Z a A)
        if (nameA > nameB) return -1;
        return 0;
    });

    displayStudents(filteredData); // Mostrar los estudiantes ordenados
}

// Eventos para aplicar los filtros
companyFilter.addEventListener("change", applyFilters);
cityFilter.addEventListener("change", applyFilters);
nameSearch.addEventListener("input", applyFilters);

// Evento para ordenar por nombre de Z a A
sortButton.addEventListener("click", sortStudents);

// Llamar a la función para obtener los datos al cargar la página
fetchStudents();
