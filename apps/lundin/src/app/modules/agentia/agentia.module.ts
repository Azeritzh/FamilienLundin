import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { AgentiaComponent } from "./agentia.component"

@NgModule({
	declarations: [AgentiaComponent],
	imports: [
		BrowserModule,
		SharedModule,
	],
	providers: [],
})
export class AgentiaModule { }
