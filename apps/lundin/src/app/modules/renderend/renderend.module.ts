import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { SharedModule } from "../../shared/shared.module"
import { RenderendComponent } from "./renderend.component"

@NgModule({
	declarations: [
		RenderendComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
	],
	providers: [],
})
export class RenderendModule { }
