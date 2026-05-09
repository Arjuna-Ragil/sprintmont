"use client";

import { useSession, signIn } from "next-auth/react";
import DoodleDecor from "@/components/DoodleDecor";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleStart = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      signIn("authentik");
    }
  };

  return (
    <div className="text-on-background font-body min-h-screen flex flex-col relative" style={{ backgroundColor: "#ffffff", backgroundImage: "radial-gradient(#d4d4d8 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
      <DoodleDecor />

      <div className="relative z-10 flex flex-col w-full flex-1">
        <header className="w-full sticky top-6 z-50 px-6 pointer-events-none mt-4">
        <nav className="flex justify-between items-center px-6 py-3 max-w-5xl mx-auto bg-stone-200/30 backdrop-blur-md shadow-[0_4px_0_0_rgba(0,0,0,0.05)] border border-outline-variant/30 rounded-full pointer-events-auto">
          <div className="text-2xl font-black text-stone-800 tracking-tighter font-headline pl-2">Sprintmont</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-[#00BCD4] border-b-4 border-[#00BCD4] pb-1 font-headline font-bold tracking-tight" href="#">Home</a>
            <a className="text-stone-600 font-medium font-headline hover:text-[#00BCD4] hover:-rotate-1 transition-all duration-200" href="#features">Features</a>
            <a className="text-stone-600 font-medium font-headline hover:text-[#00BCD4] hover:-rotate-1 transition-all duration-200" href="#community">Community</a>
          </div>
          <div className="flex items-center space-x-4 max-md:hidden">
            {!session && (
              <button onClick={() => signIn("authentik")} className="hidden sm:block text-stone-600 font-medium hover:text-primary">
                Login
              </button>
            )}
            {session && (
              <button onClick={handleStart} className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:scale-95 transition-transform">
              {session ? "Go to Dashboard" : "Start Your Month"}
            </button>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 overflow-hidden grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 flex flex-col gap-10 items-center text-center">
          <div className="flex flex-col items-center text-center">
            <div className="absolute -top-10 -left-10 opacity-20 pointer-events-none">
              <span className="material-symbols-outlined text-8xl text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>draw</span>
            </div>
            <div className="font-headline font-black text-5xl md:text-8xl leading-none mb-8 max-w-4xl relative">
              <h1 className="tracking-tighter">
                Ship Something <span className="marker-underline italic text-primary-dim">Every</span> Month.
              </h1>
              <div className="absolute -right-8 md:-right-24 -top-4 md:-top-8 hidden lg:block pointer-events-none">
                <p className="font-marker text-xl text-tertiary rotate-15 inline-block drop-shadow-sm whitespace-nowrap">
                  No more<br />abandoned repos!
                </p>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl mb-12">
              Sprintmont is the ultimate &quot;sketch-to-ship&quot; workspace for developers who want to stop dreaming and start building. 3 weeks of code. 1 week of hype.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 relative">
              <button onClick={handleStart} className="bg-primary hover:bg-primary-dim text-on-primary text-xl px-10 py-5 rounded-xl font-black transition-all shadow-[8px_8px_0_0_rgba(0,101,115,0.2)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                {session ? "Go to Dashboard" : "Get Started Free"}
              </button>
              <div className="absolute -bottom-14 sm:top-1/2 sm:bottom-auto left-1/2 sm:left-[-200px] md:left-[-220px] -translate-x-1/2 sm:translate-x-0 sm:-translate-y-1/2 whitespace-nowrap -rotate-6 pointer-events-none">
                <span className="font-marker text-xl text-secondary">Join 12,000+ builders</span>
              </div>
            </div>
          </div>

          {/* Hero Demo UI Component */}
          <div className="mt-20 w-full max-w-[1000px] mx-auto relative z-20">
            {/* Decorative Floating Badges */}
            <div className="absolute -top-6 -left-4 md:-left-12 z-30 bg-surface-container-lowest p-3 md:p-4 rounded-xl shadow-lg -rotate-2 border-outline-variant/30 border">
              <p className="font-marker text-sm md:text-lg text-primary">Your Workspace</p>
            </div>
            
            <div className="absolute -bottom-8 -right-4 md:-right-12 z-30 p-4 md:p-6 bg-tertiary-container/90 backdrop-blur-md rounded-2xl shadow-xl rotate-3 max-w-[200px] md:max-w-xs text-left border border-outline-variant/20 hidden sm:block">
              <span className="material-symbols-outlined text-on-tertiary-container mb-1">local_fire_department</span>
              <p className="font-bold text-on-tertiary-container text-sm md:text-base leading-tight md:leading-normal">14-Day Streak</p>
              <p className="text-xs text-on-tertiary-container/80 hidden md:block mt-1">Keep the momentum going. Ship day is almost here.</p>
            </div>

            {/* Browser/Dashboard Frame */}
            <div className="bg-surface-container-lowest rounded-[24px] md:rounded-[32px] overflow-hidden border border-outline-variant/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col w-full h-[450px] md:h-[600px] transform -rotate-1 origin-bottom-left transition-all duration-700 hover:rotate-0 hover:shadow-[0_40px_70px_-15px_rgba(0,0,0,0.15)] group">
              
              {/* Browser Header */}
              <div className="h-10 md:h-12 bg-surface-container flex items-center px-4 md:px-6 border-b border-outline-variant/20 gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                </div>
                <div className="flex-1 flex justify-center sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-surface px-4 md:px-32 py-1.5 rounded-md text-xs font-mono text-on-surface-variant/60 flex items-center gap-2 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    app.sprintmont.com
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="flex flex-1 overflow-hidden bg-surface-container-lowest">
                {/* Sidebar */}
                <div className="w-64 bg-surface-container/30 border-r border-outline-variant/20 p-6 hidden md:flex flex-col">
                  <div className="font-headline font-black text-2xl tracking-tighter mb-10 pl-2">Sprintmont</div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 text-primary font-bold bg-primary-container/20 px-4 py-3 rounded-xl">
                      <span className="material-symbols-outlined text-primary">dashboard</span>
                      Active Sprint
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant hover:bg-surface px-4 py-3 rounded-xl cursor-default transition-colors">
                      <span className="material-symbols-outlined">rocket</span>
                      My Portfolio
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant hover:bg-surface px-4 py-3 rounded-xl cursor-default transition-colors">
                      <span className="material-symbols-outlined">group</span>
                      Community
                    </div>
                  </div>
                  
                  {/* User Profile Mock */}
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-outline-variant/20">
                    <div className="w-10 h-10 rounded-full bg-stone-200 border-2 border-surface flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-stone-500">face</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold leading-tight">Builder</span>
                      <span className="text-xs text-on-surface-variant leading-tight">Pro Member</span>
                    </div>
                  </div>
                </div>
                
                {/* Main Content Area */}
                <div className="flex-1 bg-surface-container-lowest p-6 md:p-10 overflow-y-auto">
                  <div className="flex justify-between items-start mb-8 md:mb-10">
                    <div>
                      <p className="font-marker text-secondary text-base md:text-lg mb-1">September Cohort</p>
                      <h3 className="font-headline font-black text-2xl md:text-4xl text-on-surface">AI Story Generator</h3>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 text-primary-dim px-4 py-2 rounded-full font-bold text-xs md:text-sm flex items-center gap-2">
                       <span className="relative flex h-2 w-2 md:h-3 md:w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-primary"></span>
                       </span>
                       Week 2: Code
                    </div>
                  </div>
                  
                  {/* Progress Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
                    <div className="bg-surface p-5 md:p-6 rounded-2xl border border-outline-variant/30 opacity-60">
                      <div className="flex items-center justify-between mb-4">
                        <span className="material-symbols-outlined text-on-surface-variant text-2xl md:text-3xl">task_alt</span>
                        <span className="text-[10px] uppercase font-black text-on-surface-variant bg-surface-container px-2 py-1 rounded">Finished</span>
                      </div>
                      <h4 className="font-bold text-lg md:text-xl mb-1">Week 1: Plan</h4>
                      <p className="text-xs md:text-sm text-on-surface-variant">Specs written. DB designed.</p>
                    </div>
                    <div className="bg-primary-container/10 p-5 md:p-6 rounded-2xl border-2 border-primary/30 relative overflow-hidden shadow-[0_8px_30px_rgb(0,101,115,0.05)]">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="material-symbols-outlined text-primary text-2xl md:text-3xl">terminal</span>
                        <span className="text-[10px] uppercase font-black text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">In Progress</span>
                      </div>
                      <h4 className="font-bold text-lg md:text-xl mb-1 text-primary-dim">Week 2: Code</h4>
                      <div className="w-full bg-surface-container rounded-full h-1.5 mt-4 mb-2 overflow-hidden">
                        <div className="bg-primary h-1.5 rounded-full w-[45%]"></div>
                      </div>
                      <p className="text-xs text-primary font-medium text-right">45% Complete</p>
                    </div>
                  </div>

                  {/* Task List mockup */}
                  <h4 className="font-bold text-base md:text-lg mb-4 text-on-surface">Weekly Tasks</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 bg-surface p-3 md:p-4 rounded-xl border border-outline-variant/20 shadow-sm opacity-50">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-white text-[14px] md:text-[16px]">check</span>
                      </div>
                      <span className="line-through text-on-surface-variant font-medium text-sm md:text-base">Initialize Next.js & Go Server</span>
                    </div>
                    <div className="flex items-center gap-4 bg-surface p-3 md:p-4 rounded-xl border border-outline-variant/20 shadow-sm border-l-4 border-l-secondary relative">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded border-2 border-outline-variant bg-surface-container-lowest shrink-0"></div>
                      <span className="font-bold text-on-background text-sm md:text-base">Integrate OpenAI Streaming API</span>
                      <div className="ml-auto hidden sm:flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-stone-300 border-2 border-surface"></div>
                        <div className="w-6 h-6 rounded-full bg-stone-400 border-2 border-surface"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-surface p-3 md:p-4 rounded-xl border border-outline-variant/20 shadow-sm">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded border-2 border-outline-variant bg-surface-container-lowest shrink-0"></div>
                      <span className="font-medium text-on-surface-variant text-sm md:text-base">Design Landing Page layout</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section id="features" className="py-24 relative">
          <div className="text-center mb-16">
            <h2 className="font-headline font-extrabold text-4xl mb-4">The Sprintmont Rhythm</h2>
            <p className="font-marker text-2xl text-secondary-dim">Simple. Repeatable. Effective.</p>
          </div>
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 px-10">
            {/* Timeline Connector (Hidden on Mobile) */}
            <div className="absolute top-1/2 left-0 w-full h-1 border-t-4 border-dashed border-outline-variant/30 -translate-y-1/2 hidden md:block"></div>

            {/* Phase 1 */}
            <div className="relative z-10 bg-surface text-center p-8 rounded-3xl w-full md:w-1/4 border-2 border-on-background/5 hover:scale-105 transition-transform">
              <div className="bg-primary-container text-on-primary-container w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Week 1: Sketch</h3>
              <p className="text-sm text-on-surface-variant">Ideation and MVP scoping. Don&apos;t overthink, just outline the core.</p>
            </div>

            {/* Phase 2 */}
            <div className="relative z-10 bg-surface text-center p-8 rounded-3xl w-full md:w-1/4 border-2 border-on-background/5 hover:scale-105 transition-transform">
              <div className="bg-secondary-container text-on-secondary-container w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="material-symbols-outlined">code</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Week 2-3: Build</h3>
              <p className="text-sm text-on-surface-variant">Heads down coding. Use our AI tools to move 2x faster through boilerplate.</p>
            </div>

            {/* Phase 3 */}
            <div className="relative z-10 bg-surface text-center p-8 rounded-3xl w-full md:w-1/4 border-2 border-on-background/5 hover:scale-105 transition-transform">
              <div className="bg-tertiary-container text-on-tertiary-container w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <h3 className="font-bold text-xl mb-2">Week 4: Pitch</h3>
              <p className="text-sm text-on-surface-variant">Polish the landing page, record a demo, and submit to the wall.</p>
            </div>
          </div>
        </section>

        {/* Workspace Section */}
        <section className="py-24 bg-surface-container-low rounded-[60px] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="material-symbols-outlined text-[200px]">edit_note</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-primary text-on-primary rounded-full text-xs font-bold uppercase tracking-widest mb-6">Built-in Tools</span>
              <h2 className="font-headline font-black text-4xl md:text-5xl mb-8 leading-tight">Your digital workbench, <br /><span className="text-primary italic">reimagined.</span></h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                  <div>
                    <h4 className="font-bold">Notepad Drawing Area</h4>
                    <p className="text-on-surface-variant">Capture logic flows and UI sketches directly next to your task list.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">push_pin</span>
                  <div>
                    <h4 className="font-bold">Sticky-Note Kanban</h4>
                    <p className="text-on-surface-variant">Organize features on a board that feels like physical brainstorming.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative min-h-[500px] flex items-center justify-center">
              {/* Kanban Simulation */}
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-surface-container-lowest p-6 rounded-2xl border-2 border-dashed border-outline-variant/40 sticky-note">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-error"></div>
                    <span className="font-bold text-xs uppercase opacity-50">Backlog</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-tertiary-container/20 rounded-lg text-sm border border-tertiary/10">Auth flow sketch</div>
                    <div className="p-3 bg-primary-container/20 rounded-lg text-sm border border-primary/10">Tailwind setup</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl border-2 border-dashed border-outline-variant/40 sticky-note">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-bold text-xs uppercase opacity-50">In Progress</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-secondary-container/30 rounded-lg text-sm border border-secondary/10">Hero section UI</div>
                  </div>
                </div>
                <div className="col-span-2 bg-surface-container-highest/50 p-6 rounded-2xl mt-4 relative">
                  <p className="font-marker text-xl text-on-surface mb-4">Brainstorming Canvas</p>
                  <img className="w-full h-48 object-cover rounded-xl opacity-80 mix-blend-multiply" alt="Close-up of a whiteboard with handwritten sketches, architectural diagrams, and colorful marker lines" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxqmHtd3-oHhDmOEN4iBPhE6jmRiKIMQSyvSKZCBOGh4cENkRcVAwAULEhZXDHnnxVVpwjMZfF03VoNYfzihHTiYgDnjIYNmapqy_fLGLpMpTWd07-AvPR1vwAbu9-RxHa6FUA_stI3B7GMwmkSqkDwQYSiTq6WsX_jRZp5m5KiRU4WK2-qrWrpbTyUrAwGBVUA4DsrMH-OyBnK0BiUQ6oW4uO7h4jFRUSp1xpxeuQONE6cICKMxFytqa7IjOIS6INFW2EbDMc" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-primary/40">gesture</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Features */}
        <section className="py-24 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-primary text-on-primary p-12 rounded-[40px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 opacity-10">
              <span className="material-symbols-outlined text-[300px]">auto_awesome</span>
            </div>
            <div>
              <h3 className="text-4xl font-black mb-6 leading-tight">AI Idea Generator &amp;<br />Feature Scoper</h3>
              <p className="text-xl opacity-90 max-w-md">Input your tech stack and a vague goal. We&apos;ll sketch out a 3-week roadmap and generate the first 10 user stories for you.</p>
            </div>
            <div className="mt-12 flex gap-4">
              <button className="bg-on-primary text-primary px-8 py-3 rounded-full font-bold">Try AI Assistant</button>
              <span className="font-marker text-xl rotate-[-5deg] self-center">&quot;It actually works!&quot;</span>
            </div>
          </div>
          <div className="bg-secondary-container text-on-secondary-container p-12 rounded-[40px] flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined text-4xl mb-6">alarm</span>
              <h3 className="text-3xl font-black mb-4">The Cron-Alert</h3>
              <p className="opacity-90">Gentle (and sometimes aggressive) nudges to keep you shipping. We monitor your commits and remind you when Week 4 is approaching.</p>
            </div>
            <div className="bg-on-secondary-container/10 p-4 rounded-2xl border border-on-secondary-container/20 mt-8">
              <p className="text-xs uppercase font-bold opacity-60">Next Alert</p>
              <p className="font-bold italic">&quot;7 days till Pitch Week. Get that repo public!&quot;</p>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="py-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="font-headline font-black text-5xl mb-4">Wall of Projects</h2>
              <p className="text-xl text-on-surface-variant">The best builds from the Sprintmont community.</p>
            </div>
          </div>

          {/* Bento Wall */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 bg-surface-container rounded-3xl overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Digital screenshot of a clean web application dashboard with minimalist UI elements and vibrant blue accents" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi8vxAUfPudQQQUEKM7qcY4McYiz3KRsll9Rbt0O-gQhr-wDvfTClDLzkCt1DewgpSue8px4Qq_W_xsjwXkM3gjqe_9u3BlXPlUhehu2tDzJ0a1eDbTJ6tUH17_ZwUnkERvt-v9-b_qcENn_Sx3vB-z7AeWvUsOAbRf931EoEOakpshF5W8Fy2Jm5z-S24a2S_8xhMjhq9aLEvP7bX6My7c16x4F7kZc4pG_4a_ZpiBW4bkax20N9fJGLV0E6S2eFlWcAco67s" />
                <div className="absolute inset-0 bg-linear-to-t from-surface-container to-transparent"></div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-primary-container px-3 py-1 rounded text-xs font-bold text-on-primary-container uppercase">SaaS</span>
                  <span className="text-sm opacity-60">Shipped: Jan 2024</span>
                </div>
                <h4 className="text-2xl font-black mb-2">Ghostly: Minimal CMS</h4>
                <p className="text-on-surface-variant">Built in 22 days by @sarah_codes. 400 stars on GitHub already.</p>
              </div>
            </div>

            <div className="md:col-span-5 bg-surface-container rounded-3xl p-8 flex flex-col justify-end relative">
              <div className="absolute top-6 right-6">
                <span className="material-symbols-outlined text-4xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <div>
                <h4 className="text-xl font-black mb-2">Pixel-Pusher AI</h4>
                <p className="text-sm text-on-surface-variant mb-6">A tool to convert hand-drawn sketches to clean SVG components.</p>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-tertiary"></div>
                  <div className="w-8 h-8 rounded-full bg-secondary"></div>
                  <div className="w-8 h-8 rounded-full bg-primary"></div>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 bg-surface-container rounded-3xl p-8 group">
              <div className="aspect-square bg-surface-container-high rounded-2xl mb-6 overflow-hidden flex items-center justify-center border-2 border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-6xl text-outline-variant group-hover:rotate-12 transition-transform">add</span>
              </div>
              <h4 className="text-lg font-bold">Your Project Here</h4>
              <p className="text-sm opacity-60">Ready for the next cohort? Registration ends in 3 days.</p>
            </div>

            <div className="md:col-span-8 bg-tertiary text-on-tertiary p-12 rounded-3xl flex items-center gap-8">
              <div className="hidden sm:block">
                <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2">Win the &quot;Golden Marker&quot;</h4>
                <p className="opacity-80">Every month, the top-voted project wins a $500 cloud credit and a physical Golden Marker trophy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter / Footer CTA */}
        <section className="py-24 text-center border-t-2 border-dashed border-outline-variant/20 mt-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-headline font-black text-4xl mb-6">Ready to stop idling?</h2>
            <p className="text-xl text-on-surface-variant mb-10">Start your first month today. No credit card required. Just code.</p>
            <div className="flex justify-center">
              <button onClick={handleStart} className="bg-primary hover:bg-primary-dim text-on-primary text-xl px-12 py-5 rounded-xl font-black transition-all shadow-[8px_8px_0_0_rgba(0,101,115,0.2)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none w-full sm:w-auto">
                {session ? "Go to Dashboard" : "Get Started Free"}
              </button>
            </div> 
          </div>
        </section>
      </main>

      <footer className="w-full mt-20 rounded-t-[40px] md:rounded-t-[80px] bg-stone-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-12 py-16 max-w-7xl mx-auto text-center md:text-left">
          <div>
            <div className="font-black text-stone-800 text-2xl mb-2 font-headline">Sprintmont</div>
            <p className="font-['Epilogue'] text-sm text-stone-500 max-w-xs">© 2026 Sprintmont. Keep sketching. Built for builders, by builders.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-['Epilogue'] text-sm text-stone-500 hover:text-[#00BCD4] hover:underline decoration-wavy transition-colors duration-300" href="#">Twitter</a>
            <a className="font-['Epilogue'] text-sm text-stone-500 hover:text-[#00BCD4] hover:underline decoration-wavy transition-colors duration-300" href="#">Discord</a>
            <a className="font-['Epilogue'] text-sm text-stone-500 hover:text-[#00BCD4] hover:underline decoration-wavy transition-colors duration-300" href="#">Privacy</a>
            <a className="font-['Epilogue'] text-sm text-stone-500 hover:text-[#00BCD4] hover:underline decoration-wavy transition-colors duration-300" href="#">Terms</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
