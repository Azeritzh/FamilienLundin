import { Routes } from "@angular/router"
import { RecipeComponent } from "./recipe/recipe.component"
import { RecipesComponent } from "./recipes/recipes.component"

export const recipesRoutes: Routes = [
	{ path: "", component: RecipesComponent },
	{ path: ":id", component: RecipeComponent },
]
