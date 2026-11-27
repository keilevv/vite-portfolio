// @ts-nocheck
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "./Passes/BokehPass.js";
import terrainVertexShader from "./shaders/terrain/vertex.glsl";
import terrainFragmentShader from "./shaders/terrain/fragment.glsl";
import terrainDepthVertexShader from "./shaders/terrainDepth/vertex.glsl";
import terrainDepthFragmentShader from "./shaders/terrainDepth/fragment.glsl";
import overlayVertexShader from "./shaders/overlay/vertex.glsl";
import overlayFragmentShader from "./shaders/overlay/fragment.glsl";

interface HolographicTerrainProps {
  className?: string;
}

export default function HolographicTerrain({ className = "" }: HolographicTerrainProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animationFrameId: number;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);

    const scene = new THREE.Scene();

    const camera = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
      instance: new THREE.PerspectiveCamera(75, width / height, 0.1, 100),
    };
    camera.rotation.reorder("YXZ");
    camera.instance.rotation.reorder("YXZ");
    scene.add(camera.instance);

    // Dynamic texture generation for contour lines
    const terrainTexture: any = {
      linesCount: 5,
      bigLineWidth: 0.08,
      smallLineWidth: 0.01,
      smallLineAlpha: 0.5,
      width: 1,
      height: 128,
      canvas: document.createElement("canvas"),
    };
    terrainTexture.canvas.width = terrainTexture.width;
    terrainTexture.canvas.height = terrainTexture.height;
    terrainTexture.context = terrainTexture.canvas.getContext("2d");
    terrainTexture.instance = new THREE.CanvasTexture(terrainTexture.canvas);
    terrainTexture.instance.wrapS = THREE.RepeatWrapping;
    terrainTexture.instance.wrapT = THREE.RepeatWrapping;
    terrainTexture.instance.magFilter = THREE.NearestFilter;

    const updateTexture = () => {
      const ctx = terrainTexture.context;
      if (!ctx) return;
      ctx.clearRect(0, 0, terrainTexture.width, terrainTexture.height);

      const actualBigLineWidth = Math.round(terrainTexture.height * terrainTexture.bigLineWidth);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, terrainTexture.width, actualBigLineWidth);

      const actualSmallLineWidth = Math.round(terrainTexture.height * terrainTexture.smallLineWidth);
      const smallLinesCount = terrainTexture.linesCount - 1;

      for (let i = 0; i < smallLinesCount; i++) {
        ctx.globalAlpha = terrainTexture.smallLineAlpha;
        ctx.fillStyle = "#00ffff";
        ctx.fillStyle = "#ff8408";
        ctx.fillRect(
          0,
          actualBigLineWidth +
            Math.round((terrainTexture.height - actualBigLineWidth) / terrainTexture.linesCount) * (i + 1),
          terrainTexture.width,
          actualSmallLineWidth
        );
      }
      terrainTexture.instance.needsUpdate = true;
    };
    updateTexture();

    // Terrain geometry & uniforms
    const terrainGeometry = new THREE.PlaneGeometry(1, 1, 256, 256);
    terrainGeometry.rotateX(-Math.PI * 0.5);

    const terrainUniforms = {
      uTexture: { value: terrainTexture.instance },
      uElevation: { value: 2 },
      uElevationValley: { value: 0.4 },
      uElevationValleyFrequency: { value: 1.5 },
      uElevationGeneral: { value: 0.2 },
      uElevationGeneralFrequency: { value: 0.2 },
      uElevationDetails: { value: 0.2 },
      uElevationDetailsFrequency: { value: 2.012 },
      uTextureFrequency: { value: 10 },
      uTextureOffset: { value: 0.585 },
      uTime: { value: 0 },
      uHslHue: { value: 1.0 },
      uHslHueOffset: { value: 0.0 },
      uHslHueFrequency: { value: 10.0 },
      uHslTimeFrequency: { value: 0.05 },
      uHslLightness: { value: 0.75 },
      uHslLightnessVariation: { value: 0.25 },
      uHslLightnessFrequency: { value: 20.0 },
    };

    const terrainMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: terrainVertexShader,
      fragmentShader: terrainFragmentShader,
      uniforms: terrainUniforms,
    });

    const depthUniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.common,
      THREE.UniformsLib.displacementmap,
    ]);
    for (const key in terrainUniforms) {
      depthUniforms[key] = (terrainUniforms as any)[key];
    }

    const terrainDepthMaterial = new THREE.ShaderMaterial({
      uniforms: depthUniforms,
      vertexShader: terrainDepthVertexShader,
      fragmentShader: terrainDepthFragmentShader,
    });
    terrainDepthMaterial.depthPacking = THREE.RGBADepthPacking;
    terrainDepthMaterial.blending = THREE.NoBlending;

    const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrainMesh.scale.set(10, 10, 10);
    terrainMesh.userData.depthMaterial = terrainDepthMaterial;
    scene.add(terrainMesh);

    // Floating ember particles
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);
    const particleRandoms = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 6.0;
      particlePositions[i * 3 + 1] = Math.random() * 2.5 + 0.1;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
      particleScales[i] = Math.random() * 1.2 + 0.4;
      particleRandoms[i] = Math.random() * Math.PI * 2;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("aScale", new THREE.BufferAttribute(particleScales, 1));
    particleGeometry.setAttribute("aRandom", new THREE.BufferAttribute(particleRandoms, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aScale;
        attribute float aRandom;
        varying float vAlpha;

        void main() {
          vec3 pos = position;
          pos.y = mod(pos.y + uTime * 0.12 + aRandom, 2.6);
          pos.x += sin(uTime * 0.4 + aRandom) * 0.15;
          pos.z += cos(uTime * 0.35 + aRandom) * 0.15;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aScale * 28.0 * uPixelRatio * (1.0 / -mvPosition.z);

          float heightFade = smoothstep(0.0, 0.4, pos.y) * (1.0 - smoothstep(2.0, 2.6, pos.y));
          vAlpha = heightFade * (0.5 + 0.5 * sin(uTime * 2.0 + aRandom * 3.0));
        }
      `,
      fragmentShader: `
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float strength = 1.0 - (dist * 2.0);
          strength = pow(strength, 2.2);

          vec3 emberColor = mix(vec3(1.0, 0.35, 0.02), vec3(1.0, 0.8, 0.25), strength);
          gl_FragColor = vec4(emberColor, strength * vAlpha * 0.85);
        }
      `,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.userData.noBokeh = true;
    scene.add(particles);

    // Overlay for smooth entry vignette
    const overlayGeometry = new THREE.PlaneGeometry(2, 2);
    const overlayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uVignetteColor: { value: new THREE.Color("#260f04") },
        uVignetteMultiplier: { value: 1.16 },
        uVignetteOffset: { value: -1 },
        uOverlayColor: { value: new THREE.Color("#121110") },
        uOverlayAlpha: { value: 1 },
      },
      vertexShader: overlayVertexShader,
      fragmentShader: overlayFragmentShader,
      transparent: true,
      depthTest: false,
    });
    const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
    overlayMesh.userData.noBokeh = true;
    overlayMesh.frustumCulled = false;
    scene.add(overlayMesh);

    gsap.to(overlayMaterial.uniforms.uOverlayAlpha, {
      delay: 0.4,
      duration: 3,
      value: 0,
      ease: "power2.out",
    });
    gsap.to(overlayMaterial.uniforms.uVignetteOffset, {
      delay: 0.4,
      duration: 3,
      value: -0.165,
      ease: "power2.out",
    });

    // Renderer & Post-processing
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      powerPreference: "high-performance",
    });
    renderer.setClearColor("#080024", 1);
    renderer.setClearColor("#121110", 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);

    const effectComposer = new EffectComposer(renderer);
    effectComposer.setSize(width, height);
    effectComposer.setPixelRatio(pixelRatio);

    const renderPass = new RenderPass(scene, camera.instance);
    effectComposer.addPass(renderPass);

    const bokehPass = new BokehPass(scene, camera.instance, {
      focus: 1.0,
      aperture: 0.015,
      maxblur: 0.01,
      width: width * pixelRatio,
      height: height * pixelRatio,
    });
    effectComposer.addPass(bokehPass);

    const unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.55,
      0.45,
      0.25
    );
    effectComposer.addPass(unrealBloomPass);

    // Camera views & transitions
    const views = [
      {
        position: { x: 0, y: 2.124, z: -0.172 },
        rotation: { x: -1.489, y: -Math.PI, z: 0 },
        focus: 2.14,
        parallaxMultiplier: 0.25,
      },
      {
        position: { x: 1, y: 1.1, z: 0 },
        rotation: { x: -0.833, y: 1.596, z: 1.651 },
        focus: 1.1,
        parallaxMultiplier: 0.12,
      },
      {
        position: { x: 1, y: 0.87, z: -0.97 },
        rotation: { x: -0.638, y: 2.33, z: 0 },
        focus: 1.36,
        parallaxMultiplier: 0.12,
      },
      {
        position: { x: -1.43, y: 0.33, z: -0.144 },
        rotation: { x: -0.312, y: -1.67, z: 0 },
        focus: 1.25,
        parallaxMultiplier: 0.12,
      },
    ];

    let currentViewIndex = 0;
    let currentView = views[currentViewIndex];

    const parallax = {
      target: { x: 0, y: 0 },
      eased: { x: 0, y: 0, multiplier: 4 },
      multiplier: currentView.parallaxMultiplier,
    };

    const applyView = () => {
      camera.position.set(currentView.position.x, currentView.position.y, currentView.position.z);
      camera.rotation.x = currentView.rotation.x;
      camera.rotation.y = currentView.rotation.y;
      bokehPass.materialBokeh.uniforms.focus.value = currentView.focus;
      parallax.multiplier = currentView.parallaxMultiplier;
    };
    applyView();

    const changeView = (nextIndex: number) => {
      currentViewIndex = nextIndex;
      currentView = views[currentViewIndex];

      gsap.to(overlayMaterial.uniforms.uOverlayAlpha, {
        duration: 1.25,
        value: 1,
        ease: "power2.inOut",
        onComplete: () => {
          applyView();
          gsap.to(overlayMaterial.uniforms.uOverlayAlpha, {
            duration: 1,
            value: 0,
            ease: "power2.inOut",
          });
        },
      });
    };

    const viewInterval = window.setInterval(() => {
      changeView((currentViewIndex + 1) % views.length);
    }, 7500);

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;
      parallax.target.x = (clientX / rect.width - 0.5) * parallax.multiplier;
      parallax.target.y = -(clientY / rect.height - 0.5) * parallax.multiplier;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const pr = Math.min(window.devicePixelRatio, 1.5);

      camera.instance.aspect = w / h;
      camera.instance.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(pr);

      effectComposer.setSize(w, h);
      effectComposer.setPixelRatio(pr);

      bokehPass.renderTargetDepth.width = w * pr;
      bokehPass.renderTargetDepth.height = h * pr;
      unrealBloomPass.setSize(w, h);
      particleMaterial.uniforms.uPixelRatio.value = pr;
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let lastElapsedTime = 0;
    let isVisible = true;

    const tick = () => {
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - lastElapsedTime;
      lastElapsedTime = elapsedTime;

      terrainUniforms.uTime.value = elapsedTime;
      particleMaterial.uniforms.uTime.value = elapsedTime;

      camera.instance.position.copy(camera.position);

      parallax.eased.x += (parallax.target.x - parallax.eased.x) * deltaTime * parallax.eased.multiplier;
      parallax.eased.y += (parallax.target.y - parallax.eased.y) * deltaTime * parallax.eased.multiplier;
      camera.instance.translateX(parallax.eased.x);
      camera.instance.translateY(parallax.eased.y);

      camera.instance.rotation.x = camera.rotation.x;
      camera.instance.rotation.y = camera.rotation.y;

      effectComposer.render();
      animationFrameId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          lastElapsedTime = clock.getElapsedTime();
          animationFrameId = window.requestAnimationFrame(tick);
        } else if (!isVisible && wasVisible) {
          window.cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    tick();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameId);
      window.clearInterval(viewInterval);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      terrainGeometry.dispose();
      terrainMaterial.dispose();
      terrainDepthMaterial.dispose();
      terrainTexture.instance.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      overlayGeometry.dispose();
      overlayMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
