//// this static files directory is already defined in the settings.py file
// console.log("static files running from the posts app in the static folder");

// const helloWorldBox = document.getElementById("hello-world");
// const helloAjax = document.getElementById("hello-ajax");
const postsBox = document.getElementById("posts-box");

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

$.ajax({
  type: "GET",
  url: "/data/",
  success: function (response) {
    console.log(response.data);
    const data = response.data;

    data.forEach((el) => {
      postsBox.innerHTML += `
        <p>${el.title} - <b>${el.body}</b></p> <br />
      `;
    });
  },
  error: function (error) {
    console.log(error);
  },
});
