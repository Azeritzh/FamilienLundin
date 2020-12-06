import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"

@Component({
	selector: "lundin-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent {
	password: string
	newPassword: string

	constructor(private http: HttpClient) { }

	async changePassword() {
		const blob = btoa(JSON.stringify({ password: this.password, newPassword: this.newPassword }))
		this.password = ""
		this.newPassword = ""
		const response = await this.http.post<{ success: string }>("/api/auth/change", { blob }).toPromise()
		console.log(response)
	}
}
