export class RenderClass {
    constructor() {
        this.canvas = document.getElementById('gameCanvas')
        this.ctx = this.canvas.getContext('2d')
        
        this.gameZoom = 1
        this.rainbowColor = 0
        this.fps = '0-0',
        this.fpsDisplay = 0

        let functions = require('./functions').default(this.ctx, this.canvas, this)
        for (let i in functions) this[i] = functions[i]

        this.ScreenInformation = (event) => require('./ScreenInformation.js').default(this, event)
        this.RenderMap = (event) => require('./RenderMap.js').default(this, event)

        this.loop()
    }

    loop() {
        if (+new Date()-this.fps.split('-')[1] > 1000) {
            this.fpsDisplay = this.fps.split('-')[0]
            this.fps = `0-${+new Date()}`
        }
        this.fps = `${Number(this.fps.split('-')[0]) + 1}-${this.fps.split('-')[1]}`

        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        
        if (this.gameState) {
            this.ScreenInformation()
            this.RenderMap()
        }

        window.requestAnimationFrame(() => this.loop())
    }
}