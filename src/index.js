let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// On the index.html page, there is a div with the id "toy-collection."
// When the page loads, make a 'GET' request to fetch all the toy objects.
// With the response data, make a <div class="card"> for each toy and add it to the toy-collection div.
window.onload = function () {
  initializeCards();
  initializeForm();
};

function initializeCards() {
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toyCollection) => {
      toyCollection.forEach(addToCollectionDiv);
      initializeLikeButton();
    })
    .catch((error) => console.error(error));
}

function initializeForm() {
  const form = document.getElementById("add-toy-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addNewToy(event);
  });
}

function initializeLikeButton() {
  const likeButtons = document.getElementsByClassName("like-btn");

  for (let i = 0; i < likeButtons.length; i++) {
    likeButtons[i].addEventListener("click", likeToy);
  }
}

function likeToy(event) {
  const button = event.target;
  const card = button.parentElement;
  const id = card.id;
  const likesDisplay = card.querySelector('p')
  let currentLikes = parseInt(likesDisplay.textContent);
  let newLikes = currentLikes + 1;

  fetch(`http://localhost:3000/toys/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ likes: `${newLikes} likes`}),
  })
    .then((response) => response.json())
    .then((updatedToy) => {
      likesDisplay.textContent = updatedToy.likes;
      console.log(updatedToy);
    })
    .catch((error) => console.error(error));
}

// A POST request should be sent to http://localhost:3000/toys and the new toy added to Andy's Toy Collection.
// If the post is successful, the toy should be added to the DOM without reloading the page.
function addNewToy(submittedToy) {
  const newToy = {
    name: submittedToy.target.name.value,
    image: submittedToy.target.image.value,
    likes: 0,
  };

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newToy),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      addToCollectionDiv(data);
    })
    .catch((error) => console.error(error));
}

function addToCollectionDiv(toy) {
  const name = document.createElement("h2");
  const image = document.createElement("img");
  const likes = document.createElement("p");
  const button = document.createElement("button");
  const card = document.createElement("div");

  name.textContent = toy.name;

  image.src = toy.image;
  image.classList.add("toy-avatar");

  likes.textContent = `${toy.likes} likes`;

  button.classList.add("like-btn");
  button.id = toy.id;
  button.innerText = "Like ❤️";

  card.classList.add("card");
  card.id = toy.id;
  card.append(name, image, likes, button);

  const toyCollection = document.getElementById("toy-collection");
  toyCollection.appendChild(card);
  console.log(card);
}
