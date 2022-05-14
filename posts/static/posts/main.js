//// this static files directory is already defined in the settings.py file
// console.log("static files running from the posts app in the static folder");

// const helloWorldBox = document.getElementById("hello-world");
// const helloAjax = document.getElementById("hello-ajax");
const postsBox = document.getElementById("posts-box");
const spinnerBox = document.getElementById("spinner-box");
const loadBtn = document.getElementById("load-btn");
const endBox = document.getElementById("end-box");

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
                <a href="#" class="btn btn-primary">Details</a>
              </div>
              <div class="col-2">
                <a href="#" class="btn btn-primary">Like</a>
              </div>
            </div>
          </div>
        </div>
          `;
        });
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

getData();
