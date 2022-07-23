import { BlockContext } from "./block-context"

export interface BlockDrawer {
	Draw(context: BlockContext): void
}
