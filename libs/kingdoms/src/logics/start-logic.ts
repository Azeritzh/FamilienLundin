import { GameLogic } from "@lundin/age"
import { KingdomsAction } from "../kingdoms-action"
import { KingdomsConfig } from "../kingdoms-config"
import { KingdomsState } from "../kingdoms-state"

export class StartLogic implements GameLogic<KingdomsAction> {
	constructor(
		private config: KingdomsConfig,
		private state: KingdomsState,
	) { }

	Update(actions: KingdomsAction[]) {
		for (const action of actions)
			console.log(action)
	}
}
