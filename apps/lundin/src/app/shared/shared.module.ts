import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { UserPipe } from "./pipes/user.pipe"

@NgModule({
	declarations: [
		UserPipe,
	],
	imports: [
		CommonModule,
		FormsModule,
	],
	exports: [
		FormsModule,
		UserPipe,
	],
})
export class SharedModule { }
