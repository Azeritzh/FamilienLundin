import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { NoughtsAndCrossesComponent } from "./noughts-and-crosses.component"

@NgModule({
	declarations: [NoughtsAndCrossesComponent],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [],
})
export class NoughtsAndCrossesModule { }
