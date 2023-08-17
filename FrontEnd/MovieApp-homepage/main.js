let shop = document.getElementById('shop');
let movieModal = document.getElementById('movieModal');

let basket = JSON.parse(localStorage.getItem("data")) || [];

$(document).ready(function() {
    var userEmail = localStorage.getItem("email");
    if (userEmail) {
        $("#loginActionButton").hide();
        $("#userProfileButton").show();
        $("#logoutButton").show();
    } else {
        $("#loginActionButton").show();
        $("#userProfileButton").hide();
        $("#logoutButton").hide();
    }

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
            error: function(xhr, status, error) {
                try {
                    var errorResponse = JSON.parse(xhr.responseText);
                    var errorMessage = errorResponse.error;
                    $('#responseModalBody').text(errorMessage);
                    $('#responseModal').modal('show');
                } catch (e) {}
            }
        });
    });

    $("#logoutButton").click(function() {
        localStorage.removeItem("email");
        $("#loginActionButton").show();
        $("#userProfileButton").hide();
        $("#logoutButton").hide();
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
    // Prevent modal closing when clicking on the modal content
$("#movieModal").click(function(event) {
    event.stopPropagation();
});

// Close modal when clicking outside (except modal content)
$(document).click(function(event) {
    if (!$(event.target).closest(".modal-content-movie").length) {
        $('#modal-video-watch').modal('hide');
    }
});

    
});


let generateShop = () => {
    console.log(shopItemsData);
    return shop.innerHTML = shopItemsData.map((x) => {
        let { _id, title, price, description, year, rating, actors, image } = x;
        let search = basket.find((item) => item.id === _id); // Use item.id
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="bi bi-star-fill"></i>';
            } else {
                stars += '<i class="bi bi-star"></i>';
            }
        }
        return `
        <div id="product-id-${_id}" class="item">
            <div class="clickable-image" onclick="fetchMovie('${_id}')">
                <img width="250" height="400" src="${image}" style="border-radius: 35px 35px 0 0" alt="image should be here">
            </div>
            <div class="details">
                <div class="titleClass">
                    <h3 class="title-movie-details">${title}</h3>
                </div>
                <br>
                <p style="text-align: center;font-size:24px">${year}</p> 
                <p style="text-align: center;font-size:24px">${stars}</p>
                <div class="price-quantity">
                    <h2 class="movie-price-details">$ ${price}</h2>
                    <i onclick="decrement('${_id}')" class="bi bi-bag-dash-fill" style="font-size:24px"></i>
                    <div id=${_id} class="quantity" style="font-size:24px">${search === undefined ? 0 : search.item}</div>
                    <i onclick="increment('${_id}')" class="bi bi-bag-plus-fill" style="font-size:24px"></i>
                </div>
            </div>
        </div>
        `;
    }).join("");

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
let generateMovieModal=(movie)=>{

        const modalHtml=`
        <div class="modal fade" role="dialog" tabindex="-1" id="modal-1" style="background: var(--bs-body-color);">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Write a review</h4><button class="btn-close" type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend"></div>
                            </div>
                            <div></div>
                            <div class="mb-3"><label class="form-label shadow" for="reviewerName" style="margin: 0 px 0px 4 px;color: var(--bs-secondary-bg);">Your Name:</label><input class="shadow form-control item" type="text" id="reviewerName" placeholder="Please tell us your full name" required="" minlength="3" style="border-radius: 8 px;"></div>
                            <div class="mb-3" style="border-radius: 8 px;"></div>
                            <div class="mb-3" style="box-shadow: 0px 0px;"></div>
                            <div class="mb-3 my-3"><label class="form-label" for="review" style="box-shadow: 0px 0px;color: var(--bs-secondary-bg);">Review:</label><textarea class="shadow form-control item" id="message" placeholder="Tell us honestly about what we do well and not so well." required="" minlength="10" maxlength="500" rows="7" style="border-style: solid;border-radius: 16px;"></textarea></div>
                            <div class="mb-3"><button class="btn btn-success btn-lg d-block mx-auto" type="submit" data-bs-target="#modal-video-watch" data-bs-toggle="modal">Submit Form</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade bg-dark sys-box-course-modal" role="dialog" tabindex="-1" id="modal-video-watch">
            <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
                <div class="modal-content-movie">
                    <div class="modal-header">
                        <h4 class="modal-title"><i class="fa fa-video-camera me-3"></i>Movie Preview</h4>
                        <button class="btn-close" type="button" aria-label="Close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body sys-box-course-modal">
                        <div class="dh-box-2-sides" style="display: flex;height: 100%;">
                            <div class="col-md-6 dh-box-left" style="background: var(--bs-secondary-color);height: auto;">
                                <h1 style="color: rgb(115,110,110);">${movie.title}</h1>
                                <p style="height: auto;margin-bottom: -7px;">
                                    <span style="font-weight: normal !important; color: rgb(115, 110, 110); background-color: rgb(33, 37, 41);">
                                        ${movie.description}
                                    </span><br>
                                    <p style="font-size: 24px;">
                                        <span style="font-weight: normal !important; color: rgb(115, 110, 110); background-color: rgb(33, 37, 41);">
                                            ${movie.year}
                                        </span>
                                    </p>
                                </p>
                            </div>
                            <div class="col-md-6 dh-box-right" style="height: auto;">
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
                                    <div class="row gy-4 row-cols-1 row-cols-md-2 row-cols-xl-3 justify-content-center align-items-center" style="border-style: none;">
                                        <div class="col" style="border-radius: 20px;border-style: solid;border-color: var(--bs-emphasis-color);padding-top: 8px;margin-left: 0px;width: 360px;">
                                            <div class="d-flex">
                                                <div class="bs-icon-sm bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block mb-3 bs-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-pencil-square">
                                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"></path>
                                                    </svg>
                                                </div>
                                                <div class="px-3">
                                                    <h4 style="margin-top: 4px;">Review name 1</h4>
                                                    <p>Erat netus est hendrerit, nullam et quis ad cras porttitor iaculis. Bibendum vulputate cras aenean.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button class="btn btn-primary" type="button" data-bs-target="#modal-1" data-bs-toggle="modal">Write a review</button>
                            </div>
                        </div>
                        
                        <div class="video-container" style="height: 200px;">
                        <iframe allowfullscreen="" frameborder="0" width="853" height="480" style="height: 100%; border-radius: 18px;"
                            src="https://www.youtube.com/embed/${movie.youtube_video_id}">
                        </iframe>
                    </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    movieModal.innerHTML = modalHtml;
    $('#modal-video-watch').modal('show');
}

let generateActorCards = (actorFacets, actorNames) => {
    let actorCardsHtml = '';
    for (let i = 0; i < Math.min(3, actorFacets.length); i++) {
        actorCardsHtml += `
            <div class="col-sm-6 col-md-4" style="height: 196.2px;display: flex;color: var(--bs-body-color);">
                <div class="box" style="height: 95%;border-radius: 20px;width: 85%;">
                    <img src="${actorFacets[i]}" alt="Actor" style="height: 100%;border-radius: 20px;">
                    <div class="box-content" style="height: 100%;border-radius: 20px;">
                        <h4 class="text-capitalize text-center title" style="color: var(--bs-body-color);font-family: 'Source Sans Pro', sans-serif;">${actorNames[i]}</h4>
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

async function init() {
    await fetchDataAsync();
    generateShop();
    calculation();
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


  