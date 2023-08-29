import {usdToILS} from "./main"

let userName='';
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
                    window.location.href = "/Movie-App/FrontEnd/MovieApp-homepage/cart.html";
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

    
});

document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("loginModal").style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target === document.getElementById("loginModal")) {
        document.getElementById("loginModal").style.display = "none";
    }
});


// Function to fetch movie data using AJAX
async function fetchMovie(movieId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "http://localhost:1113/MovieById",
            type: "GET",
            data: { id: movieId },
            success: function(response) {
                resolve(response);
            },
            error: function(xhr, status, error) {
                reject(error);
            },
        });
    });
}

let lable =document.getElementById('lable')
let shoppingCart = document.getElementById('shopping-cart')

// pulling data from the local storage.
let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = ()=>{
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

let total=0;


async function generateCartItems() {
    if (basket.length !== 0) {
        // Create an array of promises to fetch movie data
        let lineCount = 1;
        let lineContainer = document.createElement('div');
        lineContainer.classList.add('cart-line');

        for (let i = 0; i < basket.length; i++) {
            let id = basket[i].id;
            const movie = await fetchMovie(basket[i].id);
            let { image, title, price } = movie;
            total += price;

            if (i !== 0 && i % 4 === 0) {
                // Start a new line after every 4 items
                shoppingCart.appendChild(lineContainer);
                lineContainer = document.createElement('div');
                lineContainer.classList.add('cart-line');
                lineCount++;
            }

            lineContainer.innerHTML += `
            <div class="cart-item">
                <img width="150" height="250" src=${image} style="border-radius: 58px 0 0 58px;" alt="movie-picture"/>
             <div class="details" style="display:flex;border-radius:0 58px 58px 0">

                <div class="title-price-x">
                        <h3>
                        <p>${title}</p>
                        </h3>                  

                </div>
                <i onclick="removeItem('${id}')" class="bi bi-trash fs-3" style="align-self:end"></i>
                <div class="item-price">
                </div>

                <div class="buttons">
                    <!-- Rest of your buttons... -->
                </div>
                    

                <h3 style="text-align:center">Subtotal : $ ${price}</h3>
                <h3 style="text-align:center">Subtotal : ₪ ${price*usdToILS}</h3
             </div>   
            </div>
            `;
        }

        shoppingCart.appendChild(lineContainer); // Append the last line container
        TotalAmount()

        
    } else {
        console.log(basket);
        shoppingCart.innerHTML = ``;
        lable.innerHTML = `
        <h2 style="margin-top:20px">Cart is Empty</h2>
        <a href="view.html">
            <button class="HomeBtn">Back to store</button>
        </a>
       `;
    }
}



let update = (id)=>{
    let search = basket.find((x)=>x.id===id)
    console.log(search.item);
    document.getElementById(id).innerHTML = search.item;
    calculation()
;};

let removeItem = (id) => {
    let selectedItem = id;
    console.log(selectedItem);
    basket = basket.filter((x) => x.id !== selectedItem);
    calculation();
    TotalAmount();
    localStorage.setItem("data", JSON.stringify(basket));
    location.reload();
};


let clearCart=()=>{
    basket = []
    calculation();
    generateCartItems();
    localStorage.setItem("data",JSON.stringify(basket));
};

async function fetchUserCheckout() {
    return new Promise((resolve, reject) => {
        const email = localStorage.getItem('email');

        $.ajax({
            url: "http://localhost:1113/email",
            type: "GET",
            data: { email: email },
            success: function(response) {
                resolve(response); // Resolve the promise with the response data
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", status, error);
                reject(error); // Reject the promise with the error
            },
        });
    });
}

let orderNumber=1;

// Function to post updates to the Facebook page using AJAX
function postToFacebookPage(message) {
    const pageAccessToken = 'EAARn6rNxEIYBOxmUmkpnQivo9WSEZANA0FxD8f7sL4cr5pvejUBkY3KyCeMw5qr1HnI2pQOSaem1Tqgy93fAOnkAjAirHZBsZC8yEjCtZCMzqeEeb5SqZBH2GuieJUOUM3lAzxqZCwG6l4ccuBoQalrbaunxlGkYdrXZC2ey2CtRPYGCwgDNGtsUYB7mS2twdYZD';
    const pageId = '108469582352707';
    
    $.ajax({
      url: `https://graph.facebook.com/v12.0/${pageId}/feed`,
      method: 'POST',
      data: {
        message: message,
        access_token: pageAccessToken,
      },
      success: function(response) {
        console.log('Posted to Facebook page:', response);
      },
      error: function(error) {
        console.error('Error posting to Facebook page:', error.responseJSON);
      }
    });
  }
  
  // Call the function to post updates
  
  
  let message='';
 
let cashout = async () => {
    if (localStorage.getItem("email")!=undefined){
    try {
        const user = await fetchUserCheckout();
        userName= await user.name;
        console.log(userName)
        // Assuming you have the order data in some format
        const orderData = {
            user: user._id,
            movies: basket.map(item => item.id),
            orderNumber: 1,
        };
        
      
        $.ajax({
            url: "http://localhost:1113/createOrder",
            type: "POST",
            data: { order: orderData },
            success: function(response) {
                
                
                console.log(basket);

                // Show the success modal using vanilla JavaScript
                let successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
                message=`User ${userName} has made a new order !`
          postToFacebookPage(message);
                clearCart();
                setTimeout(function() {
                window.location.href = "/Movie-App/FrontEnd/MovieApp-profile/userprofile.html";
                },2000)
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", status, error);
                // Handle the error if needed
            },
        });
    } catch (error) {
        // Handle the error if needed
        console.error("Error:", error);
    }
    }
    else{
        $('#responseModalLabel').text("You have to be logged in in order to buy")
        $('#responseModalBody').text("Please LOGIN");
        $('#responseModal').modal('show');
    }
}




let TotalAmount = ()=>{
    if(basket.length !==0){
        lable.innerHTML =`
        <div class="Shopping-Cart-HeadLine" style="margin-top:15px">
        <h1>SHOOPING CART</h1>
        </div>
        <div class="Total-Bill-HeadLine">
        <h2>Total Bill: $ ${total}</h2>
        <button onclick="cashout() "class="checkout">Checkout</button>
        <button onclick="clearCart()" class="removeAll">Clear Cart</button>
        </div>
        `
    }
    else return
}

window.onload = async function() {
    generateCartItems();
    
    
    
};