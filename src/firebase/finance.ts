import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import firebaseConfig from "./connection";
import { getFinancePeriodOrder } from "@/utils/financePeriod";

const getFinanceCalendarDocumentId = (year: number, month: number) => (
  `${year}-${String(month).padStart(2, '0')}`
);

export const getFinances = async () => {
  const db = getFirestore(firebaseConfig);
  const collectionRef = collection(db, 'finance');
  const querySnapshot = await getDocs(collectionRef);
  const financeList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return financeList;
};

export const createFinance = async (setShowMessage: any) => {
  try {
    const newFinance = {
      month: '',
      year: '',
      players: [],
      periodOrder: 0,
    };

    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'finance');
    const financeDoc = await addDoc(collectionRef, newFinance);

    return {
      id: financeDoc.id,
      ...newFinance,
    };
  } catch (error: any) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao criar a planilha: ' + error.message });
    return null;
  }
};

export const duplicateFinance = async (
  financeData: { players?: any[] },
  setShowMessage: any
) => {
  try {
    const newFinance = {
      month: '',
      year: '',
      players: (financeData.players || []).map((player: any) => ({
        ...player,
        situation: 'Pendente',
      })),
      periodOrder: 0,
    };

    const db = getFirestore(firebaseConfig);
    const collectionRef = collection(db, 'finance');
    const financeDoc = await addDoc(collectionRef, newFinance);

    return {
      id: financeDoc.id,
      ...newFinance,
    };
  } catch (error: any) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao copiar a planilha: ' + error.message });
    return null;
  }
};

export const updateFinance = async (
  financeId: string,
  financeData: { month?: string, year?: string, players?: any[] },
  setShowMessage: any
) => {
  try {
    const db = getFirestore(firebaseConfig);
    const financeDocRef = doc(db, 'finance', financeId);
    const nextFinanceData = { ...financeData } as {
      month?: string,
      year?: string,
      players?: any[],
      periodOrder?: number,
    };

    if ('month' in financeData || 'year' in financeData) {
      nextFinanceData.periodOrder = getFinancePeriodOrder(financeData.month || '', financeData.year || '');
    }

    await updateDoc(financeDocRef, nextFinanceData);
    return true;
  } catch (error: any) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao atualizar a planilha: ' + error.message });
    return false;
  }
};

export const deleteFinance = async (financeId: string, setShowMessage: any) => {
  try {
    const db = getFirestore(firebaseConfig);
    const financeDocRef = doc(db, 'finance', financeId);
    await deleteDoc(financeDocRef);
    return true;
  } catch (error: any) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao excluir a planilha: ' + error.message });
    return false;
  }
};

export const getFinanceCalendar = async (year: number, month: number) => {
  const db = getFirestore(firebaseConfig);
  const calendarDocRef = doc(db, 'financeCalendar', getFinanceCalendarDocumentId(year, month));
  const calendarDoc = await getDoc(calendarDocRef);

  if (!calendarDoc.exists()) {
    return {
      year,
      month,
      events: {},
    };
  }

  const calendarData = calendarDoc.data();

  return {
    id: calendarDoc.id,
    year: calendarData.year || year,
    month: calendarData.month || month,
    events: calendarData.events || {},
  };
};

export const saveFinanceCalendar = async (
  year: number,
  month: number,
  events: Record<string, any[]>,
  setShowMessage: any
) => {
  try {
    const db = getFirestore(firebaseConfig);
    const calendarDocRef = doc(db, 'financeCalendar', getFinanceCalendarDocumentId(year, month));

    await setDoc(calendarDocRef, {
      year,
      month,
      events,
    });

    return true;
  } catch (error: any) {
    setShowMessage({ show: true, text: 'Ocorreu um erro ao salvar o calendário: ' + error.message });
    return false;
  }
};
