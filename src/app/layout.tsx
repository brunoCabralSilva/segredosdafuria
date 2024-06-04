import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Provider from "@/context/provider";
import { Providers } from '@/redux/provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Segredos da Fúria',
  description: 'Descubra o universo de "Werewolf: The Apocalypse 5th" em minha aplicação React desenvolvida com Next.js e estilizada com Tailwind CSS. Explore tribos, augúrios e raças, pesquise rituais e encontre dons específicos por meio de uma busca avançada.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Provider>
        <body className={inter.className}>
          <Providers>
            {children}
          </Providers>
        </body>
      </Provider>
    </html>
  )
}