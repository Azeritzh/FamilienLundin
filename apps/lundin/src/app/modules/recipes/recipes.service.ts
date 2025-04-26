import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Recipe } from "@lundin/api-interfaces"
import { firstValueFrom } from "rxjs"

@Injectable({
	providedIn: "root",
})
export class RecipesService {
	constructor(private httpClient: HttpClient) { }

	getRecipes() {
		return firstValueFrom(this.httpClient.get<Recipe[]>("api/recipe/get-recipes"))
	}

	async addRecipe(recipe: Recipe, file?: File) {
		if (file)
			recipe.fileId = await this.uploadFile(file)
		return firstValueFrom(this.httpClient.post<Recipe>("api/recipe/add-recipe", recipe))
	}

	private async uploadFile(file: File) {
		const formdata = new FormData()
		formdata.set("file", file)
		const { id } = await firstValueFrom(this.httpClient.post<{ id: string }>("api/recipe/upload-file", formdata))
		return id + "/" + file.name
	}

	async updateRecipe(recipe: Recipe, file?: File) {
		if (file)
			recipe.fileId = await this.uploadFile(file)
		return firstValueFrom(this.httpClient.post<Recipe>("api/recipe/update-recipe", recipe))
	}
}
