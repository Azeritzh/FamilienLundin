import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { MarkdownModule } from "ngx-markdown"
import { SharedModule } from "../../shared/shared.module"
import { AddRecipeComponent } from "./add-recipe/add-recipe.component"
import { EditRecipeComponent } from "./edit-recipe/edit-recipe.component"
import { RecipesService } from "./recipes.service"
import { RecipesComponent } from "./recipes/recipes.component"

@NgModule({
	declarations: [
		RecipesComponent,
		AddRecipeComponent,
		EditRecipeComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		MarkdownModule.forRoot(),
		SharedModule,
	],
	providers: [RecipesService],
	exports: [
		RecipesComponent,
	],
})
export class RecipesModule { }
