import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { KingdomsDisplayComponent } from "./kingdoms-display/kingdoms-display.component"
import { KingdomsEditorComponent } from "./kingdoms-editor/kingdoms-editor.component"
import { KingdomsComponent } from "./kingdoms.component"

@NgModule({
	declarations: [
		KingdomsComponent,
		KingdomsDisplayComponent,
		KingdomsEditorComponent,
	],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [],
})
export class KingdomsModule { }
