// Function to send AJAX request on site load
function fetchUserDataOnLoad() {
    const email = localStorage.getItem('email');
    console.log(email); // Make sure email is not null/undefined here

    $.ajax({
        url: "http://localhost:1113/email",
        type: "GET",
        data: { email: email }, // Send email as an object

        success: function(response) {
            console.log(response); // Make sure you see the response
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
function fetchOrders(OrderID){

    var data={id:OrderID}

    $.ajax({
        url: "http://localhost:1113/order",
        type: "GET",
        data: data, // Send email as an object
    success: function(response){
         console.log(response);
    }
    });
    

}


function printOrders(orders){
    const faqlist= document.getElementById("faqlist");
    console.log("orders to print",orders);
    for (let i=0;i<orders.length;i++){

        const movieName=[];
        let counter=0;
        for (let j=0;j<orders[i].movies.length;j++){
            movieName.push(orders[i].movies[j].title);
        
           
        }
        faqlist.innerHTML+=`<div class="accordion-item">
        <h2 class="accordion-header"><button class="btn accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#content-accordion-${i+1}" style="height: 58px;">Order number${i+1}</button></h2>
        <div id="content-accordion-${i+1}" class="accordion-collapse collapse" data-bs-parent="#faqlist">
           
        </div>
         </div>`
        const myAccordionBody=document.getElementById(`content-accordion-${i+1}`);
        for (let j=0;j<movieName.length;j++){
            myAccordionBody.innerHTML+= `<p class="movieName"> • ${movieName[j]} </p>`
}
    }
}

// Call the function when the page loads
window.onload = async function() {
    await fetchUserDataOnLoad();
    
    
    
};