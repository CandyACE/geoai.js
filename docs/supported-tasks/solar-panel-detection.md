# Solar Panel Detection

> **Task ID:** `solar-panel-detection`  
> **Library:** `@geobase-js/geoai`  
> **Purpose:** Specialized detection of solar panel installations in satellite and aerial imagery

## Quick Start

```typescript
import { geoai } from "@geobase-js/geoai";

// Initialize the pipeline
const solarDetectionInstance = await geoai.pipeline(
  [
    {
      task: "solar-panel-detection",
    },
  ],
  providerParams
);

// Run inference
const result = await solarDetectionInstance.inference({
  inputs: { polygon: myPolygon },
  mapSourceParams: { zoomLevel: 19 },
});

console.log(`Found ${result.detections.features.length} solar installations`);
```

## Available Models

| Model ID | Description | Best Use Case |
|----------|-------------|---------------|
| [geobase/geoai_models/solarPanelDetection_quantized](https://huggingface.co/geobase/geoai_models) | Quantized model specialized for solar panel detection | Renewable energy assessment, utility planning, compliance monitoring |

## Capabilities

- ✅ **Solar installation detection** - Rooftop and ground-mounted systems
- ✅ **Multi-scale analysis** - From residential to utility-scale installations
- ✅ **High-precision detection** - Optimized for solar panel identification
- ✅ **High-resolution support** - Best performance at 15-30cm resolution imagery
- ✅ **Geospatial integration** - Native GeoJSON output with geographic coordinates
- ✅ **Quantized model** - Optimized for fast inference and reduced memory usage

## Input Parameters

### Required Inputs

| Parameter | Type | Description |
|-----------|------|-------------|
| `polygon` | `GeoJSON.Feature<Polygon>` | Area of interest for solar panel detection |

<!-- Todo : update the map source guide link -->
### Map Source Parameters
Follow this guide for mapSourceParameters 

## Output Format

```typescript
interface ObjectDetectionResults {
  detections: GeoJSON.FeatureCollection;
  geoRawImage: GeoRawImage;
}
```

## Detected Classes

| Class | Description | Typical Use Cases |
|-------|-------------|-------------------|
| `Solar Panel` | Photovoltaic installations on rooftops and ground-mounted systems | Renewable energy mapping, utility planning, policy compliance |

<!-- Todo: to be update later -->
## Performance Metrics

### Speed & Resources

- **Inference Time:** 1.8-3.2s (typical for 1km² area)
- **Memory Usage:** 190-340MB peak
- **GPU Acceleration:** Optional (WebGL/WebGPU)

### Accuracy

- **Precision:** 88% (clear solar installations)
- **Recall:** 82% (detection rate for installations >20m²)
- **F1 Score:** 85%

### Operational Limits

- **Min Resolution:** 30cm/pixel (lower resolution may miss smaller installations)
- **Max Area:** 4km² (larger areas should be processed in tiles)
- **Optimal Zoom:** 18-20 (for detailed solar panel detection)

## Best Practices

### 🎯 **Optimal Use Cases**

- Renewable energy potential assessment
- Solar installation inventory
- Utility grid planning
- Policy compliance monitoring
- Property value assessment
- Carbon footprint analysis

### ⚡ **Performance Tips**

```typescript
// Optimal zoom levels for different scenarios
mapSourceParams: { zoomLevel: 19 } // Detailed residential analysis
mapSourceParams: { zoomLevel: 18 } // Commercial and utility installations
mapSourceParams: { zoomLevel: 20 } // Small rooftop systems
```


## Related Tasks

- [`building-detection`](./building-detection.md) - Identify buildings for rooftop solar potential
- [`object-detection`](./object-detection.md) - General-purpose object detection including solar panels
- [`mask-generation`](./mask-generation.md) - Generate precise solar installation boundaries
- [`land-cover-classification`](./land-cover-classification.md) - Assess land suitability for solar development
