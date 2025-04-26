import { Component } from "@angular/core"
import { AuthService } from "../../services/auth.service"
import { NavigationService } from "../../services/navigation.service"

@Component({
	selector: "lundin-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	standalone: false,
})
export class LoginComponent {
	title = "Velkommen til Familien Lundin"
	subtitle = "En privat familieside"
	name = ""
	password = ""

	constructor(
		private authService: AuthService,
		private navigationService: NavigationService
	) { }

	async login() {
		const success = await this.authService.login(this.name, this.password)
		if (!success)
			this.navigationService.showMessage("Log ind fejlede")
	}
}
