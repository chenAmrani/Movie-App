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
