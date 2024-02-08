import firebaseConfig from "@/firebase/connection";
import { authenticate, signIn } from "@/firebase/login";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import CatFeet from "./giftRolls/catfeet";
import PenumbralSenses from "./giftRolls/penumbralSenses";
import Staredown from "./giftRolls/staredown";
import SimpleWillPowerTest from "./giftRolls/simpleWillPowerTest";
import SimplesRageTest from "./giftRolls/simplesRageTest";
import RageTestMoreAutomaticRoll from "./giftRolls/jamTechnology";
import JamTechnology from "./giftRolls/jamTechnology";

export const MechanicGift = (props: { nameGift: any }) => {
  switch(props.nameGift) {
    case 'Catfeet': return <CatFeet />;
    case 'Eyes of the Owl': return <SimpleWillPowerTest />;
    case "Hare's Leap": return <RageTestMoreAutomaticRoll attribute="strength" skill="" renown="glory" dificulty={1} />;
    case 'Penumbral Senses': return <PenumbralSenses />
    case 'Raging Strike': return <SimplesRageTest />
    case 'Staredown': return <Staredown />
    case 'Sharpened Senses': return <SimpleWillPowerTest />
    case 'Thwarting the Arrow':  return <SimpleWillPowerTest />
    case 'Body Shift': return <RageTestMoreAutomaticRoll attribute="stamina" skill="" renown="glory" dificulty={2} />
    case 'Jam Technology': return <JamTechnology attribute="resolve" skill="" renown="honor" dificulty={2} />
  }
}

export const reduceFdv = async (session: string): Promise<any> => {
  const db = getFirestore(firebaseConfig);
  const authData: { email: string, name: string } | null = await authenticate();
  try {
    if (authData && authData.email && authData.name) {
      const { email } = authData;
      const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
      const userQuerySnapshot = await getDocs(userQuery);
      const players: any = [];
      userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
      const player: any = players.find((gp: any) => gp.email === email);
      if (player.data.willpower.length === 0) {
        player.data.willpower = [ { value: 1, agravated: false }];
      } else {
        const resolveComposure = player.data.attributes.resolve + player.data.attributes.composure;
        const agravated = player.data.willpower.filter((fdv: any) => fdv.agravated === true).map((fd: any) => fd.value);
        const superficial = player.data.willpower.filter((fdv: any) => fdv.agravated === false).map((fd: any) => fd.value);
        const allValues = Array.from({ length: resolveComposure }, (_, i) => i + 1);
        const missingInBoth = allValues.filter(value => !agravated.includes(value) && !superficial.includes(value));
        if (missingInBoth.length > 0) {
          const smallestNumber = Math.min(...missingInBoth);
          player.data.willpower.push({ value: smallestNumber, agravated: false });
          const docRef = userQuerySnapshot.docs[0].ref;
          const playersFiltered = players.filter((gp: any) => gp.email !== email);
          await updateDoc(docRef, { players: [...playersFiltered, player] });
          return true;
        } else {
          const missingInAgravated = allValues.filter(value => !agravated.includes(value));
          if (missingInAgravated.length > 0) {
            const smallestNumber = Math.min(...missingInAgravated);
            player.data.willpower.push({ value: smallestNumber, agravated: true });
            const docRef = userQuerySnapshot.docs[0].ref;
            const playersFiltered = players.filter((gp: any) => gp.email !== email);
            await updateDoc(docRef, { players: [...playersFiltered, player] });
            return true;
          } else {
            window.alert(`Você não possui mais pontos de Força de Vontade para realizar este teste (Já sofreu todos os danos Agravados possíveis).`);
            return false;
          }
        }
      }
    } else {
      const sign = await signIn();
      if (!sign) {
        window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
      }
    }
  } catch (error) {
    window.alert('Erro ao atualizar valor de Força de Vontade ' + error );
  }
};

export const verifyRage = async (session: string): Promise<any> => {
  const db = getFirestore(firebaseConfig);
  const authData: { email: string, name: string } | null = await authenticate();
  try {
    if (authData && authData.email && authData.name) {
      const { email } = authData;
      const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
      const userQuerySnapshot = await getDocs(userQuery);
      const players: any = [];
      userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
      const player: any = players.find((gp: any) => gp.email === email);
      if (player.data.rage === 0) {
        window.alert('A Fúria é igual a Zero, logo você não pode conjurar dons.')
        return false;
      } else return true;
    } else {
      const sign = await signIn();
      if (!sign) {
        window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
      }
    }
  } catch (error) {
    window.alert('Erro ao atualizar valor de Força de Vontade ' + error );
  }
};