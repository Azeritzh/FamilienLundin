import { Component } from "@angular/core"
import { NavigationService } from "../../../services/navigation.service"
import { RecipesService } from "../recipes.service"

@Component({
	selector: "lundin-edit-recipe",
	templateUrl: "./edit-recipe.component.html",
	styleUrls: ["./edit-recipe.component.scss", "../../../styles/popup-box.scss"],
})
export class EditRecipeComponent {

	constructor(
		private galleryService: RecipesService,
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
