
let shop = document.getElementById('shop');

// pulling data from the local storage.
let basket = JSON.parse(localStorage.getItem("data")) || []; //if the client has a data its return it from the local sorage else its make empty basket.

//console.log(shop);



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


 




  
  