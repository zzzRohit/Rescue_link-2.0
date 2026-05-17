import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp, PawPrint } from 'lucide-react';
import { animals } from '../constants/animals';
import { useChat } from '../hooks/useChat';

const situations = ['Injured / bleeding', 'Not moving', 'Baby animal', 'Trapped', 'Just found it'];
const defaultChips = ['Show me step-by-step', 'Can I feed it?', 'Find a rescuer near me'];

export default function FirstAidChat() {
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(animals[0]);
  const [selectedSituations, setSelectedSituations] = useState([]);
  const [input, setInput] = useState('');
  const { messages, isLoading, send } = useChat({ animal: animal.toLowerCase(), situationChips: selectedSituations });
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const submit = (event) => {
    event.preventDefault();
    send(input);
    setInput('');
  };

  const chipClick = (chip) => {
    if (chip.toLowerCase().includes('rescuer')) {
      navigate('/rescuer');
      return;
    }
    send(chip);
  };

  const toggleSituation = (situation) => {
    setSelectedSituations((current) => current.includes(situation)
      ? current.filter((item) => item !== situation)
      : [...current, situation]);
  };

  const animalPills = (
    <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible md:pb-0">
      {animals.map((item) => (
        <button key={item} type="button" onClick={() => setAnimal(item)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs ${animal === item ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-200 bg-white text-gray-600'}`}>
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#F9FAF7] md:static md:mx-auto md:flex md:h-[calc(100vh-137px)] md:max-w-6xl md:overflow-hidden md:rounded-2xl md:border md:border-gray-100 md:bg-white md:shadow-sm">
      <aside className="hidden w-[280px] shrink-0 border-r border-gray-100 bg-white p-5 md:flex md:flex-col">
        <h2 className="text-sm font-medium text-gray-900">Animal type</h2>
        <div className="mt-3">{animalPills}</div>
        <p className="mt-4 rounded-full bg-green-50 px-3 py-2 text-xs text-green-800">Selected: {animal}</p>

        <h2 className="mt-6 text-sm font-medium text-gray-900">Situation</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {situations.map((situation) => (
            <button key={situation} type="button" onClick={() => toggleSituation(situation)} className={`rounded-full border px-3 py-1.5 text-xs ${selectedSituations.includes(situation) ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-200 text-gray-600'}`}>
              {situation}
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-3">
          <Link to="/rescuer" className="block rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800">Can't handle this?</Link>
          <p className="text-xs leading-5 text-gray-400">AI guidance only. Not a substitute for a wildlife professional.</p>
        </div>
      </aside>

      <main className="flex h-full min-h-screen flex-1 flex-col md:min-h-0">
        <header className="border-b border-gray-100 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-700"><PawPrint className="h-5 w-5" /></div>
            <div>
              <h1 className="text-sm font-medium text-gray-950">Wildlife advisor</h1>
              <p className="flex items-center gap-1 text-xs text-green-700"><span className="h-2 w-2 rounded-full bg-green-500" /> Online</p>
            </div>
          </div>
          <div className="mt-3 md:hidden">{animalPills}</div>
        </header>

        <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {messages.map((message, index) => (
            <div key={index} className={message.role === 'user' ? 'ml-auto max-w-[82%]' : 'mr-auto max-w-[86%]'}>
              <div className={message.role === 'user'
                ? 'rounded-xl rounded-tr-sm border border-green-200 bg-green-50 p-3 text-sm whitespace-pre-wrap text-green-900'
                : 'rounded-xl rounded-tl-sm border border-gray-100 bg-gray-50 p-3 text-sm whitespace-pre-wrap text-gray-700'}>
                {message.content}
                {message.streaming && <span className="ml-2 inline-flex gap-1 align-middle"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 delay-100" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 delay-200" /></span>}
              </div>
              {message.role === 'assistant' && !message.streaming && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(message.chips?.length ? message.chips : defaultChips).map((chip) => (
                    <button key={chip} type="button" onClick={() => chipClick(chip)} className="rounded-full border border-green-200 px-3 py-1.5 text-xs text-green-700 hover:bg-green-50">
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 bg-white p-3">
          <p className="mb-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">⚠ AI guidance only — contact a wildlife professional for serious injuries</p>
          <form onSubmit={submit} className="flex items-center gap-2">
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Describe what happened..." className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-200" />
            <button disabled={!input.trim() || isLoading} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white disabled:opacity-50">
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
