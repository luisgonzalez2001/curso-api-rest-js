const API = 'https://api.thecatapi.com/v1/images/search?api_key=live_IbayqiU68NWmZAJ6d0yTzM8mri1j7VHtkgA9WUmbmQj7dUnjOt99xpwaWmQD3Oe9&limit=3';

const btnReload = document.querySelector('button');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const img3 = document.getElementById('img3');

document,addEventListener('DOMContentLoaded', getCat);

async function getCat() {
    try {
        const response = await fetch(API);
        const data = await response.json();
        console.log(data);
        img1.src = data[0].url;
        img2.src = data[1].url;
        img3.src = data[2].url;
    } catch (error) {
        console.log(error);
    }
}

btnReload.onclick = getCat;


// fetch(API)
//     .then(response => response.json())
//     .then(data => {
//         const img = document.querySelector('img');
//         img.src = data[0].url;
//     });