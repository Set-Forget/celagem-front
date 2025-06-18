"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eraser } from "lucide-react"

interface SignaturePadProps {
  width?: number | string
  height?: number
  onChange?: (dataUrl: string | null) => void
  value?: string | null
  backgroundColor?: string
  penColor?: string
  lineWidth?: number
}

export default function SignaturePad({
  width = "100%",
  height = 150,
  onChange,
  value,
  backgroundColor = "#FFFFFF",
  penColor = "#000000",
  lineWidth = 2,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)

  const getCanvasContext = () => {
    const canvas = canvasRef.current
    return canvas?.getContext("2d")
  }

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(
      0,
      0,
      ctx.canvas.width / (window.devicePixelRatio || 1),
      ctx.canvas.height / (window.devicePixelRatio || 1),
    )
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)

      canvas.style.width = typeof width === "number" ? `${width}px` : (width as string)
      canvas.style.height = `${height}px`

      const effectiveWidth = typeof width === "number" ? width : canvas.offsetWidth

      canvas.width = effectiveWidth * ratio
      canvas.height = height * ratio

      const ctx = getCanvasContext()
      if (ctx) {
        ctx.scale(ratio, ratio)
        drawBackground(ctx)
        ctx.strokeStyle = penColor
        ctx.lineWidth = lineWidth
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        if (value) {
          setHasSigned(true)
        }
      }
    }
  }, [width, height, backgroundColor, penColor, lineWidth, value])

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    let x, y

    if (event.nativeEvent instanceof MouseEvent) {
      x = event.nativeEvent.clientX - rect.left
      y = event.nativeEvent.clientY - rect.top
    } else if (event.nativeEvent instanceof TouchEvent) {
      x = event.nativeEvent.touches[0].clientX - rect.left
      y = event.nativeEvent.touches[0].clientY - rect.top
    } else {
      return { x: 0, y: 0 }
    }
    return { x, y }
  }

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    const ctx = getCanvasContext()
    if (!ctx) return

    const { x, y } = getCoordinates(event)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
    setHasSigned(true)
  }

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const ctx = getCanvasContext()
    if (!ctx) return

    const { x, y } = getCoordinates(event)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    const ctx = getCanvasContext()
    if (!ctx) return

    ctx.closePath()
    setIsDrawing(false)

    if (hasSigned) {
      const dataUrl = canvasRef.current?.toDataURL("image/png")
      if (onChange) {
        onChange(dataUrl || null)
      }
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = getCanvasContext()
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1))
      drawBackground(ctx)
      setHasSigned(false)
      if (onChange) {
        onChange(null)
      }
    }
  }

  return (
    <Card className="w-full border-0 shadow-none">
      <CardContent className="p-0 relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="border border-input rounded-md cursor-crosshair touch-none"
          style={{ width: typeof width === "number" ? `${width}px` : width, height: `${height}px` }}
          aria-label="Área para firmar"
        />
        <Button
          size="icon"
          variant="secondary"
          onClick={clearSignature}
          type="button"
          className="absolute top-2 right-2 bg-destructive/10 text-destructive hover:bg-destructive/15 shadow-lg shadow-destructive/10 h-7 w-7"
        >
          <Eraser />
        </Button>
      </CardContent>
    </Card>
  )
}
