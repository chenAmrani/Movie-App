
let shopItemsData;
function fetchDataFromServer(response){
    console.log(response);
    shopItemsData = response;
    console.log(shopItemsData);

}

async function fetchDataAsync() {
    try {
        const response = await $.ajax({
            url: "http://localhost:3200/",
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
//     id:"movie1",
//     name: "movie1",
//     price:45,
//     desc:"bla bla",
//     img: "/imges/image4.jpg"
// },
// {
//     id:"movie2",
//     name: "movie2",
//     price: 25,
//     desc:"bla bla",
//     img: "/imges/image2.jpg"
// },
// {
// id:"movie3",
// name: "movie3",
// price: 15,
// desc:"bla bla",
// img: "/imges/image3.jpg"
// },
// {
// id:"movie4",
// name: "movie4",
// price: 35,
// desc:"bla bla",
// img: "/imges/image4.jpg"
// }
// ];
