const NUM_POINTS = 9
const DOT_SIZE = 7
const OFFSET = 7

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  create() {
    this.graphics = this.add.graphics({
      lineStyle: { width: 2, color: 0x00ff00 },
      fillStyle: { color: 0x000000 },
    })
    this._width = 0
    this._height = 0

    this.texts = []
    this.activeCircles = []

    for (let i = 0; i < NUM_POINTS; i++) {
      this.texts.push(
        this.add.text(0, 0, '', {
          fontFamily: 'Grotesk',
          fontSize: 25,
          color: '#000000',
        }),
      )
    }

    this.points = []

    this.input.on('pointermove', (pointer) => {
      this.drawPoints(pointer)
    })

    this.input.on('pointerdown', (pointer) => {
      this.onClick(pointer)
    })
  }

  update() {
    if (
      this._width === this.cameras.main.width &&
      this._height === this.cameras.main.height
    )
      return

    this._width = this.cameras.main.width
    this._height = this.cameras.main.height

    this.drawPoints()
  }

  onClick(pointer) {
    if (this.hoveredCircle) {
      this.activeCircles = [...this.activeCircles, this.hoveredCircle]
    } else {
      this.activeCircles = []
    }
    this.drawPoints(pointer)
  }

  drawPoints(pointer) {
    this.graphics.clear()
    const radius = Math.min(this._width, this._height) * 0.3

    this.circle = new Phaser.Geom.Circle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      radius,
    )

    this.points = []

    for (var i = 0; i < NUM_POINTS; i++) {
      var angle = Phaser.Math.FromPercent(i / NUM_POINTS, 0, Phaser.Math.PI2)

      // Rotate the points to work better for 9
      angle -= 0.175

      this.points.push(
        Phaser.Geom.Circle.CircumferencePoint(this.circle, angle),
      )
    }

    this.points = [
      ...this.points.slice(OFFSET),
      ...this.points.slice(0, OFFSET),
    ]

    let isOneHovered
    this.hoveredCircle = null
    for (var i = 0; i < this.points.length; i++) {
      var p = this.points[i]
      let text = this.texts[i]
      const circle = new Phaser.Geom.Circle(p.x, p.y + 35, DOT_SIZE)
      const isHovered = pointer && circle.contains(pointer.x, pointer.y)
      const isActive = this.activeCircles.some(
        (c) => c.x === circle.x && c.y === circle.y,
      )

      if (text) {
        text.setPosition(p.x - 7.5, p.y - 12)
        text.setText(i + 1)
        text.setAlpha(isHovered || isActive ? 1 : 0.5)
      }

      if (isHovered) {
        isOneHovered = true
        this.hoveredCircle = circle
      }

      this.graphics.fillStyle(0x000000, isHovered ? 1 : 0.5)

      this.graphics.fillCircleShape(circle)
      if (isActive) {
        this.graphics.closePath()
        this.graphics.fillStyle(0x000000)
        this.graphics.lineStyle(2, 0x000000)
        let points = [...this.activeCircles, pointer].map((p) => ({
          x: p.x,
          y: p.y,
        }))
        this.graphics.moveTo(points[0].x, points[0].y)
        points.forEach((point) => this.graphics.lineTo(point.x, point.y))
        this.graphics.strokePath()
      }
    }

    document.getElementsByTagName('canvas')[0].style.cursor = isOneHovered
      ? 'pointer'
      : ''
  }
}
