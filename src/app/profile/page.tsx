'use client'
import Footer from "@/components/footer";
import InConstruction from "@/components/inConstruction";
import Nav from "@/components/nav";

export default function Profile() {
  return(
    <div className="bg-ritual bg-cover bg-top">
      <div className="bg-black/80 h-full w-full">
        <Nav />
        <InConstruction />
      </div>
      <Footer />
    </div>
  )
}