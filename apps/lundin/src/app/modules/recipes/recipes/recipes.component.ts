import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { AddRecipeComponent } from "../add-recipe/add-recipe.component"
import { EditRecipeComponent } from "../edit-recipe/edit-recipe.component"

@Component({
	selector: "lundin-recipes",
	templateUrl: "./recipes.component.html",
	styleUrls: ["./recipes.component.scss"]
})
export class RecipesComponent {

	constructor(
		private navigationService: NavigationService,
	) {	}

	add() {
		this.navigationService.openAsOverlay(AddRecipeComponent)
	}

	edit() {
		this.navigationService.openAsOverlay(EditRecipeComponent)
	}
}
