
let currentPage = 1;
const ordersPerPage = 6;
let user; // Store user data globally

function initChat(){
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
}

function fetchUserDataOnLoad() {
    const email = localStorage.getItem('email');
    
    $.ajax({
        url: "http://localhost:1113/email",
        type: "GET",
        data: { email: email },
        success: function(response) {
            document.getElementById('userName').textContent = response.name;
            document.getElementById('userEmail').textContent = response.email;
            document.getElementById('userAge').textContent = response.age;
            
            user = response; // Store user data
            const isAdmin = user.isAdmin;
            const adminBtn = document.getElementById('adminBtn');
            if (isAdmin) {
                adminBtn.style.display = 'block';
            } else {
                adminBtn.style.display = 'none';
            }
            const orders = user.orders;
            const noOrdersMessage = `<p class="text-center" style="color: white;">You didn't order anything yet</p>`;
            
            if (orders.length === 0) {
                const faqlist = document.getElementById("faqlist");
                faqlist.innerHTML = noOrdersMessage;
            } else {
                printOrders(orders);
            }
            
            const movies = user.movies;
            const movieContainer = document.getElementById('movieContainer');
            const noMoviesMessage = document.getElementById('noMoviesMessage');
            const prevButton = document.querySelector('.prev');
            const nextButton = document.querySelector('.next');
            
            if (movies.length === 0) {
                movieContainer.style.display = 'none';
                noMoviesMessage.style.display = 'block';
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
            } else {
                movieContainer.style.display = 'block';
                noMoviesMessage.style.display = 'none';
                prevButton.style.display = 'block';
                nextButton.style.display = 'block';
            }

            for (let i = 0; i < movies.length; i++) {
                const movie = movies[i];
                const movieHTML = `
                    <div class="mySlides">
                        <div class="numbertext"><span>${i + 1}/${movies.length}</span></div>
                        <img src="${movie.image}" style="height: 400px;width: 230px;">
                    </div>`;
                movieContainer.innerHTML += movieHTML;
            }
            
            showSlides(slideIndex);
            
        },
        error: function(xhr, status, error) {
            console.error("AJAX Error:", status, error);
        },
    });
}
let calculatePrice=(movies)=>{
    let price=0;
    for (let index = 0; index < movies.length; index++) {
        price+=movies[index].price;
    }
    return price;
}

function printOrders(orders) {
    const faqlist = document.getElementById("faqlist");

    const startIdx = (currentPage - 1) * ordersPerPage;
    const endIdx = startIdx + ordersPerPage;
    const ordersToDisplay = orders.slice(startIdx, endIdx);
    

    faqlist.innerHTML = '';

    if (ordersToDisplay.length === 0) {
        const noOrdersMessage = `<p class="text-center" style="color: white;">You didn't order anything yet</p>`;
        faqlist.innerHTML = noOrdersMessage;
    } else {
    for (let i = 0; i < ordersToDisplay.length; i++) {
        const order = ordersToDisplay[i];
        let movieArr=order.movies;
        let price= calculatePrice(movieArr);
        const inputDate = order.purchaseDate;
        const parsedDate = new Date(inputDate);
        const formattedDate = parsedDate.toISOString().split('T')[0];
        const formattedTime = parsedDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
        const movieNames = order.movies.map(movie => `• ${movie.title}`).join('<br>');
        const orderHTML = `
            <div class="accordion-item" style="background-color: #f0f8ff00;>
                <h2 class="accordion-header">
                    <button class="btn accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#content-accordion-${i + 1}"style="height: 58px;border-radius: 25px 25px 0 0;background-color:#ffffff7d">
                        Order number ${i + startIdx + 1}
                    </button>
                </h2>
                <div id="content-accordion-${i + 1}" class="accordion-collapse collapse" data-bs-parent="#faqlist" style="border-bottom-left-radius: 25px;border-bottom-right-radius: 25px;background-color:#ffffff7d;text-align:center">
                    <p class="orderDate"> Date: ${formattedDate}<br>
                    Time: ${formattedTime}
                    </p>
                    <p class="movieName">${movieNames}</p>
                    <p class="orderPrice">Total order price: ${price}$</p>
                </div>
            </div>`;
        faqlist.innerHTML += orderHTML;
    }

        const paginationButtons = `
        <div class="buttonsRow">
            ${currentPage > 1 ? '<button class="btn btn-secondary" onclick="goToPage(currentPage - 1)">Back</button>' : ''}
            ${endIdx < orders.length ? '<button class="btn btn-secondary" onclick="goToPage(currentPage + 1)">Next</button>' : ''}
        </div>`;
    faqlist.innerHTML += paginationButtons;
}


}
function goToPage(page) {
    currentPage = page;
    printOrders(user.orders);
}

window.onload = async function() {
    await fetchUserDataOnLoad();
};

var slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

$("#adminBtn").click(function() {
    getMoviesForAdminPanel();
});

$("#deleteModalCloseBtn").click(function() {
    getMoviesForAdminPanel();
});

let adminPanel = document.getElementById('eachMovie');

let moviesData; // Store the movies data globally
let currentPageAdmin = 1;
const moviesPerPageAdmin = 5;

function getMoviesForAdminPanel() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:1113/Movies',
        success: function (response) {
            moviesData = response;
            printAdminPanelModal();
        },
        error: function (error) {
            console.error("AJAX Error:", error);
        }
    });
}


function printAdminPanelModal() {
    const adminPanel = document.getElementById('eachMovie');
    const startIdx = (currentPageAdmin - 1) * moviesPerPageAdmin;
    const endIdx = startIdx + moviesPerPageAdmin;
    const moviesToDisplay = moviesData.slice(startIdx, endIdx);

    let tableHtml = `
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col" style="text-align:center">Movie information</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let i = 0; i < moviesToDisplay.length; i++) {
        const movie = moviesToDisplay[i];
        tableHtml += `
            <tr class="movie-row" height="120">
                <th class="movie-cell" scope="row">${i + 1 + startIdx}</th>
                <td class="movie-cell" style="width:450px">
                    <div class="row">
                        <div class="col">
                            <img width="85" height="120" src="${movie.image}" style="border-radius: 10px" alt="image should be here">       
                        </div>
                        <div class="col" style="margin-top: 30px;margin-right: 80px;">
                            ${movie.title}
                        </div>
                    </div>
                </td>
                <td class="movie-cell">
                    <button type="button" class="btn btn-secondary" onclick="updateMovieModal('${i+(5*(currentPageAdmin-1))}')" style="width: 150px;margin-bottom:20px">Update Movie</button>
                    <button type="button" class="btn btn-secondary" style="width: 150px;" onclick="deleteMovie('${movie._id}')">Delete movie</button>
                </td>
            </tr>
        `;
    }

    tableHtml += `</tbody></table>`;
    adminPanel.innerHTML = tableHtml;
    $('#adminPanelModal').modal('show');
}

function changePage(change) {
    currentPageAdmin += change;
    if (currentPageAdmin < 1) {
        currentPageAdmin = 1;
    } else if (currentPageAdmin > Math.ceil(moviesData.length / moviesPerPageAdmin)) {
        currentPageAdmin = Math.ceil(moviesData.length / moviesPerPageAdmin);
    }
    printAdminPanelModal();
}

$("#adminBtn").click(function() {
    getMoviesForAdminPanel();
});

function closeAddMovieModal() {
    $('#addMovieModal').modal('hide'); // Close the addMovieModal
    $('#adminPanelModal').modal('show'); // Show the adminPanelModal
}
function closeUpdateMovieModal() {
    $('#updateMovieModal').modal('hide'); // Close the addMovieModal
    $('#adminPanelModal').modal('show'); // Show the adminPanelModal
}

function deleteMovie(movieId) {
    userId=user._id;
    const postData= {userId,movieId};

    $.ajax({
        type: 'DELETE',
        url: `http://localhost:1113/delete`,
        data: postData,
        success: function (response) {
            // Refresh the admin panel after deletion
            $('#responseModal1Label').text("Movie Deleted"); 
            $('#responseModal1Body').text("You have deleted the movie successfuly");
            $('#adminPanelModal').modal('hide');
            $('#responseModal1').modal('show');
        },
        error: function (error) {
            $('#responseModal1Label').text("Oops"); 
            $('#responseModal1Body1').text("Something went wrong");
            $('#responseModal1').modal('show');
        }
    });
}

let createNewMovie=()=>{
    const userId= user._id;
    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const rating = document.getElementById("rating").value;
    const actorName1 = document.getElementById("actorName1").value;
    const actorName2 = document.getElementById("actorName2").value;
    const actorName3 = document.getElementById("actorName3").value;
    const actors=[actorName1,actorName2,actorName3];
    const actorURL1 = document.getElementById("actorURL1").value;
    const actorURL2 = document.getElementById("actorURL2").value;
    const actorURL3 = document.getElementById("actorURL3").value;
    const actor_facets = [actorURL1,actorURL2,actorURL3];
    const price = document.getElementById("price").value;
    const genre = document.getElementById("genre").value;
    const trailer = document.getElementById("trailer").value;
    const image = document.getElementById("image").value;
    const description = document.getElementById("description").value;
    const validate= {userId,title, year, rating, actorName1,actorName2,actorURL1,actorURL2,actorURL3,actorName3,price, genre, trailer,image, description}

    function isEmpty(value) {
        return value === undefined || value === null || value === '';
      }
      
      // Check if any property is empty
      for (const property in validate) {
        if (isEmpty(validate[property])) {
            const errorMessageDiv = document.getElementById("errorMessage");
            $('#responseModalLabel').text("Oops"); 
            $('#responseModalBody').text(property+" is missing");
            $('#responseModal').modal('show');
            return;
        }
    }
    const postData= {userId,title, year, rating, actors,actor_facets,price, genre, trailer,image, description};
    

    $.ajax({
        type: 'POST',
        url: 'http://localhost:1113/add',
        data: postData,

        success: function (response) {
            $('#responseModalLabel').text("Movie added"); 
            $('#responseModalBody').text("You have added the movie successfuly");
            $('#responseModal').modal('show');
            $('#addMovieModal').modal('hide');
            document.getElementById("title").value = "";
            document.getElementById("year").value = "";
            document.getElementById("rating").value = "";
            document.getElementById("actorName1").value = "";
            document.getElementById("actorName2").value = "";
            document.getElementById("actorName3").value = "";
            document.getElementById("actorURL1").value = "";
            document.getElementById("actorURL2").value = "";
            document.getElementById("actorURL3").value = "";
            document.getElementById("price").value = "";
            document.getElementById("genre").value = "";
            document.getElementById("trailer").value = "";
            document.getElementById("image").value = "";
            document.getElementById("description").value = "";
        },
        error: function (error) {
            $('#responseModalLabel').text("Oops"); 
            $('#responseModalBody').text("Something went wrong");
            $('#responseModal').modal('show');
        }
    });

}

let updateModal = document.getElementById('updateMovieModal');

let updateMovieModal=(movieNumber)=>{
    $('#adminPanelModal').modal('hide');
    let movie= moviesData[movieNumber];
    let updateModalHtml=`
    <div class="modal-dialog" role="document" style="display: grid; justify-content: center;">
              <div class="modal-content" style="width: 650px;">
                <div class="modal-header">
                  <h5 class="modal-title" id="updateMovieModal">Update existing movie</h5>
                  <button type="button" class="close" onclick="closeUpdateMovieModal()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body" style="display: grid;justify-content: center;border-radius: 25px;">
                    <div id="errorMessage" class="alert alert-danger" style="display: none;"></div>
                    <form id="updateMovie">
                        <div class="row" style="margin-bottom: 5px;">
                            <input type="text" id="updatetitle" placeholder="Movie name" value="${movie.title}" name="updatetitle" required style="width: 460px;text-align: center;border-radius: 15px;height: 50px">
                        </div>
                        <div class="row" style="margin-bottom: 5px;">
                                <input type="number" id="updateyear" placeholder="Year" value="${movie.year}" name="updateyear" required style="width: 225px;text-align: center;margin-right: 10px;border-radius: 15px;height: 50px;"><br>
                                <input type="number" aria-valuemax="5" value="${movie.rating}" aria-valuemin="1" id="updaterating" placeholder="Rating" name="updaterating" required style="width: 225px;text-align: center;border-radius: 15px"><br>
                        </div>
                        <div class="row" style="margin-bottom: 5px;">
                            <input type="text" id="updateactorName1" placeholder="Actor 1 name" value="${movie.actors[0]}" name="updateactorName1" required style="width: 150px;text-align: center;margin-right: 4.5px;border-radius: 15px;height: 50px"><br>
                            <input type="text" id="updateactorName2" placeholder="Actor 2 name" value="${movie.actors[1]}" name="updateactorName2" required style="width: 150px;text-align: center;margin-right: 4.5px;border-radius: 15px"><br>
                            <input type="text" id="updateactorName3" placeholder="Actor 3 name" value="${movie.actors[2]}" name="updateactorName3" required style="width: 150px;text-align: center;margin-right: 4.5px;border-radius: 15px"><br>
                        </div>
                        <div class="row" style="margin-bottom: 5px;">
                            <input type="text" id="updateactorURL1" placeholder="Actor 1 image url" value="${movie.actor_facets[0]}" name="updateactorURL1" required style="width: 150px;text-align: center;margin-right: 4.5px;border-radius: 15px;height: 50px"><br>
                            <input type="text" id="updateactorURL2" placeholder="Actor 2 image url" value="${movie.actor_facets[1]}" name="updateactorURL2" required style="width: 150px;text-align: center;margin-right: 4.5px;border-radius: 15px"><br>
                            <input type="text" id="updateactorURL3" placeholder="Actor 3 image url" value="${movie.actor_facets[2]}" name="updateactorURL3" required style="width: 150px;text-align: center;margin-right: 4.5px;border-radius: 15px"><br>
                        </div>
                        <div class="row" style="margin-bottom: 5px;">
                            <input type="number" id="updateprice" placeholder="Movie price $" value="${movie.price}" name="updateprice" required style="width: 225px;text-align: center;margin-right: 10px;border-radius: 15px;height: 50px"><br>
                            <select name="genre" id="updategenre" aria-placeholder="Select genre" value="${movie.genre[0]}" style="width: 225px;text-align: center;border-radius: 15px;">
                                <option value="#">Choose genre</option>
                                <option value="Action">Action</option>
                                <option value="Comedy">Comedy</option>
                                <option value="Horror">Horror</option>
                                <option value="Science-fiction">Science fiction</option>
                                <option value="Drama">Drama</option>
                                <option value="sports">Sports</option>
                                <option value="Fantasy">Fantasy</option>
                            </select>
                        </div>
                        <div class="row" style="margin-bottom: 5px;">
                            <input type="text" id="updateimage" placeholder="Movie Image URL" value="${movie.image}" name="updateimage" required style="width: 460px;text-align: center;border-radius: 15px;height: 50px">
                        </div>
                        <div class="row" style="margin-bottom: 5px;">
                            <input type="text" id="updatetrailer" placeholder="Trailer URL" value="${movie.trailer}" name="updatetrailer" required style="width: 460px;text-align: center;border-radius: 15px;height: 50px">
                        </div>
                        <div class="row" style="margin-bottom: 5px;">
                            <input type="text" id="updatedescription" placeholder="Enter description about the movie" value="${movie.description}" name="updatedescription" required style="width: 460px;text-align: center;height: 150px;border-radius: 15px;"><br>
                        </div>
                        <div class="row" style="margin-bottom: 5px;">
                            <button type="button" id="updateSubmitButton" style="border-radius: 15px;">Update movie</button>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                </div>
              </div>
            </div>
            `
            updateModal.innerHTML=updateModalHtml;
            $('#updateMovieModal').modal('show');

            $('#updateSubmitButton').on('click', function() {

            const userId= user._id;
            const movieId=movie._id;
            const title = document.getElementById("updatetitle").value;
            const year = document.getElementById("updateyear").value;
            const rating = document.getElementById("updaterating").value;
            const actorName1 = document.getElementById("updateactorName1").value;
            const actorName2 = document.getElementById("updateactorName2").value;
            const actorName3 = document.getElementById("updateactorName3").value;
            const actors=[actorName1,actorName2,actorName3];
            const actorURL1 = document.getElementById("updateactorURL1").value;
            const actorURL2 = document.getElementById("updateactorURL2").value;
            const actorURL3 = document.getElementById("updateactorURL3").value;
            const actor_facets = [actorURL1,actorURL2,actorURL3];
            const price = document.getElementById("updateprice").value;
            const genre = document.getElementById("updategenre").value;
            const trailer = document.getElementById("updatetrailer").value;
            const image = document.getElementById("updateimage").value;
            const description = document.getElementById("updatedescription").value;
            const validate= {userId,movieId,title, year, rating, actorName1,actorName2,actorURL1,actorURL2,actorURL3,actorName3,price, genre, trailer,image, description}

            function isEmpty(value) {
                return value === undefined || value === null || value === '';
            }
            
            // Check if any property is empty
            for (const property in validate) {
                if (isEmpty(validate[property])) {
                    const errorMessageDiv = document.getElementById("errorMessage");
                    $('#responseModalLabel').text("Oops"); 
                    $('#responseModalBody').text(property+" is missing");
                    $('#responseModal').modal('show');
                    return;
                }
            }
            const postData= {userId,movieId,title, year, rating, actors,actor_facets,price, genre, trailer,image, description};
            

            $.ajax({
                type: 'POST',
                url: 'http://localhost:1113/update',
                data: postData,

                success: function (response) {
                    $('#responseModal1Label').text("Movie updates"); 
                    $('#responseModal1Body').text("You have updated the movie successfuly");
                    $('#updateMovieModal').modal('hide');
                    $('#responseModal1').modal('show');
                    

                },
                error: function (error) {
                    $('#responseModal1Label').text("Oops"); 
                    $('#responseModal1Body').text("Something went wrong");
                    $('#responseModal1').modal('show');
                }
            });
        })


}

let UserUpdateModal = document.getElementById('updateUserModal');

let updateUserModal=()=>{
    let updateUserModalHtml=`
    <div class="modal-dialog" role="document" style="display: grid; justify-content: center;">
              <div class="modal-content" style="width: 650px;">
                <div class="modal-header">
                  <h5 class="modal-title" id="updateMovieModal">Update existing movie</h5>
                  <button type="button" class="close" onclick="closeUpdateMovieModal()" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body" style="display: grid;justify-content: center;border-radius: 25px;">
                    <div id="errorMessage" class="alert alert-danger" style="display: none;"></div>
                    <form id="updateMovie" style="width:300px">
                        <div class="row" style="margin-bottom: 5px;">
                            <input type="text" id="updatename" placeholder="Enter name" value="${user.name}" name="updatename" required style="width: 90%;text-align: center;border-radius: 15px;height: 50px">
                        </div>
                        <div class="row" style="margin-bottom: 5px;">
                            <input type="text" id="updateemail" placeholder="Enter email" value="${user.email}" name="updateemail" required style="width: 90%;text-align: center;border-radius: 15px;height: 50px">
                        </div>
                        <div class="row" style="margin-bottom: 5px;">
                            <input type="number" id="updateage" placeholder="Enter age" value="${user.age}" name="updateage" required style="width: 90%;text-align: center;border-radius: 15px;height: 50px">
                        </div>
                        <div class="row" style="margin-bottom: 15px;display:flex;width:95%;justify-content:center">
                            <button type="button" id="updateUserSubmitButton" style="border-radius: 15px">Update user</button>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                </div>
              </div>
            </div>
            `
            UserUpdateModal.innerHTML=updateUserModalHtml;
            $('#updateUserModal').modal('show');

            $('#updateUserSubmitButton').on('click', function() {

            const _id= user._id;
            const name=document.getElementById("updatename").value;
            const email = document.getElementById("updateemail").value;
            const age = document.getElementById("updateage").value;

            
            const validate= {_id,name,email, age}

            function isEmpty(value) {
                return value === undefined || value === null || value === '';
            }
            
            // Check if any property is empty
            for (const property in validate) {
                if (isEmpty(validate[property])) {
                    const errorMessageDiv = document.getElementById("errorMessage");
                    $('#responseModalLabel').text("Oops"); 
                    $('#responseModalBody').text(property+" is missing");
                    $('#responseModal').modal('show');
                    return;
                }
            }

            const postData= {_id,name,email, age};
            console.log(postData);
            

            $.ajax({
                type: 'POST',
                url: 'http://localhost:1113/updateUser',
                data: postData,

                success: function (response) {
                    $('#responseModal1Label').text("User updated"); 
                    $('#responseModal1Body').text("You have updated your user successfuly");
                    $('#updateUserModal').modal('hide');
                    $('#responseModal1').modal('show');
                    setTimeout(function() {
                        location.reload();
                    }, 2000);                    
                    

                },
                error: function (error) {
                    $('#responseModal1Label').text("Oops"); 
                    $('#responseModal1Body').text("Something went wrong");
                    $('#responseModal1').modal('show');
                }
            });
        })

}

initChat();

function fetchTotalNumberOfPurchase() {
    $(document).ready(function () {
        $.ajax({
          url: "http://localhost:1113/totalNumberOfPurchasesPerMonth",
          dataType: "json",
          success: function (data) {
            drawChart(data.months, data.totals); //actually drawing it 
          },
          error: function (xhr, status, error) {
            console.error(error);
          },
        });
      });
    }
    
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    
    function drawChart(months, totals) {
      var margin = { top: 20, right: 20, bottom: 30, left: 50 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    
      var x = d3.scaleBand().range([0, width]).padding(0.1);
    
      var y = d3.scaleLinear().range([height, 0]);
    
      var xAxis = d3.axisBottom(x);
    
      var yAxis = d3.axisLeft(y);
    
      var svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
     
        
      
    
      var data = months.map(function (month, index) {
        return {
          month: month,
          total: totals[index],
        };
        
      });
    
      x.domain(
        data.map(function (d) {
          return d.month;
        })
      );
      y.domain([
        0,
        d3.max(data, function (d) {
          return d.total;
        }),
      ]);
    
    
      svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.month);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y(d.total);
      })
      .attr("height", function (d) {
        return height - y(d.total);
      })
      .attr("fill", function (d) {
        return color(d.month);
      });
    
    
    
      svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
      svg.append("g").attr("class", "y axis").call(yAxis);
    }

function fetchMostGenrePerMonth() {
    $.ajax({
      url: "http://localhost:1113/genreChart",
      dataType: "json",
      success: function (data) {
        if (data) {
          const genres = data.map((item) => item.genre);
          const totalPurchases = data.map((item) => item.totalPurchases);
            drawPieChart(genres, totalPurchases);
        } else {
          console.error("Invalid or empty response from the server");
        }
      },
    });
  }
  
  
  function drawPieChart(genres, totalPurchases) {
    console.log(genres, totalPurchases);
    // Define the dimensions of the pie chart
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;
  
    // Create an SVG element for the pie chart
    const svg = d3
      .select("#secondChart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);
  
    // Create a color scale for the pie chart
    const pieColor = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Define the pie function
    const pie = d3.pie().value((d) => d);
  
    // Create the pie slices
    const arcs = pie(totalPurchases);
  
    // Draw the pie chart
    svg
      .selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
      .attr("fill", (d, i) => pieColor(i));
  
    // Add labels
    svg
      .selectAll("text")
      .data(arcs)
      .enter()
      .append("text")
      .attr("transform", (d) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        const x = Math.sin(angle) * (radius * 0.7); 
        const y = -Math.cos(angle) * (radius * 0.7);
        return `translate(${x}, ${y})`;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text((d, i) => `${genres[i]} (${totalPurchases[i]})`);
  
    // Add title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", 0)
      .attr("y", -height / 2 - 10)
      .attr("text-anchor", "middle")
      .text("Most Bought Genre per Month");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const showStatsButton = document.getElementById("showStatsButton");
    showStatsButton.addEventListener("click", showStats);
});
    
function showStats() {
    // Clear previous charts by emptying the chart containers
    d3.select("#chart").selectAll("*").remove();
    d3.select("#secondChart").selectAll("*").remove();
  
    // Append chart titles
    d3.select("#chart")
      .append("h2")
      .text("Amount of purchases per month")
      .style("text-align", "center");
  
    d3.select("#secondChart")
      .append("h2")
      .text("Purchases by genres")
      .style("text-align", "center");
  
    fetchTotalNumberOfPurchase(); // Fetch and draw the first chart
    fetchMostGenrePerMonth(); // Fetch and draw the second chart
  }
    $("#showOrdersButton").click(function () {
        $('#adminPanelModal').modal('hide');
        fetchOrdersForAdmin();
    });
    $("#statisticsModalCloseBtn, #statisticsModalClose1Btn, #ordersModalClose1Btn, #ordersModalCloseBtn,#usersModalClose1Btn, #usersModalCloseBtn").click(function () {
        $('#adminPanelModal').modal('show');
    });
    $("#orderResponseCloseButton, #orderResponseClose1Button").click(function () {
        fetchOrdersForAdmin();
    });
    $("#showUsersButton").click(function () {
        $('#adminPanelModal').modal('hide');
        fetchUsersForAdmin();
    });
    
    $("#userResponseCloseButton, #userResponseClose1Button").click(function () {
        fetchUsersForAdmin();
    });
    $("#addUserBtn").click(function () {
        $('#usersModal').modal('hide');
        $('#addUserModal').modal('show');
    });
    $("#addUserModalCloseButton, #addUserModalClose1Button").click(function () {
        $('#addUserModal').modal('hide');
        $('#usersModal').modal('show');
    });

    $(document).ready(function() {
        $('#createUserButton').click(function() {
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const age = document.getElementById("age").value;
            const isAdmin = document.getElementById("isAdminCheckBox").checked;
    
            const postData = { name, email, password, age, isAdmin };
    
            // Check for empty fields
            const emptyFields = [];
            if (!name) emptyFields.push("Name");
            if (!email) emptyFields.push("Email");
            if (!password) emptyFields.push("Password");
            if (!age) emptyFields.push("Age");
    
            if (emptyFields.length > 0) {
                const errorMessage = "Please fill in the following fields: " + emptyFields.join(", ");
                $('#errorMessage1').text(errorMessage).show();
                return;
            }
    
            // If no empty fields, proceed with AJAX request
            $.ajax({
                url: "http://localhost:1113/register",
                type: "POST",
                data: postData,
                success: function(response) {
                    $('#userResponseModalTitle').text("Success");
                    $('#userResponseModalBody').text("User " + name + " has been created");
                    $('#addUserModal').modal('hide');
                    $('#userResponseModal').modal('show');
                },
                error: function(xhr, status, error) {
                    const errorMessage = xhr.responseJSON.error;
                    $('#errorMessage1').text(errorMessage).show();
                },
            });
        });
    });


    


  let fetchOrdersForAdmin=()=>{
    $.ajax({
        url: "http://localhost:1113/getAllOrders",
        type: "GET",
        success: function(response) {
            let allOrders=response;
            printOrdersToModal(allOrders);
        },
        error: function(xhr, status, error) {
           
        },
    });
  }

  let fetchUsersForAdmin=()=>{
    $.ajax({
        url: "http://localhost:1113/users",
        type: "GET",
        success: function(response) {
            let allUsers=response;
            printUsersToModal(allUsers);
        },
        error: function(xhr, status, error) {
           
        },
    });
  }
  let printUsersToModal=(allUsers)=>{
    console.log(allUsers);
    userList= document.getElementById('userItems');
    userList.innerHTML=``;
    for (let i = 0; i < allUsers.length; i++) {
        let userItem=`
        <div class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100" style="justify-content:center">
            <h4 class="mb-1 display-6">${allUsers[i].name}</h5></div>
        <div class="d-flex w-100 justify-content-between">
            <small>${allUsers[i].email}</small>
            <small>${allUsers[i].isAdmin?"Admin":"Not Admin"}</small>
        </div>
        <div class="usersBoughtMovies" id="usersBoughtMovies" style="margin-bottom:10px;margin-top:5px;min-height:70px;height: 100px; overflow-y: auto;">
            ${showUsersMovies(allUsers[i].movies)}
        </div>
        <div class="row">
            <div class="col-6">
                Total purchases: ${allUsers[i].orders.length}
            </div>
             <div class="col-6" style="justify-content:end;display:flex;">
                ${adminActions(allUsers[i])}
                <button type="button" onclick="deleteUser('${allUsers[i]._id}')" class="btn btn-danger"><i class="bi bi-trash3"></i></button>
                </div>
        </div>
        </div>
        </div>
        `
        userList.innerHTML+=userItem;
    }

    $('#usersModal').modal('show');
  }
  let adminActions=(userToChange)=>{
    if (userToChange.isAdmin){
        return `<button type="button" onclick="removeAdmin('${userToChange._id}')" class="btn btn-primary" style="margin-right:2px">Remove Admin</button>`
    }
    else{
        return `<button type="button" onclick="makeAdmin('${userToChange._id}')" class="btn btn-primary" style="margin-right:2px">Make Admin</button>`
    }
  }
  let makeAdmin=(userID)=>{
    console.log(userID);
    $.ajax({
        url: "http://localhost:1113/updateUser",
        type: "POST",
        data: { _id: userID ,isAdmin: true},
        success: function(response) {
            $('#userResponseModalTitle').text("Success");
            $('#userResponseModalBody').text(response.name+" is now Admin"); 
            $('#usersModal').modal('hide');
            $('#userResponseModal').modal('show');
        },
        error: function(xhr, status, error) {

        },
    });
  }
  let removeAdmin=(userID)=>{
    console.log(userID);
    $.ajax({
        url: "http://localhost:1113/updateUser",
        type: "POST",
        data: { _id: userID ,isAdmin: false},
        success: function(response) {
            $('#userResponseModalTitle').text("Success");
            $('#userResponseModalBody').text(response.name+" is now not an Admin"); 
            $('#usersModal').modal('hide');
            $('#userResponseModal').modal('show');
        },
        error: function(xhr, status, error) {

        },
    });
  }


  let deleteUser=(_id)=>{
    $.ajax({
        url: "http://localhost:1113/deleteUser",
        type: "POST",
        data: { _id: _id },
        success: function(response) {
            $('#userResponseModalTitle').text("User Deleted"); 
            $('#userResponseModalBody').text("User has been deleted"); 
            $('#usersModal').modal('hide');
            $('#userResponseModal').modal('show');
        },
        error: function(xhr, status, error) {

        },
    });
  }

  let showUsersMovies=(usersMovies)=>{
    if (usersMovies.length>0){
    return `Movies: ${usersMovies.map(item => `<div>• ${item.title}</div>`).join('')}`
    }
    else return `User has no movies`;
  }

  let printOrdersToModal=(allOrders)=>{
    orderList= document.getElementById('Orderitems');
    orderList.innerHTML=``;
    if  (allOrders.length>0){
    for (let i = 0; i < allOrders.length; i++) {
        console.log(allOrders[i].user);
        let totalprice=0;
        for(let j=0;j<allOrders[i].movies.length;j++){
            totalprice+=allOrders[i].movies[j].price
        }
        const inputDate = allOrders[i].purchaseDate;
        const parsedDate = new Date(inputDate);
        const formattedDate = parsedDate.toISOString().split('T')[0];
        const order=`
        <div class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">Order ${i+1}</h5>
            <small>${formattedDate}</small>
        </div>
        <div class="boughtMovies" id="boughtMovies" style="margin-bottom:10px;min-height:70px">
            • ${allOrders[i].movies.map(item => item.title)}
        </div>
        <div class="row">
            <div class="col-6">
                Total Price: ${totalprice}$ <br>
                User: ${allOrders[i].user.name}
            </div>
             <div class="col-6" style="justify-content:end;display:flex;">
                <button type="button" onclick="deleteOrder('${allOrders[i]._id}')" class="btn btn-danger"><i class="bi bi-trash3"></i></button>
                </div>
        </div>
        </div>
        `
        orderList.innerHTML+=order;
    }
    }
    else{
        orderList.innerHTML+=`There are no orders yet`
    }

    $('#ordersModal').modal('show');
  }

  let deleteOrder=(_id)=>{
    $.ajax({
        url: "http://localhost:1113/deleteOrderById",
        type: "POST",
        data: { _id: _id },
        success: function(response) {
            $('#orderResponseModalTitle').text("Order Deleted"); 
            $('#orderResponseModalBody').text("Order has been deleted"); 
            $('#ordersModal').modal('hide');
            $('#orderResponseModal').modal('show');
        },
        error: function(xhr, status, error) {

        },
    });
  }