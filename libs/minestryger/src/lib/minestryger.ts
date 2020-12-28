import { AgEngine } from "@lundin/age"
import { MinestrygerConfig } from "./minestryger-config"
import { MinestrygerState } from "./minestryger-state"

export class Minestryger {
	state = new MinestrygerState(new MinestrygerConfig(30, 16, 50))
	engine = new AgEngine<MinestrygerAction>([], [], this.state)
}

export class MinestrygerAction {

}