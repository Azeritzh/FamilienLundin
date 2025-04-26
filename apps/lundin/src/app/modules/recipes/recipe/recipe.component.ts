import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Recipe } from "@lundin/api-interfaces"
import { NavigationService } from "../../../services/navigation.service"
import { LabellingDirective } from "../../../shared/directives/labelling.directive"
import { RecipeFormComponent } from "../recipe-form/recipe-form.component"
import { RecipesService } from "../recipes.service"

@Component({
	selector: "lundin-recipe",
	templateUrl: "./recipe.component.html",
	styleUrls: ["./recipe.component.scss"],
	imports: [
		CommonModule,
		LabellingDirective,
	],
})
export class RecipeComponent implements OnInit {
	recipe = <Recipe>{}

	constructor(
		private activatedRoute: ActivatedRoute,
		private navigationService: NavigationService,
		private recipesService: RecipesService,
	) { }

	ngOnInit() {
		this.activatedRoute.paramMap.subscribe(async params => {
			const id = +(params.get("id") ?? 0)
			const recipes = await this.recipesService.getRecipes()
			this.recipe = recipes.find(x => x._id === id) ?? <Recipe>{}
		})
	}

	async edit() {
		const component = await this.navigationService.openAsOverlay(RecipeFormComponent)
		component.recipe = { ...this.recipe }
	}

	imagePath() {
		return `api/recipe/file/${this.recipe.fileId}`
	}
}
