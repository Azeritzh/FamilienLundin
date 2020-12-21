import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { VirusComponent } from "./virus.component"

@NgModule({
	declarations: [VirusComponent],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [],
})
export class VirusModule { }
