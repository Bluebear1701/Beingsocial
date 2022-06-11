const $backBtn = document.querySelector('#back-btn');
const $userName = document.querySelector('#user-name');
const $createdBy = document.querySelector('#created-by');
const $createdAt = document.querySelector('#created-at');
const $size = document.querySelector('#size');
const $toppingsList = document.querySelector('#toppings-list');
const $thoughtSection = document.querySelector('#thought-section');
const $newThoughtForm = document.querySelector('#new-thought-form');

let userId;

function getUser() {
  // get id of user
  const searchParams = new URLSearchParams(document.location.search.substring(1));
  const userId = searchParams.get('id');

  // get userInfo
  fetch(`/api/users/${userId}`)
    .then(response => {
      console.log(response);
      if (!response.ok) {
        console.log('hi');
        throw new Error({ message: 'Something went wrong!' });
      }

      return response.json();
    })
    .then(printUser)
    .catch(err => {
      console.log(err);
      alert('Cannot find a user with this id! Taking you back.');
      window.history.back();
    });
}

function printUser(userData) {
  console.log(userData);

  userId = userData._id;

  const { userName, createdBy, createdAt, size, toppings, thoughts } = userData;

  $userName.textContent = userName;
  $createdBy.textContent = createdBy;
  $createdAt.textContent = createdAt;
  $size.textContent = size;
  $toppingsList.innerHTML = toppings
    .map(topping => `<span class="col-auto m-2 text-center btn">${topping}</span>`)
    .join('');

  if (thoughts && thoughts.length) {
    thoughts.forEach(printThought);
  } else {
    $thoughtSection.innerHTML = '<h4 class="bg-dark p-3 rounded">No thoughts yet!</h4>';
  }
}

function printThought(thought) {
  // make div to hold thought and subthoughts
  const thoughtDiv = document.createElement('div');
  thoughtDiv.classList.add('my-2', 'card', 'p-2', 'w-100', 'text-dark', 'rounded');

  const thoughtContent = `
      <h5 class="text-dark">${thought.writtenBy} thoughted on ${thought.createdAt}:</h5>
      <p>${thought.thoughtBody}</p>
      <div class="bg-dark ml-3 p-2 rounded" >
        ${thought.replies && thought.replies.length
      ? `<h5>${thought.replies.length} ${thought.replies.length === 1 ? 'Reaction' : 'Replies'
      }</h5>
        ${thought.replies.map(printReaction).join('')}`
      : '<h5 class="p-1">No replies yet!</h5>'
    }
      </div>
      <form class="reaction-form mt-3" data-thoughtid='${thought._id}'>
        <div class="mb-3">
          <label for="reaction-name">Leave Your Name</label>
          <input class="form-input" name="reaction-name" required />
        </div>
        <div class="mb-3">
          <label for="reaction">Leave a Reaction</label>
          <textarea class="form-textarea form-input"  name="reaction" required></textarea>
        </div>

        <button class="mt-2 btn display-block w-100">Add Reaction</button>
      </form>
  `;

  thoughtDiv.innerHTML = thoughtContent;
  $thoughtSection.prepend(thoughtDiv);
}

function printReaction(reaction) {
  return `
  <div class="card p-2 rounded bg-secondary">
    <p>${reaction.writtenBy} replied on ${reaction.createdAt}:</p>
    <p>${reaction.reactionBody}</p>
  </div>
`;
}

function handleNewThoughtSubmit(event) {
  event.preventDefault();

  const thoughtBody = $newThoughtForm.querySelector('#thought').value;
  const writtenBy = $newThoughtForm.querySelector('#written-by').value;

  if (!thoughtBody || !writtenBy) {
    return false;
  }

  const formData = { thoughtBody, writtenBy };

  fetch(`/api/thoughts/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      response.json();
    })
    .then(thoughtResponse => {
      console.log(thoughtResponse);
      // location.reload();
    })
    .catch(err => {
      console.log(err);
    });
}

function handleNewReactionSubmit(event) {
  event.preventDefault();

  if (!event.target.matches('.reaction-form')) {
    return false;
  }

  const thoughtId = event.target.getAttribute('data-thoughtid');

  const writtenBy = event.target.querySelector('[name=reaction-name]').value;
  const reactionBody = event.target.querySelector('[name=reaction]').value;

  if (!reactionBody || !writtenBy) {
    return false;
  }

  const formData = { writtenBy, reactionBody };

  fetch(`/api/thoughts/${userId}/${thoughtId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      response.json();
    })
    .then(thoughtResponse => {
      console.log(thoughtResponse);
      location.reload();
    })
    .catch(err => {
      console.log(err);
    });
}

$backBtn.addEventListener('click', function () {
  window.history.back();
});

$newThoughtForm.addEventListener('submit', handleNewThoughtSubmit);
$thoughtSection.addEventListener('submit', handleNewReactionSubmit);

getUser();
