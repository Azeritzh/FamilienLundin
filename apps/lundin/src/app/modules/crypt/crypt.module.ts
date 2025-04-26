import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { SharedModule } from "../../shared/shared.module"
import { CryptComponent } from "./crypt.component"
import { CryptService } from "./crypt.service"

@NgModule({
	declarations: [CryptComponent],
	imports: [
		CommonModule,
		SharedModule,
	],
	providers: [CryptService],
})
export class CryptModule { }
