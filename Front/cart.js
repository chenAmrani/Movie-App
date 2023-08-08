
let lable =document.getElementById('lable')
let shoppingCart = document.getElementById('shopping-cart')

// pulling data from the local storage.
let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = ()=>{
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x)=>x.item).reduce((x,y)=>x+y,0) 
};

calculation();


let generateItems =()=>{
    //if we have data on the local storage:
    if(basket.length !==0){
        console.log("basket is not empty");
    }
    else{
        shoppingCart.innerHTML = ``;
        lable.innerHTML = `
        <h2>Cart is Empty</h2>
        <a herf ="view.html">
          <button class="HomeBtn">Back to store</button>
        </a>
        `;
    }
};

generateItems();