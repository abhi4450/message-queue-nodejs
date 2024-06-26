document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.querySelector("#login");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#pass");
  const newDiv = document.querySelector("#msg");

  const submitForgotPassword = document.getElementById("submitForgotPassword");

  loginButton.addEventListener("click", UserLoginHandler);

  async function UserLoginHandler() {
    const email = emailInput.value;
    const password = passwordInput.value;

    const loginUserData = {
      email: email,
      password: password,
    };

    try {
      const result = await checkForUserInBackend(loginUserData);

      if (result.success) {
        if (result.status === 200) {
          localStorage.setItem("token", result.data.token);
          alert(result.data.message);

          window.location.href = "http://localhost:3000/api/user/dashboard";
        } else {
          console.warn("Unexpected status code:", result.status);
        }
      } else {
        if (result.status === 401) {
          newDiv.innerText = `${result.error}`;
        } else if (result.status === 404) {
          newDiv.innerText = `${result.error}`;
        } else {
          console.warn("Unexpected status code:", result.status);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  async function checkForUserInBackend(loginUserData) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        loginUserData
      );

      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return {
        success: false,
        error: error.response.data.message,
        status: error.response.status,
      };
    }
  }

  if (submitForgotPassword) {
    submitForgotPassword.addEventListener("click", async function () {
      // Handle the logic for submitting the forgot password form
      const forgotEmail = document.getElementById("forgotEmail").value;

      try {
        const response = await axios.post(
          "http://localhost:3000/api/user/password/forgotpassword",
          {
            email: forgotEmail,
          }
        );

        // Handle the response from the backend API as needed
        alert(response.data.message);
      } catch (error) {
        if (error.response.status === 400) {
          // Handle status 400 (Bad Request) from the backend
          alert(error.response.data.message);
        } else {
          console.error("Error submitting forgot password form:", error);
          alert("Failed to submit forgot password form. Please try again.");
        }
      }
    });
  }
});
