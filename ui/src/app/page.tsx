"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleStart = () => {
    if (session) {
      router.push('/projects/new');
    } else {
      signIn("authentik");
    }
  };

  return (
    <div className="bg-background text-on-background font-body paper-grain min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="w-full sticky top-0 z-50 bg-stone-200/30 backdrop-blur-md shadow-[0_4px_0_0_rgba(0,0,0,0.05)]">
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-black text-stone-800 tracking-tighter font-headline">Sprintmont</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-[#00BCD4] border-b-4 border-[#00BCD4] pb-1 font-headline font-bold tracking-tight" href="#">Methodology</a>
            <a className="text-stone-600 font-medium font-headline hover:text-[#00BCD4] hover:-rotate-1 transition-all duration-200" href="#">Features</a>
            <a className="text-stone-600 font-medium font-headline hover:text-[#00BCD4] hover:-rotate-1 transition-all duration-200" href="#">Community</a>
          </div>
          <div className="flex items-center space-x-4">
            {!session && (
              <button onClick={() => signIn("authentik")} className="hidden sm:block text-stone-600 font-medium hover:text-primary">
                Login
              </button>
            )}
            <button onClick={handleStart} className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:scale-95 transition-transform">
              {session ? "Go to Dashboard" : "Start Your Month"}
            </button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 overflow-hidden flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 flex flex-col items-center text-center">
          <div className="absolute -top-10 -left-10 opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-8xl text-primary" style={{fontVariationSettings: "'FILL' 0"}}>draw</span>
          </div>
          <h1 className="font-headline font-black text-5xl md:text-8xl leading-none tracking-tighter mb-8 max-w-4xl relative">
            Ship Something <span className="marker-underline italic text-primary-dim">Every</span> Month.
            <div className="absolute -right-12 top-0 hidden lg:block">
              <span className="font-marker text-2xl text-tertiary rotate-12 inline-block">No more<br/>abandoned repos!</span>
              <span className="material-symbols-outlined text-tertiary block -rotate-12">trending_flat</span>
            </div>
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl mb-12">
            Sprintmont is the ultimate &quot;sketch-to-ship&quot; workspace for developers who want to stop dreaming and start building. 3 weeks of code. 1 week of hype.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 relative">
            <button onClick={handleStart} className="bg-primary hover:bg-primary-dim text-on-primary text-xl px-10 py-5 rounded-xl font-black transition-all shadow-[8px_8px_0_0_rgba(0,101,115,0.2)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
              {session ? "Go to Dashboard" : "Get Started Free"}
            </button>
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 sm:translate-x-40">
              <span className="font-marker text-xl text-secondary">Join 12,000+ builders →</span>
            </div>
          </div>

          {/* Hero Image / Visual Anchor */}
          <div className="mt-24 relative w-full max-w-5xl">
            <div className="absolute -top-8 left-10 z-10 bg-surface-container-lowest p-4 rounded-xl shadow-lg rotate-[-2deg] border-outline-variant/20 border">
              <p className="font-marker text-lg text-primary">This month: AI SaaS</p>
            </div>
            <div className="bg-surface-container-low rounded-[40px] p-2 md:p-4 overflow-hidden border-2 border-dashed border-outline-variant/30">
              <img className="w-full h-auto rounded-[32px] grayscale hover:grayscale-0 transition-all duration-700" alt="Modern developer workspace with multiple monitors, coding environment visible, and hand-drawn doodles overlaying the digital screen aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkT55BVPePGD1VH1hXADRrBVNunG977CKIyouyiUN5Hfvc7Mk3N-2x63I-crrU6Brnd-wtzlMRgolmSeGuXAf_toL6i5Me9_wnxg4FT8h3i6eJL1sSXEI7eDF4hCVdgEXkqPUte8FNd-puCREgQf1SVkWIIstE8gvhtYvmr2hR7q73cbNEeh9p2MEVRh6OiZKyF4Vr6V7Fmgo_KH1rqQdVpPf1ZBRuOquwFEM8y4xmyE04c5aevqbqRa3qSVh08s5LKOYLl-55"/>
            </div>
            <div className="absolute -bottom-10 -right-4 z-10 p-6 bg-tertiary-container/90 backdrop-blur-md rounded-2xl shadow-xl rotate-[3deg] max-w-xs text-left">
              <span className="material-symbols-outlined text-on-tertiary-container mb-2">rocket_launch</span>
              <p className="font-bold text-on-tertiary-container">24 Projects Shipped Today</p>
              <p className="text-sm text-on-tertiary-container/80">The community is heating up. Get your build ready for Pitch Week.</p>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="py-24 relative">
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
              <h2 className="font-headline font-black text-4xl md:text-5xl mb-8 leading-tight">Your digital workbench, <br/><span className="text-primary italic">reimagined.</span></h2>
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
                  <img className="w-full h-48 object-cover rounded-xl opacity-80 mix-blend-multiply" alt="Close-up of a whiteboard with handwritten sketches, architectural diagrams, and colorful marker lines" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxqmHtd3-oHhDmOEN4iBPhE6jmRiKIMQSyvSKZCBOGh4cENkRcVAwAULEhZXDHnnxVVpwjMZfF03VoNYfzihHTiYgDnjIYNmapqy_fLGLpMpTWd07-AvPR1vwAbu9-RxHa6FUA_stI3B7GMwmkSqkDwQYSiTq6WsX_jRZp5m5KiRU4WK2-qrWrpbTyUrAwGBVUA4DsrMH-OyBnK0BiUQ6oW4uO7h4jFRUSp1xpxeuQONE6cICKMxFytqa7IjOIS6INFW2EbDMc"/>
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
              <h3 className="text-4xl font-black mb-6 leading-tight">AI Idea Generator &amp;<br/>Feature Scoper</h3>
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
        <section className="py-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="font-headline font-black text-5xl mb-4">Wall of Projects</h2>
              <p className="text-xl text-on-surface-variant">The best builds from the Sprintmont community.</p>
            </div>
            <button className="text-primary font-bold flex items-center gap-2 hover:underline">
              View all 1,240 builds <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          
          {/* Bento Wall */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 bg-surface-container rounded-3xl overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Digital screenshot of a clean web application dashboard with minimalist UI elements and vibrant blue accents" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDi8vxAUfPudQQQUEKM7qcY4McYiz3KRsll9Rbt0O-gQhr-wDvfTClDLzkCt1DewgpSue8px4Qq_W_xsjwXkM3gjqe_9u3BlXPlUhehu2tDzJ0a1eDbTJ6tUH17_ZwUnkERvt-v9-b_qcENn_Sx3vB-z7AeWvUsOAbRf931EoEOakpshF5W8Fy2Jm5z-S24a2S_8xhMjhq9aLEvP7bX6My7c16x4F7kZc4pG_4a_ZpiBW4bkax20N9fJGLV0E6S2eFlWcAco67s"/>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent"></div>
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
                <span className="material-symbols-outlined text-4xl text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
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
                <span className="material-symbols-outlined text-6xl" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
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
            <form className="flex flex-col sm:flex-row gap-4">
              <input className="flex-grow rounded-xl border-2 border-on-background/10 bg-surface-container-low px-6 py-4 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Enter your email" type="email"/>
              <button className="bg-on-background text-surface px-8 py-4 rounded-xl font-black hover:bg-primary-dim transition-colors" type="button" onClick={handleStart}>
                Ship Now
              </button>
            </form>
            <p className="mt-6 font-marker text-lg text-secondary italic">Next cohort starts in 4d : 12h : 33m</p>
          </div>
        </section>
      </main>

      <footer className="w-full mt-20 rounded-t-[40px] md:rounded-t-[80px] bg-stone-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-12 py-16 max-w-7xl mx-auto text-center md:text-left">
          <div>
            <div className="font-black text-stone-800 text-2xl mb-2 font-headline">Sprintmont</div>
            <p className="font-['Epilogue'] text-sm text-stone-500 max-w-xs">© 2024 Sprintmont. Keep sketching. Built for builders, by builders.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-['Epilogue'] text-sm text-stone-500 hover:text-[#00BCD4] hover:underline decoration-wavy transition-colors duration-300" href="#">Twitter</a>
            <a className="font-['Epilogue'] text-sm text-stone-500 hover:text-[#00BCD4] hover:underline decoration-wavy transition-colors duration-300" href="#">Discord</a>
            <a className="font-['Epilogue'] text-sm text-stone-500 hover:text-[#00BCD4] hover:underline decoration-wavy transition-colors duration-300" href="#">Privacy</a>
            <a className="font-['Epilogue'] text-sm text-stone-500 hover:text-[#00BCD4] hover:underline decoration-wavy transition-colors duration-300" href="#">Terms</a>
          </div>
        </div>
      </footer>

      {/* Doodle Decor Accents */}
      <div className="fixed top-[20%] right-[5%] pointer-events-none opacity-20 -rotate-12 hidden lg:block">
        <span className="material-symbols-outlined text-[120px] text-primary">architecture</span>
      </div>
      <div className="fixed bottom-[10%] left-[2%] pointer-events-none opacity-20 rotate-12 hidden lg:block">
        <span className="material-symbols-outlined text-[100px] text-tertiary">brush</span>
      </div>
    </div>
  );
}
