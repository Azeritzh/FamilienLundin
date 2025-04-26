import { GenericShader } from "./generic-shader"

const vertexShader = `
attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;
uniform mat3 uWorld;
uniform mat3 uObject;
uniform vec2 uFrame;
void main(void) {
gl_Position = vec4(uWorld * uObject * vec3(aPosition, 1), 1);
vTexCoord = aTexCoord + uFrame;
}`

const fragmentShader = `
precision mediump float;
uniform sampler2D uImage;
uniform vec4 uColor;
varying vec2 vTexCoord;
void main(void) {
gl_FragColor = texture2D(uImage, vTexCoord) * uColor;
}`

export class StandardShader extends GenericShader {
	constructor(
		gl: WebGL2RenderingContext,
		public aPositionLocation = 0,
		public aTexCoordLocation = 0,
		public uImageLocation: WebGLUniformLocation | null = null,
		public uColorLocation: WebGLUniformLocation | null = null,
		public uWorldLocation: WebGLUniformLocation | null = null,
		public uObjectLocation: WebGLUniformLocation | null = null,
		public uFrameLocation: WebGLUniformLocation | null = null,
	) {
		super(gl, vertexShader, fragmentShader)
		this.aPositionLocation = gl.getAttribLocation(this.program, "aPosition")
		this.aTexCoordLocation = gl.getAttribLocation(this.program, "aTexCoord")
		this.uImageLocation = gl.getUniformLocation(this.program, "uImage")
		this.uColorLocation = gl.getUniformLocation(this.program, "uColor")
		this.uWorldLocation = gl.getUniformLocation(this.program, "uWorld")
		this.uObjectLocation = gl.getUniformLocation(this.program, "uObject")
		this.uFrameLocation = gl.getUniformLocation(this.program, "uFrame")
	}
}
