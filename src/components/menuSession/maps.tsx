'use client'

import contexto from "@/context/context";
import Image from "next/image";
import { useContext, useRef, useState } from "react";
import type { ElementType, MouseEvent, WheelEvent } from "react";
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
  | "vermelho"
  | "azul"
  | "verde"
  | "amarelo"
  | "laranja"
  | "roxo"
  | "rosa"
  | "ciano"
  | "preto"
  | "branco"
  | "indigo"
  | "cinza";

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
  distanceKm: number;
};

const IMAGE_WIDTH = 2000;
const IMAGE_HEIGHT = 800;

const SCALE_BAR_KM = 10;
const SCALE_BAR_LENGTH_IN_IMAGE_PIXELS = 500;
const KM_PER_IMAGE_PIXEL = SCALE_BAR_KM / SCALE_BAR_LENGTH_IN_IMAGE_PIXELS;

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
  vermelho: {
    label: "Vermelho",
    className: "bg-red-600 border-white text-white",
    previewClassName: "bg-red-600",
    previewBorderClassName: "border-white",
  },
  azul: {
    label: "Azul",
    className: "bg-blue-600 border-white text-white",
    previewClassName: "bg-blue-600",
    previewBorderClassName: "border-white",
  },
  verde: {
    label: "Verde",
    className: "bg-green-600 border-white text-white",
    previewClassName: "bg-green-600",
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
  ciano: {
    label: "Ciano",
    className: "bg-cyan-500 border-white text-white",
    previewClassName: "bg-cyan-500",
    previewBorderClassName: "border-white",
  },
  preto: {
    label: "Preto",
    className: "bg-black border-white text-white",
    previewClassName: "bg-black",
    previewBorderClassName: "border-white",
  },
  branco: {
    label: "Branco",
    className: "bg-white border-black text-black",
    previewClassName: "bg-white",
    previewBorderClassName: "border-black",
  },
  indigo: {
    label: "Indigo",
    className: "bg-indigo-600 border-white text-white",
    previewClassName: "bg-indigo-600",
    previewBorderClassName: "border-white",
  },
  cinza: {
    label: "Cinza",
    className: "bg-slate-500 border-white text-white",
    previewClassName: "bg-slate-500",
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

export default function Maps() {
  const {
    showMaps,
    setShowMaps,
    session,
    setSession,
    setShowMessage,
  } = useContext(contexto);

  const imageWrapperRef = useRef<HTMLDivElement | null>(null);

  const points: Point[] = session?.map?.points ?? [];

  const [isMarkingEnabled, setIsMarkingEnabled] = useState(false);

  const [isMeasuringEnabled, setIsMeasuringEnabled] = useState(false);
  const [measurementStart, setMeasurementStart] =
    useState<MeasurementPoint | null>(null);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<PendingPoint | null>(null);
  const [editingPointId, setEditingPointId] = useState<number | null>(null);

  const [markerName, setMarkerName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<MarkerIconType>("marcador");
  const [selectedColor, setSelectedColor] =
    useState<MarkerColorType>("vermelho");

  const [zoom, setZoom] = useState(1);
  const [isSavingMap, setIsSavingMap] = useState(false);

  // const hasMap = Boolean(session?.map);
  const hasMap = true;
  
  async function updateMapPoints(nextPoints: Point[]) {
    if (!session?.id) {
      setShowMessage({
        show: true,
        text: "Sessão inválida. Não foi possível salvar os pontos do mapa.",
      });
      return;
    }

    const nextSession = {
      ...session,
      map: {
        ...(session.map ?? {}),
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

  function clearMeasurementLine() {
    setMeasurements([]);
    setMeasurementStart(null);
  }

  function calculateDistanceKm(
    start: MeasurementPoint,
    end: MeasurementPoint
  ) {
    const dxInImagePixels = (end.x - start.x) * IMAGE_WIDTH;
    const dyInImagePixels = (end.y - start.y) * IMAGE_HEIGHT;

    const distanceInImagePixels = Math.sqrt(
      dxInImagePixels ** 2 + dyInImagePixels ** 2
    );

    return distanceInImagePixels * KM_PER_IMAGE_PIXEL;
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

  function getClickedPosition(event: MouseEvent<HTMLDivElement>) {
    const wrapper = imageWrapperRef.current;

    if (!wrapper) return null;

    const rect = wrapper.getBoundingClientRect();

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const x = clickX / rect.width;
    const y = clickY / rect.height;

    if (x < 0 || x > 1 || y < 0 || y > 1) return null;

    return { x, y };
  }

  function handleMapClick(event: MouseEvent<HTMLDivElement>) {
    const clickedPosition = getClickedPosition(event);

    if (!clickedPosition) return;

    if (isMeasuringEnabled) {
      if (!measurementStart) {
        setMeasurementStart(clickedPosition);
        return;
      }

      const distanceKm = calculateDistanceKm(
        measurementStart,
        clickedPosition
      );

      setMeasurements((prevMeasurements) => [
        ...prevMeasurements,
        {
          id: Date.now(),
          start: measurementStart,
          end: clickedPosition,
          distanceKm,
        },
      ]);

      setMeasurementStart(null);
      return;
    }

    if (!isMarkingEnabled) return;

    setPendingPoint(clickedPosition);
    setEditingPointId(null);
    setMarkerName("");
    setSelectedIcon("marcador");
    setSelectedColor("vermelho");
    setIsPopupOpen(true);
  }

  function toggleMarking() {
    setIsMarkingEnabled((prev) => {
      const nextValue = !prev;

      if (nextValue) {
        setIsMeasuringEnabled(false);
        setMeasurementStart(null);
      }

      return nextValue;
    });
  }

  function toggleMeasuring() {
    setIsMeasuringEnabled((prev) => {
      const nextValue = !prev;

      if (nextValue) {
        setIsMarkingEnabled(false);
      }

      if (!nextValue) {
        setMeasurementStart(null);
        clearMeasurementLine();
      }

      return nextValue;
    });
  }

  function openEditPopup(point: Point) {
    if (!isMarkingEnabled) return;

    clearMeasurementLine();

    setEditingPointId(point.id);
    setPendingPoint(null);
    setMarkerName(point.name);
    setSelectedIcon(point.icon);
    setSelectedColor(normalizeMarkerColor(point.color));
    setIsPopupOpen(true);
  }

  function closePopup() {
    setIsPopupOpen(false);
    setPendingPoint(null);
    setEditingPointId(null);
    setMarkerName("");
    setSelectedIcon("marcador");
    setSelectedColor("vermelho");
  }

  async function saveMarker() {
    const name = markerName.trim();

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
            }
          : point
      );

      await updateMapPoints(updatedPoints);
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
    };

    await updateMapPoints([...points, newPoint]);
    closePopup();
  }

  async function deleteMarker() {
    if (!editingPointId) return;

    const updatedPoints = points.filter(
      (point) => point.id !== editingPointId
    );

    await updateMapPoints(updatedPoints);
    closePopup();
  }

  const SelectedPreviewIcon = markerIcons[selectedIcon].Icon;
  const selectedPreviewColor = markerColors[selectedColor];

  if (!hasMap) {
    return (
      <div className="z-80 sm:z-50 fixed md:relative w-full h-screen flex flex-col items-center justify-center bg-black/80 px-3 sm:px-0 border-white border-2">
        <div className="w-full flex items-center justify-end pt-1 pb-2 px-2 bg-black">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer mr-1 min-w-9"
            onClick={() => setShowMaps({ show: false, data: "" })}
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
            setShowMaps({ show: false, data: "" });
          }}
        />
      </div>

      <div
        onWheel={handleWheel}
        className="w-full h-full bg-black overflow-auto relative"
      >
        <div className="min-w-full min-h-full flex justify-center items-center">
          <div
            ref={imageWrapperRef}
            onClick={handleMapClick}
            className={`relative shrink-0 ${
              isMarkingEnabled || isMeasuringEnabled
                ? "cursor-crosshair"
                : "cursor-default"
            }`}
            style={{
              width: `${zoom * 100}%`,
              aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}`,
            }}
          >
            <Image
              src={`/images/maps/${showMaps.data}.png`}
              alt="Mapa de Nova Horizonte"
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
                  {measurement.distanceKm.toFixed(2)} km
                </div>
              );
            })}

            {points.map((point) => {
              const marker = markerIcons[point.icon];
              const markerColor = markerColors[normalizeMarkerColor(point.color)];
              const MarkerIcon = marker.Icon;

              return (
                <button
                  key={point.id}
                  type="button"
                  onClick={(event) => {
                    if (!isMarkingEnabled) return;

                    event.stopPropagation();
                    openEditPopup(point);
                  }}
                  className={`absolute w-7 h-7 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-sm z-30 shadow-lg ${markerColor.className} ${
                    isMarkingEnabled
                      ? "pointer-events-auto cursor-pointer"
                      : "pointer-events-none"
                  }`}
                  style={{
                    left: `${point.x * 100}%`,
                    top: `${point.y * 100}%`,
                  }}
                  title={
                    isMarkingEnabled
                      ? `${point.name} - clique para editar`
                      : point.name
                  }
                >
                  <MarkerIcon />
                </button>
              );
            })}
          </div>
        </div>

        {isPopupOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
            <div
              className="w-full max-w-md rounded-lg border border-zinc-600 bg-zinc-950 p-4 text-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">
                  {editingPointId ? "Editar marcador" : "Novo marcador"}
                </h2>

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
                {Object.entries(markerColors).map(([key, color]) => {
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
