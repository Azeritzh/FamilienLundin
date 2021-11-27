import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { Recipe } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { AddRecipeComponent } from "../add-recipe/add-recipe.component"
import { EditRecipeComponent } from "../edit-recipe/edit-recipe.component"
import { RecipesService } from "../recipes.service"

@Component({
	selector: "lundin-recipes",
	templateUrl: "./recipes.component.html",
	styleUrls: ["./recipes.component.scss"]
})
export class RecipesComponent {
	recipes: Recipe[] = []

	constructor(
		private navigationService: NavigationService,
		private recipesService: RecipesService,
		private router: Router,
	) {
		this.loadData()
	}

	async loadData() {
		this.recipes = await this.recipesService.getRecipes()
	}

	add() {
		this.navigationService.openAsOverlay(AddRecipeComponent)
	}

	edit() {
		this.navigationService.openAsOverlay(EditRecipeComponent)
	}

	open(recipe: Recipe){
		this.router.navigateByUrl("recipes/" + recipe._id)
	}

	pathFor(fileId: string) {
		return `api/recipe/file/${fileId}`
	}
}
