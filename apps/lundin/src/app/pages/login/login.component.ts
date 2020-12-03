import { Component } from "@angular/core"
import { AuthService } from "../../auth/auth.service"

@Component({
	selector: "lundin-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
	title = "Velkommen til Familien Lundin"
	subtitle = "En privat familieside"
	name = ""
	password = ""

	constructor(private authService: AuthService) { }

	login() {
		this.authService.login(this.name, this.password)
	}
}
