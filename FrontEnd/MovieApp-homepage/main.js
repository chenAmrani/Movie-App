let shop = document.getElementById('shop');

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
        var userEmail = localStorage.getItem("email");
        if (!userEmail) {
            document.getElementById("loginModal").style.display = "block";
        } else {
            // Handle the user profile action here
        }
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


let generateShop = () => {
    return shop.innerHTML = shopItemsData.map((x) => {
        let { _id, title, price, desc, year, rating, actors, image } = x;
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
            <img width="220" height="400" src="${image}" alt="image should be here">
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


  