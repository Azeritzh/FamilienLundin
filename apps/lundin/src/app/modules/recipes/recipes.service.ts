import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Recipe } from "@lundin/api-interfaces"

@Injectable()
export class RecipesService {
	constructor(private httpClient: HttpClient) { }

	getRecipes() {
		return this.httpClient.get<Recipe[]>("api/recipe/get-recipes").toPromise()
	}

	addRecipe(recipe: Recipe){
		return this.httpClient.post<Recipe>("api/recipe/add-recipe", recipe).toPromise()
	}

	updateRecipe(recipe: Recipe) {
		return this.httpClient.post("api/recipe/update-recipe", recipe).toPromise()
	}
}
