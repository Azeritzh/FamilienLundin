import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { MeldComponent } from "./meld.component"

@NgModule({
	declarations: [
		MeldComponent,
	],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [],
})
export class MeldModule { }
