import Search from './models/search';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';
import Recipe from './models/Recipe';
import List from './models/list';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import Likes from './models/Likes';
import * as likeView from './views/likesView';

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
    // console.log(id)

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
       
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id)
            )
        console.log(state.recipe)
        }catch (err){
            cconsole.log(err)
            alert('Error processing recipe')
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event=>window.addEventListener(event, controlRecipe));

/***
 * 
 * List Controller
 * 
 */

 const controlList=( )=>{
     if(!state.list)state.list = new List();
     
     //add each ingredient to the list

     state.recipe.ingredients.forEach(el =>{
         const item = state.list.addItem(el.count, el.unit, el.ingredient)
         listView.renderItem(item)
     })
 }

 //Handdle delete and update list items

 elements.shopping.addEventListener('click', e=>{
     const id = e.target.closest('.shopping__item').dataset.itemid;

     if (e.target.matches('.shopping__delete, .shopping__delete *')){
         state.list.deleteItem(id)

         //Delete fro UI

         listView.deleteItem(id)
     }else if (e.target.matches('.shopping__count-value')){
         const val = parseFloat(e.target.value)
         state.list.updateCount(id, val)
     }
     

 })
//Testing
 state.likes = new Likes();

 const controlLike= ()=>{
    if(!state.likes)  state.likes = new Likes();
    const currentID = state.recipe.id;


    if(!state.likes.isLiked(currentID)){
        //Add like to the state
            const newLike = state.likes.addLike(
                currentID,
                state.recipe.title,
                state.recipe.author,
                state.recipe.img,                
            );
        //Toggle th button
        likeView.toggleLikBtn(true)
        //Add to UI list
        likeView.renderLike(newLike)
// console.log(state.likes)
        //User hase liked current recipe

 }else {
    state.likes.deleteLike(currentID);

    //Toogle button
    likeView.toggleLikBtn(false)

    //Remove it form the list
    // console.log(state.likes);
    likeView.deleteLike(currentID)

        };
        likeView.toggleLikeMenu(state.likes.getNumLikes())
 }
 


window.addEventListener('load', ()=>{
    state.likes = new Likes();

    state.likes.readStorage();

    likeView.toggleLikeMenu(state.likes.getNumLikes());

    //Render existing likes
    state.likes.likes.forEach(like => likeView.renderLike(like));

})
 


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
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){

        //add ingredints to shopping cart

        controlList()
    }else if (e.target.matches('.recipe__love, .recipe__love *')){
            //Like Controller
            controlLike();
    }
    // console.log(state.recipe)
       
})

window.l = new List();




