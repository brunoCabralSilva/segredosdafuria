import { collection, doc, getDocs, getFirestore, runTransaction, setDoc } from 'firebase/firestore';
import firebaseConfig from './connection';
import { getOfficialTimeBrazil } from './utilities';
import { tribeQuizTrybeIds, type TribeQuizResultId } from '@/data/trybeQuiz';

export type TrybeQuizScoreboardItem = {
  id: TribeQuizResultId;
  trybeId: TribeQuizResultId;
  total: number;
  updatedAt: string;
};

const TRYBE_QUIZ_SCOREBOARD_COLLECTION = 'trybeQuizScoreboard';

const normalizeScoreboardItem = (
  trybeId: TribeQuizResultId,
  data?: any,
): TrybeQuizScoreboardItem => ({
  id: trybeId,
  trybeId,
  total: Number(data?.total || 0),
  updatedAt: data?.updatedAt || '',
});

export const ensureTrybeQuizScoreboard = async () => {
  const db = getFirestore(firebaseConfig);
  const scoreboardCollectionRef = collection(db, TRYBE_QUIZ_SCOREBOARD_COLLECTION);
  const querySnapshot = await getDocs(scoreboardCollectionRef);
  const existingIds = new Set(querySnapshot.docs.map((scoreDoc) => scoreDoc.id));

  const missingTrybes = tribeQuizTrybeIds.filter((trybeId) => !existingIds.has(trybeId));

  if (missingTrybes.length === 0) return;

  const updatedAt = await getOfficialTimeBrazil();

  await Promise.all(
    missingTrybes.map((trybeId) => setDoc(doc(scoreboardCollectionRef, trybeId), {
      id: trybeId,
      trybeId,
      total: 0,
      updatedAt,
    })),
  );
};

export const getTrybeQuizScoreboard = async () => {
  await ensureTrybeQuizScoreboard();

  const db = getFirestore(firebaseConfig);
  const scoreboardCollectionRef = collection(db, TRYBE_QUIZ_SCOREBOARD_COLLECTION);
  const querySnapshot = await getDocs(scoreboardCollectionRef);
  const scoreboardMap = new Map(
    querySnapshot.docs.map((scoreDoc) => [scoreDoc.id, scoreDoc.data()]),
  );

  return tribeQuizTrybeIds.map((trybeId) => normalizeScoreboardItem(
    trybeId,
    scoreboardMap.get(trybeId),
  ));
};

export const registerTrybeQuizWinner = async (trybeId: TribeQuizResultId) => {
  await ensureTrybeQuizScoreboard();

  const db = getFirestore(firebaseConfig);
  const updatedAt = await getOfficialTimeBrazil();
  const scoreboardCollectionRef = collection(db, TRYBE_QUIZ_SCOREBOARD_COLLECTION);
  const scoreDocRef = doc(scoreboardCollectionRef, trybeId);

  await runTransaction(db, async (transaction) => {
    const scoreDocSnapshot = await transaction.get(scoreDocRef);
    const currentScore = scoreDocSnapshot.exists()
      ? normalizeScoreboardItem(trybeId, scoreDocSnapshot.data())
      : normalizeScoreboardItem(trybeId);

    transaction.set(scoreDocRef, {
      id: trybeId,
      trybeId,
      total: currentScore.total + 1,
      updatedAt,
    });
  });

  return getTrybeQuizScoreboard();
};
