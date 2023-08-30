let shopItemsData=[];
function fetchDataFromServer(response){
    shopItemsData = response;
}

async function fetchDataAsync() {
    try {
        const response = await $.ajax({
            url: "http://localhost:1113/Movies",
            type: "GET",
        });

        await fetchDataFromServer(response);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
fetchDataAsync();
