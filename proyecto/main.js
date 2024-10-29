const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
});
api.defaults.headers.common['X-API-KEY'] = 'live_IbayqiU68NWmZAJ6d0yTzM8mri1j7VHtkgA9WUmbmQj7dUnjOt99xpwaWmQD3Oe9'

const API_RANDOM = 'https://api.thecatapi.com/v1/images/search';
const API_FAVOURITES =' https://api.thecatapi.com/v1/favourites';
const API_UPLOAD = 'https://api.thecatapi.com/v1/images/upload'
const API_KEY = 'live_IbayqiU68NWmZAJ6d0yTzM8mri1j7VHtkgA9WUmbmQj7dUnjOt99xpwaWmQD3Oe9'

const ADD_NEW_ELEMENT = `
    <article id="newImage" class="michi-random-container add-new-michi">
        <span>+</span>
        <p>New Image</p>
    </article>
`;

let id = 0;
let newImage;

const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const img3 = document.getElementById('img3');
const gridContainerRandom = document.getElementById('gridContainerRandom');
const gridContainerFav = document.getElementById('gridContainerFav');

async function getCats(number) {
    try {
        const response = await fetch(`${API_RANDOM}?limit=${number}`,{
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        if(response.status !== 200) {
            throw new Error(`Error en peticion HTTP en Random: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        const errorNode = document.getElementById('error');
        errorNode.innerText = error.message;
    }
}

async function getFavouritesCats() {
    try {
        const response = await fetch(`${API_FAVOURITES}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        if(response.status !== 200) {
            throw new Error(`Error en peticion HTTP en Favourites: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        const errorNode = document.getElementById('error');
        errorNode.innerText = error.message;
    }
}

async function loadRandomCats(n) {
    const data = await getCats(n);
    gridContainerRandom.innerHTML = "";
    id = 0;
    data.map((cat) => {
        gridContainerRandom.innerHTML += `
            <article id="${cat.id}" class="michi-random-container">
                <img id="img${++id}" src="${cat.url}" alt="Foto de gatito recuperada aleatoriamente">
                <button id="btnRandom${id}" onclick="saveFavouriteCat('${cat.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon save-icon" viewBox="0 0 512 512"><path d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
                </button>
            </article>
        `;
    })
    if(n < 10) {
        gridContainerRandom.innerHTML += ADD_NEW_ELEMENT;
        newImage = document.getElementById('newImage');
        newImage.addEventListener('click', addNewImageRandom);
    }
}

async function loadFavouritesCats() {
    const data = await getFavouritesCats();
    data.map((cat) => {
        gridContainerFav.innerHTML += `
            <article class="michi-random-container">
                <img src="${cat.image.url}" alt="Foto de gatito recuperada aleatoriamente">
                <button onclick="deleteFavouriteCat('${cat.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="ionicon save-icon" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352"/><path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
                </button>
            </article>
        `;
    });
}

async function addNewImageRandom() {
    const data = await getCats(1);
    newImage.remove();
    gridContainerRandom.innerHTML += `
    <article id="${data[0].id}" class="michi-random-container">
        <img id="img${++id}" src="${data[0].url}" alt="Foto de gatito recuperada aleatoriamente">
        <button onclick="saveFavouriteCat('${data[0].id}')">
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon save-icon" viewBox="0 0 512 512"><path d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
        </button>
    </article>
    `;

    if(id < 10) {
        gridContainerRandom.innerHTML += ADD_NEW_ELEMENT;
        newImage = document.getElementById('newImage');
        newImage.addEventListener('click', addNewImageRandom);
    }
}

async function saveFavouriteCat(idImage, random = true) {
    try {
        const { data, status} = await api.post('/favourites', {
            image_id: idImage
        });

        // const response = await fetch(`${API_FAVOURITES}`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-API-KEY': API_KEY
        //     },
        //     body: JSON.stringify({
        //         image_id: idImage,
        //     })
        // });

        if(status !== 200) {
            throw new Error(`Error en peticion HTTP en Guardar Favorito: ${status}`);
        }

        gridContainerFav.innerHTML = "";
        loadFavouritesCats();

        if(random){
            const article = document.getElementById(idImage);
            article.remove();
            addNewImageRandom();
        }

    } catch (error) {
        console.log(error);
        const errorNode = document.getElementById('error');
        errorNode.innerText = error.message;
    }
}

async function deleteFavouriteCat(idImage) {
    try {
        const response = await fetch(`${API_FAVOURITES}/${idImage}`, {
            method: 'DELETE',
            headers: {
                'X-API-KEY': API_KEY
            }
        });

        if(response.status !== 200) {
            throw new Error(`Error en peticion HTTP en Eliminar Favorito: ${response.status}`);
        }

        gridContainerFav.innerHTML = "";
        loadFavouritesCats();

    } catch (error) {
        console.log(error);
        const errorNode = document.getElementById('error');
        errorNode.innerText = error.message;
    }
}

function reload() {
    id < 3 ?
    loadRandomCats(3) :
    loadRandomCats(id);
}

async function uploadCatPhoto() {
    try {
        const form = document.getElementById('uploadingForm');
        const formData = new FormData(form);

        const res = await fetch(API_UPLOAD, {
            method: 'POST',
            headers: {
                'X-API-KEY': API_KEY,
            },
            body: formData
        })

        const data = await res.json();

        if(res.status !== 201) {
            throw new Error(`Error en peticion HTTP en subir imagen: ${response.status}`);
        }

        saveFavouriteCat(data.id, false);

    } catch (error) {
        console.log(error);
        const errorNode = document.getElementById('error');
        errorNode.innerText = error.message;
    }
}

function previewImage() {
    const file = document.getElementById('file').files;
    console.log(file);

    if(file.length > 0) {
        const fileReader = new FileReader();

        fileReader.onload = function(e) {
            document.getElementById('previewImg').setAttribute('src', e.target.result)
        }

        fileReader.readAsDataURL(file[0]);
    }
}

loadRandomCats(3);
loadFavouritesCats();