'use client'
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import InConstruction from '@/components/inConstruction';

export default function Rituals() {
  return (
    <div className="w-full h-screen bg-ritual bg-cover bg-top relative">
      <div className="absolute bg-black/80 w-full h-full" />
      <Nav />
      <InConstruction />
      <Footer />
    </div>
  );
}