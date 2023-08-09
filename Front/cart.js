
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
                <img width="100" src=${img} alt=""/>
             <div class="details">

                <div class="title-price-x">
                    <h4 class="title-price">
                        <p>${name}</p>
                        <p class="cart-item-price">$ ${price}</p>
                    </h4>
                    <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
                </div>

                <div class="buttons">
                    <i onclick="decrement(${id})" class="bi bi-bag-dash-fill"></i>
                    <div id=${id} class="quantity">${item}</div>
                    <i onclick="increment(${id})" class="bi bi-bag-plus-fill"></i>
                </div>
                    
                <h3>$ ${item * price}</h3>
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
        <h2>Total Bill: $ ${amount}</h2>
        <button class="checkout">Checkout</button>
        <button onclick="clearCart()" class="removeAll">Clear Cart</button>
        `
    }
    else return
}
TotalAmount();