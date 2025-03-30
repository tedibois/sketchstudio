
import React, { useRef, useEffect, useState } from "react";
import { Canvas, TEvent } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  Paintbrush,
  Square,
  Circle,
  StraightLine,
  Type,
  Eraser,
  Trash2,
  Download,
  Save,
  Undo,
  Redo,
  ArrowLeft,
} from "lucide-react";

export type DrawingCanvasProps = {
  onSave?: (dataUrl: string) => void;
  onBack?: () => void;
  className?: string;
  initialImage?: string;
};

type Tool = "brush" | "rectangle" | "circle" | "line" | "text" | "eraser" | "select";

const DrawingCanvas = ({ onSave, onBack, className, initialImage }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("brush");
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState("#000000");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const initCanvas = async () => {
      try {
        const canvas = new Canvas(canvasRef.current, {
          width: 800,
          height: 600,
          backgroundColor: "#ffffff",
          isDrawingMode: activeTool === "brush",
        });

        fabricCanvasRef.current = canvas;

        // Initialize brush settings
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = color;
          canvas.freeDrawingBrush.width = brushSize;
        }

        // Load initial image if provided
        if (initialImage) {
          try {
            Canvas.Image.fromURL(initialImage, (img) => {
              canvas.add(img);
              canvas.renderAll();
              saveToHistory();
            });
          } catch (error) {
            console.error("Error loading initial image:", error);
          }
        } else {
          saveToHistory();
        }

        // Add event listeners
        canvas.on("object:added", saveToHistory);
        canvas.on("object:modified", saveToHistory);
        canvas.on("object:removed", saveToHistory);

        setIsDrawing(true);
      } catch (error) {
        console.error("Error initializing canvas:", error);
        toast.error("Failed to initialize drawing canvas");
      }
    };

    initCanvas();

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, []);

  // Update active tool
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    canvas.isDrawingMode = activeTool === "brush" || activeTool === "eraser";

    if (canvas.freeDrawingBrush) {
      if (activeTool === "eraser") {
        canvas.freeDrawingBrush.color = "#ffffff";
      } else {
        canvas.freeDrawingBrush.color = color;
      }
      canvas.freeDrawingBrush.width = brushSize;
    }

    // Set selection mode for non-drawing tools
    if (activeTool === "select") {
      canvas.selection = true;
    }
  }, [activeTool, color, brushSize]);

  const saveToHistory = () => {
    if (!fabricCanvasRef.current) return;

    try {
      const canvas = fabricCanvasRef.current;
      const json = JSON.stringify(canvas.toJSON());

      // Only save if something changed
      if (history.length === 0 || history[historyIndex] !== json) {
        // Remove any forward history if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(json);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);
  };

  const handleAddShape = (shape: "rectangle" | "circle" | "line" | "text") => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    let object;

    switch (shape) {
      case "rectangle":
        object = new Canvas.Rect({
          left: 100,
          top: 100,
          fill: color,
          width: 100,
          height: 100,
          strokeWidth: 2,
          stroke: color,
        });
        break;
      case "circle":
        object = new Canvas.Circle({
          left: 100,
          top: 100,
          fill: color,
          radius: 50,
          strokeWidth: 2,
          stroke: color,
        });
        break;
      case "line":
        object = new Canvas.Line([50, 100, 150, 100], {
          left: 100,
          top: 100,
          stroke: color,
          strokeWidth: brushSize,
        });
        break;
      case "text":
        object = new Canvas.Textbox("Text", {
          left: 100,
          top: 100,
          fill: color,
          fontFamily: "Arial",
          fontSize: 20,
        });
        break;
    }

    if (object) {
      canvas.add(object);
      canvas.setActiveObject(object);
      canvas.renderAll();
    }
  };

  const handleClear = () => {
    if (!fabricCanvasRef.current) return;

    if (confirm("Are you sure you want to clear the canvas?")) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = "#ffffff";
      fabricCanvasRef.current.renderAll();
      saveToHistory();
      toast.success("Canvas cleared");
    }
  };

  const handleDownload = () => {
    if (!fabricCanvasRef.current) return;

    try {
      const dataUrl = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 1
      });
      const link = document.createElement("a");
      link.download = "drawing.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  const handleSave = () => {
    if (!fabricCanvasRef.current || !onSave) return;

    try {
      const dataUrl = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 1
      });
      onSave(dataUrl);
      toast.success("Drawing saved");
    } catch (error) {
      console.error("Error saving image:", error);
      toast.error("Failed to save image");
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0 && fabricCanvasRef.current) {
      try {
        const canvas = fabricCanvasRef.current;
        const newIndex = historyIndex - 1;
        canvas.loadFromJSON(JSON.parse(history[newIndex]), () => {
          canvas.renderAll();
          setHistoryIndex(newIndex);
        });
      } catch (error) {
        console.error("Error undoing:", error);
        toast.error("Failed to undo");
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && fabricCanvasRef.current) {
      try {
        const canvas = fabricCanvasRef.current;
        const newIndex = historyIndex + 1;
        canvas.loadFromJSON(JSON.parse(history[newIndex]), () => {
          canvas.renderAll();
          setHistoryIndex(newIndex);
        });
      } catch (error) {
        console.error("Error redoing:", error);
        toast.error("Failed to redo");
      }
    }
  };

  if (!isDrawing) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-card border rounded-lg">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Loading drawing canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2 p-2 bg-card rounded-lg border">
        {onBack && (
          <Button variant="outline" size="icon" onClick={onBack} title="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant={activeTool === "brush" ? "default" : "outline"}
          size="icon"
          onClick={() => handleToolClick("brush")}
          title="Brush"
        >
          <Paintbrush className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === "rectangle" ? "default" : "outline"}
          size="icon"
          onClick={() => {
            handleToolClick("rectangle");
            handleAddShape("rectangle");
          }}
          title="Rectangle"
        >
          <Square className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === "circle" ? "default" : "outline"}
          size="icon"
          onClick={() => {
            handleToolClick("circle");
            handleAddShape("circle");
          }}
          title="Circle"
        >
          <Circle className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === "line" ? "default" : "outline"}
          size="icon"
          onClick={() => {
            handleToolClick("line");
            handleAddShape("line");
          }}
          title="Line"
        >
          <StraightLine className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === "text" ? "default" : "outline"}
          size="icon"
          onClick={() => {
            handleToolClick("text");
            handleAddShape("text");
          }}
          title="Text"
        >
          <Type className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === "eraser" ? "default" : "outline"}
          size="icon"
          onClick={() => handleToolClick("eraser")}
          title="Eraser"
        >
          <Eraser className="h-4 w-4" />
        </Button>
        
        <Button
          variant={activeTool === "select" ? "default" : "outline"}
          size="icon"
          onClick={() => handleToolClick("select")}
          title="Select"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 3l4 8H8l4-8z" />
            <path d="M12 11v10" />
          </svg>
        </Button>
        
        <div className="h-6 border-l border-border mx-1"></div>
        
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-border"
            title="Color"
          />
          
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs text-muted-foreground">Size:</span>
            <Slider
              value={[brushSize]}
              min={1}
              max={50}
              step={1}
              onValueChange={(value) => setBrushSize(value[0])}
              className="w-24"
            />
          </div>
        </div>
        
        <div className="h-6 border-l border-border mx-1"></div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleUndo}
          disabled={historyIndex <= 0}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleRedo}
          disabled={historyIndex >= history.length - 1}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
        
        <div className="h-6 border-l border-border mx-1"></div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleClear}
          className="text-destructive hover:text-destructive"
          title="Clear"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1">
            <Download className="h-4 w-4" /> Download
          </Button>
          
          {onSave && (
            <Button size="sm" onClick={handleSave} className="gap-1">
              <Save className="h-4 w-4" /> Save
            </Button>
          )}
        </div>
      </div>
      
      <div className="canvas-container relative border rounded-lg overflow-hidden shadow-sm">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </div>
  );
};

export default DrawingCanvas;
