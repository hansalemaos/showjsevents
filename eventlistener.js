class PrintEvents {
    constructor(element) {
        this.pid = document.querySelector("p#actiondone");
        this.events = [
            // Document & Window
            "DOMContentLoaded", "load", "beforeunload", "unload", "pageshow", "pagehide",
            "visibilitychange", "readystatechange",
            "resize", "scroll", "error", "unhandledrejection", "rejectionhandled",
            "online", "offline", "storage",
            "popstate", "hashchange",
            "pointerlockchange", "pointerlockerror",
            "fullscreenchange", "fullscreenerror",
            "beforeprint", "afterprint",

            // Animation & Transition
            "animationstart", "animationiteration", "animationend", "animationcancel",
            "transitionrun", "transitionstart", "transitionend", "transitioncancel",

            // Clipboard & Composition
            "beforecopy", "copy", "beforecut", "cut", "beforepaste", "paste",
            "compositionstart", "compositionupdate", "compositionend",

            // Form & Input
            "beforeinput", "input", "change", "invalid", "reset", "submit", "formdata",

            // Keyboard
            "keydown", "keypress", "keyup",

            // Mouse
            "click", "dblclick", "mousedown", "mouseup",
            "mouseenter", "mouseleave", "mouseover", "mouseout", "mousemove",
            "contextmenu", "auxclick", "wheel",

            // Pointer
            "pointerdown", "pointerup", "pointermove", "pointerover", "pointerout",
            "pointerenter", "pointerleave", "pointercancel",
            "gotpointercapture", "lostpointercapture",

            // Touch
            "touchstart", "touchmove", "touchend", "touchcancel",

            // Drag & Drop
            "dragstart", "drag", "dragenter", "dragleave", "dragover",
            "drop", "dragend",

            // Media
            "abort", "canplay", "canplaythrough", "durationchange", "emptied",
            "encrypted", "ended", "loadeddata", "loadedmetadata", "loadstart",
            "progress", "ratechange", "seeked", "seeking", "stalled", "suspend",
            "play", "playing", "pause", "timeupdate", "volumechange", "waiting",
            "loadend",

            // Progress/XHR-like
            "timeout",

            // Selection
            "select", "selectionchange",

            // Gamepad & Device
            "gamepadconnected", "gamepaddisconnected",
            "devicemotion", "deviceorientation", "deviceorientationabsolute",

            // Cue
            "cuechange",

            // Messaging / WebSocket
            "message", "messageerror", // postMessage / BroadcastChannel / Worker
            "open", "close", "error", "message", // WebSocket / EventSource

            // Payments & Notifications
            "shippingaddresschange", "shippingoptionchange",
            "notificationclick", "notificationclose",

            // WebGL & Speech
            "webglcontextlost", "webglcontextrestored",
            "speechstart", "speechend", "speechboundary", "soundstart", "soundend"
        ];

        // registra todos
        this.events.forEach(type =>
            element.addEventListener(type, this, false)
        );
    }

    handleEvent(event) {
        const lines = [];

        // --- propriedades genéricas ---
        lines.push(`Type: ${event.type}`);
        lines.push(`Time: ${event.timeStamp.toFixed(1)}ms`);
        lines.push(`Bubbles: ${event.bubbles}, Cancelable: ${event.cancelable}`);
        lines.push(`Target: ${event.target.tagName.toLowerCase()}${event.target.id ? '#' + event.target.id : ''}`);
        lines.push(`CurrentTarget: ${event.currentTarget.tagName.toLowerCase()}`);

        // --- MouseEvent ---
        if (event instanceof MouseEvent) {
            lines.push(`Coords: (${event.clientX}, ${event.clientY})`);
            lines.push(`Button: ${event.button}`);
            lines.push(`Buttons bitmask: ${event.buttons}`);
        }

        // --- WheelEvent ---
        if (event instanceof WheelEvent) {
            lines.push(`Delta: Δx=${event.deltaX}, Δy=${event.deltaY}, Δz=${event.deltaZ}`);
            lines.push(`DeltaMode: ${event.deltaMode}`);
        }

        // --- PointerEvent ---
        if (event instanceof PointerEvent) {
            lines.push(`PointerID: ${event.pointerId}`);
            lines.push(`PointerType: ${event.pointerType}`);
            lines.push(`Pressure: ${event.pressure}`);
            lines.push(`Tilt: (${event.tiltX}, ${event.tiltY})`);
        }

        // --- KeyboardEvent ---
        if (event instanceof KeyboardEvent) {
            lines.push(`Key: ${event.key} (code: ${event.code})`);
            lines.push(`Modifiers: ctrl=${event.ctrlKey}, alt=${event.altKey}, shift=${event.shiftKey}, meta=${event.metaKey}`);
        }

        // --- TouchEvent ---
        if (event instanceof TouchEvent) {
            const touchList = Array.from(event.touches)
                .map(t => `(${t.clientX},${t.clientY})`)
                .join(" | ");
            lines.push(`Touches [${event.touches.length}]: ${touchList}`);
        }

        // --- DragEvent ---
        if (event instanceof DragEvent) {
            const dt = event.dataTransfer;
            if (dt) {
                lines.push(`Drag types: ${Array.from(dt.types).join(", ")}`);
                lines.push(`EffectAllowed: ${dt.effectAllowed}, DropEffect: ${dt.dropEffect}`);
            }
        }

        // --- ClipboardEvent ---
        if (event instanceof ClipboardEvent) {
            const text = event.clipboardData?.getData("text") || "";
            lines.push(`Clipboard text: "${text}"`);
        }

        // --- StorageEvent ---
        if (event instanceof StorageEvent) {
            lines.push(`Storage key: ${event.key}`);
            lines.push(`OldValue: ${event.oldValue}, NewValue: ${event.newValue}`);
            lines.push(`URL: ${event.url}`);
        }

        // --- CompositionEvent (IME) ---
        if (event instanceof CompositionEvent) {
            lines.push(`Composed data: "${event.data}"`);
        }

        // --- Animation & Transition ---
        if (event.type.startsWith("animation")) {
            lines.push(`AnimationName: ${event.animationName}, Elapsed: ${event.elapsedTime.toFixed(2)}s`);
        }
        if (event.type.startsWith("transition")) {
            lines.push(`Property: ${event.propertyName}, Elapsed: ${event.elapsedTime.toFixed(2)}s`);
        }

        // --- Error & PromiseRejection ---
        if (event.type === "error") {
            lines.push(`Message: ${event.message}, File: ${event.filename}:${event.lineno}`);
        }
        if (event.type === "unhandledrejection") {
            lines.push(`Rejection reason:`, event.reason);
        }

        // --- BeforeUnload ---
        if (event.type === "beforeunload") {
            lines.push(`ReturnValue: ${event.returnValue}`);
        }

        // --- Visibility & Online/Offline ---
        if (event.type === "visibilitychange") {
            lines.push(`VisibilityState: ${document.visibilityState}`);
        }
        if (event.type === "online" || event.type === "offline") {
            lines.push(`Navigator.onLine: ${navigator.onLine}`);
        }

        // escreve tudo
        this.pid.innerHTML = lines.map(l => `<div>${l}</div>`).join("");
    }
}

const s = new PrintEvents(document.body);
