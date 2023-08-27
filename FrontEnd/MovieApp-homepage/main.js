let shop = document.getElementById('shop');
let movieModal = document.getElementById('movieModal');
let basket = JSON.parse(localStorage.getItem("data")) || [];



$(document).ready(function() {

    function initializeLiveChat() {
        const socket = io("http://localhost:1115", {
            transports: ["websocket"],
        });
    
        socket.on("connect", function () {
            console.log("Connected to socket.io server");
        });
    
        socket.on("message", function (message) {
            console.log("Received message:", message);
            appendMessage(message, new Date());
        });
    
        // Hide the chat window when the close button is clicked
        $("#closeChatButton").click(function () {
            $("#chatWindow").hide();
        });
    
        // Send chat message when the send button is clicked
        $("#sendButton").click(function () {
            const message = $("#messageInput").val();
            if (message.trim() !== "") {
                socket.emit("message",localStorage.getItem('email')+": "+message);
                $("#messageInput").val("");
            }
        });
    
 
    
        // Append the message to the chat container
function appendMessage(message, timestamp) {
    const messageItem = document.createElement("li");
    messageItem.classList.add("message");

    const timeElement = document.createElement("span");
    timeElement.classList.add("message-time");
    timeElement.textContent = formatTime(timestamp);

    const messageContent = document.createElement("div");

    const messageTextElement = document.createElement("span");
    messageTextElement.classList.add("message-text");

    if (message.startsWith(localStorage.getItem('email'))) {
        // If the message starts with the user's email, consider it as the user's own message
        messageTextElement.textContent = "You" + message.substr(localStorage.getItem('email').length);
    } else {
        // Messages from other users
        messageTextElement.textContent = message;
    }

    messageContent.appendChild(messageTextElement);

    messageItem.appendChild(timeElement);
    messageItem.appendChild(messageContent);

    messageList.appendChild(messageItem);
}
    
        function formatTime(date) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
    
            return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
        }
    }
    
    
    var userEmail = localStorage.getItem("email");
    if (userEmail) {
        $("#loginActionButton").hide();
        $("#userProfileButton").show();
        $("#logoutButton").show();

        initializeLiveChat();
    } else {
        $("#loginActionButton").show();
        $("#userProfileButton").hide();
        $("#logoutButton").hide();
        $("#openChatButton").hide();
    }
    $("#openChatButton").click(function() {
        $("#chatWindow").toggle();
    });

    $(document).on('click', '.item .clickable-image', function (event) {
        event.stopPropagation(); // Prevent event from bubbling up

        // Find the closest '.item' element
        let itemElement = $(this).closest('.item');

        // Get the movie ID from the 'id' attribute of the '.item' element
        let movieId = itemElement.attr('id');
        if (movieId) {
            movieId = movieId.replace('product-id-', '');
            fetchMovie(movieId);
        } else {
            console.log("Movie ID attribute not found.");
        }
    });
    
    $(document).on('click', '.dropdown-item', function () {
        let movieId = $(this).find('.clickable-image').attr('data-movie-id');
        if (movieId) { // Check if movieId is not undefined
            fetchMovie(movieId);
        } else {
            console.log("Movie ID attribute not found.");
        }
    });

    // Prevent modal closing when clicking on the modal content
    $(document).on('click', '.modal-content-movie', function(event) {
        event.stopPropagation(); // Prevent event from bubbling up
    });


    $("#loginForm").submit(function(event) {
        event.preventDefault();
        var email = $("#email").val();
        var password = $("#password").val();
        var postData = {
            email: email,
            password: password
        };
        
        $.ajax({
            type: "POST",
            url: "http://localhost:1113/login", 
            data: postData,
            success: function(response) {
                localStorage.setItem("email", postData.email);
                $('#responseModalBody').text("Login successful!, you are redirected");
                $('#responseModal').modal('show');
                setTimeout(function() {
                    window.location.href = "/Movie-App/FrontEnd/MovieApp-homepage/view.html";
                }, 2000);
            },
            error: function (xhr, status, error) {
                if (error) {
                    $('#responseModalLabel').text("Oops"); 
                    $('#responseModalBody').text("Wrong email/password, Please try again");
                    
                    // Clear the password field
                    $("#password").val("");
                } else {
                    $('#responseModalLabel').text("Oops");
                    $('#responseModalBody').text("An error occurred. Please try again later.");
                }
                $('#responseModal').modal('show');
            }
        });
    });

    $("#logoutButton").click(function() {
        localStorage.removeItem("email");
        localStorage.removeItem("movies");
        $("#loginActionButton").show();
        $("#userProfileButton").hide();
        $("#logoutButton").hide();
        $("#openChatButton").hide();
        $("#chatWindow").hide();
    });

    $("#loginActionButton").click(function() {
        document.getElementById("loginModal").style.display = "block";
    });

    $("#userProfileButton").click(function() {
        window.location.href = '/Movie-App/FrontEnd/MovieApp-Profile/userProfile.html';
    });
    $(".modal").click(function(event) {
        // Check if the click target is the modal itself or its content
        if (event.target === this) {
            document.getElementById("loginModal").style.display = "none";
        }
    });
    $("#closeModal").click(function() {
        document.getElementById("loginModal").style.display = "none";
    });



    
});

let user;


let generateShop = async () => {
            // Fetch the genre options from the movies
            const allGenres = new Set();
            const allRatings = new Set();
            shopItemsData.forEach(item => {
                allGenres.add(item.genre);
                allRatings.add(item.rating);

            });
            // Create genre dropdown options
        const genreSelect = document.getElementById('genre-select');
        const ratingSelect = document.getElementById('rating-select');

        allGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreSelect.appendChild(option);
        });
        allRatings.forEach(rating => {
            const option = document.createElement('option');
            option.value = rating;
            option.textContent = rating;
            ratingSelect.appendChild(option);
        });

        const applyFilters = () => {
            const selectedGenre = genreSelect.value;
            const selectedRating = ratingSelect.value;
    
            const filteredItems = shopItemsData.filter(item => {
                const matchesGenre = selectedGenre === 'all' || item.genre.includes(selectedGenre);
                const matchesRating = selectedRating === 'all' || item.rating >= parseInt(selectedRating);
                return matchesGenre && matchesRating;
            });
    
            const shopItemsHTML = generateShopItems(filteredItems);
            shop.innerHTML = shopItemsHTML;
        };
    
        genreSelect.addEventListener('change', applyFilters);
        ratingSelect.addEventListener('change', applyFilters);
    
    const email = localStorage.getItem('email');
    if (localStorage.getItem('email')){
        try {
            const response = await fetch(`http://localhost:1113/email?email=${email}`);

            user = await response.json();

        } catch (error) {
            console.error("Fetch Error:", error);
        }
    }
    else{
        console.log("localstorage is empty");
    }
    
$(document).ready(function() {
    // Attach a click event listener to the login button
    $("#loginForm").submit(function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
        
        // Get the form data
        var email = $("#email").val();
        var password = $("#password").val();
        
        // Prepare the data to send in the POST request
        var postData = {
            email: email,
            password: password
        };
        
        // Send an AJAX POST request
        $.ajax({
            type: "POST",
            url: "http://localhost:1113/login",
            data: postData,
            success: function(response) {
                // Handle the response from the server here
                localStorage.setItem("email", postData.email);
                $('#responseModalBody').text("Login successful!"); // Display a success message
                $('#responseModal').modal('show'); // Show the modal
               
                // You can redirect the user or perform other actions as needed
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
    });
});

    return shop.innerHTML = shopItemsData.map((x) => {
        let { _id, title, price, description, year, rating, actors, image } = x;
        let search = basket.find((item) => item.id === _id);
        let stars = '';
        
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="bi bi-star-fill"></i>';
            } else {
                stars += '<i class="bi bi-star"></i>';
            }
        }

        let movieContent = `
        <div class="row center-text" style="width:250px">
        <p style="margin-top:5px">You own this movie</p>
        </div>`;
        ;
        if (checkIfMovieIncluded(_id)) { 
            movieContent = `
                <h2 id="movie-price-details" class="movie-price-details">$ ${price}</h2>
                <i id="decrement" onclick="decrement('${_id}')" class="bi bi-bag-dash-fill" style="font-size:24px"></i>
                <div id="${_id}" class="quantity" style="font-size:24px">${search === undefined ? 0 : search.item}</div>
                <i id="increment" onclick="increment('${_id}')" class="bi bi-bag-plus-fill" style="font-size:24px"></i>
            `;
        }

        return `
            <div id="product-id-${_id}" class="item">
                <div class="clickable-image">
                    <img width="250" height="400" src="${image}" style="border-radius: 35px 35px 0 0;min-height:400px" alt="image should be here">
                </div>
                <div class="details">
                    <div class="titleClass">
                        <h3 class="title-movie-details">${title}</h3>
                    </div>
                    <br>
                    <p style="text-align: center;font-size:24px">${year}</p> 
                    <p style="text-align: center;font-size:24px">${stars}</p>
                    <div class="price-quantity">
                        ${movieContent}
                    </div>
                </div>
            </div>
        `;
    }).join("");
};

const generateShopItems = (items) => {
    console.log(items);
    return items.map((item) => {
    let { _id, title, price, description, year, rating, actors, image } = item;
        let search = basket.find((item) => item.id === _id);
        let stars = '';
        
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="bi bi-star-fill"></i>';
            } else {
                stars += '<i class="bi bi-star"></i>';
            }
        }

        let movieContent = `
        <div class="row center-text" style="width:250px">
        <p style="margin-top:5px">You own this movie</p>
        </div>`;
        ;
        if (checkIfMovieIncluded(_id)) { 
            movieContent = `
                <h2 id="movie-price-details" class="movie-price-details">$ ${price}</h2>
                <i id="decrement" onclick="decrement('${_id}')" class="bi bi-bag-dash-fill" style="font-size:24px"></i>
                <div id="${_id}" class="quantity" style="font-size:24px">${search === undefined ? 0 : search.item}</div>
                <i id="increment" onclick="increment('${_id}')" class="bi bi-bag-plus-fill" style="font-size:24px"></i>
            `;
        }

        return `
            <div id="product-id-${_id}" class="item">
                <div class="clickable-image">
                    <img width="250" height="400" src="${image}" style="border-radius: 35px 35px 0 0;min-height:400px" alt="image should be here">
                </div>
                <div class="details">
                    <div class="titleClass">
                        <h3 class="title-movie-details">${title}</h3>
                    </div>
                    <br>
                    <p style="text-align: center;font-size:24px">${year}</p> 
                    <p style="text-align: center;font-size:24px">${stars}</p>
                    <div class="price-quantity">
                        ${movieContent}
                    </div>
                </div>
            </div>
        `;
    }).join("")
};



// Function to check if a movie is included in the basket
let checkIfMovieIncluded = (id) => {
    if (localStorage.getItem("email")){
    
        for (let i=0;i<user.movies.length;i++){
            if (user.movies[i]._id==id){
                return false;
            } 
        }
        return true;
    }
    else return true;


    
};




let fetchMovie = (_id) => {


    $.ajax({
        type: "GET",
        url: "http://localhost:1113/MovieById", // Remove one slash here
        data: { id: _id }, // Format the data as an object
        success: function(response) {
            generateMovieModal(response);
        },
        error: function(xhr, status, error) {
            // Handle errors
        }
    });

}

let currentReviewIndex = 0;


let generateMovieModal=(movie)=>{
    let search = basket.find((item) => item.id === movie._id);
    const nextButton = `
        <button id="nextReviewsButton" class="btn btn-primary">Next</button>
    `;
    const previousButton = `
        <button id="previousReviewsButton" class="btn btn-primary" style="display: none;">Previous</button>
    `;
    const addToCartButtons = `
    <div class="row" style="display: flex; justify-content: center;width:400px">
    <h2 id="movie-price-details" class="movie-price-details" style="width:fit-content;color:whitesmoke">$ ${movie.price}</h2>
    <div class="row" style="justify-content:center">
    <button id="add-to-cart" onclick="increment('${movie._id}')" style="font-size: 16px; margin: 0 10px;border-radius:20px; padding: 5px 10px; background-color: green; color: white; border: none; cursor: pointer;width:150px;margin-bottom:5px">Add to Cart</button>
    </div>
    <div class="row" style="justify-content:center">
    <button id="remove-from-cart" onclick="decrement('${movie._id}')" style="font-size: 16px;border-radius:20px; margin: 0 10px; padding: 5px 10px; background-color: red; color: white; border: none; cursor: pointer;width:150px">Remove from cart</button>
    </div>
    </div>
`;
        const modalHtml=`
        <div class="modal fade" role="dialog" tabindex="-1" id="modal-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Write a review</h4><button class="btn-close" type="button" aria-label="Close" data-bs-dismiss="modal" data-bs-target="#modal-video-watch" data-bs-toggle="modal"></button>
                    </div>  
                    <div class="modal-body">
                        <form id="addReviewForm">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend"></div>
                            </div>
                            <div></div>
                            <div class="mb-3"><label class="form-label" for="reviewerName" style="margin: 0 0 4px 0;">Your Name:</label><input class="shadow form-control item" type="text" id="reviewerName" placeholder="Please tell us your full name" required="" minlength="3" style="border-radius: 8 px;"></div>
                            <div class="mb-3" style="border-radius: 8 px;"></div>
                            <div class="mb-3" style="box-shadow: 0px 0px;"></div>
                            <div class="mb-3 my-3"><label class="form-label" for="review" style="box-shadow: 0px 0px;">Review:</label><textarea class="shadow form-control item" id="message" placeholder="Tell us your thoughts about the movie." required="" minlength="8" maxlength="500" rows="7" style="border-style: solid;border-radius: 16px;"></textarea></div>
                            <div class="mb-3">    <button class="btn btn-success btn-lg d-block mx-auto" type="submit">Submit Form</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade sys-box-course-modal" role="dialog" tabindex="-1" id="modal-video-watch">
            <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
                <div class="modal-content" id="movieModal" style="max-width:1100px;background-color: #333333;border-radius: 25px;"> 
                    <div class="modal-header data-bs-theme=dark" style="background-color: black;border-radius: 25px;">
                        <h4 class="modal-title" style="color:white"><i class="fa fa-video-camera me-3"></i>Movie Preview</h4>
                        <div class="row" style="margin-left:140px">
                        ${addToCartButtons}
                        </div>
                        <button class="btn-close btn-close-white" type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body sys-box-course-modal">
                        <div class="dh-box-2-sides" style="display: flex;height: 100%;">
                            <div class="col-md-6 dh-box-left" style="background: var(--bs-secondary-color);height: auto;">
                                <h1 style="color: rgb(115,110,110);">${movie.title}</h1>
                                <p style="height: auto;">
                                    <span style="font-weight: normal !important; color: rgb(115, 110, 110);">
                                        ${movie.description}
                                    </span><br>
                                    <p style="font-size: 32px;">
                                        <span style="font-weight: normal !important; color: rgb(115, 110, 110);">
                                            ${movie.year}
                                        </span>
                                    </p>
                                </p>
                            </div>
                            <div class="col-md-6 dh-box-right" style="height: auto;background-color:var(--bs-secondary-color)">
                                <h1 style="color: rgb(115, 110, 110);">Actors</h1>
                                <div class="container" style="width: 95%;">
                                    <div class="row justify-content-center">
                                        ${generateActorCards(movie.actor_facets, movie.actors)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="dh-box-2-sides" style="display: flex;height: 100%;">
                            <div class="col-md-6 dh-box-left" style="background: var(--bs-secondary-color);height: auto;width: 100%;margin-top: 7px;border-radius: 20px;padding: 10px;margin-bottom: 7px;">
                                <h1 style="color: rgb(115,110,110);">Reviews</h1>
                                <div class="container py-4 py-xl-5">
                                    <div class="row gy-4 row-cols-1 row-cols-md-2 row-cols-xl-3 style="border-style: none;" style="justify-content: center;">
                                    <div class="mb-3" style="width:min-content">
                                    <div class="review-cards-container" style="display:flex;width:fit-content">
                                        <!-- Generate the first 6 review cards here -->
                                        ${generateReviewCards(movie.reviews, currentReviewIndex)}
                                    </div>
                                    ${previousButton}
                                    ${movie.reviews.length > currentReviewIndex + 6 ? nextButton : ''}
                                </div>
                                    </div>
                                </div>
                                <button class="btn btn-primary" type="button" data-bs-target="#modal-1" data-bs-toggle="modal">Write a review</button>
                            </div>
                        </div>
                          <div class="video-container" style="height: 200px;"><iframe allowfullscreen="" frameborder="0" src="${convertToEmbedUrl(movie.trailer)}" width="853" height="480" style="height: 100%;border-radius: 18px;"></iframe></div>
                    </div>
                    <div class="modal-footer" style="justify-content:center">
                    
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
    `;


    

    movieModal.innerHTML = modalHtml;
    $('#modal-video-watch').modal('show');

    $('#addToCartButton').on('click', function () {
        addToCart(movie._id);
    });

    $('#nextReviewsButton').on('click', function() {
        currentReviewIndex += 6;
        
        // Update visibility of "Previous" button
        if (currentReviewIndex > 0) {
            $('#previousReviewsButton').show();
        }
        
        // Update review cards and button visibility
        updateReviewCards(movie);
    });

    $('#previousReviewsButton').on('click', function() {
        currentReviewIndex -= 6;
        
        // Update visibility of "Next" button
        if (movie.reviews.length > currentReviewIndex + 6) {
            $('#nextReviewsButton').show();
        }
        
        // Update review cards and button visibility
        updateReviewCards(movie);
    });

    $("#addReviewForm").submit(function(event) {
        event.preventDefault();
    
        var name = $("#reviewerName").val().trim();
        var text = $("#message").val();
    
        if (name === "") {
            alert("Please enter your full name.");
            return; // Stop the function execution
        }
    
        if (text.length < 8) {
            alert("Please enter a review with at least 8 characters.");
            return; // Stop the function execution
        }
    
        var postData = {
            name: name,
            text: text,
            movieId: movie._id,
        };

        $.ajax({
            type: "POST",
            url: "http://localhost:1113/addreview",
            data: postData,
            success: function (response) {
                // Create the HTML markup for the new review card
                const newReview = {
                    name: name,
                    text: text,
                    date: new Date().toISOString()
                };
                
                movie.reviews.push(newReview);
                const updatedReviewCardsHtml = generateReviewCards(movie.reviews, currentReviewIndex);
                // Append the new review card to the existing review cards
                $('.review-cards-container').html(updatedReviewCardsHtml);

                $('#modal-1').modal('hide');
                $('#modal-video-watch').modal('show');


                // Optionally, you can reset the form inputs here
            
                return true;
            },
            error: function (xhr, status, error) {
                // Handle errors
            },
        });
    });
}


function updateReviewCards(movie) {
    const reviewCardsHtml = generateReviewCards(movie.reviews, currentReviewIndex);
    $('.review-cards-container').html(reviewCardsHtml);

    // Update visibility of "Next" and "Previous" buttons
    if (currentReviewIndex > 0) {
        $('#previousReviewsButton').show();
    } else {
        $('#previousReviewsButton').hide();
    }

    if (movie.reviews.length > currentReviewIndex + 6) {
        $('#nextReviewsButton').show();
    } else {
        $('#nextReviewsButton').hide();
    }
}



let generateReviewCards = (reviews, startIndex) => {
    let reviewCardsHtml = '';
    const endIndex = Math.min(startIndex + 6, reviews.length);

    if(reviews.length >=1){
    for (let i = startIndex; i < endIndex; i += 3) {
        reviewCardsHtml += `
            <div class="row">
        `;

        for (let j = 0; j < 3; j++) {
            const currentIndex = i + j;
            if (currentIndex < endIndex) {
                const review = reviews[currentIndex];

                // Parse the date string and format it
                const reviewDate = new Date(review.date);
                const formattedDate = `
                    <p style="margin-bottom:0!important">Date: ${reviewDate.toISOString().slice(0, 10)}</p>
                    <p>Time: ${reviewDate.toISOString().slice(11, 19)}</p>
                `;

                reviewCardsHtml += `
                    <div class="col">
                        <div class="col" style="border-radius: 20px;border-style: solid;padding-top: 8px;margin-right:15px;margin-bottom:15px;width: 360px;">
                            <div class="d-grid">
                                <!-- ... Rest of the code ... -->
                                <div class="px-3">
                                    <h4 style="margin-top: 4px;">Review writer: ${review.name}</h4>
                                    <p>${review.text}</p>
                                    ${formattedDate}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        reviewCardsHtml += `
            </div>
        `;
    }
    }
    else{
        reviewCardsHtml += `
            <div class="row">
        `;
        reviewCardsHtml += `\
        <div class="col">
        <div class="col" style="border-radius: 20px;border-style: solid;padding-top: 8px;margin-right:15px;margin-bottom:15px;width: 360px;height:150px">
        <div class="d-grid">
            <!-- ... Rest of the code ... -->
            <div class="px-3">
                <h4 style="margin-top: 4px;">There are no reviews yet.</h4>
                    </div>
                </div>
            </div>
        </div>
        `
        reviewCardsHtml += `
        </div>
         `;
    }
    return reviewCardsHtml;
}
function generateSingleReviewCard(review) {
    const reviewDate = new Date(review.date);
    const formattedDate = `
    <p style="margin-bottom:0!important">Date: ${reviewDate.toISOString().slice(0, 10)}</p>
    <p>Time: ${reviewDate.toISOString().slice(11, 19)}</p>
    `;
    return `
        <div class="col">
            <div class="col" style="border-radius: 20px;border-style: solid;padding-top: 8px;margin-right:15px;margin-bottom:15px;width: 360px;">
                <div class="d-grid">
                    <div class="px-3">
                        <h4 style="margin-top: 4px;">Review writer: ${review.name}</h4>
                        <p>${review.text}</p>
                        <p>${formattedDate}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function convertToEmbedUrl(originalUrl) {
    // Regular expressions for different YouTube URL formats
    const regexList = [
        /youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/,
        /youtu\.be\/([A-Za-z0-9_-]+)/
    ];

    let videoId = null;
    for (const regex of regexList) {
        const match = originalUrl.match(regex);
        if (match && match[1]) {
            videoId = match[1];
            break;
        }
    }

    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    console.log('https://www.youtube.com/embed/${videoId}');
    return null; // Return null if the URL doesn't contain a video ID
}


let generateActorCards = (actorFacets, actorNames) => {
    let actorCardsHtml = '';
    for (let i = 0; i < Math.min(3, actorFacets.length); i++) {
        actorCardsHtml += `
            <div class="col-sm-6 col-md-4" style="height: 196.2px;display: flex;color: var(--bs-body-color);">
                <div class="box" style="height: 95%;border-radius: 20px;width: 85%;">
                    <img src="${actorFacets[i]}" alt="Actor" style="height: 100%;border-radius: 20px;">
                    <div class="box-content" style="height: 100%;border-radius: 20px;background-color: #333333;">
                        <h5 class="text-capitalize text-center title" style="font-size: 14px;color: #ffffff;font-family: 'Source Sans Pro', sans-serif;margin-top: auto;">${actorNames[i]}</h5>
                    </div>
                </div>
            </div>
        `;
    }
    return actorCardsHtml;
}

let increment = (_id) => {
    let selecteditem = _id;
    let search = basket.find((item) => item.id === selecteditem); // Use item.id
    if (search === undefined) {
        basket.push({
            id: selecteditem,
            item: 1
        });
    } else if (search.item < 1) {
        search.item += 1;
    } else {
        alert("You can only buy one of each movie.");
        return;
    }
    update(selecteditem);
    localStorage.setItem("data", JSON.stringify(basket));
    generateShop(); // Update the shop view
    
};

let decrement = (_id) => {
    let selecteditem = _id;
    let search = basket.find((item) => item.id === selecteditem); // Use item.id
    if (search === undefined) return;
    if (search.item === 0) return;
    else {
        search.item -= 1;
    }
    update(selecteditem);
    basket = basket.filter((x) => x.item !== 0);
    localStorage.setItem("data", JSON.stringify(basket));
    generateShop(); // Update the shop view

};

let update = (id) => {
    let search = basket.find((item) => item.id === id); // Use item.id
    document.getElementById(id).innerHTML = search.item;
    calculation();
};

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

let addToCart = (movieId) => {
    let search = basket.find((item) => item.id === movieId);

    if (search === undefined) {
        basket.push({
            id: movieId,
            item: 1
        });
    } else {
        search.item += 1;
    }

    update(movieId);
    localStorage.setItem("data", JSON.stringify(basket));
    generateShop(); // Update the shop view
};

async function init() {
    await fetchDataAsync();
    generateShop();
    calculation();
    hideLoader(); // Hide the loader once movies are loaded

}
function hideLoader() {
    const loader = document.getElementById('loader');

    loader.style.display = 'none';
}

init();



document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("loginModal").style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target === document.getElementById("loginModal")) {
        document.getElementById("loginModal").style.display = "none";
    }
});


// From here on , is the part of SEARCH
document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('search-bar');
    const searchIcon = document.getElementById('search-icon');
    const searchResultsDropdown = document.getElementById('search-results-dropdown');

    searchBar.addEventListener('input', function () {
        const query = this.value.trim();
        getMoviesByQuery(query);
    });

    searchIcon.addEventListener('click', function () {
        const query = searchBar.value.trim();
        getMoviesByQuery(query);
    });

    function populateSearchResultsDropdown(movies) {
        searchResultsDropdown.innerHTML = ''; // Clear previous search results

        movies.forEach(function (movie) {
            const { _id, title, image } = movie;

            const dropdownItem = document.createElement('a');
            dropdownItem.classList.add('dropdown-item');
            dropdownItem.innerHTML = `
                <div class="clickable-image" data-movie-id="${_id}">
                    <img width="55" height="45" src="${image}" alt="Movie Image">
                    <span>${title}</span>
            </a>
            `;

            searchResultsDropdown.appendChild(dropdownItem);
        });

        searchResultsDropdown.style.display = 'block';
    }

    function getMoviesByQuery(query) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:1113/Movies',
            success: function (movies) {
                const filteredMovies = movies.filter(function (movie) {
                    return movie.title.toLowerCase().includes(query.toLowerCase());
                });
                populateSearchResultsDropdown(filteredMovies);
            },
            error: function (error) {
                console.error('Error fetching movies: ', error);
            }
        });
    }

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.dropdown')) {
            searchResultsDropdown.style.display = 'none';
        }
    });


    const createCurrency = async () => {
        let usdToILS = 0;
        await $.ajax({
          url: `https://api.apilayer.com/exchangerates_data/latest?symbols=ils&base=usd`,
          type: "GET",
          secure: true,
          cors: true,
          headers: {
            "apikey": "6PlRg2D3qY6wF9YlAr1GqwWtGmpoAdD9"
          },
        }).done((res) => usdToILS = res.rates.ILS);
      
        document.querySelector('#currency').innerHTML =
          `<currency>
        <h5 style ="margin-top: 10px; color: green;">Exchange rate: 1 USD = ${1 * usdToILS} ILS</i></h5>
      </currency>`
      }
      createCurrency();
    
    });