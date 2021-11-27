import type { Recipe } from "@lundin/api-interfaces"
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { StorageService } from "../../storage/storage.service"

@Controller("recipe")
export class RecipeController {
	constructor(private readonly storageService: StorageService) { }

	@UseGuards(JwtAuthGuard)
	@Get("get-recipes")
	async getRecipes() {
		return this.storageService.recipeCollection.find()
	}

	@UseGuards(JwtAuthGuard)
	@Post("add-recipe")
	async addRecipe(@Body() recipe: Recipe) {
		return this.storageService.recipeCollection.insertOne(recipe)
	}

	@UseGuards(JwtAuthGuard)
	@Post("update-recipe")
	async updateRecipe(@Body() recipe: Recipe) {
		return this.storageService.recipeCollection.updateOne({ _id: recipe._id }, recipe)
	}
}
