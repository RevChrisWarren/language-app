const listEl = document.querySelector(".list");
const cardInputEl = document.querySelector("#list-card-input");
const listContainer = document.querySelector(".list-container");
const saveBtn = document.querySelector(".save");
const frontInputEl = document.querySelector("#front");
const backInputEl = document.querySelector("#back");
const addNewDeckBtn = document.querySelector(".new-deck-btn");
const modal = document.getElementById("modal");
const modalBtn = document.querySelector(".modal-btn");
const newDeckEntryField = document.querySelector("#new-deck-field");
const dropDownMenu = document.querySelector(".dropdown-menu");
const span = document.querySelector(".close");
const newCardBtn = document.querySelector(".new-card-btn");
const updateBtn = document.querySelector(".edit");
const removeDeckBtn = document.querySelector(".remove-deck-btn");

const cardListArr = [];

function addNewDeck() {
  modal.style.display = "block";
}
function showDeckList() {}

async function saveDeckName(event) {
  event.preventDefault();
  const newDeckEntry = newDeckEntryField.value.trim();
  const newDeckListItem = document.createElement("li");
  if (!newDeckEntry) {
    return alert("Error: Please enter a Deck Name");
  }
  let newDeck = await fetch("/api/decks/", {
    method: "POST",
    body: JSON.stringify({ newDeckEntry }),
    headers: { "Content-Type": "application/json" },
  });
  newDeckListItem.innerHTML = `<a class="dropdown-item">${newDeckEntry}</a>`;
  newDeckListItem.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(".dropdown-toggle").innerHTML = newDeckEntry;
  });
  dropDownMenu.append(newDeckListItem);
  modal.style.display = "none";
  newDeckEntryField.value = "";
  newCardBtn.style.display = "block";
  window.location.reload();
}

let dropdownItem = document
  .querySelectorAll(".dropdown-item")
  .forEach((item) => {
    item.addEventListener("click", async (e) => {
      e.preventDefault();
      let previousCard = document.querySelectorAll(".list-card");
      previousCard.forEach((i) => {
        i.remove();
      });
      document.querySelector(".dropdown-toggle").innerHTML = item.innerHTML;

      let res = await fetch(`/api/cards?deck_id=${e.target.dataset.id}`);
      let data = await res.json();

      listContainer.dataset.deck_id = e.target.dataset.id;
      data.forEach((card) => {
        const cardLi = document.createElement("li");
        const exBox = document.createElement("button");
        cardLi.classList = "list-card";
        cardLi.textContent = `${card.front} / ${card.back} / `;
        cardLi.dataset.card_id = card.id;
        cardLi.dataset.deck_id = card.deck_id;
        listContainer.append(cardLi);
        cardLi.append(exBox);
        exBox.innerHTML = "X";
        exBox.addEventListener("click", () => {
          fetch(`api/cards/${cardLi.dataset.card_id}`, {
            method: "DELETE",
          }).then((response) => {
            if (response.ok) {
              cardLi.remove();
            } else {
              alert(response.statusText);
            }
          });
        });
      });
      removeDeckBtn.addEventListener("click", () => {
        fetch("api/decks/" + e.target.dataset.id, {
          method: "DELETE",
        }).then((response) => {
          if (response.ok) {
            window.location.reload();
          }
        });
      });
    });
  });

function closeModal() {
  modal.style.display = "none";
  newCardBtn.style.display = "block";
}

function newCard() {
  frontInputEl.value = "";
  backInputEl.value = "";
  saveBtn.style.display = "block";
  UpdateBtn.style.display = "none";
}

async function saveFrontBack(event) {
  event.preventDefault();
  const frontCard = frontInputEl.value.trim();
  const backCard = backInputEl.value.trim();
  const listCard = document.createElement("li");
  const exBox = document.createElement("button");
  listCard.classList = "list-card";
  listCard.id = "list-card";
  if (!frontCard || !backCard) {
    return alert("Error: Please enter in both fields");
  }
  cardListArr.push(frontInputEl.value);
  cardListArr.push(backInputEl.value);
  listCard.textContent = frontCard + " / " + backCard;
  listCard.appendChild(exBox);
  exBox.innerHTML = " X";

  const deckId = listContainer.dataset.deck_id;

  frontInputEl.value = "";
  backInputEl.value = "";
  try {
    let newCard = await fetch("/api/cards/", {
      method: "POST",
      body: JSON.stringify({
        front: frontCard,
        back: backCard,
        deck_id: deckId,
        dueDate: new Date(),
      }),
      headers: { "Content-Type": "application/json" },
    });
    await newCard.json();
    listContainer.append(listCard);
  } catch (error) {
    window.alert("Failed to create a card");
  }
}

const listCardContainer = document.querySelector(".list-container");

saveBtn.addEventListener("click", saveFrontBack);
addNewDeckBtn.addEventListener("click", addNewDeck);
modalBtn.addEventListener("click", saveDeckName);
span.addEventListener("click", closeModal);
newCardBtn.addEventListener("click", newCard);
