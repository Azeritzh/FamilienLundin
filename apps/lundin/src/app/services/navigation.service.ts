import { Injectable, Type } from "@angular/core"
import { NavigationEnd, Router } from "@angular/router"
import { Subject } from "rxjs"

@Injectable({
	providedIn: "root",
})
export class NavigationService {
	overlay$ = new Subject<{ component?: Type<any>, init?: (component: any) => void }>()
	message$ = new Subject<string | null>()

	constructor(router: Router) {
		router.events.subscribe(x => {
			if(x instanceof NavigationEnd)
				this.afterNavigation()
		})
	}

	private afterNavigation(){
		this.closeOverlay()
		this.closeMessage()
	}

	openAsOverlay<T>(component: Type<T>) {
		return new Promise<T>(resolve => {
			this.overlay$.next({ component, init: (instance: T) => resolve(instance) })
		})
	}

	closeOverlay() {
		this.overlay$.next({})
	}

	showMessage(message: string) {
		this.message$.next(message)
	}

	closeMessage() {
		this.message$.next(null)
	}
}
