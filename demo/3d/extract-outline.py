"""Trace the two real white logo silhouettes from assets/1.jpg.

Pillow, NumPy and SciPy are available in the existing Python environment. The
polygon coordinates derive from the image, not the demo's approximate SVG.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "assets/1.jpg"
OUTPUT = ROOT / "demo/assets/tactic-mark-outline.json"


def trace_pixel_edges(component: np.ndarray, x_offset: int, y_offset: int) -> list:
    """Follow consistently directed exterior edges of occupied image pixels."""
    padded = np.pad(component, 1)
    top = component & ~padded[:-2, 1:-1]
    right = component & ~padded[1:-1, 2:]
    bottom = component & ~padded[2:, 1:-1]
    left = component & ~padded[1:-1, :-2]
    edges = {}
    for name, mask in (("top", top), ("right", right), ("bottom", bottom), ("left", left)):
        ys, xs = np.nonzero(mask)
        for y, x in zip(ys.tolist(), xs.tolist()):
            x += x_offset
            y += y_offset
            if name == "top":
                start, end = (x, y), (x + 1, y)
            elif name == "right":
                start, end = (x + 1, y), (x + 1, y + 1)
            elif name == "bottom":
                start, end = (x + 1, y + 1), (x, y + 1)
            else:
                start, end = (x, y + 1), (x, y)
            edges[start] = end
    start = min(edges, key=lambda point: (point[1], point[0]))
    point = start
    contour = []
    for _ in range(len(edges) + 1):
        contour.append(point)
        point = edges[point]
        if point == start:
            break
    else:
        raise RuntimeError("Could not close the logo's exterior contour.")
    return contour


def simplify(points: np.ndarray, tolerance: float) -> np.ndarray:
    """Ramer–Douglas–Peucker reduction, keeping image edge accuracy."""
    if len(points) < 3:
        return points
    delta = points[-1] - points[0]
    length = np.linalg.norm(delta)
    if length == 0:
        distances = np.linalg.norm(points - points[0], axis=1)
    else:
        offsets = points - points[0]
        distances = np.abs(delta[0] * offsets[:, 1] - delta[1] * offsets[:, 0]) / length
    index = int(np.argmax(distances))
    if distances[index] <= tolerance:
        return points[[0, -1]]
    a = simplify(points[: index + 1], tolerance)
    b = simplify(points[index:], tolerance)
    return np.concatenate((a[:-1], b))


def minimum_gap(a: np.ndarray, b: np.ndarray) -> float:
    """Measure the closest distance between the two disjoint outline loops."""
    distances = []
    for points, edges in ((a, b), (b, a)):
        for point in points:
            for index, start in enumerate(edges):
                end = edges[(index + 1) % len(edges)]
                direction = end - start
                fraction = np.clip(
                    np.dot(point - start, direction) / np.dot(direction, direction),
                    0.0,
                    1.0,
                )
                distances.append(np.linalg.norm(point - start - fraction * direction))
    return float(min(distances))


def main() -> None:
    image = np.asarray(Image.open(SOURCE).convert("L"))
    mask = image > 230
    labels, count = ndimage.label(mask)
    sizes = np.bincount(labels.ravel())
    components = [index for index in range(1, count + 1) if sizes[index] > 10000]
    if len(components) != 2:
        raise RuntimeError(f"Expected two substantial white shapes, found {len(components)}.")
    slices = ndimage.find_objects(labels)
    traced = []
    for index in components:
        region = slices[index - 1]
        contour = trace_pixel_edges(
            labels[region] == index, region[1].start, region[0].start
        )
        loop = np.asarray(contour + [contour[0]], dtype=np.float64)
        polygon = simplify(loop, tolerance=5.0)[:-1]
        if len(polygon) != 6:
            raise RuntimeError(f"Expected six contour corners, found {len(polygon)}.")
        traced.append(polygon)
    traced.sort(key=lambda polygon: np.mean(polygon[:, 1]))
    points = np.concatenate(traced)
    lower = points.min(axis=0)
    upper = points.max(axis=0)
    center = (lower + upper) / 2
    scale = 4.0 / (upper[0] - lower[0])
    gap_pixels = minimum_gap(traced[0], traced[1])
    output = {
        "source": "assets/1.jpg",
        "sourceSha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
        "sourceImageSize": [int(image.shape[1]), int(image.shape[0])],
        "threshold": 230,
        "simplificationTolerancePixels": 5.0,
        "sourceBoundsPixels": {"min": lower.tolist(), "max": upper.tolist()},
        "scaleUnitsPerPixel": scale,
        "coordinateSystem": "Y-up; silhouette image X maps to X, image Y maps to Z; image-top is negative Z",
        "footprintSize": [4.0, float((upper[1] - lower[1]) * scale)],
        "minimumFootprintGapUnits": gap_pixels * scale,
        "minimumFootprintGapPixels": gap_pixels,
        "shapes": [],
    }
    for index, polygon in enumerate(traced):
        world = (polygon - center) * scale
        output["shapes"].append({
            "name": "TACTIC_Green_Rear" if index == 0 else "TACTIC_Red_Front",
            "color": "#16913b" if index == 0 else "#d61932",
            "height": 4.6 if index == 0 else 4.3,
            "glass": {
                "attenuationColor": "#0e713b" if index == 0 else "#a70716",
                "attenuationDistance": 3.0,
                "thickness": 0.9,
                "ior": 1.5,
                "transmission": 1.0,
                "roughness": 0.10,
            },
            "outlinePixels": polygon.tolist(),
            "outlineXZ": world.tolist(),
        })
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(output, indent=2) + "\n")
    print(json.dumps({
        "contourCorners": [len(polygon) for polygon in traced],
        "footprintSize": output["footprintSize"],
        "sourceBoundsPixels": output["sourceBoundsPixels"],
        "minimumFootprintGapUnits": output["minimumFootprintGapUnits"],
    }, indent=2))


if __name__ == "__main__":
    main()
