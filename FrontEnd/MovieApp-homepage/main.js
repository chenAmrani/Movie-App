
let shop = document.getElementById('shop');

// pulling data from the local storage.
let basket = JSON.parse(localStorage.getItem("data")) || []; //if the client has a data its return it from the local sorage else its make empty basket.

//console.log(shop);


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

let generateShop = () => {
    return shop.innerHTML = shopItemsData.map((x) => {
        let { id, title, price, desc, year, rating, actors, image } = x;
        let search = basket.find((x) => x.id === id) || [];
    // Create star rating representation
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="bi bi-star-fill"></i>';
        } else {
            stars += '<i class="bi bi-star"></i>';
        }
    }

    return `
    <div id=product-id-${id} class="item">
        <img width="220" src="${image}" alt="image should be here" >
        <div class="details">
            <h3 class="title-movie-details">${title}</h3>
            <p>${year}</p>
            <p>${desc}</p>
            <p>${stars}</p> <!-- Display star rating here -->
            <div class="price-quantity">
                <h2 class="movie-price-details">$ ${price}</h2>
                <div class="buttons">
                    <i onclick="decrement(${id})" class="bi bi-bag-dash-fill"></i>
                    <div id=${id} class="quantity">${search.item === undefined ? 0 : search.item}</div>
                    <i onclick="increment(${id})" class="bi bi-bag-plus-fill"></i>
                </div>
            </div>
        </div>
    </div>
    `;
}).join("");
};


let increment = (id)=>{
    let selecteditem = id;
    let search = basket.find((x)=>x.id ==selecteditem.id); //check one one and check id the movie is exist in the basket.
    if(search ==undefined){ //if the movie isnt exist in the basket.
    basket.push({
        id: selecteditem.id,
        item: 1
        
    });
}else{
    search.item +=1;
}
    update(selecteditem.id);
    localStorage.setItem("data",JSON.stringify(basket));
};

let decrement = (id)=>{
    let selecteditem = id;
    let search = basket.find((x)=>x.id ==selecteditem.id); //check one one and check id the movie is exist in the basket.
    if(search === undefined) return;
        if(search.item === 0) return; //if the movie isnt exist in the basket dont do anything.
   else{
        search.item -=1;
    }
    update(selecteditem.id);
    basket = basket.filter((x) => x.item !== 0);
    localStorage.setItem("data",JSON.stringify(basket));
};

let update = (id)=>{
    let search = basket.find((x)=>x.id===id)
    console.log(search.item);
    document.getElementById(id).innerHTML = search.item;
    calculation()
;};

//add all the count of the movie
let calculation = ()=>{
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x)=>x.item).reduce((x,y)=>x+y,0) 
};


async function init(){
    await fetchDataAsync();
    generateShop();
    calculation();
}


init();


// Open the login modal when the login button is clicked
document.getElementById("loginButton").addEventListener("click", function() {
    document.getElementById("loginModal").style.display = "block";
});

// Close the login modal when the close button is clicked
document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("loginModal").style.display = "none";
});

// Close the login modal when clicking outside the modal
window.addEventListener("click", function(event) {
    if (event.target === document.getElementById("loginModal")) {
        document.getElementById("loginModal").style.display = "none";
    }
});
// JavaScript code

document.addEventListener('DOMContentLoaded', function () {
    // Reference to the input field, search icon, and search results container
    const searchBar = document.getElementById('search-bar');
    const searchIcon = document.getElementById('search-icon');
    const searchResults = document.getElementById('search-results');

    // Event listener for input changes
    searchBar.addEventListener('input', function () {
        // Get the user's search query
        const query = this.value.trim();

        // Fetch movies based on the query using AJAX
        getMoviesByQuery(query);
    });

    // Event listener for search icon click
    searchIcon.addEventListener('click', function () {
        // Get the user's search query
        const query = searchBar.value.trim();

        // Fetch movies based on the query using AJAX
        getMoviesByQuery(query);
    });

    // Function to populate the search results container with movie options
    function populateSearchResults(movies) {
        searchResults.innerHTML = ''; // Clear previous search results

        movies.forEach(function (movie) {
            const {
                _id,
                title,
                image
            } = movie;

            // Create a search result item element
            const searchResultItem = document.createElement('div');
            searchResultItem.classList.add('search-result-item');
            searchResultItem.innerHTML = `
                <img width="20" height="15" src="${image}" alt="Movie Image">
                <span>${title}</span>
            `;

            // Add a click event listener to handle the selection of the movie
            searchResultItem.addEventListener('click', function () {
                const movieId = _id;
                // Handle the selection of the movie here
                console.log(`Selected movie ID: ${movieId}`);
                // Clear the search results
                searchResults.innerHTML = '';
            });

            searchResults.appendChild(searchResultItem);
        });
    }

    // Function to fetch movies based on the query using AJAX
    function getMoviesByQuery(query) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:1113/Movies',
            success: function (movies) {
                // Filter movies based on the query
                const filteredMovies = movies.filter(function (movie) {
                    return movie.title.toLowerCase().startsWith(query.toLowerCase());
                });

                // Populate the search results container with filtered movies
                populateSearchResults(filteredMovies);
            },
            error: function (error) {
                console.error('Error fetching movies: ', error);
            }
        });
    }
});



// ----------------------------------------------------------------------------------------------------
// const {
//     getObjectById
//   } = require("../Controllers/AppController"); 

// fetch("movies.json")
// .then(function(response){
//     return response.json();
// }).then(function(data){
//     localStorage.setItem("movies",JSON.stringify(data));
//     if(!localStorage.getItem("cart")){
//         localStorage.setItem("cart","[]");
//     }
// });
//  let cart = JSON.parse(localStorage.getItem("cart"));

// //add movie to the cart
//  function addItemToCart(movieId){
//     if(cart.length == 0){
//         cart.push({id:movieId});
//     }
//     else{
//         let res = cart.find(element=>element.id==movieId);
//         if(res==undefined){
//             cart.push({id:movieId});
//         }
//     }
//     localStorage.setItem("cart",JSON.stringify(cart));
//  }

// //Remove movie from the cart
//   function removeItemFromCart(movieId){
//     let temp =cart.filter(item=>item.id != movieId);
//     localStora
//     ge.setItem("cart",JSON.stringify(temp));
//  }

//  //Get cart price
//  function get(MovieTitle){
//     let temp = cart.map(function(item){
//         return parseFloat(moviePrice)
//     });
//     let sum = temp.reduce(function(prev,next){
//         return prev + next;
//     },0)
//  }


 




  
  