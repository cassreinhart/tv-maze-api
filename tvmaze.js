"use strict";

const $searchForm = $("#search-form");
const $episodesArea = $("#episodes-area");
const altSrc = 'https://tinyurl.com/tv-missing';
const $showGetEpisodes = $(".Show-getEpisodes");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) { //searchShows
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  let shows = res.data.map(r => { 
    let show = r.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : altSrc
    };
  });

  return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  
  for (let show of shows) {
    // console.log(show.id);
  let $show = $(
    `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
     <div class="media">
       <img 
          src="${show.image}" 
          alt="${show.name}" 
          class="w-25 mr-3">
       <div class="media-body">
         <h5 class="text-primary">${show.name}</h5>
         <div><small>${show.summary}</small></div>
         <button class="btn btn-outline-light btn-sm Show-getEpisodes">
           Episodes
         </button>
       </div>
     </div>  
   </div>
  `)
    
  $showsList.append($show);  
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {  //handleSearch
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = res.data.map( episode => { 

    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
      // summary: episode.summary
    };
  });

  return episodes;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();

  for (let episode of episodes) {
  let $episode = $(`<li>${episode.name} (Season ${episode.season}, Episode ${episode.number})</li>`);
  $episodesList.append($episode);  
  }

  $("#episodes-area").show();
 }

// async function getAndDisplayEpisodes() {  //handleClick
//   const episodes = await getEpisodesOfShow();
// }

$('#shows-list').on("click", ".Show-getEpisodes", async function(evt) {
  // console.log('clicked!');
  let showId = $(evt.target).closest(".Show").data("show-id");
  console.log(showId);
  let episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
});