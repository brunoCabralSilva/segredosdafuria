'use client'
import Footer from "@/components/footer";
import InConstruction from "@/components/inConstruction";
import Nav from "@/components/nav";
import { testToken } from "@/firebase/token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Profile() {
  const router = useRouter();
  const [showData, setShowData] = useState<boolean>(false);
  useEffect(() => {
    const verification = testToken();
    if (!verification) router.push('/user/login');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return(
    <div className="bg-ritual bg-cover bg-top">
      {
        showData ? <div className="bg-black/80 h-full w-full">
          <Nav />
          <InConstruction />
        </div>
        : <div className="bg-black/80 text-white h-screen flex items-center justify-center flex-col">
            <span className="loader z-50" />
          </div>
      }
      <Footer />
    </div>
  )
}