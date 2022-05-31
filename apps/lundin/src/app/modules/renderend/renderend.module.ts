import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { RenderendComponent } from "./renderend.component"

@NgModule({
	declarations: [RenderendComponent],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [],
})
export class RenderendModule { }
