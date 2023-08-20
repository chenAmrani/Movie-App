let currentPage = 1;
const ordersPerPage = 6;
let user; // Store user data globally

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
        const movieNames = order.movies.map(movie => `• ${movie.title}`).join('<br>');
        const orderHTML = `
            <div class="accordion-item" style="background-color: #f0f8ff00;>
                <h2 class="accordion-header">
                    <button class="btn accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#content-accordion-${i + 1}"style="height: 58px;border-radius: 25px 25px 0 0;background-color:#ffffff7d">
                        Order number ${i + startIdx + 1}
                    </button>
                </h2>
                <div id="content-accordion-${i + 1}" class="accordion-collapse collapse" data-bs-parent="#faqlist" style="border-bottom-left-radius: 25px;border-bottom-right-radius: 25px;background-color:#ffffff7d">
                    <p class="movieName">${movieNames}</p>
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
                    <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#updateMovieModal" style="width: 150px;margin-bottom:20px">Update Movie</button>
                    <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#deleteMovieModal" style="width: 150px;">Delete movie</button>
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
        },
        error: function (error) {
            $('#responseModalLabel').text("Oops"); 
            $('#responseModalBody').text("Something went wrong");
            $('#responseModal').modal('show');
        }
    });

    
}