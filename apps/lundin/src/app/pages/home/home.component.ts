import { Component } from "@angular/core"
import { AddMessageComponent } from "../../modules/message/add-message/add-message.component"
import { NavigationService } from "../../services/navigation.service"

@Component({
	selector: "lundin-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.scss"]
})
export class HomeComponent {
	constructor(private navigationService: NavigationService) { }

	async addThread() {
		this.navigationService.openAsOverlay(AddMessageComponent)
	}
}
