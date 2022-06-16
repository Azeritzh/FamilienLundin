import { DisplayConfig } from "./minestryger-display"

export const defaultDisplayConfig: DisplayConfig = {
	defaultFieldSize: 25,
	useAvailableSize: false,
	newGameText: "New game",
	sprites: {
		hidden: {
			color: "grey",
		},
		"hidden-hover": {
			color: "lightgrey",
		},
		flag: {
			text: "⚑",
			color: "grey",
			textcolor: "red",
			font: "serif",
			fontWeight: "",
		},
		"flag-hover": {
			text: "⚑",
			color: "lightgrey",
			textcolor: "red",
			font: "serif",
			fontWeight: "",
		},
		bomb: {
			text: "💣",
			color: "red",
			font: "serif",
			fontWeight: "",
			fontScale: 0.6,
		},
		"0": {},
		"1": {
			text: "1",
			textcolor: "#0100fe",
		},
		"2": {
			text: "2",
			textcolor: "#017f01",
		},
		"3": {
			text: "3",
			textcolor: "#fe0000",
		},
		"4": {
			text: "4",
			textcolor: "#010080",
		},
		"5": {
			text: "5",
			textcolor: "#810102",
		},
		"6": {
			text: "6",
			textcolor: "#008081",
		},
		"7": {
			text: "7",
			textcolor: "#000000",
		},
		"8": {
			text: "8",
			textcolor: "#808080",
		},
	},
	styling: `
.game-host {
	position: relative;
	display: grid;
	grid-template-areas: "settings game game game aber"
		"settings time button bombs aber"
		"settings free free free aber";
	grid-template-rows: max-content 2rem;
	grid-template-columns: 1fr 3rem max-content 3rem 1fr;
	justify-content: center;
}

.game-host .settings-section { grid-area: settings; }
.game-host canvas { grid-area: game; }

.game-host .bombs, .game-host .time {
	width: 3rem;
	height: 2rem;
	text-align: center;
	line-height: 2rem;
	font-weight: bold;
	font-size: 1.2rem;
	color: red;
	background-color: black;
}

.game-host .time {
	grid-area: time;
}

.game-host .bombs {
	grid-area: bombs;
	margin-left: auto;
}

.game-host .button {
	grid-area: button;
	border-radius: 0;
}

.settings-section {
	margin-right: 0.5rem;
	width: 250px;
}

.settings-section h1 {
	font-size: 1.2rem;
	font-weight: bold;
	line-height: 2rem;
	text-align: center;
	margin-bottom: 0.5rem;
	background-color: var(--color-primary);
	color: var(--color-text-light);
}

.settings-section .setting {
	display: flex;
	margin-bottom: 0.2rem;
}
.settings-section .setting * { line-height: 2rem; }
.settings-section .setting label { flex: 1; }
.settings-section .setting input { width: 4rem; }
.settings-section .setting button { flex: 1; }
`,
}
