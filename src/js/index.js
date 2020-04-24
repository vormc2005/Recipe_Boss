import Search from './models/search';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';

/**Global state
 * Search object
 * current recipe object
 * shopping list object
 * liked recipes
 */

const state = {};


/**Search Controller
 * 
 * 
 * 
 * 
 */
const controlSearch = async ()=>{
    const query = searchView.getInput();

    // const query = 'pizza';

    console.log(query)

    if(query){
        //New search object and add to state
        state.search = new Search(query);
        //Clear previous results and prepare UI
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes)
        //Search for recipes
        await state.search.getResults();

        //render results on ui
        clearLoader();
      searchView.renderResults(state.search.result);

    }
}

elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});
//Testing
// window.addEventListener('load', e =>{
//     e.preventDefault();
//     controlSearch();
// });

/**Testing search
 * const search = new Search('pizza')
 * console.log(search)
 * search.getResults();
 */

elements.searchResPages.addEventListener('click', e =>{
    // console.log(e.target)
    const btn = e.target.closest('.btn-inline');
    console.log(btn)
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        // console.log(goToPage)
    }
})

/**
 * 
 * Recipe Conrtroller
 */

 /* Testing Recipe API call
 const r = new Recipe(46956);
 r.getRecipe();
 console.log(r)
*/

const controlRecipe= async ()=>{

    //Get Id from url
    const id = window.window.location.hash.replace('#', '');
    console.log(id)

    if(id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe)

        //Highlight selected
       if(state.search) {
           searchView.highlightSelected(id)};

        //Create new recipe object
        state.recipe = new Recipe(id);
        // window.r = state.recipe;
        try{

        //Get recipe data
       await state.recipe.getRecipe();
    //    console.log(state.recipe.ingredients)
       state.recipe.parseIngredients();

        //Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings()
        //render recipe
        clearLoader()
       
        recipeView.renderRecipe(state.recipe)
        console.log(state.recipe)
        }catch (err){
            alert('Error processing recipe')
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event=>window.addEventListener(event, controlRecipe));


//Handling recipe button clicks on the recipe to change servings size

elements.recipe.addEventListener('click', e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease buttone is clicked
        // console.log('decrease')
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredients(state.recipe)
        }
       
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
            //Increase button is clicked
            // console.log('increase')
            state.recipe.updateServings('inc')
            recipeView.updateServingsIngredients(state.recipe)
    }
    console.log(state.recipe)
       
})



