import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { Recipe } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { RecipesService } from "../recipes.service"

@Component({
	selector: "lundin-recipe-form",
	templateUrl: "./recipe-form.component.html",
	styleUrls: ["./recipe-form.component.scss", "../../../styles/popup-box.scss"],
	standalone: false,
})
export class RecipeFormComponent {
	file: File | null = null
	recipe: Recipe = {
		_id: 0,
		title: "",
		description: "",
		time: "",
		persons: "",
		ingredients: "",
		fileId: "",
	}

	constructor(
		private navigationService: NavigationService,
		private recipeService: RecipesService,
		private router: Router,
	) { }

	handleFile(file: File) {
		this.file = file
	}

	async save() {
		this.navigationService.closeOverlay()
		const { _id } = this.recipe._id
			? await this.recipeService.updateRecipe(this.recipe, this.file!)
			: await this.recipeService.addRecipe(this.recipe, this.file!)
		this.router.navigateByUrl("recipes/" + _id)
	}

	cancel() {
		this.navigationService.closeOverlay()
	}

	imagePath() {
		return this.recipe.fileId
			? "api/recipe/file/" + this.recipe.fileId
			: ""
	}
}
