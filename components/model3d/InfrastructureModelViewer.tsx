"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Download, Home, Layers, Maximize2, PanelLeft, Printer, Settings } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function makeBuilding(width: number, depth: number, height: number, x: number, z: number) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({
    color: "#7f8588",
    transparent: true,
    opacity: 0.42,
    roughness: 0.9,
    metalness: 0.05
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, height / 2, z);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: "#2b3033", transparent: true, opacity: 0.5 })
  );
  mesh.add(edges);
  return mesh;
}

function makeRoad(width: number, length: number, x: number, z: number, rotation = 0) {
  const road = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.06, length),
    new THREE.MeshStandardMaterial({ color: "#9a9a96", roughness: 1 })
  );
  road.position.set(x, 0.035, z);
  road.rotation.y = rotation;
  return road;
}

function makePipeSegment(start: THREE.Vector3, end: THREE.Vector3, material: THREE.Material, radius: number) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 12);
  const segment = new THREE.Mesh(geometry, material);
  segment.position.copy(start).add(end).multiplyScalar(0.5);
  segment.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return segment;
}

function makeUtilityLine(points: THREE.Vector3[], color: string, radius: number) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.48,
    roughness: 0.35
  });
  for (let index = 0; index < points.length - 1; index += 1) {
    group.add(makePipeSegment(points[index], points[index + 1], material, radius));
  }
  points.forEach((point) => {
    const joint = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.35, 16, 12), material);
    joint.position.copy(point);
    group.add(joint);
  });
  return group;
}

export function InfrastructureModelViewer() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activeLayer, setActiveLayer] = useState("all");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#85898a");
    scene.fog = new THREE.Fog("#85898a", 70, 190);

    const camera = new THREE.PerspectiveCamera(48, mount.clientWidth / mount.clientHeight, 0.1, 500);
    camera.position.set(42, 58, 72);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minDistance = 28;
    controls.maxDistance = 155;

    scene.add(new THREE.HemisphereLight("#f8fafc", "#475569", 1.6));
    const sun = new THREE.DirectionalLight("#ffffff", 2.2);
    sun.position.set(40, 80, 30);
    sun.castShadow = true;
    scene.add(sun);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(180, 120),
      new THREE.MeshStandardMaterial({ color: "#a5a5a0", roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    [-55, 0, 55].forEach((x) => {
      scene.add(makeRoad(8, 122, x, 0));
    });
    [-30, 22].forEach((z) => {
      scene.add(makeRoad(8, 180, 0, z, Math.PI / 2));
    });

    const buildingPositions = [
      [-75, -46, 20, 13, 8],
      [-28, -47, 24, 12, 10],
      [28, -47, 24, 12, 9],
      [74, -46, 22, 13, 8],
      [-75, -6, 21, 17, 9],
      [-28, -7, 24, 17, 12],
      [27, -7, 25, 17, 10],
      [74, -6, 22, 17, 11],
      [-75, 42, 22, 17, 10],
      [-28, 43, 24, 16, 7],
      [27, 43, 25, 16, 9],
      [74, 42, 22, 17, 8]
    ];
    buildingPositions.forEach(([x, z, width, depth, height]) => {
      const building = makeBuilding(width, depth, height, x, z);
      building.castShadow = true;
      scene.add(building);
    });

    const waterLines = new THREE.Group();
    waterLines.name = "water";
    waterLines.add(makeUtilityLine([new THREE.Vector3(-88, 0.58, -35), new THREE.Vector3(88, 0.58, -35)], "#00d5df", 0.24));
    waterLines.add(makeUtilityLine([new THREE.Vector3(-51, 0.58, -58), new THREE.Vector3(-51, 0.58, 58)], "#00d5df", 0.22));
    waterLines.add(makeUtilityLine([new THREE.Vector3(4, 0.58, -58), new THREE.Vector3(4, 0.58, 58)], "#00d5df", 0.2));
    waterLines.add(makeUtilityLine([new THREE.Vector3(59, 0.58, -58), new THREE.Vector3(59, 0.58, 58)], "#00d5df", 0.2));

    const wastewaterLines = new THREE.Group();
    wastewaterLines.name = "wastewater";
    wastewaterLines.add(makeUtilityLine([new THREE.Vector3(-88, 0.52, 27), new THREE.Vector3(88, 0.52, 27)], "#22c55e", 0.22));
    wastewaterLines.add(makeUtilityLine([new THREE.Vector3(-59, 0.52, -58), new THREE.Vector3(-59, 0.52, 58)], "#22c55e", 0.18));
    wastewaterLines.add(makeUtilityLine([new THREE.Vector3(-4, 0.52, -58), new THREE.Vector3(-4, 0.52, 58)], "#22c55e", 0.18));
    wastewaterLines.add(makeUtilityLine([new THREE.Vector3(51, 0.52, -58), new THREE.Vector3(51, 0.52, 58)], "#22c55e", 0.18));

    const riskMarkers = new THREE.Group();
    riskMarkers.name = "risk";
    [
      [-51, -35, "#ef4444"],
      [4, -35, "#f97316"],
      [51, 27, "#ef4444"],
      [-59, 27, "#f97316"]
    ].forEach(([x, z, color]) => {
      const marker = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 0.5, 24),
        new THREE.MeshStandardMaterial({ color: String(color), emissive: String(color), emissiveIntensity: 0.35 })
      );
      marker.position.set(Number(x), 0.8, Number(z));
      riskMarkers.add(marker);
    });

    scene.add(waterLines, wastewaterLines, riskMarkers);

    const grid = new THREE.GridHelper(180, 36, "#5f6668", "#737978");
    grid.position.y = 0.08;
    scene.add(grid);

    const resize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", resize);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      waterLines.visible = activeLayer === "water" || activeLayer === "all";
      wastewaterLines.visible = activeLayer === "wastewater" || activeLayer === "all";
      riskMarkers.visible = activeLayer === "risk" || activeLayer === "all";
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      controls.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, [activeLayer]);

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="flex h-16 items-center justify-between border-b px-5">
        <div className="flex items-center gap-3">
          <Box className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">IEAT_BANG_CHUN_CONCEPT.ifc</p>
            <p className="text-xs text-muted-foreground">Infrastructure 3D Digital Twin Concept</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
      <div className="flex h-14 items-center justify-between border-b bg-slate-50 px-5 text-xs font-medium text-slate-700">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2"><PanelLeft className="h-4 w-4" />Views</span>
          <span className="flex items-center gap-2"><Layers className="h-4 w-4" />Model browser</span>
          <span className="flex items-center gap-2"><Settings className="h-4 w-4" />Properties</span>
        </div>
        <span className="flex items-center gap-2"><Printer className="h-4 w-4" />Print</span>
      </div>
      <div className="grid min-h-[650px] lg:grid-cols-[280px_1fr]">
        <aside className="order-2 border-r bg-white p-4 lg:order-1">
          <div className="space-y-3">
            <p className="text-sm font-semibold">Model browser</p>
            {[
              ["all", "All infrastructure layers", "blue"],
              ["water", "Water supply network", "blue"],
              ["wastewater", "Wastewater collection", "green"],
              ["risk", "High-risk assets", "red"]
            ].map(([id, label, color]) => (
              <button
                key={id}
                onClick={() => setActiveLayer(id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm",
                  activeLayer === id ? "border-primary bg-blue-50 text-primary" : "bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                <span>{label}</span>
                <Badge variant={color as "blue" | "green" | "red"}>{id}</Badge>
              </button>
            ))}
          </div>
        </aside>
        <div className="relative order-1 lg:order-2">
          <div ref={mountRef} className="h-full min-h-[650px] w-full" />
          <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-2 rounded-md bg-white/75 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
            <Home className="h-4 w-4" />
            TOP / FRONT
          </div>
          <div className="pointer-events-none absolute bottom-5 left-5 rounded-md bg-slate-950/65 px-4 py-3 text-xs text-white">
            <p className="font-semibold">Digital Twin 3D Concept</p>
            <p className="mt-1 text-slate-200">Grey city model + cyan/green utility corridors + risk markers</p>
          </div>
          <Button className="absolute bottom-5 right-5" variant="outline" size="sm">
            <Maximize2 className="h-4 w-4" />
            Full view
          </Button>
        </div>
      </div>
    </div>
  );
}
