document.addEventListener("DOMContentLoaded", function () {

    function createCard(column, taskText, categoryText, deadlineDate) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-body">
                <h6 class="card-title task" contenteditable="true">${taskText}</h6>
                <p class="card-subtitle category" contenteditable="true">${categoryText}</p>
                <input type="date" name="date" id="deadline" value="${deadlineDate || ''}">
                <div class="card-footer">
                    <i class="fa fa-trash delete-icon"></i>
                </div>
            </div>
        `;

        const deleteIcon = card.querySelector(".delete-icon");
        deleteIcon.addEventListener("click", function () {
            column.querySelector(".card-container").removeChild(card);
            saveCardsToLocalStorage();
        });

        return card;
    }

    function addNewCard(column) {
        const taskText = prompt("Enter task title:");
        if (taskText) {
            const card = createCard(column, taskText, "", "");
            column.querySelector(".card-container").appendChild(card);
            addEditListeners(card);
            saveCardsToLocalStorage();
        }
    }

    const addButtonList = document.querySelectorAll(".added");
    addButtonList.forEach((button) => {
        button.addEventListener("click", () => {
            const column = button.closest(".col");
            addNewCard(column);
        });
    });

    function addEditListeners(card) {
        const taskElement = card.querySelector(".task");
        const categoryElement = card.querySelector(".category");

        taskElement.addEventListener("input", function () {
            saveCardsToLocalStorage();
        });

        categoryElement.addEventListener("input", function () {
            saveCardsToLocalStorage();
        });

        const deadlineElement = card.querySelector("#deadline");
        deadlineElement.addEventListener("change", function () {
            saveCardsToLocalStorage();
        });
    }

    function saveCardsToLocalStorage() {
        const columns = document.querySelectorAll(".col");
        const savedData = {};

        columns.forEach((column, index) => {
            const cards = column.querySelectorAll(".card");
            const cardData = [];

            cards.forEach((card) => {
                const taskText = card.querySelector(".task").textContent;
                const categoryText = card.querySelector(".category").textContent;
                const deadlineDate = card.querySelector("#deadline").value;
                cardData.push({ taskText, categoryText, deadlineDate });
            });

            savedData[`column${index}`] = cardData;
        });

        localStorage.setItem("cardsData", JSON.stringify(savedData));
    }

    function loadCardsFromLocalStorage() {
        const savedData = JSON.parse(localStorage.getItem("cardsData"));

        if (savedData) {
            Object.keys(savedData).forEach((columnKey, columnIndex) => {
                const cardData = savedData[columnKey];
                const column = document.querySelectorAll(".col")[columnIndex];

                cardData.forEach((data) => {
                    const { taskText, categoryText, deadlineDate } = data;
                    const card = createCard(column, taskText, categoryText, deadlineDate);
                    column.querySelector(".card-container").appendChild(card);
                    addEditListeners(card);
                });
            });
        }
    }

    loadCardsFromLocalStorage();
});
