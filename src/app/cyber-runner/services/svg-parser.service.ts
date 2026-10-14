import { Injectable } from '@angular/core';

export interface RenderOptions {
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SvgParserService {
  private svgCache: Map<string, Path2D> = new Map();

  parseSvgFile(svgContent: string): Promise<Document> {
    return new Promise((resolve, reject) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const errorNode = doc.querySelector('parsererror');
      if (errorNode) {
        reject(new Error('Invalid SVG content'));
      } else {
        resolve(doc);
      }
    });
  }

  extractPathById(svgDoc: Document, id: string): Path2D | null {
    if (this.svgCache.has(id)) {
      return this.svgCache.get(id)!;
    }

    const pathElement = svgDoc.querySelector(`#${id}, [id="${id}"]`);
    if (!pathElement || pathElement.tagName !== 'path') {
      return null;
    }

    const d = pathElement.getAttribute('d');
    if (!d) {
      return null;
    }

    const path2d = new Path2D(d);
    this.svgCache.set(id, path2d);
    return path2d;
  }

  extractAllPaths(svgDoc: Document): Map<string, Path2D> {
    const paths = svgDoc.querySelectorAll('path');
    paths.forEach((path, index) => {
      const id = path.getAttribute('id') || `path-${index}`;
      const d = path.getAttribute('d');
      if (d) {
        const path2d = new Path2D(d);
        this.svgCache.set(id, path2d);
      }
    });
    return this.svgCache;
  }

  renderPathToCanvas(ctx: CanvasRenderingContext2D, path: Path2D, options: RenderOptions = {}): void {
    ctx.save();

    const x = options.x || 0;
    const y = options.y || 0;
    const scale = options.scale || 1;
    const rotation = options.rotation || 0;

    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    if (options.fillStyle) {
      ctx.fillStyle = options.fillStyle;
      ctx.fill(path);
    }

    if (options.strokeStyle) {
      ctx.strokeStyle = options.strokeStyle;
      ctx.lineWidth = options.lineWidth || 1;
      ctx.stroke(path);
    }

    ctx.restore();
  }

  createSvgCache(): Map<string, Path2D> {
    return this.svgCache;
  }

  clearCache(): void {
    this.svgCache.clear();
  }

  getCachedPath(id: string): Path2D | null {
    return this.svgCache.get(id) || null;
  }
}
