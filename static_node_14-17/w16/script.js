// Store the original artwork data extracted from the DOM
let artworks = [];

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const artworkList = document.getElementById('artworkList');
    const searchInput = document.getElementById('searchInput');

    // Extract artworks from the DOM
    const artworkElements = artworkList.getElementsByClassName('artwork');
    for (let element of artworkElements) {
        const title = element.querySelector('h3').textContent;
        const artist = element.querySelector('p').textContent.replace('by ', '');
        const image = element.querySelector('img').src;
        artworks.push({ title, artist, image, element: element.cloneNode(true) });
    }

    // Filter artworks based on search input
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        const filteredArtworks = artworks.filter(artwork =>
            artwork.artist.toLowerCase().includes(query)
        );
        renderArtworks(filteredArtworks);
    });
});

// Render artworks to the DOM
function renderArtworks(artworksToRender) {
    const artworkList = document.getElementById('artworkList');
    artworkList.innerHTML = '';
    artworksToRender.forEach(artwork => {
        artworkList.appendChild(artwork.element.cloneNode(true));
    });
}