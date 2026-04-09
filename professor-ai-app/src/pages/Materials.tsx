import { useRef } from 'react';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';

export default function Materials() {
  const { materials, uploadMaterial, openModal } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMaterial(file);
  };

  return (
    <Layout>
      <main className="flex-1 lg:ml-[280px] p-8 lg:p-12 space-y-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-end border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-4xl font-headline font-medium text-slate-900 tracking-tight">Resource Library</h1>
            <p className="text-slate-500 mt-2">All materials processed by the Syllabus Agent.</p>
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold tracking-widest text-xs uppercase shadow-lg shadow-violet-600/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-sm">upload</span> Upload
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx" />
        </div>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100">
                <th className="p-6">Document Title</th>
                <th className="p-6">Origin Course</th>
                <th className="p-6">Date Ingested</th>
                <th className="p-6 text-right">Adaptive Learning Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-600">
              {materials.map(mat => (
                <tr key={mat.id} className="hover:bg-slate-50/50 cursor-pointer group">
                  <td className="p-6 flex items-center gap-4">
                    <span className="material-symbols-outlined text-red-500 bg-red-50 p-2 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">picture_as_pdf</span>
                    <span className="group-hover:text-violet-600 transition-colors font-semibold">{mat.title}</span>
                  </td>
                  <td className="p-6">
                    <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs">{mat.course_id.toUpperCase()}</span>
                  </td>
                  <td className="p-6 text-slate-400">{mat.date_added}</td>
                  <td className="p-6 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); openModal('formats'); }} className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-orange-600 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                      <span className="material-symbols-outlined text-[14px]">view_comfy_alt</span> Formats
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openModal('quiz'); }} className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                      <span className="material-symbols-outlined text-[14px]">psychology_alt</span> Quiz
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openModal('summary'); }} className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                      <span className="material-symbols-outlined text-[14px]">rate_review</span> Summary
                    </button>
                  </td>
                </tr>
              ))}
              {materials.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-12 text-center text-slate-400">Library is empty. Upload a document to trigger the ingestion pipeline.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </Layout>
  );
}
