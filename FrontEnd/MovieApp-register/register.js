$("#register").submit(function(event) {
    event.preventDefault();

    // Check if the checkbox is checked
    if (!$("#agreeCheckbox").prop("checked")) {
        $('#responseModalBody').text("You must agree to the terms of services before registering.");
        $('#responseModal').modal('show');
        return; // Prevent further execution
    }

    // Rest of your registration code
    const name = document.getElementById("Name").value;
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;
    const age = document.getElementById("Age").value;

    var data = { name: name, email: email, password: password, age: age };
    $.ajax({
        url: "http://localhost:1113/register",
        type: "POST",
        data: data,
        success: function(response){
            localStorage.setItem("email", data.email);

            $('#responseModalBody').text("Registration successful!, you are redirected"); // Display a success message
            $('#responseModal').modal('show'); // Show the modal
            
            // Redirect the user to the home page after a short delay
            setTimeout(function() {
                 window.location.href = "/Movie-App/FrontEnd/MovieApp-homepage/view.html"; // Replace with the actual URL of your home page
            }, 2000); // Delay in milliseconds (e.g., 2000ms = 2 seconds)
        },
        
        error: function(xhr, status, error) {
            try {
                var errorResponse = JSON.parse(xhr.responseText); // Parse the JSON error response
                var errorMessage = errorResponse.error; // Extract the error message
                $('#responseModalBody').text(errorMessage); // Display the error message
                $('#responseModal').modal('show'); // Show the modal
            } catch (e) {
                // Handle other types of errors
                $('#responseModalBody').text("An error occurred during registration."); // Display a generic error message
                $('#responseModal').modal('show'); // Show the modal
            }
        }
    });
    
    
    
})



