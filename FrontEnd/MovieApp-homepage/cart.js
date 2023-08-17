

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
        for (let i = 0; i < basket.length; i++) {
            let id = basket[i].id;
            const movie = await fetchMovie(basket[i].id);
            let { image, title, price } = movie;
            total += price;
            shoppingCart.innerHTML += `
            <div class="cart-item">
                <img width="150" height="250" src=${image} alt="movie-picture"/>
             <div class="details">

                <div class="title-price-x">
                        <h3>
                        <p>${title}</p>
                        </h3>                  
                    <i onclick="removeItem('${id}')" class="bi bi-x-lg"></i>
                </div>

                <div class="item-price">
                </div>

                <div class="buttons">
                    <!-- Rest of your buttons... -->
                </div>
                    
                <h3>Subtotal : $ ${price}</h3>
             </div>   
            </div>
            `;

        }
        TotalAmount();

        
    
    } else {
        shoppingCart.innerHTML = ``;
        lable.innerHTML = `
        <h2>Cart is Empty</h2>
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

let TotalAmount = ()=>{
    if(basket.length !==0){
        lable.innerHTML =`
        <div class="Shopping-Cart-HeadLine">
        <h1>SHOOPING CART</h1>
        </div>
        <div class="Total-Bill-HeadLine">
        <h2>Total Bill: $ ${total}</h2>
        <button class="checkout">Checkout</button>
        <button onclick="clearCart()" class="removeAll">Clear Cart</button>
        </div>
        `
    }
    else return
}

window.onload = async function() {
    generateCartItems();
    
    
    
};