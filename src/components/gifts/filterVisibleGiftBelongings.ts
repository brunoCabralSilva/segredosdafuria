import dataTrybes from "@/data/trybes.json";

const customTrybeTypes = new Set(
  dataTrybes
    .flatMap((trybe: any) => (
      trybe?.custom
        ? [
            String(trybe?.nameEn || "").trim().toLowerCase(),
            String(trybe?.namePtBr || "").trim().toLowerCase(),
          ]
        : []
    ))
    .filter((type: string) => type !== "")
);

export function filterVisibleGiftBelongings(belongings: any[], allowCustomTrybes: boolean) {
  if (!Array.isArray(belongings)) return [];
  if (allowCustomTrybes) return belongings;

  return belongings.filter((belong) => {
    const belongingType = String(belong?.type || "").trim().toLowerCase();
    return belongingType === "" || !customTrybeTypes.has(belongingType);
  });
}