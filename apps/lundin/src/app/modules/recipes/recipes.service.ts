import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Recipe } from "@lundin/api-interfaces"

@Injectable()
export class RecipesService {
	constructor(private httpClient: HttpClient) { }

	getRecipes() {
		return this.httpClient.get<Recipe[]>("api/recipe/get-recipes").toPromise()
	}

	async addRecipe(recipe: Recipe, file?: File) {
		if (file)
			recipe.fileId = await this.uploadFile(file)
		return this.httpClient.post<Recipe>("api/recipe/add-recipe", recipe).toPromise()
	}

	private async uploadFile(file: File) {
		const formdata = new FormData()
		formdata.set("file", file)
		const { id } = await this.httpClient.post<{ id: string }>("api/recipe/upload-file", formdata).toPromise()
		return id + "/" + file.name
	}

	async updateRecipe(recipe: Recipe, file?: File) {
		if (file)
			recipe.fileId = await this.uploadFile(file)
		return this.httpClient.post<Recipe>("api/recipe/update-recipe", recipe).toPromise()
	}
}
