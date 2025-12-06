import React from 'react';
import { Calculator, Sigma, TrendingUp, HelpCircle } from 'lucide-react';

interface SidebarProps {
  onExampleClick: (prompt: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const EXAMPLES = [
  { icon: Calculator, label: "حل معادلة تربيعية", prompt: "حل المعادلة التالية مع الشرح: x^2 - 5x + 6 = 0" },
  { icon: TrendingUp, label: "رسم دالة جيبية", prompt: "ارسم دالة الجيب sin(x) في المجال من -10 إلى 10" },
  { icon: Sigma, label: "حساب التفاضل", prompt: "ما هو مشتق الدالة f(x) = x^3 + 2x ؟" },
  { icon: HelpCircle, label: "شرح نظرية فيثاغورس", prompt: "اشرح نظرية فيثاغورس مع مثال عددي." },
];

const Sidebar: React.FC<SidebarProps> = ({ onExampleClick, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl z-30 transition-all duration-300 ease-in-out
        md:relative md:transform-none md:shadow-none md:z-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8 text-teal-700 dark:text-teal-400">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <Sigma className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-['Cairo'] text-slate-800 dark:text-slate-100">الخوارزمي</h1>
          </div>

          <div className="flex-1 overflow-y-auto">
            <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">
              أمثلة مقترحة
            </h2>
            <div className="space-y-2">
              {EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onExampleClick(ex.prompt);
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors text-right group"
                >
                  <ex.icon className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                  <span className="text-sm font-medium">{ex.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800/30">
              <h3 className="text-teal-800 dark:text-teal-300 font-bold mb-2 text-sm">عن التطبيق</h3>
              <p className="text-teal-700 dark:text-teal-400 text-xs leading-relaxed opacity-90">
                مساعد ذكي للطلاب والباحثين في الرياضيات، يدعم اللغة العربية والمعادلات الرياضية والرسم البياني.
              </p>
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-600">© 2024 استوديو الخوارزمي</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;