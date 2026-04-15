const statusEl = document.getElementById("status");
const temaSelect = document.getElementById("temaSelect");
const btnAll = document.getElementById("btnAll");
const btnAllTemas = document.getElementById("btnAllTemas");
const btnTema = document.getElementById("btnTema");
const graphEl = document.getElementById("graph");
const legendEl = document.getElementById("legend");
const overviewMetaEl = document.getElementById("overviewMeta");
const overviewListEl = document.getElementById("overviewList");

const SVG_NS = "http://www.w3.org/2000/svg";
const DEFAULT_VIEWBOX = { x: 0, y: 0, width: 900, height: 460 };

let graphBounds = { ...DEFAULT_VIEWBOX };
let viewBoxState = { ...DEFAULT_VIEWBOX };
let dragState = null;
let touchState = null;

async function requestJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
}

function renderTemas(temas) {
    temaSelect.innerHTML = temas
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map((tema) => `<option value="${tema.nombre}">${tema.nombre}</option>`)
        .join("");
}

function createNode(id, label, type, attributes = {}) {
    return { id, label, type, attributes };
}

function renderOverview(nodes) {
    const safeNodes = Array.isArray(nodes) ? nodes : [];
    overviewMetaEl.textContent = `Nodos (${safeNodes.length})`;

    if (!safeNodes.length) {
        overviewListEl.innerHTML = '<div class="empty">Sin nodos para mostrar.</div>';
        return;
    }

    const byType = safeNodes.reduce((acc, node) => {
        const type = node.type || "desconocido";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const chips = Object.entries(byType)
        .map(([type, count]) => `${type}: ${count}`)
        .join(" | ");
    overviewMetaEl.textContent = `Nodos (${safeNodes.length}) · ${chips}`;

    overviewListEl.innerHTML = safeNodes
        .slice()
        .sort((a, b) => (a.label || "").localeCompare(b.label || ""))
        .map((node) => {
            const attrs = node.attributes || {};
            const attrRows = Object.entries(attrs)
                .map(([key, value]) => `<div><span>${key}</span><strong>${String(value)}</strong></div>`)
                .join("");

            return `
                <details class="overview-item">
                    <summary>
                        <span>${node.label || "Sin nombre"}</span>
                        <span class="overview-node-type">${node.type || "n/a"}</span>
                    </summary>
                    <div class="overview-body">
                        <div><span>id</span><strong>${node.id}</strong></div>
                        ${attrRows}
                    </div>
                </details>
            `;
        })
        .join("");
}

function renderLegend(nodes) {
    const typeSet = new Set(nodes.map((node) => node.type));
    const order = ["tech", "tema", "categoria"];
    const labels = {
        tech: "Tecnologia",
        tema: "Tema",
        categoria: "Categoria"
    };
    const dotClass = {
        tech: "dot-tech",
        tema: "dot-tema",
        categoria: "dot-cat"
    };

    const items = order
        .filter((type) => typeSet.has(type))
        .map((type) => `
            <span class="legend-item">
                <span class="dot ${dotClass[type]}"></span>
                ${labels[type]}
            </span>
        `)
        .join("");

    legendEl.innerHTML = items;
}

function updateViewBox() {
    graphEl.setAttribute(
        "viewBox",
        `${viewBoxState.x} ${viewBoxState.y} ${viewBoxState.width} ${viewBoxState.height}`
    );
}

function resetZoom() {
    viewBoxState = { ...graphBounds };
    updateViewBox();
}

function toSvgPoint(clientX, clientY) {
    const rect = graphEl.getBoundingClientRect();
    const x = viewBoxState.x + ((clientX - rect.left) / rect.width) * viewBoxState.width;
    const y = viewBoxState.y + ((clientY - rect.top) / rect.height) * viewBoxState.height;
    return { x, y };
}

function zoomAt(clientX, clientY, zoomFactor) {
    const minWidth = 260;
    const maxWidth = graphBounds.width * 3;
    const nextWidth = Math.min(maxWidth, Math.max(minWidth, viewBoxState.width * zoomFactor));
    const nextHeight = (nextWidth / graphBounds.width) * graphBounds.height;

    const pivot = toSvgPoint(clientX, clientY);
    const px = (pivot.x - viewBoxState.x) / viewBoxState.width;
    const py = (pivot.y - viewBoxState.y) / viewBoxState.height;

    viewBoxState = {
        x: pivot.x - px * nextWidth,
        y: pivot.y - py * nextHeight,
        width: nextWidth,
        height: nextHeight
    };
    updateViewBox();
}

function panByPixels(deltaClientX, deltaClientY) {
    const rect = graphEl.getBoundingClientRect();
    const dx = (deltaClientX / rect.width) * viewBoxState.width;
    const dy = (deltaClientY / rect.height) * viewBoxState.height;
    viewBoxState.x -= dx;
    viewBoxState.y -= dy;
    updateViewBox();
}

function touchDistance(touchA, touchB) {
    const dx = touchA.clientX - touchB.clientX;
    const dy = touchA.clientY - touchB.clientY;
    return Math.hypot(dx, dy);
}

function touchMidpoint(touchA, touchB) {
    return {
        x: (touchA.clientX + touchB.clientX) / 2,
        y: (touchA.clientY + touchB.clientY) / 2
    };
}

function initGraphInteractions() {
    graphEl.addEventListener("wheel", (event) => {
        event.preventDefault();
        // Wheel/trackpad now zooms the graph directly (Neo4j-like camera feel).
        const factor = event.deltaY < 0 ? 0.92 : 1.08;
        zoomAt(event.clientX, event.clientY, factor);
    }, { passive: false });

    graphEl.addEventListener("mousedown", (event) => {
        if (event.button !== 0) {
            return;
        }

        dragState = {
            startClientX: event.clientX,
            startClientY: event.clientY,
            startX: viewBoxState.x,
            startY: viewBoxState.y
        };
        graphEl.classList.add("dragging");
    });

    window.addEventListener("mousemove", (event) => {
        if (!dragState) {
            return;
        }

        const rect = graphEl.getBoundingClientRect();
        const dx = ((event.clientX - dragState.startClientX) / rect.width) * viewBoxState.width;
        const dy = ((event.clientY - dragState.startClientY) / rect.height) * viewBoxState.height;

        viewBoxState.x = dragState.startX - dx;
        viewBoxState.y = dragState.startY - dy;
        updateViewBox();
    });

    window.addEventListener("mouseup", () => {
        dragState = null;
        graphEl.classList.remove("dragging");
    });

    graphEl.addEventListener("dblclick", () => {
        resetZoom();
    });

    graphEl.addEventListener("touchstart", (event) => {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            touchState = {
                mode: "pan",
                lastX: touch.clientX,
                lastY: touch.clientY
            };
            return;
        }

        if (event.touches.length >= 2) {
            const a = event.touches[0];
            const b = event.touches[1];
            touchState = {
                mode: "pinch",
                distance: touchDistance(a, b),
                midpoint: touchMidpoint(a, b)
            };
        }
    }, { passive: true });

    graphEl.addEventListener("touchmove", (event) => {
        if (!touchState) {
            return;
        }

        event.preventDefault();

        if (touchState.mode === "pan" && event.touches.length === 1) {
            const touch = event.touches[0];
            const dx = touch.clientX - touchState.lastX;
            const dy = touch.clientY - touchState.lastY;
            panByPixels(dx, dy);
            touchState.lastX = touch.clientX;
            touchState.lastY = touch.clientY;
            return;
        }

        if (event.touches.length >= 2) {
            const a = event.touches[0];
            const b = event.touches[1];
            const nextDistance = touchDistance(a, b);
            const midpoint = touchMidpoint(a, b);

            if (touchState.mode !== "pinch") {
                touchState = {
                    mode: "pinch",
                    distance: nextDistance,
                    midpoint
                };
                return;
            }

            const rawFactor = touchState.distance / nextDistance;
            const boundedFactor = Math.max(0.9, Math.min(1.1, rawFactor));
            zoomAt(midpoint.x, midpoint.y, boundedFactor);
            touchState.distance = nextDistance;
            touchState.midpoint = midpoint;
        }
    }, { passive: false });

    graphEl.addEventListener("touchend", (event) => {
        if (event.touches.length === 0) {
            touchState = null;
            return;
        }

        if (event.touches.length === 1) {
            const touch = event.touches[0];
            touchState = {
                mode: "pan",
                lastX: touch.clientX,
                lastY: touch.clientY
            };
        }
    }, { passive: true });

    graphEl.addEventListener("touchcancel", () => {
        touchState = null;
    }, { passive: true });

    updateViewBox();
}

function renderGraph(nodes, edges) {
    graphEl.innerHTML = "";

    const densityScale = Math.max(1, Math.sqrt(Math.max(nodes.length, 1) / 8));
    graphBounds = {
        x: 0,
        y: 0,
        width: Math.round(DEFAULT_VIEWBOX.width * densityScale),
        height: Math.round(DEFAULT_VIEWBOX.height * densityScale)
    };
    resetZoom();

    if (!nodes.length) {
        renderLegend([]);
        renderOverview([]);
        const text = document.createElementNS(SVG_NS, "text");
        text.setAttribute("x", "50%");
        text.setAttribute("y", "50%");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#64748b");
        text.textContent = "No hay datos para dibujar el grafo.";
        graphEl.appendChild(text);
        return;
    }

    const width = graphBounds.width;
    const height = graphBounds.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.38;

    const temaCount = nodes.filter((n) => n.type === "tema").length;
    const ringNodes = temaCount > 1 ? nodes : nodes.filter((n) => n.type !== "tema");

    const positionedNodes = nodes.map((node) => {
        const shouldCenterTema = node.type === "tema" && temaCount === 1;
        if (shouldCenterTema) {
            return { ...node, x: centerX, y: centerY };
        }

        const ringIndex = ringNodes.findIndex((n) => n.id === node.id);
        const angle = (ringIndex / Math.max(ringNodes.length, 1)) * (Math.PI * 2);
        return {
            ...node,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    });

    const byId = new Map(positionedNodes.map((n) => [n.id, n]));

    edges.forEach((edge) => {
        const from = byId.get(edge.from);
        const to = byId.get(edge.to);
        if (!from || !to) {
            return;
        }

        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", String(from.x));
        line.setAttribute("y1", String(from.y));
        line.setAttribute("x2", String(to.x));
        line.setAttribute("y2", String(to.y));
        line.setAttribute("class", "edge-line");
        graphEl.appendChild(line);
    });

    positionedNodes.forEach((node) => {
        const group = document.createElementNS(SVG_NS, "g");

        const circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttribute("cx", String(node.x));
        circle.setAttribute("cy", String(node.y));

        let fill = "#0f766e";
        let r = 16;
        if (node.type === "tema") {
            fill = "#b45309";
            r = 22;
        } else if (node.type === "categoria") {
            fill = "#475569";
            r = 14;
        }

        circle.setAttribute("r", String(r));
        circle.setAttribute("fill", fill);
        circle.setAttribute("opacity", "0.94");

        const label = document.createElementNS(SVG_NS, "text");
        label.setAttribute("x", String(node.x));
        label.setAttribute("y", String(node.y + r + 16));
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("class", "node-label");
        label.textContent = node.label;

        group.appendChild(circle);
        group.appendChild(label);
        graphEl.appendChild(group);
    });

    renderLegend(nodes);
    renderOverview(nodes);
}

function buildGraphForAll(tecnologias) {
    const nodes = [];
    const edges = [];
    const techIds = new Set();

    function addTechNode(nombre) {
        if (!nombre) {
            return;
        }
        const id = `tech:${nombre}`;
        if (techIds.has(id)) {
            return;
        }
        techIds.add(id);
        nodes.push(createNode(id, nombre, "tech", { nombre }));
    }

    tecnologias.forEach((tech) => {
        addTechNode(tech.nombre);
        const techId = `tech:${tech.nombre}`;

        if (Array.isArray(tech.compatibles)) {
            tech.compatibles.forEach((compatible) => {
                if (!compatible || !compatible.nombre) {
                    return;
                }
                const toId = `tech:${compatible.nombre}`;
                addTechNode(compatible.nombre);
                edges.push({ from: techId, to: toId, label: "SE_INTEGRA_CON" });
            });
        }
    });

    renderGraph(nodes, edges);
}

function buildGraphForTema(tecnologias, tema) {
    const nodes = [createNode(`tema:${tema}`, tema, "tema", { nombre: tema })];
    const edges = [];

    tecnologias.forEach((tech) => {
        const techId = `tech:${tech.nombre}`;
        if (!nodes.find((n) => n.id === techId)) {
            nodes.push(createNode(techId, tech.nombre, "tech", { nombre: tech.nombre }));
        }
        edges.push({ from: techId, to: `tema:${tema}`, label: "VISTO_EN" });

        if (Array.isArray(tech.compatibles)) {
            tech.compatibles.forEach((compatible) => {
                if (!compatible || !compatible.nombre) {
                    return;
                }
                const toId = `tech:${compatible.nombre}`;
                if (!nodes.find((n) => n.id === toId)) {
                    nodes.push(createNode(toId, compatible.nombre, "tech", { nombre: compatible.nombre }));
                }
                edges.push({ from: techId, to: toId, label: "SE_INTEGRA_CON" });
            });
        }
    });

    renderGraph(nodes, edges);
}

function buildGraphForTemas(temas) {
    const nodes = (temas || []).map((tema) =>
        createNode(`tema:${tema.id || tema.nombre}`, tema.nombre || "Sin nombre", "tema", {
            id: tema.id || "-",
            nombre: tema.nombre || "Sin nombre"
        })
    );
    renderGraph(nodes, []);
}

async function loadTemas() {
    try {
        const temas = await requestJson("/api/temas");
        renderTemas(temas);
        statusEl.textContent = `Temas cargados: ${temas.length}`;
    } catch (error) {
        statusEl.textContent = `No se pudieron cargar los temas (${error.message}).`;
    }
}

async function loadAllTecnologias() {
    statusEl.textContent = "Consultando tecnologias...";
    try {
        const tecnologias = await requestJson("/api/tecnologias");
        buildGraphForAll(tecnologias);
        statusEl.textContent = `Total tecnologias: ${tecnologias.length}`;
    } catch (error) {
        statusEl.textContent = `Error al consultar tecnologias (${error.message}).`;
        renderGraph([], []);
    }
}

async function loadAllTemas() {
    statusEl.textContent = "Consultando temas...";
    try {
        const temas = await requestJson("/api/temas");
        buildGraphForTemas(temas);
        statusEl.textContent = `Total temas: ${temas.length}`;
    } catch (error) {
        statusEl.textContent = `Error al consultar temas (${error.message}).`;
        renderGraph([], []);
    }
}

async function loadTecnologiasPorTema() {
    const tema = temaSelect.value;
    if (!tema) {
        statusEl.textContent = "Selecciona un tema para filtrar.";
        return;
    }

    statusEl.textContent = `Consultando tecnologias para '${tema}'...`;
    try {
        const tecnologias = await requestJson(`/api/tecnologias/${encodeURIComponent(tema)}`);
        buildGraphForTema(tecnologias, tema);
        statusEl.textContent = `Resultados para '${tema}': ${tecnologias.length}`;
    } catch (error) {
        statusEl.textContent = `Error al consultar por tema (${error.message}).`;
        renderGraph([], []);
    }
}

btnAll.addEventListener("click", loadAllTecnologias);
btnAllTemas.addEventListener("click", loadAllTemas);
btnTema.addEventListener("click", loadTecnologiasPorTema);

(async function init() {
    initGraphInteractions();
    resetZoom();
    await loadTemas();
    await loadAllTecnologias();
})();
