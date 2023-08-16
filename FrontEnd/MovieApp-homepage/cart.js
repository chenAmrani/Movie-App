
function fetchMovie() {
    const dataString = localStorage.getItem('data'); // Retrieve the string from localStorage
    const dataArray = JSON.parse(dataString); // Parse the string into an array

    if (Array.isArray(dataArray) && dataArray.length > 0) {
        const movieId = dataArray[0].id; // Access the "id" property of the first item in the array
        console.log(movieId); // This will log the value of "id"
    } 

    $.ajax({
        url: "http://localhost:1113/email",
        type: "GET",
        data: { email: email }, // Send email as an object

        success: function(response) {
            // console.log(response); // Make sure you see the response
            document.getElementById('userName').textContent = response.name;
            document.getElementById('userEmail').textContent = response.email;
            document.getElementById('userAge').textContent = response.age;
            const user=response;
            const orders=user.orders;
            printOrders(orders)
            const movies=user.movies;
            const movieContainer = document.getElementById('movieContainer');
            movieContainer.innerHTML = ''; // Clear previous content

            for (let i = 0; i < movies.length; i++) {
                const movie = movies[i];
                const movieHTML = `
                    <div class="mySlides">
                        <div class="numbertext"><span>${i + 1}/${movies.length}</span></div>
                        <img src="${movie.image}" width="100%" style="height: 250px;width: 200px;">
                    </div>`;
                movieContainer.innerHTML += movieHTML;
            }

            // After adding movies, initialize the slideshow
            showSlides(slideIndex); // Make sure slideIndex is defined in your SlideShow.js
        },
        error: function(xhr, status, error) {
            console.error("AJAX Error:", status, error);
        },
    });
}

let lable =document.getElementById('lable')
let shoppingCart = document.getElementById('shopping-cart')

// pulling data from the local storage.
let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = ()=>{
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x)=>x.item).reduce((x,y)=>x+y,0) 
};

calculation();


let generateCartItems =()=>{
    //if we have data on the local storage:
    if(basket.length !==0){
        return (shoppingCart.innerHTML= basket.map((x) => {
            let { id,item} = x;
            //basket = the data from the local storage.
            // shopItemDate = the all data in the data mongoos.
            //we want to take only the data that we have in the local storage.
            let search = shopItemsData.find((y) => y.id === id)||[]
            let {img,name,price} = search
            return `
            <div class="cart-item">
                <img width="100" src=${img} alt="movie-picture"/>
             <div class="details">

                <div class="title-price-x">
                        <h3>
                        <p>${name}</p>
                        </h3>                  
                    <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
                </div>

                <div class="item-price">
                <p class="cart-item-price">$ ${price}</p>
                </div>

                <div class="buttons">
                    <i onclick="decrement(${id})" class="bi bi-bag-dash-fill"></i>
                    <div id=${id} class="quantity">${item}</div>
                    <i onclick="increment(${id})" class="bi bi-bag-plus-fill"></i>
                </div>
                    
                <h3>Subtotal : $ ${item * price}</h3>
             </div>   
            </div>
            `;  
        }).join(""));
    
    }else{
        shoppingCart.innerHTML = ``;
        lable.innerHTML = `
        <h2>Cart is Empty</h2>
        <a href="view.html">
            <button class="HomeBtn">Back to store</button>
        </a>

       `;
    }
};

generateCartItems();

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
    generateCartItems();
    TotalAmount();
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
    generateCartItems();
    TotalAmount();
    localStorage.setItem("data",JSON.stringify(basket));
};

let update = (id)=>{
    let search = basket.find((x)=>x.id===id)
    console.log(search.item);
    document.getElementById(id).innerHTML = search.item;
    calculation()
;};

let removeItem = (id)=>{
    let selectedItem = id
    basket = basket.filter((x)=>x.id !==selectedItem.id);
    generateCartItems();
    calculation();
    TotalAmount();
    localStorage.setItem("data",JSON.stringify(basket));
};


let clearCart=()=>{
    basket = []
    calculation();
    generateCartItems();
    localStorage.setItem("data",JSON.stringify(basket));
};

let TotalAmount = ()=>{
    if(basket.length !==0){
        let amount = basket.map((x)=>{
            let {item,id} = x;
            let search = shopItemsData.find((y) => y.id === id)||[]
            return item*search.price;
        }).reduce((x,y)=>x+y,0);
        lable.innerHTML =`
        <div class="Shopping-Cart-HeadLine">
        <h1>SHOOPING CART</h1>
        </div>
        <div class="Total-Bill-HeadLine">
        <h2>Total Bill: $ ${amount}</h2>
        <button class="checkout">Checkout</button>
        <button onclick="clearCart()" class="removeAll">Clear Cart</button>
        </div>
        `
    }
    else return
}
TotalAmount();

window.onload = async function() {
    await fetchMovie();
    
    
    
};