import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { FileInputComponent } from "./file-input/file-input.component"
import { UserPipe } from "./pipes/user.pipe"

@NgModule({
	declarations: [
		FileInputComponent,
		UserPipe,
	],
	imports: [
		CommonModule,
		FormsModule,
	],
	exports: [
		FileInputComponent,
		FormsModule,
		UserPipe,
	],
})
export class SharedModule { }
