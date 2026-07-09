'use client'

import contexto from "@/context/context";
import Image from "next/image";
import { useContext, useRef, useState } from "react";
import type { ElementType, MouseEvent, PointerEvent, WheelEvent } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

import {
  FaSubway,
  FaTrain,
  FaBus,
  FaPlaneDeparture,
  FaWarehouse,
  FaHospital,
  FaUniversity,
  FaIndustry,
  FaExclamationTriangle,
  FaTree,
  FaHome,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaBuilding,
  FaRoad,
  FaWater,
  FaFire,
  FaSkullCrossbones,
  FaRecycle,
  FaOilCan,
  FaTruck,
  FaRulerCombined,
  FaPaw,
  FaChessRook,
  FaChurch,
  FaShieldAlt,
  FaStore,
  FaLandmark,
} from "react-icons/fa";
import { updateSession } from "@/firebase/sessions";

type MarkerIconType =
  | "metro"
  | "trem"
  | "onibus"
  | "aeroporto"
  | "porto"
  | "hospital"
  | "escola"
  | "industria"
  | "perigo"
  | "parque"
  | "residencial"
  | "financeiro"
  | "marcador"
  | "predio"
  | "estrada"
  | "rio"
  | "incendio"
  | "toxico"
  | "reciclagem"
  | "petroleo"
  | "caminhao"
  | "zoologico"
  | "castelo"
  | "religioso"
  | "delegacia"
  | "comercio"
  | "governo";

type MarkerColorType =
  | "ciano"
  | "azul"
  | "indigo"
  | "roxo"
  | "rosa"
  | "verdeEscuro"
  | "verde"
  | "cinza"
  | "branco"
  | "preto"
  | "amarelo"
  | "laranja"
  | "vermelho";

type LegacyMarkerColorType =
  | MarkerColorType
  | "vinho"
  | "lima"
  | "marrom";

type Point = {
  id: number;
  x: number;
  y: number;
  name: string;
  icon: MarkerIconType;
  color: LegacyMarkerColorType;
  imageNames?: string[];
};

type Token = {
  id: number;
  x: number;
  y: number;
  name: string;
  imageName?: string;
  isDead?: boolean;
  color?: "green" | "red";
  ownerEmail?: string;
  sheetId?: string;
};

type PendingPoint = {
  x: number;
  y: number;
};

type MeasurementPoint = {
  x: number;
  y: number;
};

type Measurement = {
  id: number;
  start: MeasurementPoint;
  end: MeasurementPoint;
  distanceMeters: number;
};

type DraggedMarker = {
  id: number;
  x: number;
  y: number;
};

type DraggedToken = {
  id: number;
  x: number;
  y: number;
};

type MarkerDragState = {
  pointId: number;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  hasDragged: boolean;
};

type TokenDragState = {
  tokenId: number;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  hasDragged: boolean;
};

type PopupPage = "details" | "gallery";

const IMAGE_WIDTH = 2000;
const IMAGE_HEIGHT = 800;

const SCALE_BAR_METERS = 10;
const SCALE_BAR_LENGTH_IN_IMAGE_PIXELS = 500;
const METERS_PER_IMAGE_PIXEL =
  SCALE_BAR_METERS / SCALE_BAR_LENGTH_IN_IMAGE_PIXELS;
const MARKER_DRAG_THRESHOLD_IN_PIXELS = 5;

const markerIcons = {
  metro: { label: "Metrô", Icon: FaSubway },
  trem: { label: "Trem", Icon: FaTrain },
  onibus: { label: "Ônibus", Icon: FaBus },
  aeroporto: { label: "Aeroporto", Icon: FaPlaneDeparture },
  porto: { label: "Porto / Logística", Icon: FaWarehouse },
  hospital: { label: "Hospital", Icon: FaHospital },
  escola: { label: "Universidade / Escola", Icon: FaUniversity },
  industria: { label: "Indústria", Icon: FaIndustry },
  perigo: { label: "Área de risco", Icon: FaExclamationTriangle },
  parque: { label: "Parque", Icon: FaTree },
  residencial: { label: "Residencial", Icon: FaHome },
  financeiro: { label: "Centro financeiro", Icon: FaMoneyBillWave },
  marcador: { label: "Marcador comum", Icon: FaMapMarkerAlt },
  predio: { label: "Prédio", Icon: FaBuilding },
  estrada: { label: "Estrada", Icon: FaRoad },
  rio: { label: "Rio / Água", Icon: FaWater },
  incendio: { label: "Inflamável", Icon: FaFire },
  toxico: { label: "Tóxico / Poluição", Icon: FaSkullCrossbones },
  reciclagem: { label: "Reciclagem", Icon: FaRecycle },
  petroleo: { label: "Petróleo", Icon: FaOilCan },
  caminhao: { label: "Caminhão / Cargas", Icon: FaTruck },
  zoologico: { label: "Zoologico", Icon: FaPaw },
  castelo: { label: "Castelo / Fortaleza", Icon: FaChessRook },
  religioso: { label: "Centro religioso", Icon: FaChurch },
  delegacia: { label: "Delegacia / Seguranca", Icon: FaShieldAlt },
  comercio: { label: "Comercio / Loja", Icon: FaStore },
  governo: { label: "Centro civico / Governo", Icon: FaLandmark },
} satisfies Record<
  MarkerIconType,
  {
    label: string;
    Icon: ElementType;
  }
>;

const markerColors = {
  ciano: {
    label: "Ciano",
    className: "bg-cyan-500 border-white text-white",
    previewClassName: "bg-cyan-500",
    previewBorderClassName: "border-white",
  },
  azul: {
    label: "Azul",
    className: "bg-blue-600 border-white text-white",
    previewClassName: "bg-blue-600",
    previewBorderClassName: "border-white",
  },
  indigo: {
    label: "Indigo",
    className: "bg-indigo-600 border-white text-white",
    previewClassName: "bg-indigo-600",
    previewBorderClassName: "border-white",
  },
  roxo: {
    label: "Roxo",
    className: "bg-purple-600 border-white text-white",
    previewClassName: "bg-purple-600",
    previewBorderClassName: "border-white",
  },
  rosa: {
    label: "Rosa",
    className: "bg-pink-600 border-white text-white",
    previewClassName: "bg-pink-600",
    previewBorderClassName: "border-white",
  },
  verdeEscuro: {
    label: "Verde escuro",
    className: "bg-emerald-900 border-white text-white",
    previewClassName: "bg-emerald-900",
    previewBorderClassName: "border-white",
  },
  verde: {
    label: "Verde",
    className: "bg-green-600 border-white text-white",
    previewClassName: "bg-green-600",
    previewBorderClassName: "border-white",
  },
  cinza: {
    label: "Cinza",
    className: "bg-slate-500 border-white text-white",
    previewClassName: "bg-slate-500",
    previewBorderClassName: "border-white",
  },
  branco: {
    label: "Branco",
    className: "bg-white border-black text-black",
    previewClassName: "bg-white",
    previewBorderClassName: "border-black",
  },
  preto: {
    label: "Preto",
    className: "bg-black border-white text-white",
    previewClassName: "bg-black",
    previewBorderClassName: "border-white",
  },
  amarelo: {
    label: "Amarelo",
    className: "bg-yellow-400 border-black text-black",
    previewClassName: "bg-yellow-400",
    previewBorderClassName: "border-black",
  },
  laranja: {
    label: "Laranja",
    className: "bg-orange-600 border-white text-white",
    previewClassName: "bg-orange-600",
    previewBorderClassName: "border-white",
  },
  vermelho: {
    label: "Vermelho",
    className: "bg-red-600 border-white text-white",
    previewClassName: "bg-red-600",
    previewBorderClassName: "border-white",
  },
} satisfies Record<
  MarkerColorType,
  {
    label: string;
    className: string;
    previewClassName: string;
    previewBorderClassName: string;
  }
>;

function normalizeMarkerColor(
  color: LegacyMarkerColorType
): MarkerColorType {
  return color in markerColors ? (color as MarkerColorType) : "vermelho";
}

function normalizeMarkerImageNames(imageNames: string[]) {
  return imageNames
    .map((imageName) => imageName.trim())
    .filter((imageName) => imageName.length > 0);
}

function getNextTokenNumber(tokens: Token[]) {
  const highestTokenNumber = tokens.reduce((highestNumber, token) => {
    const tokenLabel = (token.imageName ?? token.name ?? "").trim();
    const tokenMatch = tokenLabel.match(/^token\s+(\d+)$/i);

    if (!tokenMatch) return highestNumber;

    return Math.max(highestNumber, Number(tokenMatch[1]));
  }, 0);

  return highestTokenNumber + 1;
}

function getTokenFallbackLabel(tokenLabel: string) {
  const trimmedTokenLabel = tokenLabel.trim();

  if (!trimmedTokenLabel) return "T";

  const firstLetter = trimmedTokenLabel.charAt(0).toUpperCase();
  const matchedNumber = trimmedTokenLabel.match(/\d+/)?.[0] ?? "";

  return `${firstLetter}${matchedNumber}`;
}

export default function Battle() {
  const {
    showBattle,
    setShowBattle,
    dataSheet,
    email,
    session,
    sheetId,
    setSession,
    setShowMessage,
    setShowMenuSession,
    forceHideSessionMenu,
  } = useContext(contexto);

  const isGameMaster = session?.gameMaster === email;

  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const markerDragStateRef = useRef<MarkerDragState | null>(null);
  const tokenDragStateRef = useRef<TokenDragState | null>(null);
  const suppressMarkerClickRef = useRef<number | null>(null);
  const suppressTokenClickRef = useRef<number | null>(null);

  const points: Point[] = session?.battle?.points ?? [];
  const tokens: Token[] = session?.battle?.tokens ?? [];

  const [isMarkingEnabled, setIsMarkingEnabled] = useState(false);
  const [isTokenPlacementEnabled, setIsTokenPlacementEnabled] =
    useState(false);

  const [isMeasuringEnabled, setIsMeasuringEnabled] = useState(false);
  const [measurementStart, setMeasurementStart] =
    useState<MeasurementPoint | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isTokenPopupOpen, setIsTokenPopupOpen] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<PendingPoint | null>(null);
  const [editingPointId, setEditingPointId] = useState<number | null>(null);
  const [editingTokenId, setEditingTokenId] = useState<number | null>(null);

  const [markerName, setMarkerName] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenColor, setTokenColor] = useState<"green" | "red">("green");
  const [failedTokenImageIds, setFailedTokenImageIds] = useState<
    Record<number, boolean>
  >({});
  const [isPreviewImageFailed, setIsPreviewImageFailed] = useState(false);
  const [markerImageNames, setMarkerImageNames] = useState<string[]>([]);
  const [newMarkerImageName, setNewMarkerImageName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<MarkerIconType>("marcador");
  const [selectedColor, setSelectedColor] =
    useState<MarkerColorType>(isGameMaster ? "azul" : "ciano");
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);
  const [popupPage, setPopupPage] = useState<PopupPage>("details");
  const [fullscreenImageName, setFullscreenImageName] = useState<
    string | null
  >(null);

  const [zoom, setZoom] = useState(1);
  const [isSavingMap, setIsSavingMap] = useState(false);
  const [draggedMarker, setDraggedMarker] =
    useState<DraggedMarker | null>(null);
  const [draggedToken, setDraggedToken] = useState<DraggedToken | null>(null);

  // const hasMap = Boolean(session?.battle);
  const hasMap = true;
  const editingPoint =
    editingPointId === null
      ? null
      : points.find((point) => point.id === editingPointId) ?? null;
  const editingToken =
    editingTokenId === null
      ? null
      : tokens.find((token) => token.id === editingTokenId) ?? null;
  const isBlueMarkerSelected =
    editingPoint !== null &&
    normalizeMarkerColor(editingPoint.color) === "azul";
  const isReadOnlyPopup = isBlueMarkerSelected && !isGameMaster;
  const availableMarkerColors = Object.entries(markerColors).filter(
    ([key]) => isGameMaster || key !== "azul"
  );
  const galleryImageNames = markerImageNames;
  const hasGalleryImages = galleryImageNames.length > 0;
  const currentGalleryImageName = hasGalleryImages
    ? galleryImageNames[
        Math.min(galleryImageIndex, galleryImageNames.length - 1)
      ]
    : null;

  function renderGalleryContent() {
    if (!hasGalleryImages || !currentGalleryImageName) {
      return (
        <div className="rounded border border-dashed border-zinc-700 bg-black/30 px-4 py-6 text-center text-sm text-zinc-400">
          Nenhuma imagem configurada para este marcador.
        </div>
      );
    }

    return (
      <>
        <button
          type="button"
          onClick={() => setFullscreenImageName(currentGalleryImageName)}
          className="relative mb-3 block aspect-video w-full overflow-hidden rounded border border-zinc-700 bg-black"
        >
          <Image
            src={`/images/battle/${showBattle.data}/${currentGalleryImageName}.png`}
            alt={`${markerName} - imagem ${galleryImageIndex + 1}`}
            fill
            className="object-contain"
          />
        </button>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() =>
              setGalleryImageIndex((prev) =>
                prev === 0 ? galleryImageNames.length - 1 : prev - 1
              )
            }
            className="rounded border border-zinc-600 bg-zinc-800 px-3 py-1 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Anterior
          </button>

          <span className="text-xs text-zinc-400">
            {galleryImageIndex + 1} / {galleryImageNames.length}
          </span>

          <button
            type="button"
            onClick={() =>
              setGalleryImageIndex((prev) =>
                prev === galleryImageNames.length - 1 ? 0 : prev + 1
              )
            }
            className="rounded border border-zinc-600 bg-zinc-800 px-3 py-1 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Proxima
          </button>
        </div>
      </>
    );
  }

  function renderMarkerImageNameEditor() {
    if (!isGameMaster) return null;

    return (
      <div className="mt-4 rounded border border-zinc-700 bg-zinc-900 p-3">
        <label className="block text-sm mb-2">
          Nomes das imagens
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMarkerImageName}
            onChange={(event) =>
              setNewMarkerImageName(event.target.value)
            }
            placeholder="Ex: Terminal Central 1"
            className="min-w-0 flex-1 rounded border border-zinc-600 bg-black px-3 py-2 text-sm text-white outline-none"
          />

          <button
            type="button"
            onClick={() => {
              clearMeasurementLine();
              addMarkerImageName();
            }}
            className="rounded bg-zinc-700 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-600"
          >
            Adicionar
          </button>
        </div>

        {markerImageNames.length > 0 ? (
          <div className="mt-3 flex max-h-24 flex-wrap gap-2 overflow-y-auto pr-1">
            {markerImageNames.map((imageName, index) => (
              <span
                key={`${imageName}-${index}`}
                className="inline-flex max-w-full items-center gap-2 rounded border border-zinc-600 bg-black px-2 py-1 text-xs text-zinc-100"
              >
                <span className="truncate">{imageName}</span>
                <button
                  type="button"
                  onClick={() => {
                    clearMeasurementLine();
                    removeMarkerImageName(index);
                  }}
                  className="text-zinc-400 hover:text-white"
                  aria-label={`Remover imagem ${imageName}`}
                >
                  x
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-zinc-500">
            Nenhuma imagem adicionada.
          </p>
        )}
      </div>
    );
  }
  
  async function updateBattlePoints(nextPoints: Point[]) {
    if (!session?.id) {
      setShowMessage({
        show: true,
        text: "Sessão inválida. Não foi possível salvar os pontos do mapa.",
      });
      return;
    }

    const nextSession = {
      ...session,
      battle: {
        ...(session.battle ?? {}),
        points: nextPoints,
      },
    };

    try {
      setIsSavingMap(true);
      setSession(nextSession);
      await updateSession(nextSession, setShowMessage);
    } finally {
      setIsSavingMap(false);
    }
  }

  async function updateBattleTokens(nextTokens: Token[]) {
    if (!session?.id) {
      setShowMessage({
        show: true,
        text: "Sessao invalida. Nao foi possivel salvar os tokens da batalha.",
      });
      return;
    }

    const nextSession = {
      ...session,
      battle: {
        ...(session.battle ?? {}),
        tokens: nextTokens,
      },
    };

    try {
      setIsSavingMap(true);
      setSession(nextSession);
      await updateSession(nextSession, setShowMessage);
    } finally {
      setIsSavingMap(false);
    }
  }

  function clearMeasurementLine() {
    setMeasurements([]);
    setMeasurementStart(null);
  }

  function calculateDistanceMeters(
    start: MeasurementPoint,
    end: MeasurementPoint
  ) {
    const dxInImagePixels = (end.x - start.x) * IMAGE_WIDTH;
    const dyInImagePixels = (end.y - start.y) * IMAGE_HEIGHT;

    const distanceInImagePixels = Math.sqrt(
      dxInImagePixels ** 2 + dyInImagePixels ** 2
    );

    return distanceInImagePixels * METERS_PER_IMAGE_PIXEL;
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    if (isPopupOpen) return;

    event.preventDefault();

    setZoom((prevZoom) => {
      const zoomStep = 0.15;

      const newZoom =
        event.deltaY < 0
          ? prevZoom + zoomStep
          : prevZoom - zoomStep;

      return Math.min(Math.max(newZoom, 1), 5);
    });
  }

  function zoomIn() {
    if (isPopupOpen) return;
    setZoom((prevZoom) => Math.min(prevZoom + 0.25, 5));
  }

  function zoomOut() {
    if (isPopupOpen) return;
    setZoom((prevZoom) => Math.max(prevZoom - 0.25, 1));
  }

  function resetZoom() {
    if (isPopupOpen) return;
    setZoom(1);
  }

  function getPositionFromClient(clientX: number, clientY: number) {
    const wrapper = imageWrapperRef.current;

    if (!wrapper) return null;

    const rect = wrapper.getBoundingClientRect();

    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const x = clickX / rect.width;
    const y = clickY / rect.height;

    if (x < 0 || x > 1 || y < 0 || y > 1) return null;

    return { x, y };
  }

  function getClickedPosition(event: MouseEvent<HTMLDivElement>) {
    return getPositionFromClient(event.clientX, event.clientY);
  }

  function canMoveMarker(point: Point) {
    if (isMeasuringEnabled || isSavingMap || isPopupOpen || isTokenPopupOpen) {
      return false;
    }

    return !(normalizeMarkerColor(point.color) === "azul" && !isGameMaster);
  }

  function canEditToken(token: Token) {
    return isGameMaster || token.ownerEmail === email;
  }

  function canMoveToken(token: Token) {
    if (isMeasuringEnabled || isSavingMap || isPopupOpen || isTokenPopupOpen) {
      return false;
    }

    return canEditToken(token);
  }

  function handleMarkerPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    point: Point
  ) {
    if (!canMoveMarker(point)) return;

    event.stopPropagation();
    clearMeasurementLine();

    markerDragStateRef.current = {
      pointId: point.id,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      hasDragged: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleMarkerPointerMove(event: PointerEvent<HTMLButtonElement>) {
    const dragState = markerDragStateRef.current;

    if (!dragState) return;

    const distanceFromStart = Math.hypot(
      event.clientX - dragState.startClientX,
      event.clientY - dragState.startClientY
    );

    if (
      !dragState.hasDragged &&
      distanceFromStart < MARKER_DRAG_THRESHOLD_IN_PIXELS
    ) {
      return;
    }

    const nextPosition = getPositionFromClient(event.clientX, event.clientY);

    if (!nextPosition) return;

    dragState.hasDragged = true;
    setDraggedMarker({
      id: dragState.pointId,
      x: nextPosition.x,
      y: nextPosition.y,
    });
  }

  async function handleMarkerPointerUp(
    event: PointerEvent<HTMLButtonElement>
  ) {
    const dragState = markerDragStateRef.current;

    if (!dragState) return;

    event.stopPropagation();
    event.currentTarget.releasePointerCapture(dragState.pointerId);

    markerDragStateRef.current = null;

    if (!dragState.hasDragged) {
      setDraggedMarker(null);
      return;
    }

    const nextPosition = getPositionFromClient(event.clientX, event.clientY);

    if (!nextPosition) {
      setDraggedMarker(null);
      return;
    }

    suppressMarkerClickRef.current = dragState.pointId;
    setDraggedMarker(null);

    const updatedPoints = points.map((point) =>
      point.id === dragState.pointId
        ? {
            ...point,
            x: nextPosition.x,
            y: nextPosition.y,
          }
        : point
    );

    await updateBattlePoints(updatedPoints);
  }

  function handleMarkerPointerCancel() {
    markerDragStateRef.current = null;
    setDraggedMarker(null);
  }

  function handleTokenPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    token: Token
  ) {
    if (!canMoveToken(token)) return;

    event.stopPropagation();
    clearMeasurementLine();

    tokenDragStateRef.current = {
      tokenId: token.id,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      hasDragged: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleTokenPointerMove(event: PointerEvent<HTMLButtonElement>) {
    const dragState = tokenDragStateRef.current;

    if (!dragState) return;

    const distanceFromStart = Math.hypot(
      event.clientX - dragState.startClientX,
      event.clientY - dragState.startClientY
    );

    if (
      !dragState.hasDragged &&
      distanceFromStart < MARKER_DRAG_THRESHOLD_IN_PIXELS
    ) {
      return;
    }

    const nextPosition = getPositionFromClient(event.clientX, event.clientY);

    if (!nextPosition) return;

    dragState.hasDragged = true;
    setDraggedToken({
      id: dragState.tokenId,
      x: nextPosition.x,
      y: nextPosition.y,
    });
  }

  async function handleTokenPointerUp(event: PointerEvent<HTMLButtonElement>) {
    const dragState = tokenDragStateRef.current;

    if (!dragState) return;

    event.stopPropagation();
    event.currentTarget.releasePointerCapture(dragState.pointerId);

    tokenDragStateRef.current = null;

    if (!dragState.hasDragged) {
      setDraggedToken(null);
      return;
    }

    const nextPosition = getPositionFromClient(event.clientX, event.clientY);

    if (!nextPosition) {
      setDraggedToken(null);
      return;
    }

    suppressTokenClickRef.current = dragState.tokenId;
    setDraggedToken(null);

    const updatedTokens = tokens.map((token) =>
      token.id === dragState.tokenId
        ? {
            ...token,
            x: nextPosition.x,
            y: nextPosition.y,
          }
        : token
    );

    await updateBattleTokens(updatedTokens);
  }

  function handleTokenPointerCancel() {
    tokenDragStateRef.current = null;
    setDraggedToken(null);
  }

  async function createToken(position: PendingPoint) {
    if (!isGameMaster) {
      const existingPlayerToken = tokens.find(
        (token) => token.ownerEmail === email
      );

      if (existingPlayerToken) {
        setShowMessage({
          show: true,
          text: "Voce ja possui um token nesta batalha.",
        });
        return;
      }
    }

    const selectedCharacterName = dataSheet?.data?.name?.trim?.() ?? "";

    if (!isGameMaster && !selectedCharacterName) {
      setShowMessage({
        show: true,
        text: "Selecione um personagem antes de criar seu token.",
      });
      return;
    }

    const defaultTokenName = `Token ${getNextTokenNumber(tokens)}`;
    const nextTokenName = isGameMaster
      ? defaultTokenName
      : selectedCharacterName;

    const newToken: Token = {
      id: Date.now(),
      x: position.x,
      y: position.y,
      name: nextTokenName,
      imageName: nextTokenName,
      color: "green",
      ...(isGameMaster ? {} : { ownerEmail: email, sheetId }),
    };

    await updateBattleTokens([...tokens, newToken]);
    setIsTokenPlacementEnabled(false);
  }

  function handleMapClick(event: MouseEvent<HTMLDivElement>) {
    const clickedPosition = getClickedPosition(event);

    if (!clickedPosition) return;

    if (isMeasuringEnabled) {
      if (!measurementStart) {
        setMeasurementStart(clickedPosition);
        return;
      }

      const distanceMeters = calculateDistanceMeters(
        measurementStart,
        clickedPosition
      );

      setMeasurements((prevMeasurements) => [
        ...prevMeasurements,
        {
          id: Date.now(),
          start: measurementStart,
          end: clickedPosition,
          distanceMeters,
        },
      ]);

      setMeasurementStart(null);
      return;
    }

    if (isTokenPlacementEnabled) {
      createToken(clickedPosition);
      return;
    }

    if (!isMarkingEnabled) return;

    setPendingPoint(clickedPosition);
    setEditingPointId(null);
    setMarkerName("");
    setMarkerImageNames([]);
    setNewMarkerImageName("");
    setSelectedIcon("marcador");
    setSelectedColor(isGameMaster ? "azul" : "ciano");
    setGalleryImageIndex(0);
    setPopupPage("details");
    setIsPopupOpen(true);
  }

  function toggleMarking() {
    setIsMarkingEnabled((prev) => {
      const nextValue = !prev;

      if (nextValue) {
        setIsMeasuringEnabled(false);
        setIsTokenPlacementEnabled(false);
        setMeasurementStart(null);
      }

      return nextValue;
    });
  }

  function toggleTokenPlacement() {
    setIsTokenPlacementEnabled((prev) => {
      const nextValue = !prev;

      if (nextValue) {
        setIsMarkingEnabled(false);
        setIsMeasuringEnabled(false);
        setMeasurementStart(null);
        clearMeasurementLine();
      }

      return nextValue;
    });
  }

  function toggleMeasuring() {
    setIsMeasuringEnabled((prev) => {
      const nextValue = !prev;

      if (nextValue) {
        setIsMarkingEnabled(false);
        setIsTokenPlacementEnabled(false);
      }

      if (!nextValue) {
        setMeasurementStart(null);
        clearMeasurementLine();
      }

      return nextValue;
    });
  }

  function openEditPopup(point: Point) {
    if (isMeasuringEnabled) return;

    clearMeasurementLine();

    setEditingPointId(point.id);
    setPendingPoint(null);
    setMarkerName(point.name);
    setMarkerImageNames(point.imageNames ?? []);
    setNewMarkerImageName("");
    setSelectedIcon(point.icon);
    setSelectedColor(normalizeMarkerColor(point.color));
    setGalleryImageIndex(0);
    setPopupPage("details");
    setIsPopupOpen(true);
  }

  function openTokenPopup(token: Token) {
    if (isMeasuringEnabled || !canEditToken(token)) return;

    clearMeasurementLine();

    setEditingTokenId(token.id);
    setTokenName(token.imageName ?? token.name);
    setTokenColor(token.color ?? "green");
    setIsPreviewImageFailed(false);
    setIsTokenPopupOpen(true);
  }

  function closePopup() {
    setIsPopupOpen(false);
    setPendingPoint(null);
    setEditingPointId(null);
    setMarkerName("");
    setMarkerImageNames([]);
    setNewMarkerImageName("");
    setSelectedIcon("marcador");
    setSelectedColor(isGameMaster ? "azul" : "ciano");
    setGalleryImageIndex(0);
    setPopupPage("details");
    setFullscreenImageName(null);
  }

  function closeTokenPopup() {
    setIsTokenPopupOpen(false);
    setEditingTokenId(null);
    setTokenName("");
    setTokenColor("green");
    setIsPreviewImageFailed(false);
  }

  async function saveToken() {
    if (!editingToken || !canEditToken(editingToken)) return;

    const nextName = isGameMaster
      ? tokenName.trim() || editingToken.name
      : editingToken.name;

    const updatedTokens = tokens.map((token) =>
      token.id === editingToken.id
        ? {
            ...token,
            name: nextName,
            imageName: nextName,
            color: isGameMaster ? tokenColor : token.color ?? "green",
          }
        : token
    );

    setFailedTokenImageIds((prevState) => {
      const nextState = { ...prevState };
      delete nextState[editingToken.id];
      return nextState;
    });
    await updateBattleTokens(updatedTokens);
    closeTokenPopup();
  }

  async function deleteToken() {
    if (!editingToken || !canEditToken(editingToken)) return;

    const updatedTokens = tokens.filter(
      (token) => token.id !== editingToken.id
    );

    await updateBattleTokens(updatedTokens);
    closeTokenPopup();
  }

  async function toggleTokenDead() {
    if (!editingToken || !canEditToken(editingToken)) return;

    const updatedTokens = tokens.map((token) =>
      token.id === editingToken.id
        ? {
            ...token,
            isDead: !token.isDead,
          }
        : token
    );

    await updateBattleTokens(updatedTokens);
  }

  function addMarkerImageName() {
    const imageName = newMarkerImageName.trim();

    if (!imageName) return;

    setMarkerImageNames((prevImageNames) => [
      ...prevImageNames,
      imageName,
    ]);
    setNewMarkerImageName("");
    setGalleryImageIndex(0);
  }

  function removeMarkerImageName(indexToRemove: number) {
    setMarkerImageNames((prevImageNames) =>
      prevImageNames.filter((_, index) => index !== indexToRemove)
    );
    setGalleryImageIndex(0);
  }

  async function saveMarker() {
    if (!isGameMaster && selectedColor === "azul") {
      setShowMessage({
        show: true,
        text: "A cor azul é reservada ao Narrador da sessao.",
      });
      return;
    }

    if (isReadOnlyPopup) {
      setShowMessage({
        show: true,
        text: "Voce não tem permissão para editar marcadores azuis.",
      });
      return;
    }

    const name = markerName.trim();
    const imageNames = normalizeMarkerImageNames(markerImageNames);

    if (!name) {
      alert("Digite um nome para o marcador.");
      return;
    }

    if (editingPointId) {
      const updatedPoints = points.map((point) =>
        point.id === editingPointId
          ? {
              ...point,
              name,
              icon: selectedIcon,
              color: selectedColor,
              imageNames,
            }
          : point
      );

      await updateBattlePoints(updatedPoints);
      closePopup();
      return;
    }

    if (!pendingPoint) return;

    const newPoint: Point = {
      id: Date.now(),
      x: pendingPoint.x,
      y: pendingPoint.y,
      name,
      icon: selectedIcon,
      color: selectedColor,
      imageNames,
    };

    await updateBattlePoints([...points, newPoint]);
    closePopup();
  }

  async function deleteMarker() {
    if (!editingPointId) return;

    if (isReadOnlyPopup) {
      setShowMessage({
        show: true,
        text: "Voce nao tem permissao para excluir marcadores azuis.",
      });
      return;
    }

    const updatedPoints = points.filter(
      (point) => point.id !== editingPointId
    );

    await updateBattlePoints(updatedPoints);
    closePopup();
  }

  const SelectedPreviewIcon = markerIcons[selectedIcon].Icon;
  const selectedPreviewColor = markerColors[selectedColor];

  if (!hasMap) {
    return (
      <div className="absolute inset-0 z-0 flex h-full w-full flex-col items-center justify-center border-2 border-white bg-black/80 px-3 sm:px-0">
        <div className="w-full flex items-center justify-end pt-1 pb-2 px-2 bg-black">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer mr-1 min-w-9"
            onClick={() => {
              setShowBattle({ show: false, data: "" });
              forceHideSessionMenu();
            }}
          />
        </div>

        <div className="w-full h-full flex items-center justify-center bg-black text-white">
          <div className="rounded-lg border border-zinc-700 bg-zinc-950 px-6 py-5 text-center shadow-2xl">
            <h2 className="text-lg font-bold mb-2">
              Nenhum mapa foi criado para essa sessão
            </h2>

            <p className="text-sm text-zinc-400">
              Crie um mapa para esta sessão antes de adicionar marcadores.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="z-80 sm:z-50 fixed md:relative w-full h-screen flex flex-col items-center justify-center bg-black/80 px-3 sm:px-0 border-white border-2">
      <div className="w-full flex items-center justify-between gap-3 pt-1 pb-2 px-2 bg-black">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              clearMeasurementLine();
              toggleMarking();
            }}
            className={`w-9 h-9 rounded border flex items-center justify-center text-lg ${
              isMarkingEnabled
                ? "bg-green-600 text-white border-green-400"
                : "bg-zinc-700 text-zinc-300 border-zinc-500"
            }`}
            title={isMarkingEnabled ? "Marcação ativa" : "Marcação inativa"}
          >
            <FaMapMarkerAlt />
          </button>

          <button
            type="button"
            onClick={toggleMeasuring}
            className={`w-9 h-9 rounded border flex items-center justify-center text-lg ${
              isMeasuringEnabled
                ? "bg-green-600 text-white border-green-400"
                : "bg-zinc-700 text-zinc-300 border-zinc-500"
            }`}
            title={isMeasuringEnabled ? "Medição ativa" : "Medição inativa"}
          >
            <FaRulerCombined />
          </button>

          <button
            type="button"
            onClick={toggleTokenPlacement}
            className={`h-9 w-9 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
              isTokenPlacementEnabled
                ? "border-green-300 bg-green-700 text-white"
                : "border-green-500 bg-zinc-800 text-green-300"
            }`}
            title={
              isTokenPlacementEnabled
                ? "Criacao de token ativa"
                : "Criar token"
            }
          >
            T
          </button>

          <button
            type="button"
            onClick={() => {
              clearMeasurementLine();
              zoomOut();
            }}
            className="px-3 py-1 rounded text-sm font-semibold bg-zinc-800 text-white border border-zinc-500"
          >
            -
          </button>

          <button
            type="button"
            onClick={() => {
              clearMeasurementLine();
              resetZoom();
            }}
            className="px-3 py-1 rounded text-sm font-semibold bg-zinc-900 text-white border border-zinc-500"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={() => {
              clearMeasurementLine();
              zoomIn();
            }}
            className="px-3 py-1 rounded text-sm font-semibold bg-zinc-800 text-white border border-zinc-500"
          >
            +
          </button>

          {isSavingMap && (
            <span className="text-xs text-zinc-300">
              Salvando mapa...
            </span>
          )}
        </div>

        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mr-1 min-w-9"
          onClick={() => {
            clearMeasurementLine();
            setShowBattle({ show: false, data: "" });
            forceHideSessionMenu();
          }}
        />
      </div>

      <div
        onWheel={handleWheel}
        className="w-full h-full bg-black overflow-auto relative"
      >
        <div className="flex h-full min-h-full w-full min-w-full items-center justify-center">
          <div
            ref={imageWrapperRef}
            onClick={handleMapClick}
            className={`relative shrink-0 ${
              isMarkingEnabled || isMeasuringEnabled || isTokenPlacementEnabled
                ? "cursor-crosshair"
                : "cursor-default"
            }`}
            style={{
              width: "100%",
              height: "100%",
              minWidth: `${zoom * 100}%`,
              minHeight: `${zoom * 100}%`,
            }}
          >
            <Image
              src={`/images/battle/${showBattle.data}/${showBattle.data}.png`}
              alt={`Mapa da Sessão ${session.name}`}
              fill
              className="object-contain select-none"
              priority
              draggable={false}
            />

            <svg className="absolute inset-0 z-10 w-full h-full pointer-events-none">
              {measurements.map((measurement) => (
                <line
                  key={measurement.id}
                  x1={`${measurement.start.x * 100}%`}
                  y1={`${measurement.start.y * 100}%`}
                  x2={`${measurement.end.x * 100}%`}
                  y2={`${measurement.end.y * 100}%`}
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                />
              ))}

              {measurementStart && (
                <circle
                  cx={`${measurementStart.x * 100}%`}
                  cy={`${measurementStart.y * 100}%`}
                  r="6"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />
              )}
            </svg>

            {measurements.map((measurement) => {
              const middleX =
                (measurement.start.x + measurement.end.x) / 2;
              const middleY =
                (measurement.start.y + measurement.end.y) / 2;

              return (
                <div
                  key={`label-${measurement.id}`}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded bg-black/80 px-2 py-1 text-xs font-bold text-white border border-white pointer-events-none"
                  style={{
                    left: `${middleX * 100}%`,
                    top: `${middleY * 100}%`,
                  }}
                >
                  {measurement.distanceMeters.toFixed(2)} m
                </div>
              );
            })}

            {tokens.map((token) => {
              const tokenPosition =
                draggedToken?.id === token.id ? draggedToken : token;
              const resolvedTokenImageName = (token.imageName ?? token.name ?? "").trim();
              const shouldShowTokenImage =
                resolvedTokenImageName.length > 0 &&
                !failedTokenImageIds[token.id];
              const tokenFallbackLabel = getTokenFallbackLabel(
                resolvedTokenImageName || token.name || "Token"
              );
              const tokenColorClassName =
                (token.color ?? "green") === "red"
                  ? "border-red-500 bg-red-950/70"
                  : "border-green-500 bg-black/80";

              return (
                <button
                  key={token.id}
                  type="button"
                  onPointerDown={(event) =>
                    handleTokenPointerDown(event, token)
                  }
                  onPointerMove={handleTokenPointerMove}
                  onPointerUp={handleTokenPointerUp}
                  onPointerCancel={handleTokenPointerCancel}
                  onDragStart={(event) => event.preventDefault()}
                  onClick={(event) => {
                    if (isMeasuringEnabled) return;

                    event.stopPropagation();

                    if (suppressTokenClickRef.current === token.id) {
                      suppressTokenClickRef.current = null;
                      return;
                    }

                    openTokenPopup(token);
                  }}
                  className={`absolute z-30 flex h-[27px] w-[27px] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border-2 text-center text-[8px] font-bold leading-none text-white shadow-lg ${tokenColorClassName} ${
                    isMeasuringEnabled
                      ? "pointer-events-none cursor-default"
                      : canMoveToken(token)
                      ? "cursor-grab touch-none active:cursor-grabbing"
                      : "cursor-pointer"
                  }`}
                  style={{
                    left: `${tokenPosition.x * 100}%`,
                    top: `${tokenPosition.y * 100}%`,
                  }}
                  title={token.name}
                >
                  {shouldShowTokenImage ? (
                    <Image
                      src={`/images/battle/${showBattle.data}/${resolvedTokenImageName}.png`}
                      alt={token.name}
                      fill
                      draggable={false}
                      className="pointer-events-none h-full w-full select-none object-cover"
                      onError={() =>
                        setFailedTokenImageIds((prevState) => ({
                          ...prevState,
                          [token.id]: true,
                        }))
                      }
                    />
                  ) : (
                    <span className="pointer-events-none select-none text-[10px] font-black uppercase leading-none">
                      {tokenFallbackLabel}
                    </span>
                  )}

                  {token.isDead && (
                    <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-2xl font-black leading-none text-red-600 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      X
                    </span>
                  )}
                </button>
              );
            })}

            {points.map((point) => {
              const marker = markerIcons[point.icon];
              const markerColor = markerColors[normalizeMarkerColor(point.color)];
              const MarkerIcon = marker.Icon;
              const markerPosition =
                draggedMarker?.id === point.id ? draggedMarker : point;

              return (
                <button
                  key={point.id}
                  type="button"
                  onPointerDown={(event) =>
                    handleMarkerPointerDown(event, point)
                  }
                  onPointerMove={handleMarkerPointerMove}
                  onPointerUp={handleMarkerPointerUp}
                  onPointerCancel={handleMarkerPointerCancel}
                  onClick={(event) => {
                    if (isMeasuringEnabled) return;

                    event.stopPropagation();

                    if (suppressMarkerClickRef.current === point.id) {
                      suppressMarkerClickRef.current = null;
                      return;
                    }

                    openEditPopup(point);
                  }}
                  className={`absolute h-7 w-7 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-sm z-30 shadow-lg ${markerColor.className} ${
                    isMeasuringEnabled
                      ? "pointer-events-none cursor-default"
                      : canMoveMarker(point)
                      ? "pointer-events-auto cursor-grab active:cursor-grabbing touch-none"
                      : "pointer-events-auto cursor-pointer"
                  }`}
                  style={{
                    left: `${markerPosition.x * 100}%`,
                    top: `${markerPosition.y * 100}%`,
                  }}
                  title={
                    isMeasuringEnabled
                      ? point.name
                      : normalizeMarkerColor(point.color) === "azul" &&
                        !isGameMaster
                      ? `${point.name} - clique para visualizar`
                      : `${point.name} - clique para editar`
                  }
                >
                  <MarkerIcon />
                </button>
              );
            })}
          </div>
        </div>

        {isPopupOpen && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 px-4 py-4">
            <div
              className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-lg border border-zinc-600 bg-zinc-950 p-4 text-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPopupPage("details")}
                    className={`rounded border px-3 py-2 text-sm font-semibold transition ${
                      popupPage === "details"
                        ? "border-white bg-zinc-100 text-black"
                        : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    {isReadOnlyPopup ? "Informacoes" : "Edicao"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPopupPage("gallery")}
                    className={`rounded border px-3 py-2 text-sm font-semibold transition ${
                      popupPage === "gallery"
                        ? "border-white bg-zinc-100 text-black"
                        : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    Imagens
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    clearMeasurementLine();
                    closePopup();
                  }}
                  className="text-zinc-300 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              {isReadOnlyPopup ? (
                <div className="space-y-4">
                  {popupPage === "details" ? (
                    <>
                  <div className="rounded border border-zinc-700 bg-zinc-900 p-3">
                    <p className="text-sm text-zinc-400 mb-1">
                      Nome do marcador
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {markerName}
                    </p>
                  </div>

                  <div className="rounded border border-zinc-700 bg-zinc-900 p-3">
                    <p className="text-sm text-zinc-400 mb-1">
                      Icone selecionado
                    </p>
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${selectedPreviewColor.className}`}
                      >
                        <SelectedPreviewIcon />
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {markerIcons[selectedIcon].label}
                      </span>
                    </div>
                  </div>
                    </>
                  ) : (

                  <div className="rounded border border-zinc-700 bg-zinc-900 p-3">
                    <p className="text-sm text-zinc-400 mb-3">
                      Galeria de imagens
                    </p>
                    {renderGalleryContent()}
                  </div>

                  )}

                  {popupPage === "details" && (
                    <p className="text-sm text-zinc-400">
                      Voce nao tem permissao para editar marcadores azuis.
                    </p>
                  )}

                  <p className="hidden">
                    Voce nao tem permissao para editar este marcador porque a cor azul é exclusiva do Narrador.
                  </p>
                </div>
              ) : (
                <>
              {popupPage === "details" ? (
                <>
              <input
                type="text"
                value={markerName}
                onChange={(event) => setMarkerName(event.target.value)}
                placeholder="Ex: Terminal Central, Cidade Industrial..."
                className="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white outline-none mb-4"
              />

              <label className="block text-sm mb-2">
                Escolha o ícone
              </label>

              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto pr-1 mb-4">
                {Object.entries(markerIcons).map(([key, marker]) => {
                  const Icon = marker.Icon;
                  const isSelected = selectedIcon === key;

                  return (
                    <div
                      key={key}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          clearMeasurementLine();
                          setSelectedIcon(key as MarkerIconType);
                        }}
                        aria-label={marker.label}
                        title={marker.label}
                        className={`h-9 w-9 rounded-full border-2 flex items-center justify-center text-sm transition ${
                          isSelected
                            ? `${selectedPreviewColor.className} ring-2 ring-white ring-offset-2 ring-offset-zinc-950`
                            : `${selectedPreviewColor.className} hover:scale-105`
                        }`}
                      >
                        <Icon />
                      </button>
                    </div>
                  );
                })}
              </div>

              <label className="block text-sm mb-2">
                Escolha a cor
              </label>

              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {availableMarkerColors.map(([key, color]) => {
                  const isSelected = selectedColor === key;

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-center"
                    >
                      <button 
                        type="button"
                        onClick={() => {
                          clearMeasurementLine();
                          setSelectedColor(key as MarkerColorType);
                        }}
                        aria-label={color.label}
                        title={color.label}
                        className={`h-6 w-6 rounded-full border transition ${
                          isSelected
                            ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950"
                            : "hover:scale-105"
                        }`}
                      >
                        <span
                          className={`block h-full w-full rounded-full border ${color.previewBorderClassName} ${color.previewClassName}`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between gap-2 mt-5">
                {editingPointId && (
                  <button
                    type="button"
                    disabled={isSavingMap}
                    onClick={() => {
                      clearMeasurementLine();
                      deleteMarker();
                    }}
                    className="px-3 py-2 rounded bg-red-700 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Excluir
                  </button>
                )}

                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    disabled={isSavingMap}
                    onClick={() => {
                      clearMeasurementLine();
                      closePopup();
                    }}
                    className="px-3 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    disabled={isSavingMap}
                    onClick={() => {
                      clearMeasurementLine();
                      saveMarker();
                    }}
                    className="px-3 py-2 rounded bg-green-700 hover:bg-green-600 text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSavingMap ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
                </>
              ) : (
                <>
                  <div className="rounded border border-zinc-700 bg-zinc-900 p-3">
                    <p className="text-sm text-zinc-400 mb-3">
                      Galeria de imagens
                    </p>
                    {renderGalleryContent()}
                  </div>

                  {renderMarkerImageNameEditor()}

                  <div className="flex justify-end gap-2 mt-5">
                    <button
                      type="button"
                      disabled={isSavingMap}
                      onClick={() => {
                        clearMeasurementLine();
                        closePopup();
                      }}
                      className="px-3 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      disabled={isSavingMap}
                      onClick={() => {
                        clearMeasurementLine();
                        saveMarker();
                      }}
                      className="px-3 py-2 rounded bg-green-700 hover:bg-green-600 text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSavingMap ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                </>
              )}
                </>
              )}
            </div>
          </div>
        )}

        {isTokenPopupOpen && editingToken && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 px-4 py-4">
            <div
              className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-lg border border-zinc-600 bg-zinc-950 p-4 text-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold">
                  Editar token
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    clearMeasurementLine();
                    closeTokenPopup();
                  }}
                  className="text-xl text-zinc-300 hover:text-white"
                >
                  x
                </button>
              </div>

              <label className="mb-2 block text-sm">
                Nome do token / imagem
              </label>
              <input
                type="text"
                value={tokenName}
                onChange={(event) => {
                  setTokenName(event.target.value);
                  setIsPreviewImageFailed(false);
                }}
                placeholder="Ex: Luna Crinos"
                className={`w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-white outline-none ${
                  !isGameMaster
                    ? "cursor-not-allowed opacity-70"
                    : ""
                }`}
                disabled={!isGameMaster}
              />

              {isGameMaster && (
                <div className="mt-4">
                  <label className="mb-2 block text-sm">
                    Cor do token
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTokenColor("green")}
                      className={`rounded border px-3 py-2 text-sm font-semibold ${
                        tokenColor === "green"
                          ? "border-white bg-green-700 text-white"
                          : "border-zinc-600 bg-zinc-900 text-zinc-300"
                      }`}
                    >
                      Verde
                    </button>

                    <button
                      type="button"
                      onClick={() => setTokenColor("red")}
                      className={`rounded border px-3 py-2 text-sm font-semibold ${
                        tokenColor === "red"
                          ? "border-white bg-red-700 text-white"
                          : "border-zinc-600 bg-zinc-900 text-zinc-300"
                      }`}
                    >
                      Vermelho
                    </button>
                  </div>
                </div>
              )}

              {tokenName.trim() && (
                <div className="mt-4 rounded border border-zinc-700 bg-zinc-900 p-3">
                  <p className="mb-3 text-sm text-zinc-400">
                    Preview
                  </p>
                  <div
                    className={`relative mx-auto h-16 w-16 overflow-hidden rounded-full border-2 ${
                      tokenColor === "red"
                        ? "border-red-500 bg-red-950/70"
                        : "border-green-500 bg-black"
                    }`}
                  >
                    {!isPreviewImageFailed ? (
                      <Image
                        src={`/images/battle/${showBattle.data}/${tokenName.trim()}.png`}
                        alt={tokenName}
                        fill
                        className="h-full w-full object-cover"
                        onError={() => setIsPreviewImageFailed(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-black uppercase text-white">
                        {getTokenFallbackLabel(tokenName)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isSavingMap}
                    onClick={() => {
                      clearMeasurementLine();
                      deleteToken();
                    }}
                    className="rounded bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Excluir
                  </button>

                  <button
                    type="button"
                    disabled={isSavingMap}
                    onClick={() => {
                      clearMeasurementLine();
                      toggleTokenDead();
                    }}
                    className={`rounded px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                      editingToken.isDead
                        ? "bg-red-900 hover:bg-red-800"
                        : "bg-zinc-700 hover:bg-zinc-600"
                    }`}
                  >
                    Morto
                  </button>
                </div>

                <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  disabled={isSavingMap}
                  onClick={() => {
                    clearMeasurementLine();
                    closeTokenPopup();
                  }}
                  className="rounded bg-zinc-700 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={isSavingMap}
                  onClick={() => {
                    clearMeasurementLine();
                    saveToken();
                  }}
                  className="rounded bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingMap ? "Salvando..." : "Salvar"}
                </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {fullscreenImageName && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setFullscreenImageName(null)}
          >
            <div
              className="relative h-full w-full max-w-7xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setFullscreenImageName(null)}
                className="absolute right-2 top-2 z-10 rounded border border-zinc-600 bg-black/70 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Fechar
              </button>

              <div className="relative h-full w-full">
                <Image
                  src={`/images/battle/${showBattle.data}/${fullscreenImageName}.png`}
                  alt={fullscreenImageName}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
