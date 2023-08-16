

let shopItemsData=[];
function fetchDataFromServer(response){
    // console.log(response);
    shopItemsData = response;
    // console.log(shopItemsData);
}

async function fetchDataAsync() {
    try {
        const response = await $.ajax({
            url: "http://localhost:1113/Movies",
            type: "GET",
            //data: data,
        });

        await fetchDataFromServer(response);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
fetchDataAsync();




//-----------------------------------------------------
// var shopItemsData = new XMLHttpRequest();
// shopItemsData.open("GET", "http://localhost:3200/", true);
// shopItemsData.send();



// let shopItemsData = [{
//     id:"12",
//     title: "movie1",
//     price:45,
//     desc:"movie1",
//     year: 1999,
//     rating: "rating : 4 " ,
//     actors: "chen,ori,nir,dorin",
//     image: "/BackEnd/images/image1.jpg"
// },
// {
//     id:"123",
//     title: "movie2",
//     price: 25,
//     desc:"movie2",
//     year: 2002,
//     rating: "rating : 7 ",
//     actors: " actors : chen,ori,nir,dorin",
//     image: "/BackEnd/images/image2.jpg"
// },
// {
// id:"1234",
// title: "movie3",
// price: 15,
// desc:"movie3",
// year: 2022,
// rating: "rating : 3 ",
// actors: " actors : chen,ori,nir,dorin",
// image: "/BackEnd/images/image3.jpg"
// },
// {
// id:"12345",
// title: "movie4",
// price: 35,
// desc:"movie4",
// year: 1964,
// rating: "rating : 5 ",
// actors: " actors : chen,ori,nir,dorin",
// image: "/BackEnd/images/image4.jpg"
// }
// ];
