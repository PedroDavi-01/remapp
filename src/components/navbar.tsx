import Link from "next/link";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Brain  } from 'lucide-react';


export default async function Navbar() {
  const { userId } = await auth();

  return (
    <nav className="border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          href={userId ? "/home" : "/"} 
          className="font-bold text-xl text-blue-600 tracking-tight"
        >
          <div className="flex items-center gap-2">
            <span>Remapp </span>
            <Brain size={16}/>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          {userId ? (
            <>
              <Link 
                href="/home" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/pastas" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Decks
              </Link>
              <Link 
                href="/desempenho" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Desempenho
              </Link>
              
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-100">
                Entrar
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}