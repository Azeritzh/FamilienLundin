import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { RecipesService } from "../recipes.service"

@Component({
	selector: "lundin-add-recipe",
	templateUrl: "./add-recipe.component.html",
	styleUrls: ["./add-recipe.component.scss", "../../../styles/popup-box.scss"],
})
export class AddRecipeComponent {

	constructor(
		private recipeService: RecipesService,
		private navigationService: NavigationService,
	) { }

	async save() {
		//await this.galleryService.addImage(this.personId, this.file)
		this.navigationService.closeOverlay()
	}

	cancel() {
		this.navigationService.closeOverlay()
	}
}
