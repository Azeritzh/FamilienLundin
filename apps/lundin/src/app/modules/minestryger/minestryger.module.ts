import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { MinestrygerComponent } from "./minestryger.component"

@NgModule({
	declarations: [MinestrygerComponent],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [],
})
export class MinestrygerModule { }
