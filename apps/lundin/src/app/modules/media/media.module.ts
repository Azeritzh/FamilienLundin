import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { MediaComponent } from "./media.component"

@NgModule({
	declarations: [MediaComponent],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [],
})
export class MediaModule { }
