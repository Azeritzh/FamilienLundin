import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { RouterModule } from "@angular/router"
import { MarkdownModule } from "ngx-markdown"
import { SharedModule } from "../../shared/shared.module"
import { RecipeFormComponent } from "./recipe-form/recipe-form.component"
import { RecipeComponent } from "./recipe/recipe.component"
import { RecipesRootComponent } from "./recipes-root/recipes-root.component"
import { RecipesService } from "./recipes.service"
import { RecipesComponent } from "./recipes/recipes.component"

@NgModule({
	declarations: [
		RecipeFormComponent,
		RecipeComponent,
		RecipesComponent,
		RecipesRootComponent,
	],
	imports: [
		CommonModule,
		MarkdownModule.forRoot(),
		SharedModule,
		RouterModule,
	],
	providers: [RecipesService],
	exports: [
		RecipesRootComponent,
	],
})
export class RecipesModule { }
