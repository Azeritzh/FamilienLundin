import { Component, ComponentFactoryResolver, HostBinding, OnInit, Type, ViewChild } from "@angular/core"
import { Router } from "@angular/router"
import { first } from "rxjs/operators"
import { OverlayHostDirective } from "../directives/overlay-host.directive"
import { AuthService } from "../services/auth.service"
import { NavigationService } from "../services/navigation.service"

@Component({
	selector: "lundin-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	header = "Familien Lundin"
	navigationEntries: NavigationEntry[] = [
		{ text: "Hjem", link: "/", imageUrl: "/assets/images/icons/Home_icon.svg" },
		{ text: "Kalender", link: "/calendar", imageUrl: "/assets/images/icons/Calendar_icon.svg", mustBeLoggedIn: true },
		{ text: "Familie", link: "/ancestry", imageUrl: "/assets/images/icons/Family_icon.svg" },
		{ text: "Galleri", link: "/gallery", imageUrl: "/assets/images/icons/Gallery_icon.svg", mustBeLoggedIn: true },
		{ text: "Opskrifter", link: "/recipes", imageUrl: "/assets/images/icons/Recipes_icon.svg", mustBeLoggedIn: true },
		{ text: "Musik", link: "/music", imageUrl: "/assets/images/icons/Gallery_icon.svg", mustBeLoggedIn: true },
		{ text: "Video", link: "/video", imageUrl: "/assets/images/icons/Gallery_icon.svg", mustBeLoggedIn: true },
		{ text: "Diverse", link: "/various", imageUrl: "/assets/images/icons/Home_icon.svg" },
	]
	@HostBinding("class.hidden-navigation") hideNavigation = true

	@ViewChild("overlayHost", { read: OverlayHostDirective, static: true }) overlayHost: OverlayHostDirective
	showingLoading = true
	showingOverlay = false
	showingMessage = false
	message = ""

	constructor(
		public authService: AuthService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private navigationService: NavigationService,
		private router: Router,
	) {
		this.navigationService.overlay$.subscribe(({ component, init }) => {
			this.overlayHost.viewContainerRef.clear()
			this.showingOverlay = false
			if (component)
				init(this.openAsOverlay(component))
		})
		this.navigationService.message$.subscribe(message => {
			this.showingMessage = !!message
			this.message = message
		})
		Object.defineProperty(this.navigationEntries[0], "text", { get: () => this.authService.isLoggedIn() ? "Hjem" : "Log ind" })
	}

	ngOnInit() {
		if (this.authService.isLoggedIn())
			this.showingLoading = false
		else
			this.authService.onRefreshResponse.pipe(first()).subscribe(() => this.showingLoading = false)
	}

	private openAsOverlay<T>(component: Type<T>): T {
		const factory = this.componentFactoryResolver.resolveComponentFactory(component)
		const componentRef = this.overlayHost.viewContainerRef.createComponent(factory)
		this.showingOverlay = true
		return componentRef.instance
	}

	closeOverlay(event: MouseEvent) {
		event.stopPropagation()
		if (event.target === event.currentTarget)
			this.navigationService.closeOverlay()
	}

	closeMessage() {
		this.showingMessage = false
	}

	firstLetterOf(name: string) {
		return name[0]
	}

	shownNavigationEntries() {
		const isLoggedIn = this.authService.isLoggedIn()
		return this.navigationEntries.filter(x => x.mustBeLoggedIn ? isLoggedIn : true)
	}

	async logout(){
		await this.authService.logout()
		this.router.navigateByUrl("/")
	}
}

interface NavigationEntry {
	text: string
	link: string
	imageUrl: string
	mustBeLoggedIn?: boolean
}
