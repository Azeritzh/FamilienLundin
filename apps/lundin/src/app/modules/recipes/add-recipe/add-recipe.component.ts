import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { Recipe } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { RecipesService } from "../recipes.service"

@Component({
	selector: "lundin-add-recipe",
	templateUrl: "./add-recipe.component.html",
	styleUrls: ["./add-recipe.component.scss", "../../../styles/popup-box.scss"],
})
export class AddRecipeComponent {
	file: File = null

	constructor(
		private navigationService: NavigationService,
		private recipeService: RecipesService,
		private router: Router,
	) { }

	handleFile(file: File) {
		this.file = file
	}

	async save() {
		//await this.galleryService.addImage(this.personId, this.file)
		const recipe: Recipe = {
			_id: 0,
			title: "string",
			description: "string",
			time: "string",
			persons: "string",
			ingredients: "string",
			fileId: "",
		}
		this.navigationService.closeOverlay()
		const { _id } = await this.recipeService.addRecipe(recipe, this.file)
		this.router.navigateByUrl("recipes/" + _id)
	}

	cancel() {
		this.navigationService.closeOverlay()
	}
}
