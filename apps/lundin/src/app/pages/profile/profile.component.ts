import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"
import { firstValueFrom } from "rxjs"
import { AuthService } from "../../services/auth.service"

@Component({
	selector: "lundin-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent {
	password: string
	newPassword: string
	repeatNewPassword: string

	constructor(
		public authService: AuthService,
		private http: HttpClient,
	) { }

	async changePassword() {
		const blob = btoa(JSON.stringify({ password: this.password, newPassword: this.newPassword }))
		this.password = ""
		this.newPassword = ""
		const response = await firstValueFrom(this.http.post<{ success: string }>("/api/auth/change", { blob }))
		console.log(response)
	}
}
