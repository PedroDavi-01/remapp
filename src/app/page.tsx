import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";


export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-slate-50 px-4 text-center">
      <main className="max-w-3xl space-y-6">
        
        <h1 className="text-5xl md:text-7xl py-2 font-extrabold text-slate-900 tracking-tight">
          Estude de forma <br />
          <span className="text-blue-600">mais inteligente.</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-xl mx-auto leading-relaxed">
          O Remapp usa ciência para ajudar você a memorizar conteúdos complexos através da repetição espaçada. Simples, rápido e eficiente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <SignInButton mode="modal" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 text-lg">
              Começar Agora Gratuitamente
          </SignInButton>
          
          <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-100 transition-all text-lg">
            Ver como funciona
          </button>
        </div>
      </main>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full">
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-left">
          <p className="text-2xl mb-2">⚡</p>
          <h3 className="font-bold text-slate-900">Criação Rápida</h3>
          <p className="text-slate-500 text-sm">Adicione cards em segundos direto da sua página inicial.</p>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-left">
          <p className="text-2xl mb-2">📅</p>
          <h3 className="font-bold text-slate-900">Agendamento Automático</h3>
          <p className="text-slate-500 text-sm">Nós calculamos o dia exato para você revisar cada assunto.</p>
        </div>

        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20 text-left">
          <p className="text-2xl mb-2">📈</p>
          <h3 className="font-bold text-slate-900">Foco no Resultado</h3>
          <p className="text-slate-500 text-sm">Acompanhe seu desempenho e identifique onde precisa melhorar.</p>
        </div>
      </section>

      <footer className="mt-20 py-8 text-slate-400 text-sm border-t w-full max-w-5xl">
        © {new Date().getFullYear()} Remapp - Sua memória em outro nível.
      </footer>
    </div>
  );
}