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
