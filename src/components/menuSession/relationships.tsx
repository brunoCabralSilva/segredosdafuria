'use client'

import contexto from "@/context/context";
import { updateSession } from "@/firebase/sessions";
import { useContext, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

type RelationshipNode = {
  id: number;
  email: string;
  sheetId?: string;
  name: string;
  x: number;
  y: number;
};

type RelationshipEdge = {
  id: string;
  fromId: number;
  toId: number;
  label: string;
  curveOffset?: number;
  labelOffsetX?: number;
  labelOffsetY?: number;
};

type DragState = {
  nodeId: number;
  pointerId: number;
  hasDragged: boolean;
};

type EdgeDragState = {
  edgeId: string;
  pointerId: number;
};

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const NODE_WIDTH = 180;
const NODE_HEIGHT = 64;
const NODE_TEXT_MAX_CHARS = 16;
const NODE_TEXT_LINE_HEIGHT = 18;
const LABEL_WIDTH = 156;
const LABEL_HEIGHT = 28;
const LABEL_TEXT_MAX_CHARS = 20;
const LABEL_TEXT_LINE_HEIGHT = 14;

function getNextNodePosition(totalNodes: number) {
  const columns = 4;
  const horizontalGap = 250;
  const verticalGap = 170;
  const startX = 170;
  const startY = 150;
  const column = totalNodes % columns;
  const row = Math.floor(totalNodes / columns);

  return {
    x: startX + column * horizontalGap,
    y: startY + row * verticalGap,
  };
}

function clampPosition(x: number, y: number) {
  return {
    x: Math.min(Math.max(x, NODE_WIDTH / 2), CANVAS_WIDTH - NODE_WIDTH / 2),
    y: Math.min(Math.max(y, NODE_HEIGHT / 2), CANVAS_HEIGHT - NODE_HEIGHT / 2),
  };
}

function buildEdgesForNewNode(
  existingNodes: RelationshipNode[],
  newNode: RelationshipNode,
  connectedNodeIds?: number[]
) {
  const allowedIds = connectedNodeIds ? new Set(connectedNodeIds) : null;

  return existingNodes
    .filter((node) => (allowedIds ? allowedIds.has(node.id) : true))
    .flatMap((node) => [
    {
      id: `${node.id}-${newNode.id}`,
      fromId: node.id,
      toId: newNode.id,
      label: "",
    },
    {
      id: `${newNode.id}-${node.id}`,
      fromId: newNode.id,
      toId: node.id,
      label: "",
    },
  ]);
}

function getTrimmedValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function wrapText(value: string, maxCharsPerLine: number) {
  const trimmedValue = value.trim();

  if (!trimmedValue) return [""];

  const words = trimmedValue.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    if (word.length > maxCharsPerLine) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }

      for (let index = 0; index < word.length; index += maxCharsPerLine) {
        lines.push(word.slice(index, index + maxCharsPerLine));
      }
      return;
    }

    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxCharsPerLine) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine) lines.push(currentLine);

  return lines.length > 0 ? lines : [""];
}

function getNodeTextLines(value: string) {
  return wrapText(value || "Sem nome", NODE_TEXT_MAX_CHARS);
}

function getNodeBoxHeight(value: string) {
  return Math.max(
    NODE_HEIGHT,
    getNodeTextLines(value).length * NODE_TEXT_LINE_HEIGHT + 24
  );
}

function getNodeBoundaryPoint(
  node: RelationshipNode,
  targetX: number,
  targetY: number
) {
  const halfWidth = NODE_WIDTH / 2;
  const halfHeight = getNodeBoxHeight(node.name || "Sem nome") / 2;
  const deltaX = targetX - node.x;
  const deltaY = targetY - node.y;

  if (deltaX === 0 && deltaY === 0) {
    return { x: node.x, y: node.y };
  }

  const scale =
    1 /
    Math.max(
      Math.abs(deltaX) / halfWidth || 0,
      Math.abs(deltaY) / halfHeight || 0
    );

  return {
    x: node.x + deltaX * scale,
    y: node.y + deltaY * scale,
  };
}

function getLabelTextLines(value: string) {
  return wrapText(value || "Sem texto", LABEL_TEXT_MAX_CHARS);
}

function getLabelBoxHeight(value: string) {
  return Math.max(
    LABEL_HEIGHT,
    getLabelTextLines(value).length * LABEL_TEXT_LINE_HEIGHT + 12
  );
}

function getDefaultCurveDirection(
  edge: Pick<RelationshipEdge, "fromId" | "toId">,
  firstNodeId: number,
  secondNodeId: number
) {
  return edge.fromId === firstNodeId && edge.toId === secondNodeId ? 1 : -1;
}

function getEdgeGeometry(
  edge: RelationshipEdge,
  nodesById: Record<number, RelationshipNode>
) {
  const fromNode = nodesById[edge.fromId];
  const toNode = nodesById[edge.toId];

  if (!fromNode || !toNode) return null;

  const firstNode = fromNode.id < toNode.id ? fromNode : toNode;
  const secondNode = fromNode.id < toNode.id ? toNode : fromNode;
  const baseDx = secondNode.x - firstNode.x;
  const baseDy = secondNode.y - firstNode.y;
  const baseDistance = Math.max(Math.sqrt(baseDx ** 2 + baseDy ** 2), 1);
  const normalX = -baseDy / baseDistance;
  const normalY = baseDx / baseDistance;
  const defaultCurveDirection = getDefaultCurveDirection(
    edge,
    firstNode.id,
    secondNode.id
  );
  const curveOffset =
    typeof edge.curveOffset === "number" && Number.isFinite(edge.curveOffset)
      ? edge.curveOffset
      : 120 * defaultCurveDirection;
  const centerFromX = fromNode.x;
  const centerFromY = fromNode.y;
  const centerToX = toNode.x;
  const centerToY = toNode.y;
  const midpointX = (centerFromX + centerToX) / 2;
  const midpointY = (centerFromY + centerToY) / 2;
  const controlX = midpointX + normalX * curveOffset;
  const controlY = midpointY + normalY * curveOffset;
  const fromPoint = getNodeBoundaryPoint(fromNode, controlX, controlY);
  const toPoint = getNodeBoundaryPoint(toNode, controlX, controlY);
  const fromX = fromPoint.x;
  const fromY = fromPoint.y;
  const toX = toPoint.x;
  const toY = toPoint.y;
  const baseLabelX = (fromX + 2 * controlX + toX) / 4;
  const baseLabelY = (fromY + 2 * controlY + toY) / 4;
  const defaultLabelOffsetX = normalX * 24 * Math.sign(curveOffset || 1);
  const defaultLabelOffsetY = normalY * 24 * Math.sign(curveOffset || 1);
  const labelOffsetX =
    typeof edge.labelOffsetX === "number" && Number.isFinite(edge.labelOffsetX)
      ? edge.labelOffsetX
      : defaultLabelOffsetX;
  const labelOffsetY =
    typeof edge.labelOffsetY === "number" && Number.isFinite(edge.labelOffsetY)
      ? edge.labelOffsetY
      : defaultLabelOffsetY;
  const labelX = baseLabelX + labelOffsetX;
  const labelY = baseLabelY + labelOffsetY;

  return {
    edge,
    fromNode,
    toNode,
    normalX,
    normalY,
    midpointX,
    midpointY,
    controlX,
    controlY,
    curveOffset,
    labelX,
    labelY,
    baseLabelX,
    baseLabelY,
    path: `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`,
  };
}

function normalizeRelationshipNode(node: RelationshipNode): RelationshipNode {
  return {
    id: node.id,
    email: node.email,
    ...(node.sheetId ? { sheetId: node.sheetId } : {}),
    name: typeof node.name === "string" ? node.name : "",
    x: node.x,
    y: node.y,
  };
}

function normalizeRelationshipEdge(edge: RelationshipEdge): RelationshipEdge {
  return {
    id: edge.id,
    fromId: edge.fromId,
    toId: edge.toId,
    label: typeof edge.label === "string" ? edge.label : "",
    ...(typeof edge.curveOffset === "number" &&
    Number.isFinite(edge.curveOffset)
      ? { curveOffset: edge.curveOffset }
      : {}),
    ...(typeof edge.labelOffsetX === "number" &&
    Number.isFinite(edge.labelOffsetX)
      ? { labelOffsetX: edge.labelOffsetX }
      : {}),
    ...(typeof edge.labelOffsetY === "number" &&
    Number.isFinite(edge.labelOffsetY)
      ? { labelOffsetY: edge.labelOffsetY }
      : {}),
  };
}

export default function Relationships() {
  const {
    email,
    session,
    dataSheet,
    sheetId,
    setSession,
    setShowMessage,
    setShowRelationshipMap,
    forceHideSessionMenu,
  } = useContext(contexto);

  const [isSaving, setIsSaving] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [relationshipDrafts, setRelationshipDrafts] = useState<
    Record<number, string>
  >({});
  const [pendingNode, setPendingNode] = useState<RelationshipNode | null>(null);
  const [pendingConnections, setPendingConnections] = useState<
    Record<number, boolean>
  >({});
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);
  const [draggedEdgeId, setDraggedEdgeId] = useState<string | null>(null);

  const dragStateRef = useRef<DragState | null>(null);
  const edgeDragStateRef = useRef<EdgeDragState | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const nodes = useMemo<RelationshipNode[]>(
    () => session?.relationshipMap?.nodes ?? [],
    [session]
  );
  const edges = useMemo<RelationshipEdge[]>(
    () => session?.relationshipMap?.edges ?? [],
    [session]
  );

  const nodeMap = useMemo(
    () =>
      nodes.reduce<Record<number, RelationshipNode>>((accumulator, node) => {
        accumulator[node.id] = node;
        return accumulator;
      }, {}),
    [nodes]
  );
  const edgeMap = useMemo(
    () =>
      edges.reduce<Record<string, RelationshipEdge>>((accumulator, edge) => {
        accumulator[edge.id] = edge;
        return accumulator;
      }, {}),
    [edges]
  );
  const selectedNode =
    selectedNodeId === null
      ? null
      : nodes.find((node) => node.id === selectedNodeId) ?? null;
  const isSelectedNodeOwner = selectedNode?.email === email;
  const isGameMaster = session?.gameMaster === email;
  const canEditSelectedNode = Boolean(selectedNode) && (isSelectedNodeOwner || isGameMaster);

  const connections = useMemo(
    () =>
      edges
        .map((edge) => {
          return getEdgeGeometry(edge, nodeMap);
        })
        .filter(
          (connection): connection is NonNullable<ReturnType<typeof getEdgeGeometry>> =>
            connection !== null
        ),
    [edges, nodeMap]
  );

  async function persistRelationshipMap(
    nextNodes: RelationshipNode[],
    nextEdges: RelationshipEdge[]
  ) {
    if (!session?.id) return;

    const normalizedNodes = nextNodes.map(normalizeRelationshipNode);
    const normalizedEdges = nextEdges.map(normalizeRelationshipEdge);

    const nextSession = {
      ...session,
      relationshipMap: {
        ...(session.relationshipMap ?? {}),
        nodes: normalizedNodes,
        edges: normalizedEdges,
      },
    };

    try {
      setIsSaving(true);
      setSession(nextSession);
      await updateSession(nextSession, setShowMessage);
    } finally {
      setIsSaving(false);
    }
  }

  async function createMyNode() {
    if (!session?.id || !email) return;
    const characterName = getTrimmedValue(dataSheet?.data?.name);
    const activeSheetId = getTrimmedValue(dataSheet?.id) || getTrimmedValue(sheetId);

    if (!characterName && !isGameMaster) {
      setShowMessage({
        show: true,
        text: "Defina ou selecione uma ficha com nome de personagem antes de criar seu item.",
      });
      return;
    }

    const nextNodeName = characterName;

    const existingNode =
      isGameMaster && !nextNodeName && !activeSheetId
        ? null
        : isGameMaster
      ? nodes.find((node) => {
          if (node.email !== email) return false;
          if (activeSheetId && node.sheetId) return node.sheetId === activeSheetId;
          if (activeSheetId && !node.sheetId) return node.name === nextNodeName;
          return node.name === nextNodeName;
        })
      : nodes.find((node) => node.email === email);

    if (existingNode) {
      if (
        existingNode.name === nextNodeName &&
        (!isGameMaster || !activeSheetId || existingNode.sheetId === activeSheetId)
      ) {
        setShowMessage({
          show: true,
          text: "Voce ja possui um item neste mapa de relacionamentos.",
        });
        setSelectedNodeId(existingNode.id);
        setNameDraft(existingNode.name);
        return;
      }

      const nextNodes = nodes.map((node) =>
        node.id === existingNode.id
          ? { ...node, name: nextNodeName, sheetId: activeSheetId || node.sheetId }
          : node
      );

      await persistRelationshipMap(nextNodes, edges);
      setSelectedNodeId(existingNode.id);
      setNameDraft(nextNodeName);
      return;
    }

    const nextNode: RelationshipNode = {
      id: Date.now(),
      email,
      sheetId: activeSheetId || undefined,
      name: nextNodeName,
      ...getNextNodePosition(nodes.length),
    };

    if (isGameMaster && nodes.length > 0) {
      setPendingNode(nextNode);
      setPendingConnections(
        nodes.reduce<Record<number, boolean>>((accumulator, node) => {
          accumulator[node.id] = true;
          return accumulator;
        }, {})
      );
      return;
    }

    await persistRelationshipMap(
      [...nodes, nextNode],
      [...edges, ...buildEdgesForNewNode(nodes, nextNode)]
    );
    setSelectedNodeId(nextNode.id);
    setNameDraft(nextNode.name);
  }

  async function confirmPendingNodeCreation() {
    if (!pendingNode) return;

    const connectedNodeIds = Object.entries(pendingConnections)
      .filter(([, value]) => value)
      .map(([nodeId]) => Number(nodeId));

    await persistRelationshipMap(
      [...nodes, pendingNode],
      [
        ...edges,
        ...buildEdgesForNewNode(nodes, pendingNode, connectedNodeIds),
      ]
    );
    setSelectedNodeId(pendingNode.id);
    setNameDraft(pendingNode.name);
    setPendingNode(null);
    setPendingConnections({});
  }

  function cancelPendingNodeCreation() {
    setPendingNode(null);
    setPendingConnections({});
  }

  function getPositionFromPointer(event: PointerEvent<Element>) {
    const svg = svgRef.current;

    if (!svg) return null;

    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;

    return clampPosition(x, y);
  }

  function canEditEdge(edge: RelationshipEdge) {
    const fromNode = nodeMap[edge.fromId];
    if (!fromNode) return false;
    return isGameMaster || fromNode.email === email;
  }

  function updateEdgesInSession(nextEdges: RelationshipEdge[]) {
    setSession({
      ...session,
      relationshipMap: {
        ...(session.relationshipMap ?? {}),
        nodes,
        edges: nextEdges,
      },
    });
  }

  function handleLabelPointerDown(
    event: PointerEvent<SVGGElement>,
    edge: RelationshipEdge
  ) {
    if (!canEditEdge(edge)) return;

    event.stopPropagation();
    edgeDragStateRef.current = {
      edgeId: edge.id,
      pointerId: event.pointerId,
    };
    setDraggedEdgeId(edge.id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleLabelPointerMove(
    event: PointerEvent<SVGGElement>,
    edge: RelationshipEdge
  ) {
    const edgeDragState = edgeDragStateRef.current;

    if (!edgeDragState || edgeDragState.edgeId !== edge.id) {
      return;
    }

    const pointerPosition = getPositionFromPointer(event);
    const geometry = getEdgeGeometry(edge, nodeMap);

    if (!pointerPosition || !geometry) return;

    const nextCurveOffset =
      (pointerPosition.x - geometry.midpointX) * geometry.normalX +
      (pointerPosition.y - geometry.midpointY) * geometry.normalY;
    const nextControlX =
      geometry.midpointX + geometry.normalX * nextCurveOffset;
    const nextControlY =
      geometry.midpointY + geometry.normalY * nextCurveOffset;
    const nextBaseLabelX =
      (geometry.fromNode.x + 2 * nextControlX + geometry.toNode.x) / 4;
    const nextBaseLabelY =
      (geometry.fromNode.y + 2 * nextControlY + geometry.toNode.y) / 4;

    const nextEdges = edges.map((currentEdge) =>
      currentEdge.id === edge.id
        ? {
            ...currentEdge,
            curveOffset: nextCurveOffset,
            labelOffsetX: pointerPosition.x - nextBaseLabelX,
            labelOffsetY: pointerPosition.y - nextBaseLabelY,
          }
        : currentEdge
    );

    updateEdgesInSession(nextEdges);
  }

  async function handleLabelPointerUp(
    event: PointerEvent<SVGGElement>,
    edge: RelationshipEdge
  ) {
    const edgeDragState = edgeDragStateRef.current;

    if (!edgeDragState || edgeDragState.edgeId !== edge.id) {
      return;
    }

    event.currentTarget.releasePointerCapture(edgeDragState.pointerId);
    edgeDragStateRef.current = null;
    setDraggedEdgeId(null);

    const nextEdges = session?.relationshipMap?.edges ?? edges;
    await persistRelationshipMap(nodes, nextEdges);
  }

  function handleNodePointerDown(
    event: PointerEvent<SVGGElement>,
    node: RelationshipNode
  ) {
    event.stopPropagation();

    dragStateRef.current = {
      nodeId: node.id,
      pointerId: event.pointerId,
      hasDragged: false,
    };

    setDraggedNodeId(node.id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleNodePointerMove(
    event: PointerEvent<SVGGElement>,
    node: RelationshipNode
  ) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.nodeId !== node.id) return;

    dragState.hasDragged = true;
    const nextPosition = getPositionFromPointer(event);

    if (!nextPosition) return;

    const nextNodes = nodes.map((currentNode) =>
      currentNode.id === node.id
        ? {
            ...currentNode,
            x: nextPosition.x,
            y: nextPosition.y,
          }
        : currentNode
    );

    setSession({
      ...session,
      relationshipMap: {
        ...(session.relationshipMap ?? {}),
        nodes: nextNodes,
        edges,
      },
    });
  }

  async function handleNodePointerUp(
    event: PointerEvent<SVGGElement>,
    node: RelationshipNode
  ) {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.nodeId !== node.id) return;

    event.currentTarget.releasePointerCapture(dragState.pointerId);

    dragStateRef.current = null;
    setDraggedNodeId(null);

    if (!dragState.hasDragged) {
      setSelectedNodeId(node.id);
      setNameDraft(node.name);

      const connectedNodeIds = new Set(
        edges
          .filter(
            (edge) => edge.fromId === node.id || edge.toId === node.id
          )
          .flatMap((edge) => [edge.fromId, edge.toId])
          .filter((nodeId) => nodeId !== node.id)
      );

      const nextDrafts = nodes
        .filter((currentNode) => connectedNodeIds.has(currentNode.id))
        .reduce<Record<number, string>>((accumulator, currentNode) => {
          accumulator[currentNode.id] =
            edgeMap[`${node.id}-${currentNode.id}`]?.label ?? "";
          return accumulator;
        }, {});

      setRelationshipDrafts(nextDrafts);
      return;
    }

    await persistRelationshipMap(nodes, edges);
  }

  function handleNodePointerCancel() {
    dragStateRef.current = null;
    setDraggedNodeId(null);
  }

  function handleEdgePointerCancel() {
    edgeDragStateRef.current = null;
    setDraggedEdgeId(null);
  }

  function closeSelectedNodePanel() {
    setSelectedNodeId(null);
    setNameDraft("");
    setRelationshipDrafts({});
  }

  function closeRelationshipMap() {
    setShowRelationshipMap({ show: false, data: "" });
    forceHideSessionMenu();
  }

  async function saveSelectedNodeRelationships() {
    if (!selectedNode) return;

    const nextNodes = nodes.map((node) =>
      node.id === selectedNode.id && isGameMaster
        ? { ...node, name: getTrimmedValue(nameDraft) }
        : node
    );

    const nextEdges = edges.map((edge) => {
      if (edge.fromId !== selectedNode.id) return edge;

      return {
        ...edge,
        label: relationshipDrafts[edge.toId] ?? "",
      };
    });

    await persistRelationshipMap(nextNodes, nextEdges);
  }

  async function deleteMyNode() {
    if (!selectedNode || selectedNode.email !== email) return;

    const nextNodes = nodes.filter((node) => node.id !== selectedNode.id);
    const nextEdges = edges.filter(
      (edge) => edge.fromId !== selectedNode.id && edge.toId !== selectedNode.id
    );

    setSelectedNodeId(null);
    setNameDraft("");
    setRelationshipDrafts({});

    await persistRelationshipMap(nextNodes, nextEdges);
  }

  const selectedNodeRelationships = selectedNode
    ? nodes.filter((node) => {
        if (node.id === selectedNode.id) return false;

        return edges.some(
          (edge) =>
            (edge.fromId === selectedNode.id && edge.toId === node.id) ||
            (edge.toId === selectedNode.id && edge.fromId === node.id)
        );
      })
    : [];

  return (
    <div className="absolute inset-0 z-40 flex h-full w-full flex-col border-2 border-white bg-14 bg-cover bg-center text-white">
      <div className="flex h-full w-full flex-col bg-black/60">
        {pendingNode && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-md border border-zinc-700 bg-zinc-950 p-4">
              <p className="text-sm font-semibold text-white">
                Conectar novo item
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Escolha com quais itens existentes{" "}
                <span className="text-white">
                  {pendingNode.name || "Sem nome"}
                </span>{" "}
                deve se conectar.
              </p>

              <div className="mt-4 flex max-h-72 flex-col gap-2 overflow-y-auto">
                {nodes.map((node) => (
                  <label
                    key={node.id}
                    className="flex cursor-pointer items-center gap-3 border border-zinc-700 bg-black/40 px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={pendingConnections[node.id] ?? false}
                      onChange={(event) =>
                        setPendingConnections((prevState) => ({
                          ...prevState,
                          [node.id]: event.target.checked,
                        }))
                      }
                    />
                    <span>{node.name || "Sem nome"}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={confirmPendingNodeCreation}
                  disabled={isSaving}
                  className="bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "Salvando..." : "Criar item"}
                </button>

                <button
                  type="button"
                  onClick={cancelPendingNodeCreation}
                  disabled={isSaving}
                  className="bg-zinc-700 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full flex-wrap items-center justify-between gap-3 border-b border-zinc-700 bg-black/70 px-3 py-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={createMyNode}
              disabled={isSaving}
              className="border border-white bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Salvando..." : "Criar meu item"}
            </button>

            <span className="text-sm text-zinc-400">
              O item usa o nome do personagem da ficha selecionada.
            </span>
          </div>

          <IoIosCloseCircleOutline
            className="min-w-9 cursor-pointer text-4xl text-white"
            onClick={closeRelationshipMap}
          />
        </div>

        <div className="flex h-full min-h-0 w-full flex-col md:flex-row">
          <div className="flex min-h-[260px] flex-1 items-center justify-center overflow-auto bg-black/45 p-4">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
            className="h-full w-full max-w-6xl"
          >
              <defs>
                <marker
                  id="relationship-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
                </marker>
              </defs>

              {connections.map((connection) => {
                const isEditingEdge = draggedEdgeId === connection.edge.id;
                const editable = canEditEdge(connection.edge);
                const labelLines = getLabelTextLines(
                  connection.edge.label.trim() || "Sem texto"
                );
                const labelBoxHeight = getLabelBoxHeight(
                  connection.edge.label.trim() || "Sem texto"
                );
                const labelTextStartY =
                  connection.labelY -
                  ((labelLines.length - 1) * LABEL_TEXT_LINE_HEIGHT) / 2 +
                  4;

                return (
                  <g key={connection.edge.id}>
                    <path
                      d={connection.path}
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      markerEnd="url(#relationship-arrow)"
                    />

                    <path
                      d={connection.path}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="18"
                    />

                    <g
                      onPointerDown={(event) =>
                        handleLabelPointerDown(event, connection.edge)
                      }
                      onPointerMove={(event) =>
                        handleLabelPointerMove(event, connection.edge)
                      }
                      onPointerUp={(event) =>
                        handleLabelPointerUp(event, connection.edge)
                      }
                      onPointerCancel={handleEdgePointerCancel}
                      className={
                        editable
                          ? isEditingEdge
                            ? "cursor-grabbing"
                            : "cursor-grab"
                          : ""
                      }
                    >
                    <rect
                      x={connection.labelX - LABEL_WIDTH / 2}
                      y={connection.labelY - labelBoxHeight / 2}
                      width={LABEL_WIDTH}
                      height={labelBoxHeight}
                      rx="8"
                      fill="#202C33"
                    />
                      <text
                      x={connection.labelX}
                      y={labelTextStartY}
                      textAnchor="middle"
                      fontSize="12"
                      fill="white"
                      className="pointer-events-none select-none"
                    >
                        {labelLines.map((line, index) => (
                          <tspan
                            key={`${connection.edge.id}-${index}`}
                            x={connection.labelX}
                            dy={index === 0 ? 0 : LABEL_TEXT_LINE_HEIGHT}
                          >
                            {line}
                          </tspan>
                        ))}
                      </text>
                    </g>

                  </g>
                );
              })}

              {nodes.map((node) => {
                const isDragging = draggedNodeId === node.id;
                const nodeLines = getNodeTextLines(node.name || "Sem nome");
                const nodeHeight = getNodeBoxHeight(node.name || "Sem nome");
                const nodeTextStartY =
                  node.y -
                  ((nodeLines.length - 1) * NODE_TEXT_LINE_HEIGHT) / 2 +
                  6;

                return (
                  <g
                    key={node.id}
                    onPointerDown={(event) => handleNodePointerDown(event, node)}
                    onPointerMove={(event) => handleNodePointerMove(event, node)}
                    onPointerUp={(event) => handleNodePointerUp(event, node)}
                    onPointerCancel={handleNodePointerCancel}
                    className={isDragging ? "cursor-grabbing" : "cursor-grab"}
                  >
                  <rect
                    x={node.x - NODE_WIDTH / 2}
                    y={node.y - nodeHeight / 2}
                    width={NODE_WIDTH}
                    height={nodeHeight}
                    fill="#005C4B"
                    rx="12"
                  />
                    <text
                      x={node.x}
                      y={nodeTextStartY}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="700"
                      fill="white"
                    >
                      {nodeLines.map((line, index) => (
                        <tspan
                          key={`${node.id}-${index}`}
                          x={node.x}
                          dy={index === 0 ? 0 : NODE_TEXT_LINE_HEIGHT}
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}

              {nodes.length === 0 && (
                <text
                  x={CANVAS_WIDTH / 2}
                  y={CANVAS_HEIGHT / 2}
                  textAnchor="middle"
                  fontSize="20"
                  fill="#a1a1aa"
                >
                  Crie o primeiro item para iniciar o mapa.
                </text>
              )}
            </svg>
          </div>

          {selectedNode && (
            <div className="w-full border-t border-zinc-700 bg-black/60 p-4 md:w-[320px] md:border-l md:border-t-0">
              <div className="border border-zinc-700 bg-black/75 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">
                    Relacionamentos
                  </p>
                  <button
                    type="button"
                    onClick={closeSelectedNodePanel}
                    className="border border-zinc-500 px-2 py-1 text-xs font-semibold text-white hover:bg-white hover:text-black"
                  >
                    X
                  </button>
                </div>

                <>
                  <p className="mb-3 text-xs text-zinc-400">
                    Item selecionado: {selectedNode.name || "Sem nome"}
                  </p>

                  {isGameMaster && (
                    <label className="mb-4 block text-sm">
                      <span className="mb-2 block text-zinc-300">Nome do item</span>
                      <input
                        type="text"
                        value={nameDraft}
                        onChange={(event) => setNameDraft(event.target.value)}
                        placeholder="Defina o nome do item"
                        className="w-full border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-white"
                      />
                    </label>
                  )}

                  {selectedNodeRelationships.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {selectedNodeRelationships.map((node) => (
                        <label key={node.id} className="block text-sm">
                          <span className="mb-2 block text-zinc-300">
                            {selectedNode.name} para {node.name}
                          </span>
                          {canEditSelectedNode ? (
                            <input
                              type="text"
                              value={relationshipDrafts[node.id] ?? ""}
                              onChange={(event) =>
                                setRelationshipDrafts((prevState) => ({
                                  ...prevState,
                                  [node.id]: event.target.value,
                                }))
                              }
                              placeholder="Descreva esta relacao"
                              className="w-full border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-white"
                            />
                          ) : (
                            <div className="border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white">
                              {edgeMap[`${selectedNode.id}-${node.id}`]?.label?.trim() ||
                                "Sem texto"}
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400">
                      Ainda nao existem outros elementos para se relacionar.
                    </p>
                  )}

                  {canEditSelectedNode && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={saveSelectedNodeRelationships}
                        disabled={isSaving}
                        className="bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving ? "Salvando..." : "Salvar"}
                      </button>

                      <button
                        type="button"
                        onClick={deleteMyNode}
                        disabled={isSaving}
                        className="bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Apagar meu item
                      </button>
                    </div>
                  )}
                </>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
