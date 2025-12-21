(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ThreeViewer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThreeViewer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$controls$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/controls/OrbitControls.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/examples/jsm/loaders/GLTFLoader.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function ThreeViewer({ modelUrl }) {
    _s();
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(null);
    const mountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center w-full h-full text-red-500 p-4 border border-red-500",
            children: error
        }, void 0, false, {
            fileName: "[project]/src/components/ThreeViewer.tsx",
            lineNumber: 18,
            columnNumber: 7
        }, this);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThreeViewer.useEffect": ()=>{
            if (!mountRef.current) return;
            /* Scene */ const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
            scene.background = null;
            const envTexture = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTexture"](new Uint8Array([
                255,
                255,
                255
            ]), 1, 1, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RGBFormat"]);
            envTexture.needsUpdate = true;
            scene.environment = envTexture;
            /* Camera */ const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
            camera.position.set(0, 0, 3);
            /* Renderer */ const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                antialias: true,
                alpha: true
            });
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            mountRef.current.appendChild(renderer.domElement);
            renderer.outputColorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
            renderer.toneMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ACESFilmicToneMapping"];
            renderer.toneMappingExposure = 1;
            /* Lights */ scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmbientLight"](0xffffff, 1.2));
            const dirLight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"](0xffffff, 1);
            dirLight.position.set(5, 5, 5);
            scene.add(dirLight);
            /* Controls (rotate only) */ const controls = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$controls$2f$OrbitControls$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrbitControls"](camera, renderer.domElement);
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.autoRotate = false;
            // Mặc định tắt controls để tránh xoay khi click ra ngoài ngay từ đầu
            controls.enabled = false;
            /* Load GLTF */ const loader = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$examples$2f$jsm$2f$loaders$2f$GLTFLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GLTFLoader"]();
            // Biến để lưu trữ tham chiếu đến model cho việc Raycasting
            let loadedModel = null;
            loader.load(modelUrl, {
                "ThreeViewer.useEffect": (gltf)=>{
                    loadedModel = gltf.scene; // Lưu tham chiếu model
                    /* 🔥 Auto-scale to fit */ const box = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Box3"]().setFromObject(loadedModel);
                    const size = box.getSize(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]()).length();
                    const center = box.getCenter(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]());
                    console.log("Model loaded. Size:", size, "Center:", center);
                    if (size === 0) {
                        console.error("Model has 0 size. Check if it contains meshes.");
                    }
                    loadedModel.position.set(0, -0.5, 0);
                    const scale = 1.5 / size || 1;
                    loadedModel.scale.setScalar(scale);
                    scene.add(loadedModel);
                    console.log("load model successfully");
                }
            }["ThreeViewer.useEffect"], {
                "ThreeViewer.useEffect": (xhr)=>{
                    console.log(xhr.loaded / xhr.total * 100 + "% loaded");
                }
            }["ThreeViewer.useEffect"], {
                "ThreeViewer.useEffect": (error)=>{
                    console.error("An error happened loading the model:", error);
                    setError("Error loading model: " + error.message);
                }
            }["ThreeViewer.useEffect"]);
            /* 🔥 LOGIC MỚI: Raycasting để kiểm tra click chuột */ const raycaster = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Raycaster"]();
            const mouse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector2"]();
            const onPointerDown = {
                "ThreeViewer.useEffect.onPointerDown": (event)=>{
                    // Nếu chưa load xong model thì không làm gì cả
                    if (!loadedModel) return;
                    // 1. Tính toán tọa độ chuột chuẩn hóa (Normalized Device Coordinates) (-1 đến +1)
                    const rect = renderer.domElement.getBoundingClientRect();
                    mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
                    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                    // 2. Cập nhật tia chiếu từ camera
                    raycaster.setFromCamera(mouse, camera);
                    // 3. Kiểm tra va chạm với model (recursive = true để kiểm tra tất cả mesh con)
                    const intersects = raycaster.intersectObject(loadedModel, true);
                    // 4. Nếu có va chạm -> Bật controls. Không thì tắt.
                    if (intersects.length > 0) {
                        controls.enabled = true;
                    } else {
                        controls.enabled = false;
                    }
                }
            }["ThreeViewer.useEffect.onPointerDown"];
            // Lắng nghe sự kiện pointerdown (chuột nhấn xuống)
            // Sử dụng { capture: true } để đảm bảo logic của ta chạy trước logic của OrbitControls
            renderer.domElement.addEventListener("pointerdown", onPointerDown, {
                capture: true
            });
            /* Logic phụ: Khi nhả chuột, ta có thể giữ controls enabled hoặc tắt nó.
       Để trải nghiệm mượt mà, ta cứ để nó enabled cho đến lần click tiếp theo.
       Tuy nhiên, nếu muốn chặt chẽ, bạn có thể thêm sự kiện pointerup. */ /* Animation */ const animate = {
                "ThreeViewer.useEffect.animate": ()=>{
                    requestAnimationFrame(animate);
                    controls.update();
                    renderer.render(scene, camera);
                }
            }["ThreeViewer.useEffect.animate"];
            animate();
            /* Resize */ const onResize = {
                "ThreeViewer.useEffect.onResize": ()=>{
                    if (!mountRef.current) return;
                    camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
                }
            }["ThreeViewer.useEffect.onResize"];
            window.addEventListener("resize", onResize);
            /* Cleanup */ return ({
                "ThreeViewer.useEffect": ()=>{
                    window.removeEventListener("resize", onResize);
                    renderer.domElement.removeEventListener("pointerdown", onPointerDown, {
                        capture: true
                    });
                    renderer.dispose();
                    mountRef.current?.removeChild(renderer.domElement);
                }
            })["ThreeViewer.useEffect"];
        }
    }["ThreeViewer.useEffect"], [
        modelUrl
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: mountRef,
        className: "w-full h-full"
    }, void 0, false, {
        fileName: "[project]/src/components/ThreeViewer.tsx",
        lineNumber: 179,
        columnNumber: 10
    }, this);
}
_s(ThreeViewer, "zy9HJP5+uJSpqWpdmevplh7F0eI=");
_c = ThreeViewer;
var _c;
__turbopack_context__.k.register(_c, "ThreeViewer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_ThreeViewer_tsx_7f1c533a._.js.map