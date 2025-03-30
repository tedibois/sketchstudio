
import { useEffect, useRef, useState } from "react";
import { Canvas, IEvent, PencilBrush, StaticCanvas } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Save,
  Trash2,
  Download,
  Undo,
  Circle,
  Square,
  Pencil,
} from "lucide-react";

type DrawingCanvasProps = {
  onSave?: (dataUrl: string) => void;
  width?: number;
  height?: number;
};

const DrawingCanvas = ({
  onSave,
  width = 800,
  height = 600,
}: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#000000");
  const [history, setHistory] = useState<string[]>([]);
  const [activeToolType, setActiveToolType] = useState<
    "brush" | "rectangle" | "circle"
  >("brush");
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#ffffff",
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.width = brushSize;
    canvas.freeDrawingBrush.color = brushColor;
    canvas.isDrawingMode = true;

    // Save initial state
    const initialState = canvas.toJSON();
    setHistory([JSON.stringify(initialState)]);

    // Add event listener for object modifications
    canvas.on("object:added", () => {
      const currentState = canvas.toJSON();
      setHistory((prevHistory) => [
        ...prevHistory,
        JSON.stringify(currentState),
      ]);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [width, height]);

  // Update brush size
  useEffect(() => {
    if (fabricCanvas && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.width = brushSize;
    }
  }, [brushSize, fabricCanvas]);

  // Update brush color
  useEffect(() => {
    if (fabricCanvas && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = brushColor;
    }
  }, [brushColor, fabricCanvas]);

  // Handle tool type change
  useEffect(() => {
    if (!fabricCanvas) return;

    switch (activeToolType) {
      case "brush":
        fabricCanvas.isDrawingMode = true;
        break;
      case "rectangle":
      case "circle":
        fabricCanvas.isDrawingMode = false;
        break;
    }
  }, [activeToolType, fabricCanvas]);

  // Add shape to canvas
  const addShape = (type: "rectangle" | "circle") => {
    if (!fabricCanvas) return;

    const center = fabricCanvas.getCenter();
    const options = {
      left: center.left,
      top: center.top,
      fill: brushColor,
      width: 100,
      height: 100,
      radius: 50,
    };

    if (type === "rectangle") {
      fabricCanvas.add(new fabric.Rect(options));
    } else if (type === "circle") {
      fabricCanvas.add(new fabric.Circle(options));
    }

    fabricCanvas.renderAll();
  };

  // Clear canvas
  const clearCanvas = () => {
    if (!fabricCanvas) return;
    
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    
    // Save new state
    const clearedState = fabricCanvas.toJSON();
    setHistory([JSON.stringify(clearedState)]);
    
    toast("Canvas cleared!");
  };

  // Undo last action
  const undo = () => {
    if (!fabricCanvas || history.length <= 1) return;
    
    const newHistory = [...history];
    newHistory.pop(); // Remove current state
    const previousState = newHistory[newHistory.length - 1];
    
    fabricCanvas.loadFromJSON(previousState, () => {
      fabricCanvas.renderAll();
      setHistory(newHistory);
    });
    
    toast("Undid last action");
  };

  // Save canvas
  const saveCanvas = () => {
    if (!fabricCanvas) return;
    
    const dataUrl = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
    });
    
    if (onSave) {
      onSave(dataUrl);
    }
    
    toast.success("Drawing saved!");
  };

  // Download canvas
  const downloadCanvas = () => {
    if (!fabricCanvas) return;
    
    const dataUrl = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
    });
    
    const link = document.createElement("a");
    link.download = `sketchsocial-drawing-${new Date().toISOString()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast("Drawing downloaded!");
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-w-full">
      <div className="p-1 border rounded-lg shadow-md bg-background overflow-hidden max-w-full">
        <canvas
          ref={canvasRef}
          className="max-w-full canvas-container touch-none border rounded"
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center w-full">
        <div className="flex items-center p-2 gap-2 rounded-lg border bg-card">
          <Button
            variant={activeToolType === "brush" ? "default" : "outline"}
            size="icon"
            onClick={() => setActiveToolType("brush")}
            title="Brush"
          >
            <Pencil size={18} />
          </Button>
          <Button
            variant={activeToolType === "rectangle" ? "default" : "outline"}
            size="icon"
            onClick={() => {
              setActiveToolType("rectangle");
              addShape("rectangle");
            }}
            title="Rectangle"
          >
            <Square size={18} />
          </Button>
          <Button
            variant={activeToolType === "circle" ? "default" : "outline"}
            size="icon"
            onClick={() => {
              setActiveToolType("circle");
              addShape("circle");
            }}
            title="Circle"
          >
            <Circle size={18} />
          </Button>
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg border bg-card">
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="w-8 h-8 border-none rounded cursor-pointer"
            title="Color picker"
          />
          <div className="flex items-center gap-2 w-48">
            <span className="text-sm">Size:</span>
            <Slider
              value={[brushSize]}
              min={1}
              max={50}
              step={1}
              onValueChange={(value) => setBrushSize(value[0])}
            />
          </div>
        </div>

        <div className="flex items-center p-2 gap-2 rounded-lg border bg-card">
          <Button
            variant="outline"
            size="icon"
            onClick={undo}
            disabled={history.length <= 1}
            title="Undo"
          >
            <Undo size={18} />
          </Button>
          <Button variant="outline" size="icon" onClick={clearCanvas} title="Clear">
            <Trash2 size={18} />
          </Button>
          <Button variant="outline" size="icon" onClick={downloadCanvas} title="Download">
            <Download size={18} />
          </Button>
          <Button onClick={saveCanvas} title="Save">
            <Save size={18} className="mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
