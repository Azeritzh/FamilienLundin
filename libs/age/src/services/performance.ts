class AgePerformance {
	intervalId: any = 0
	element: HTMLDivElement | null = null

	timings: { [index: string]: TimingInfo } = {}

	showPerformance(interval: number) {
		this.element = document.createElement("div")
		this.element.style.position = "absolute"
		this.element.style.top = "0"
		this.element.style.whiteSpace = "pre"
		this.element.style.fontFamily = "monospace"
		this.element.style.color = "white"
		this.element.style.backgroundColor = "rgba(0,0,0,0.5)"
		this.element.style.pointerEvents = "none"
		document.body.appendChild(this.element)
		this.intervalId = setInterval(() => {
			let text = ""
			for (const key in this.timings) {
				text += key + `:
  average: ${this.timings[key].average().toFixed(2)}
  max:     ${this.timings[key].max().toFixed(2)}
`
			}
			this.element!.innerText = text
		}, interval * 1000)
	}

	hidePerformance() {
		clearInterval(this.intervalId)
		document.body.removeChild(this.element!)
		this.element = null
	}
}

class TimingInfo {
	constructor(
		public lastStarted: number,
		public lastTime: number,
		public recentTimes: number[]
	) { }

	average() {
		return this.recentTimes.sum() / this.recentTimes.length
	}

	max() {
		return this.recentTimes.max()
	}
}

const agePerformance = new AgePerformance()
;(<any>window)["agePerformance"] = agePerformance

export function startTiming(name: string) {
	if (!agePerformance.timings[name])
		agePerformance.timings[name] = new TimingInfo(0, 0, [])
	agePerformance.timings[name].lastStarted = performance.now()
}

export function finishTiming(name: string) {
	agePerformance.timings[name].lastTime = performance.now() - agePerformance.timings[name].lastStarted
	agePerformance.timings[name].recentTimes.push(agePerformance.timings[name].lastTime)
	if (agePerformance.timings[name].recentTimes.length > 100)
		agePerformance.timings[name].recentTimes.shift()
}
