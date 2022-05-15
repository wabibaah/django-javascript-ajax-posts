//// this static files directory is already defined in the settings.py file
// console.log("static files running from the posts app in the static folder");

// const helloWorldBox = document.getElementById("hello-world");
// const helloAjax = document.getElementById("hello-ajax");
const postsBox = document.getElementById("posts-box");
const spinnerBox = document.getElementById("spinner-box");
const loadBtn = document.getElementById("load-btn");
const endBox = document.getElementById("end-box");

const postForm = document.getElementById("post-form");
const title = document.getElementById("id_title");
const body = document.getElementById("id_body");
const csrf = document.getElementsByName("csrfmiddlewaretoken");

// console.log(window.location);
const url = window.location.href;

const alertBox = document.getElementById("alert-box");

// console.log("csrf value: ", csrf[0].value);

// helloWorldBox.innerHTML = "Kworku vi <b>abba</b>";

// $.ajax({
//   method: "GET",
//   URL: "/hello-world/",
//   success: function (response) {
//     console.log(response);
//   },
//   error: function (error) {
//     console.log(error);
//   },
// });

// $.ajax({
//   type: "GET",
//   url: "/hello-world",
//   success: function (response) {
//     console.log(response);
//     const ajaxText = response.text;
//     helloAjax.innerHTML = `${ajaxText}`;
//   },
//   error: function (error) {
//     console.log(error);
//   },
// });

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

const likeUnlikePosts = () => {
  const likeUnlikeForms = [...document.getElementsByClassName("like-unlike-forms")];
  likeUnlikeForms.forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const clickedId = e.target.getAttribute("data-form-id");
      // / we are getting the attribute of the form that was clicked and we are storing it in clickedId
      const clickedBtn = document.getElementById(`like-unlike-${clickedId}`);

      //// we need to set up a view that will handle this logic or this ajax
      $.ajax({
        type: "POST",
        url: "/like-unlike/",
        data: {
          csrfmiddlewaretoken: csrftoken,
          pk: clickedId,
        },
        success: function (response) {
          // console.log(response);
          clickedBtn.textContent = response.liked
            ? `Unlike (${response.count})`
            : `Like (${response.count})`;
        },
        error: function (error) {
          console.log(error);
        },
      });
    })
  );
};

let visible = 3;

const getData = () => {
  $.ajax({
    type: "GET",
    url: `/data/${visible}/`,
    success: function (response) {
      const data = response.data;
      console.log(data);
      setTimeout(() => {
        spinnerBox.classList.add("not-visible");
        data.forEach((el) => {
          postsBox.innerHTML += `
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${el.title}</h5>
              <p class="card-text">${el.body}</p>
            </div>
            <div class="card-footer">
              <div class="row">
                <div class="col-2">
                  <a href="${url}${el.id}" class="btn btn-primary">Details</a>
                </div>
                <div class="col-2">
                  <form class="like-unlike-forms" data-form-id="${el.id}">
                    <button class="btn btn-primary" id="like-unlike-${el.id}">${
            el.liked ? `Unlike ( ${el.count} )` : `Like ( ${el.count} )`
          }</button>
                  </form>
                </div>
              </div>
            </div>
        </div>
          `;
        });
        likeUnlikePosts();
      }, 500);
      console.log(response.size);
      if (response.size === 0) {
        endBox.textContent = "No posts added yet...";
      } else if (response.size <= visible) {
        loadBtn.classList.add("not-visible");
        endBox.textContent = "No more posts to load...";
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

loadBtn.addEventListener("click", () => {
  //// we are making it visible before we run getData() and we make it invisible in the getData function in the sucess par of the ajax call
  spinnerBox.classList.remove("not-visible");
  visible += 3;
  getData();
});

// create a new post using the modal form and ajax (post form submission)
postForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $.ajax({
    type: "POST",
    url: "",
    data: {
      csrfmiddlewaretoken: csrf[0].value,
      title: title.value,
      body: body.value,
    },
    success: function (response) {
      console.log(response);
      postsBox.insertAdjacentHTML(
        "afterbegin",
        `
      <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">${response.title}</h5>
        <p class="card-text">${response.body}</p>
      </div>
    <div class="card-footer">
      <div class="row">
        <div class="col-2">
          <a href="${response.id}/" class="btn btn-primary">Details</a>
        </div>
        <div class="col-2">
          <form class="like-unlike-forms" data-form-id="${response.id}">
            <button class="btn btn-primary" id="like-unlike-${response.id}">Like (0) </button>
          </form>
        </div>
      </div>
    </div>
  </div>
      `
      );
      likeUnlikePosts();
      $("#addPostModal").modal("hide");
      handleAlerts("success", "New post created successfully");
      postForm.reset();
    },
    error: function (error) {
      console.log(error);
      handleAlerts("danger", "Oops... something went wrong");
    },
  });
});

getData();
