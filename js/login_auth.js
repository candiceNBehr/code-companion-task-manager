$(document).ready(function () {
    //! CHECK IF USER IS AUTHENTICATED
    var isAuthenticated = localStorage.getItem("isAuthenticated");
  
    if (isAuthenticated === "true") {
      showApp();
    } else {
      showLoginPage();
    }
  
    //! LOGIN SUBMISSION
    $("#loginForm").on("submit", function (e) {
      e.preventDefault();
  
      var username = $("#username").val();
      var password = $("#password").val();
  
      //! LOAD USERS
      $.getJSON("users.json", function (data) {
        var user = data.users.find(function (user) {
          return user.username === username && user.password === password;
        });
  
        if (user) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user", user.username);
          showApp();
          fetchTasks(); // CALL TASKS
        } else {
          $("#errorMessage").text("Invalid username or password. Please try again.");
        }
      }).fail(function () {
        alert("Failed to load users data.");
      });
    });
  
    //! LOGOUT
    $("#logoutButton").on("click", function () {
      localStorage.removeItem("isAuthenticated");
      showLoginPage();
      sessionStorage.clear();
    });
  });
  
  //* FUNCTIONS
  function showLoginPage() {
    $("#app").hide();
    $("#loginPage").show();
  }
  
  function showApp() {
    $("#loginPage").hide();
    $("#app").show();
  }