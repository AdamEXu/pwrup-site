import { jsx, jsxs } from 'react/jsx-runtime';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import Lenis from 'lenis';
import { clsx } from 'clsx';
import Hls from 'hls.js';
import { twMerge } from 'tailwind-merge';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Light easing
      infinite: false
    });
    window.lenis = lenis;
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    console.log("Lenis smooth scroll initialized with config:", {
      duration: 1.2,
      easing: "custom light easing",
      infinite: false
    });
    return () => {
      lenis.destroy();
    };
  }, []);
}

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function TypewriterEffect({
  words,
  speed = 100,
  delay = 0,
  className = "",
  jitter = 20,
  onComplete
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayedWords, setDisplayedWords] = useState([]);
  useEffect(() => {
    if (currentWordIndex >= words.length) {
      if (onComplete) {
        onComplete();
      }
      return;
    }
    const currentWord = words[currentWordIndex];
    const timer = setTimeout(
      () => {
        if (currentCharIndex < currentWord.text.length) {
          setDisplayedWords((prev) => {
            const newWords = [...prev];
            if (newWords[currentWordIndex]) {
              newWords[currentWordIndex] = {
                ...currentWord,
                text: currentWord.text.slice(
                  0,
                  currentCharIndex + 1
                ),
                isComplete: false
              };
            } else {
              newWords[currentWordIndex] = {
                ...currentWord,
                text: currentWord.text.slice(
                  0,
                  currentCharIndex + 1
                ),
                isComplete: false
              };
            }
            return newWords;
          });
          setCurrentCharIndex((prev) => prev + 1);
        } else {
          setDisplayedWords((prev) => {
            const newWords = [...prev];
            newWords[currentWordIndex] = {
              ...currentWord,
              text: currentWord.text,
              isComplete: true
            };
            return newWords;
          });
          setCurrentWordIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }
      },
      currentCharIndex === 0 && currentWordIndex === 0 ? delay : speed + (Math.random() - 0.5) * 2 * (speed * jitter / 100)
    );
    return () => clearTimeout(timer);
  }, [currentWordIndex, currentCharIndex, words, speed, delay, jitter]);
  return /* @__PURE__ */ jsx(
    "span",
    {
      className,
      style: {
        fontSize: "inherit",
        fontFamily: "inherit",
        fontWeight: "inherit",
        lineHeight: "inherit",
        color: "inherit",
        letterSpacing: "inherit",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 8px rgba(0, 0, 0, 0.2)"
      },
      children: displayedWords.map((word, index) => /* @__PURE__ */ jsxs("span", { children: [
        /* @__PURE__ */ jsx("span", { className: word.className || "", children: word.text }),
        index < displayedWords.length - 1 && word.isComplete && " "
      ] }, index))
    }
  );
}

function BackgroundVideo({
  hlsUrl = "https://cdn.pinewood.one/homepage_background_video/hls/master.m3u8",
  fadeMs = 500,
  mountDelayMs = 100,
  className = "",
  startFadeIn = false
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [visible, setVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [shouldFadeIn, setShouldFadeIn] = useState(false);
  const [fadeInComplete, setFadeInComplete] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [scrollBlur, setScrollBlur] = useState(0);
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  useEffect(() => {
    if (prefersReducedMotion) return;
    let canceled = false;
    const start = () => {
      if (!canceled) setShouldMount(true);
    };
    const w = window;
    const id = w.requestIdleCallback?.(start, { timeout: mountDelayMs }) ?? window.setTimeout(start, mountDelayMs);
    return () => {
      canceled = true;
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, [mountDelayMs, prefersReducedMotion]);
  useEffect(() => {
    if (!shouldMount || prefersReducedMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setVisible(entry.isIntersecting || entry.intersectionRatio > 0);
      },
      { root: null, rootMargin: "400px", threshold: 0.01 }
      // pre-warm slightly before it scrolls in
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shouldMount, prefersReducedMotion]);
  useEffect(() => {
    if (!shouldMount || !visible || prefersReducedMotion || !hlsUrl) return;
    const video = videoRef.current;
    if (!video) return;
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        // Disable worker for better compatibility
        lowLatencyMode: false,
        backBufferLength: 90,
        // Start with higher quality assumptions
        startLevel: -1,
        // Let HLS.js auto-select, but with better defaults below
        capLevelToPlayerSize: false,
        // Don't limit quality based on player size
        maxLoadingDelay: 4,
        maxBufferLength: 30,
        maxBufferSize: 60 * 1e3 * 1e3,
        // 60MB buffer
        // Aggressive bandwidth estimation for better initial quality
        abrEwmaDefaultEstimate: 5e6,
        // Start assuming 5Mbps instead of default ~500kbps
        abrEwmaSlowVoD: 3,
        // Faster adaptation for VoD content
        abrEwmaFastVoD: 3,
        abrMaxWithRealBitrate: false,
        // Don't be overly conservative
        // Quality switching
        abrBandWidthFactor: 0.7,
        // Less conservative bandwidth factor
        abrBandWidthUpFactor: 0.7
        // Less conservative for upward switches
      });
      hlsRef.current = hls;
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels;
        if (levels.length > 1) {
          const targetLevel = levels.findIndex(
            (level) => level.height >= 720
          );
          if (targetLevel !== -1) {
            hls.startLevel = targetLevel;
          } else if (levels.length > 2) {
            hls.startLevel = levels.length - 2;
          }
        }
        video.play().catch(() => {
        });
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        console.warn("HLS error:", data);
        if (data.fatal) {
          setVideoReady(true);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {
        });
      });
    } else {
      console.warn("HLS not supported, falling back to regular sources");
      setVideoReady(true);
    }
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [shouldMount, visible, prefersReducedMotion, hlsUrl]);
  useEffect(() => {
    if (!shouldMount || prefersReducedMotion) return;
    const onVis = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) v.pause();
      else v.play().catch(() => {
      });
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [shouldMount, prefersReducedMotion]);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollProgress = Math.min(scrollY / windowHeight, 1);
      const opacityMultiplier = 1 - scrollProgress;
      const blurAmount = scrollProgress * 32;
      setScrollOpacity(opacityMultiplier);
      setScrollBlur(blurAmount);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    const checkLenis = () => {
      const lenis = window.lenis;
      if (lenis) {
        lenis.on("scroll", handleScroll);
        return () => lenis.off("scroll", handleScroll);
      }
      return null;
    };
    let lenisCleanup = checkLenis();
    const lenisTimeout = setTimeout(() => {
      if (!lenisCleanup) {
        lenisCleanup = checkLenis();
      }
    }, 100);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (lenisCleanup) lenisCleanup();
      clearTimeout(lenisTimeout);
    };
  }, [prefersReducedMotion]);
  useEffect(() => {
    if (videoReady && startFadeIn) {
      setShouldFadeIn(true);
      const timer = setTimeout(() => {
        setFadeInComplete(true);
      }, fadeMs);
      return () => clearTimeout(timer);
    }
  }, [videoReady, startFadeIn, fadeMs]);
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      const v = videoRef.current;
      if (!v) return;
      try {
        v.pause();
        v.removeAttribute("src");
        v.srcObject = null;
        v.load();
      } catch {
      }
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className: `fixed inset-0 -z-10 overflow-hidden bg-black ${className}`,
      "aria-hidden": "true",
      children: shouldMount && visible && /* @__PURE__ */ jsx(
        "video",
        {
          ref: videoRef,
          className: "absolute inset-0 h-full w-full object-cover pointer-events-none",
          style: {
            opacity: shouldFadeIn ? scrollOpacity : 0,
            filter: `blur(${scrollBlur}px)`,
            transform: `scale(${1 + scrollBlur * 0.05})`,
            // Scale up slightly to compensate for blur edge sampling
            transition: shouldFadeIn && !fadeInComplete ? `opacity ${fadeMs}ms ease-in-out` : "none"
          },
          tabIndex: -1,
          muted: true,
          playsInline: true,
          autoPlay: true,
          loop: true,
          preload: "metadata",
          onCanPlay: () => setVideoReady(true),
          onError: () => setVideoReady(true),
          disableRemotePlayback: true,
          children: !hlsUrl
        }
      )
    }
  );
}

const CanvasRevealEffect = ({
  animationSpeed = 1.5,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  revealCenter
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "h-full relative bg-white w-full",
        containerClassName
      ),
      children: [
        /* @__PURE__ */ jsx("div", { className: "h-full w-full", children: /* @__PURE__ */ jsx(
          DotMatrix,
          {
            colors: colors ?? [[0, 255, 255]],
            dotSize: dotSize ?? 3,
            opacities: opacities ?? [
              0.3,
              0.3,
              0.3,
              0.5,
              0.5,
              0.5,
              0.8,
              0.8,
              0.8,
              1
            ],
            shader: `
              float animation_speed_factor = ${animationSpeed.toFixed(1)};
              vec2 reveal_center = ${revealCenter ? `vec2(${revealCenter.x.toFixed(
              1
            )}, ${revealCenter.y.toFixed(1)})` : "u_resolution / 2.0"} / u_total_size;
              float intro_offset = distance(reveal_center, st2) * 0.01 + (random(st2) * 0.15);
              opacity *= step(intro_offset, u_time * animation_speed_factor);
              opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            `,
            center: ["x", "y"]
          }
        ) }),
        showGradient && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" })
      ]
    }
  );
};
const DotMatrix = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 4,
  dotSize = 2,
  shader = "",
  center = ["x", "y"]
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0]
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1]
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2]
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255
        ]),
        type: "uniform3fv"
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv"
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f"
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f"
      }
    };
  }, [colors, opacities, totalSize, dotSize]);
  return /* @__PURE__ */ jsx(
    Shader,
    {
      source: `
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        out vec4 fragColor;
        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }
        void main() {
            vec2 st = fragCoord.xy;
            ${center.includes("x") ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));" : ""}
            ${center.includes("y") ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));" : ""}
      float opacity = step(0.0, st.x);
      opacity *= step(0.0, st.y);

      vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

      float frequency = 5.0;
      float show_offset = random(st2);
      float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
      opacity *= u_opacities[int(rand * 10.0)];
      opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
      opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

      vec3 color = u_colors[int(show_offset * 6.0)];

      ${shader}

      fragColor = vec4(color, opacity);
      fragColor.rgb *= fragColor.a;
        }`,
      uniforms,
      maxFps: 60
    }
  );
};
const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60
}) => {
  const { size } = useThree();
  const ref = useRef(null);
  let lastFrameTime = 0;
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    if (timestamp - lastFrameTime < 1 / maxFps) {
      return;
    }
    lastFrameTime = timestamp;
    const material2 = ref.current.material;
    const timeLocation = material2.uniforms.u_time;
    timeLocation.value = timestamp;
  });
  const getUniforms = () => {
    const preparedUniforms = {};
    for (const uniformName in uniforms) {
      const uniform = uniforms[uniformName];
      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = {
            value: uniform.value,
            type: "1f"
          };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value),
            type: "3f"
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = {
            value: uniform.value,
            type: "1fv"
          };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map(
              (v) => new THREE.Vector3().fromArray(v)
            ),
            type: "3fv"
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value),
            type: "2f"
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }
    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2)
    };
    return preparedUniforms;
  };
  const material = useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor
    });
    return materialObject;
  }, [size.width, size.height, source]);
  return /* @__PURE__ */ jsxs("mesh", { ref, children: [
    /* @__PURE__ */ jsx("planeGeometry", { args: [2, 2] }),
    /* @__PURE__ */ jsx("primitive", { object: material, attach: "material" })
  ] });
};
const Shader = ({ source, uniforms, maxFps = 60 }) => {
  return /* @__PURE__ */ jsx(Canvas, { className: "absolute inset-0  h-full w-full", children: /* @__PURE__ */ jsx(
    ShaderMaterial,
    {
      source,
      uniforms,
      maxFps
    }
  ) });
};

function FancyButton({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button"
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [revealCenter, setRevealCenter] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(0.8);
  const timeoutRef = useRef(null);
  const buttonRef = useRef(null);
  const calculateAnimationSpeed = (width) => {
    const scaleFactor = width / 400;
    return Math.max(0.5, Math.min(10, scaleFactor));
  };
  useEffect(() => {
    if (isHovered) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsAnimatingOut(false);
      setShowEffect(true);
    } else if (showEffect) {
      setIsAnimatingOut(true);
      timeoutRef.current = setTimeout(() => {
        setShowEffect(false);
        setIsAnimatingOut(false);
      }, 250);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered]);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref: buttonRef,
      type,
      onClick,
      disabled,
      onMouseEnter: (e) => {
        if (buttonRef.current) {
          const rect = buttonRef.current.getBoundingClientRect();
          const relativeX = e.clientX - rect.left;
          const relativeY = e.clientY - rect.top;
          const x = relativeX * 2;
          const y = relativeY * 2;
          setRevealCenter({ x, y });
          const speed = calculateAnimationSpeed(rect.width);
          setAnimationSpeed(speed);
        }
        setIsHovered(true);
      },
      onMouseLeave: () => setIsHovered(false),
      className: `group p-4 border-2 border-white relative box-border bg-black/50 hover:bg-black/80 backdrop-blur-sm hover:backdrop-blur-md ${className}`,
      style: {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.6)",
        transition: "background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease"
      },
      children: [
        (showEffect || isHovered) && /* @__PURE__ */ jsx(
          "div",
          {
            className: `absolute inset-0 pointer-events-none transition-opacity duration-500 overflow-hidden ${isAnimatingOut ? "opacity-0" : "opacity-100"}`,
            children: /* @__PURE__ */ jsx(
              CanvasRevealEffect,
              {
                animationSpeed,
                containerClassName: "bg-transparent",
                colors: [[112, 205, 53]],
                dotSize: 2,
                showGradient: false,
                revealCenter: revealCenter || void 0
              }
            )
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-[#70cd35] relative z-10", children }),
        /* @__PURE__ */ jsx("span", { className: "h-0.5 w-2 bg-[#70cd35] absolute block -top-0.5 -left-2 group-hover:-left-0.5 transition-all z-10" }),
        /* @__PURE__ */ jsx("span", { className: "h-2 w-0.5 bg-[#70cd35] absolute block -top-2 -left-0.5 group-hover:-top-0.5 transition-all z-10" }),
        /* @__PURE__ */ jsx("span", { className: "h-0.5 w-2 bg-[#70cd35] absolute block -bottom-0.5 -left-2 group-hover:-left-0.5 transition-all z-10" }),
        /* @__PURE__ */ jsx("span", { className: "h-2 w-0.5 bg-[#70cd35] absolute block -bottom-2 -left-0.5 group-hover:-bottom-0.5 transition-all z-10" }),
        /* @__PURE__ */ jsx("span", { className: "h-0.5 w-2 bg-[#70cd35] absolute block -bottom-0.5 -right-2 group-hover:-right-0.5 transition-all z-10" }),
        /* @__PURE__ */ jsx("span", { className: "h-2 w-0.5 bg-[#70cd35] absolute block -bottom-2 -right-0.5 group-hover:-bottom-0.5 transition-all z-10" }),
        /* @__PURE__ */ jsx("span", { className: "h-0.5 w-2 bg-[#70cd35] absolute block -top-0.5 -right-2 group-hover:-right-0.5 transition-all z-10" }),
        /* @__PURE__ */ jsx("span", { className: "h-2 w-0.5 bg-[#70cd35] absolute block -top-2 -right-0.5 group-hover:-top-0.5 transition-all z-10" })
      ]
    }
  );
}

function AboutRobotics() {
  return /* @__PURE__ */ jsxs("div", { className: "w-full p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-white drop-shadow-2xl text-center text-6xl md:text-8xl", children: "Why join robotics?" }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-8 mt-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-white drop-shadow-2xl text-center text-2xl w-full lg:w-1/2", children: [
        /* @__PURE__ */ jsxs(
          "p",
          {
            className: "text-3xl md:text-4xl text-left",
            style: { fontWeight: 300, lineHeight: 1.5 },
            children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "We are a team of students from Pinewood School, and we have",
                " "
              ] }),
              /* @__PURE__ */ jsx("span", { children: "a lot of fun" }),
              /* @__PURE__ */ jsxs("span", { children: [
                " ",
                "building robots and competing against other teams in FRC competitions."
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: "text-3xl md:text-4xl text-left mt-4",
            style: { fontWeight: 500, lineHeight: 1.5 },
            children: "Robotics is:"
          }
        ),
        /* @__PURE__ */ jsxs(
          "ul",
          {
            className: "list-disc list-inside text-left mt-4 pl-4 text-2xl",
            style: {
              lineHeight: 1.5
            },
            children: [
              /* @__PURE__ */ jsx(
                "li",
                {
                  className: "hover:text-[#70cd35] hover:translate-x-2",
                  style: {
                    transition: "color 0.2s ease, transform 0.2s ease"
                  },
                  children: "Fun"
                }
              ),
              /* @__PURE__ */ jsx(
                "li",
                {
                  className: "hover:text-[#70cd35] hover:translate-x-2",
                  style: {
                    transition: "color 0.2s ease, transform 0.2s ease"
                  },
                  children: "Challenging"
                }
              ),
              /* @__PURE__ */ jsx(
                "li",
                {
                  className: "hover:text-[#70cd35] hover:translate-x-2",
                  style: {
                    transition: "color 0.2s ease, transform 0.2s ease"
                  },
                  children: "Competitive"
                }
              ),
              /* @__PURE__ */ jsx(
                "li",
                {
                  className: "hover:text-[#70cd35] hover:translate-x-2",
                  style: {
                    transition: "color 0.2s ease, transform 0.2s ease"
                  },
                  children: "Collaborative"
                }
              ),
              /* @__PURE__ */ jsx(
                "li",
                {
                  className: "hover:text-[#70cd35] hover:translate-x-2",
                  style: {
                    transition: "color 0.2s ease, transform 0.2s ease"
                  },
                  children: "Flexible"
                }
              )
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-white drop-shadow-2xl text-center text-2xl w-full lg:w-1/2 mx-auto lg:mx-0 h-full", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/Reefscape-Robot.png",
            alt: "Robotics",
            style: {
              maxHeight: "500px",
              width: "auto",
              margin: "auto",
              objectFit: "contain"
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              style: {
                textAlign: "left",
                marginTop: "30px"
              },
              children: "We built this robot!"
            }
          ),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/Hand_Drawn_Arrow.svg",
              alt: "Arrow",
              style: {
                position: "relative",
                top: -73,
                left: 204
              }
            }
          )
        ] })
      ] })
    ] })
  ] });
}

function Position({
  title,
  description,
  responsibilities,
  requirements,
  image,
  direction = "left",
  id
}) {
  const imageRef = useRef(null);
  const [verticalTilt, setVerticalTilt] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  useEffect(() => {
    const handleScrollAndResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const imageCenterY = rect.top + rect.height / 2;
      const screenCenterY = window.innerHeight / 2;
      const distanceFromCenter = (imageCenterY - screenCenterY) / (window.innerHeight / 2);
      const tilt = Math.max(
        -15,
        Math.min(
          15,
          distanceFromCenter * 15 * (isLargeScreen ? 0.5 : 1)
        )
      );
      setVerticalTilt(tilt);
    };
    handleScrollAndResize();
    window.addEventListener("scroll", handleScrollAndResize);
    window.addEventListener("resize", handleScrollAndResize);
    return () => {
      window.removeEventListener("scroll", handleScrollAndResize);
      window.removeEventListener("resize", handleScrollAndResize);
    };
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex flex-col ${direction === "left" ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 my-16 text-white`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-1/2", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-6xl text-left mb-4", children: title }),
          /* @__PURE__ */ jsx(
            "p",
            {
              className: "text-2xl md:text-3xl text-left",
              style: { lineHeight: 1.5 },
              children: description
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-2xl md:text-3xl text-left mt-4", children: /* @__PURE__ */ jsx("b", { children: "Responsibilities:" }) }),
          /* @__PURE__ */ jsx(
            "ul",
            {
              className: "list-disc list-inside text-left mt-4 pl-4 text-2xl",
              style: {
                lineHeight: 1.5
              },
              children: responsibilities.map((responsibility) => /* @__PURE__ */ jsx("li", { children: responsibility }, responsibility))
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `/sign-up?role=${id}`,
              target: "_blank",
              rel: "noopener noreferrer",
              children: /* @__PURE__ */ jsx(FancyButton, { className: "mt-8 w-full", children: "Apply" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full lg:w-1/2 flex items-center justify-center", children: /* @__PURE__ */ jsx(
          "img",
          {
            ref: imageRef,
            src: image,
            alt: "A spreadsheet",
            style: {
              margin: "auto",
              transform: `perspective(1000px) rotateY(${isLargeScreen ? direction === "left" ? -10 : 10 : 0}deg) rotateX(${verticalTilt}deg)`,
              transformStyle: "preserve-3d",
              width: "80%",
              height: "auto"
            }
          }
        ) })
      ]
    }
  );
}

function Positions() {
  return /* @__PURE__ */ jsxs("div", { className: "w-full p-6 h-full", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-white drop-shadow-2xl text-center text-6xl md:text-8xl", children: "Our Open Positions" }),
    /* @__PURE__ */ jsx(
      Position,
      {
        title: "Business",
        description: "We are recruiting a business leader to manage our finances, as well as sponsor outreach. You will also be tasked with planning competition logistics.",
        responsibilities: [
          "Manage our finances and budgeting",
          "Plan and execute sponsor outreach",
          "Plan competition logistics"
        ],
        requirements: [],
        image: "/business_role.svg",
        id: "business"
      }
    ),
    /* @__PURE__ */ jsx(
      Position,
      {
        title: "Marketing",
        description: "We are recruiting a marketing leader to manage our social media presence, as well as recruitment of new members.",
        responsibilities: [
          "Manage our social media presence",
          "Recruit new members",
          "Plan and execute events"
        ],
        requirements: [],
        image: "/marketing_role.svg",
        direction: "right",
        id: "marketing"
      }
    )
  ] });
}

const words = [
  {
    text: "We"
  },
  {
    text: "are"
  }
];
const REVEAL_CONFIG = {
  textAlign: "right",
  // Change this to control animation direction
  text: "Pinewood Robotics"
};
function Welcome() {
  useLenis();
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [pinewoodAnimationStarted, setPinewoodAnimationStarted] = useState(false);
  const [textScale, setTextScale] = useState(1.5);
  const [weAreWidth, setWeAreWidth] = useState("auto");
  const [scrollHandlerEnabled, setScrollHandlerEnabled] = useState(false);
  const pinewoodRef = useRef(null);
  const weAreRef = useRef(null);
  useEffect(() => {
    if (typewriterComplete && !animationStarted) {
      setAnimationStarted(true);
      setTimeout(() => {
        if (pinewoodRef.current) {
          pinewoodRef.current.style.width = "auto";
          const fullWidth = pinewoodRef.current.offsetWidth;
          pinewoodRef.current.style.width = "0";
          pinewoodRef.current.offsetHeight;
          pinewoodRef.current.style.transition = "width 1000ms ease-out";
          pinewoodRef.current.offsetHeight;
          setTimeout(() => {
            if (pinewoodRef.current) {
              setPinewoodAnimationStarted(true);
              setTextScale(1);
              pinewoodRef.current.style.width = `${fullWidth}px`;
              setTimeout(() => {
                if (pinewoodRef.current) {
                  pinewoodRef.current.style.width = "auto";
                  pinewoodRef.current.style.transition = "none";
                }
                setScrollHandlerEnabled(true);
              }, 1e3);
            }
          }, 50);
        }
      }, 300);
    }
  }, [typewriterComplete, animationStarted]);
  useEffect(() => {
    if (!scrollHandlerEnabled) {
      setWeAreWidth("auto");
      return;
    }
    const easeInOut = (t) => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    };
    const handleScroll = () => {
      if (!weAreRef.current) return;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const linearProgress = Math.min(scrollY / windowHeight, 1);
      const scrollProgress = easeInOut(linearProgress) * 4;
      const tempStyle = weAreRef.current.style.width;
      weAreRef.current.style.width = "auto";
      const fullWidth = weAreRef.current.offsetWidth;
      weAreRef.current.style.width = tempStyle;
      const currentWidth = Math.max(fullWidth * (1 - scrollProgress), 0);
      setWeAreWidth(`${currentWidth}px`);
      const currentScale = Math.min(1 + 0.5 * scrollProgress, 1.5);
      setTextScale(currentScale);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [scrollHandlerEnabled]);
  return /* @__PURE__ */ jsxs("main", { style: { overflowX: "hidden" }, children: [
    /* @__PURE__ */ jsx(
      BackgroundVideo,
      {
        startFadeIn: pinewoodAnimationStarted,
        fadeMs: 1e3
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        id: "container",
        className: "min-h-screen relative z-10",
        style: { overflowX: "hidden" },
        children: /* @__PURE__ */ jsxs("div", { id: "content", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "flex justify-center h-screen items-center",
              children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-4 w-full", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "text-white drop-shadow-2xl text-center relative",
                    style: {
                      fontSize: "min(6.9vw, 120px)",
                      transform: `scale(${textScale})`,
                      transition: scrollHandlerEnabled ? "none" : "transform 1000ms ease-out",
                      transformOrigin: "center"
                    },
                    children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center min-h-[1.2em]", children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          ref: weAreRef,
                          className: "overflow-hidden whitespace-nowrap",
                          style: {
                            width: weAreWidth
                          },
                          children: /* @__PURE__ */ jsx(
                            TypewriterEffect,
                            {
                              words,
                              onComplete: () => setTypewriterComplete(true)
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          ref: pinewoodRef,
                          className: "text-[#70cd35] overflow-hidden whitespace-nowrap ml-4",
                          style: {
                            width: "0",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                            textAlign: REVEAL_CONFIG.textAlign,
                            direction: "rtl" ,
                            fontWeight: 500,
                            // For center alignment, we need to position the text properly during animation
                            ...REVEAL_CONFIG.textAlign === "center"
                          },
                          children: /* @__PURE__ */ jsx("span", { style: { direction: "ltr" }, children: REVEAL_CONFIG.text })
                        }
                      )
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "flex justify-center flex-col sm:flex-row gap-8 w-[50%] mx-auto", children: /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/sign-up",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: /* @__PURE__ */ jsx(FancyButton, { className: "w-full sm:w-[160px]", children: "Register Interest" })
                  }
                ) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(AboutRobotics, {}),
          /* @__PURE__ */ jsx(Positions, {})
        ] })
      }
    )
  ] });
}

export { Welcome as W };
