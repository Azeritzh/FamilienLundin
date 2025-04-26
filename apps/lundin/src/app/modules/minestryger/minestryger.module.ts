import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { SharedModule } from "../../shared/shared.module"
import { MinestrygerHighscoresComponent } from "./minestryger-highscores/minestryger-highscores.component"
import { MinestrygerComponent } from "./minestryger.component"
import { MinestrygerService } from "./minestryger.service"

@NgModule({
	declarations: [
		MinestrygerComponent,
		MinestrygerHighscoresComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
	],
	providers: [MinestrygerService],
})
export class MinestrygerModule { }
