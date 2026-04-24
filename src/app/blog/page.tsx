import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight, Tag, Sparkles } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";

const categoryColors: Record<string, string> = {
  "Wedding Tips": "bg-rose-50 text-rose-600",
  "Top Lists": "bg-blue-50 text-blue-600",
  "Inspiration": "bg-purple-50 text-purple-600",
  "Birthday": "bg-yellow-50 text-yellow-700",
  "Corporate": "bg-slate-100 text-slate-700",
  "Events": "bg-green-50 text-green-700",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Hero */}
      <div className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden bg-slate-900">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80"
          alt="Gujarat Event Planning Blog"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 text-center text-white px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-[10px] font-bold uppercase tracking-[3px] mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Resources & Ideas
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black mb-4 tracking-tight">The VenueConnect Blog</h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">Wedding tips, venue guides, and event inspiration for your perfect celebration in Gujarat.</p>
        </div>
      </div>

      <main className="flex-grow py-16 bg-slate-50">
        <div className="container max-w-6xl mx-auto px-4">

          {/* Featured Post */}
          <div className="mb-16">
            <Link href={`/blog/${blogPosts[0].id}`} className="group block">
              <div className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="relative h-72 md:h-auto overflow-hidden">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-primary/20">Featured Guide</span>
                  </div>
                </div>
                <div className="p-10 md:p-14 flex flex-col justify-center">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-6 uppercase tracking-wider ${categoryColors[blogPosts[0].category] || 'bg-slate-100 text-slate-600'}`}>
                    {blogPosts[0].category}
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-slate-500 text-base mb-8 leading-relaxed line-clamp-3 font-light">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center gap-6 text-xs text-slate-400 mb-8">
                    <span className="flex items-center gap-2 font-medium"><Calendar className="w-4 h-4 text-primary" />{blogPosts[0].date}</span>
                    <span className="flex items-center gap-2 font-medium"><Clock className="w-4 h-4 text-primary" />{blogPosts[0].readTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-black text-primary uppercase tracking-widest group-hover:gap-4 transition-all">
                    Read Full Story <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <div key={post.id}>
                <Link href={`/blog/${post.id}`} className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:border-primary/20 hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-sm ${categoryColors[post.category] || 'bg-white text-slate-600'}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-4 uppercase tracking-[1px] font-bold">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-primary" />{post.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-primary" />{post.readTime}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2 font-light">{post.excerpt}</p>
                    
                    <div className="mt-auto flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 text-[10px] bg-slate-50 text-slate-500 px-3 py-1 rounded-full font-bold uppercase tracking-tighter">
                          <Tag className="w-3 h-3" />{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* SEO Content Section */}
          <div className="mt-20 bg-white rounded-3xl border border-slate-200 p-10 md:p-14 shadow-sm">
            <div className="max-w-3xl">
               <h2 className="font-display text-3xl font-black mb-6 text-slate-900 tracking-tight">The Ultimate Gujarat Event Planning Resource</h2>
               <p className="text-slate-500 text-base leading-relaxed mb-6 font-light">
                 Our blog is designed to help you navigate the vibrant wedding and event landscape of Gujarat. Whether you're comparing <strong>banquet halls in Ahmedabad</strong>, scouting for <strong>party plots in Surat</strong>, or looking for <strong>wedding photographers in Rajkot</strong>, we provide the insights you need to make informed decisions.
               </p>
               <p className="text-slate-500 text-base leading-relaxed font-light">
                 We regularly update our guides to include new venue openings, trending décor themes, and budgeting tips tailored for the local market. Stay connected with VenueConnect to ensure your special day is as seamless as it is memorable.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
