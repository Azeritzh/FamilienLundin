import { AgEngine } from '@lundin/age'
import { MinestrygerState } from "./minestryger-state"

export class Minestryger {
    state = new MinestrygerState()
    engine = new AgEngine<MinestrygerAction>([], [], this.state)
}

export class MinestrygerAction {

}