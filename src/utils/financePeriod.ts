const monthOrderByName: Record<string, number> = {
  janeiro: 1,
  fevereiro: 2,
  marco: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
};

const monthLabelByOrder: Record<number, string> = {
  1: "Janeiro",
  2: "Fevereiro",
  3: "Marco",
  4: "Abril",
  5: "Maio",
  6: "Junho",
  7: "Julho",
  8: "Agosto",
  9: "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
};

export const getMonthLabelByOrder = (monthNumber: number) => monthLabelByOrder[monthNumber] || "";

const normalizeMonthValue = (month: string = "") => (
  month
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
);

export const getFinancePeriodOrder = (month: string = "", year: string = "") => {
  const normalizedMonth = normalizeMonthValue(month);
  const monthFromName = monthOrderByName[normalizedMonth];
  const monthFromNumber = Number(normalizedMonth.replace(/\D/g, ""));
  const normalizedYear = Number(String(year || "").replace(/\D/g, ""));

  const safeMonth = monthFromName || (monthFromNumber >= 1 && monthFromNumber <= 12 ? monthFromNumber : 0);
  const safeYear = normalizedYear > 0 ? normalizedYear : 0;

  if (!safeMonth && !safeYear) return 0;

  return (safeYear * 100) + safeMonth;
};

export const getFinancePeriodLabel = (month: string = "", year: string = "") => {
  const periodOrder = getFinancePeriodOrder(month, year);
  if (!periodOrder) return `${month || "Mes"} / ${year || "Ano"}`;

  const monthNumber = periodOrder % 100;
  const yearNumber = Math.floor(periodOrder / 100);

  return `${getMonthLabelByOrder(monthNumber)} ${yearNumber}`;
};

export const sortFinancesByPeriod = <T extends { month?: string, year?: string }>(finances: T[]) => (
  [...finances].sort((financeA, financeB) => {
    const periodOrderA = getFinancePeriodOrder(financeA.month || "", financeA.year || "");
    const periodOrderB = getFinancePeriodOrder(financeB.month || "", financeB.year || "");
    const hasPeriodA = periodOrderA > 0;
    const hasPeriodB = periodOrderB > 0;

    if (hasPeriodA !== hasPeriodB) {
      return hasPeriodA ? 1 : -1;
    }

    if (!hasPeriodA && !hasPeriodB) {
      return 0;
    }

    return periodOrderB - periodOrderA;
  })
);
