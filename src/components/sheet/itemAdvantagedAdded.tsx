import firebaseConfig from "@/firebase/connection";
import { collection, doc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ItensAdvantagesAdded(props: any) {
  const { session } = props;
  const [adv, setAdv] = useState([]);
  const router = useRouter();

  const getAllAdvantages = async () => {
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const decode: { email: string } = jwtDecode(token);
      const { email } = decode;
      const db = getFirestore(firebaseConfig);
      const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
      const userQuerySnapshot = await getDocs(userQuery);
      const userDocument = userQuerySnapshot.docs[0];
      const advAndflw = userDocument.data();
      const playerFound = advAndflw.players.find((player: any) => player.email === email);
      const listOfAdvantages = playerFound.data.advantagesAndFlaws.filter((item: any) => item.flaws.length > 0 || item.advantages.length > 0);
      setAdv(listOfAdvantages);
    } else router.push('/user/login');
  }

  useEffect(() => {
    getAllAdvantages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return(
    <div>
      {
        adv.length > 0 && adv.map((ad: any, index: number) => (
          <div key={index} className="text-white">
            <div className="mb-3">
              Vantagens
              <div>
                {
                  ad.advantages.map((element: any, index2: number) => (
                    <div key={index2}>
                      <p>Nome: { element.name }</p>
                      <p>Benefício: { element.advantage }</p>
                      <p>Custo: { element.value }</p>
                    </div>
                  ))
                }
              </div>
            </div>
            Desvantagens
            <div>
              {
                ad.flaws.map((element: any, index2: number) => (
                  <div key={index2}>
                    <p>Nome: { element.name }</p>
                    <p>Defeito: { element.flaw }</p>
                    <p>Custo: { element.value }</p>
                  </div>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  );
}