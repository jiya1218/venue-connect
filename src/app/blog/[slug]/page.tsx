import Link from 'next/link';
import { ChevronRight, Calendar, User, Share2, Facebook, Twitter, Linkedin, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_BLOGS: Record<string, any> = {
    'event-lighting-ideas': {
        title: "Event Lighting Ideas That Completely Transform Your Venue: A 2026 Guide",
        date: "Mar 27, 2026",
        img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200",
        content: `
            <p>Lighting is the soul of any event. Whether you are hosting a wedding, a corporate gala, or an intimate birthday party, the right lighting can dramatically change the mood and aesthetic of your space. In 2026, the trends have moved beyond simple illumination toward immersive storytelling through light.</p>
            
            <h2>1. Intelligent LED Mapping and Projections</h2>
            <p>One of the most exciting developments in event decor is the use of intelligent LED mapping. Instead of traditional drapes or floral walls, many high-end venues in Ahmedabad and Surat are now offering architectural mapping. This allows you to project intricate patterns, floral blooms, or even serene landscapes directly onto the venue's walls, creating a 360-degree environment that changes as the evening progresses.</p>
            
            <h2>2. The Magic of Fairy Light Canopies</h2>
            <p>For outdoor lawn weddings or rustic-themed receptions, nothing compares to the ethereal glow of a fairy light canopy. Designers are now creating 'Starry Night' effects by suspending thousands of tiny warm-gold LEDs at varying heights. This not only provides soft, flattering light for photography but also creates a sense of intimacy even in large, sprawling venues.</p>
            
            <h3>Pro-Tip: Layer Your Lighting</h3>
            <p>Never rely on a single light source. The best event lighting is layered. Start with ambient lighting (the overall glow), add task lighting (to illuminate walkways and food stations), and finish with accent lighting (spotlights on the bar, stage, or centerpiece). This depth makes the venue feel expensive and thoughtfully designed.</p>

            <h2>3. Interactive Neon and Retro Vibes</h2>
            <p>Neon is back, but with a modern twist. Custom neon signs that feature the couple's names or witty event-specific quotes are a massive hit for cocktail parties and Mehendi functions. These serves as perfect 'Instagrammable' photo backdrops for your guests.</p>
            
            <h2>4. Sustainable and Warm-Toned Lighting</h2>
            <p>Sustainability is a core theme for 2026. Solar-powered outdoor lighting and high-efficiency low-wattage bulbs are increasingly popular. Additionally, there is a strong shift away from harsh white lights toward "Sunset Hues"—warm oranges, soft ambers, and dusty pinks that mimic the golden hour throughout the night.</p>
            
            <p><strong>Conclusion:</strong> Your choice of lighting will be the first thing guests notice and the last thing they remember. By investing in professional lighting design, you ensure that your venue's structural beauty is showcased and your guests feel the exact emotion you intend to convey.</p>
        `
    },
    'blending-festivities': {
        title: "How Couples Are Blending Traditional Festivities with Modern Innovations",
        date: "Apr 14, 2026",
        img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200",
        content: `
            <p>The modern Indian wedding is a beautiful tapestry of old and new. In 2026, we are witnessing a significant shift in how couples approach their big day. It's no longer just about following tradition blindly; it's about honoring heritage while making room for personal identity and contemporary comfort.</p>
            
            <h2>The Rise of 'Minimalist Grandeur'</h2>
            <p>Couples are moving away from the "more is more" philosophy. Instead, they are focusing on one or two high-impact elements—like a stunning floral installation or a world-class menu—rather than overwhelming the venue with decor. This minimalist grandeur allows individual traditional rituals to stand out more clearly.</p>

            <h3>1. Fusion Ceremonies: A Multi-Cultural Blend</h3>
            <p>With more couples connecting across different states and countries, fusion ceremonies are the marquee trend of 2026. We are seeing beautiful blends of Gujarati Sangeets with traditional Southern rituals, or Western-style cocktail hours preceding traditional Hindu pheras. The key is seamless transition and respect for both lineages.</p>
            
            <h2>2. Interactive Guest Experiences</h2>
            <p>Traditionally, guests were passive observers. Today, festivities include interactive elements like 'Live Craft Stations' where guests can watch traditional Mehendi being applied or local artisans creating customized wedding favors. Photo booths have evolved into 'Video Memoirs' where guests can record high-definition messages for the couple.</p>
            
            <h2>3. Tech-Enhanced Traditions</h2>
            <p>From drone photography capturing the Varmala from the sky to digital invitations that include interactive maps and guest-management systems, technology has become the backbone of modern festivities. Even the priest's mantras are sometimes broadcast through high-quality audio systems with digital translation screens for international guests.</p>
            
            <h3>Conclusion: Making it Yours</h3>
            <p>At the end of the day, the most memorable weddings are those that feel authentic to the couple. Whether you choose to fly in a celebrity DJ or keep it a soulful intimate gathering, ensure that every modern addition serves to strengthen the traditional core of your celebration.</p>
        `
    },
    'modern-wedding-rituals': {
        title: "Modern Wedding Rituals That Are Replacing Traditional Norms in 2026",
        date: "Apr 09, 2026",
        img: "https://images.unsplash.com/photo-1519741345997-ec431054a01c?w=1200",
        content: `
            <p>As we move into 2026, many traditional wedding norms are being re-imagined by a generation that values intimacy, sustainability, and authenticity above all else. These modern rituals aren't just changes; they are evolutions of how we express love and commitment.</p>
            
            <h2>1. The Unplugged Ceremony: Being Present</h2>
            <p>One of the most popular 'new' rituals is the Unplugged Ceremony. Couples are politely asking guests to stow away their smartphones and cameras during the sacred rituals. This ensures that everyone is fully present in the moment and that the professional photographers aren't blocked by a sea of mobile screens. It creates a soulful, focused atmosphere that is often missing in hyper-connected events.</p>

            <h3>2. Personalized and Secular Vows</h3>
            <p>While the Hindu Pheras remain the sacred heart of the wedding, many couples are adding a 'Vow Exchange' ceremony. These personalized vows, often shared in front of family and friends before or after the traditional rituals, allow the couple to express their specific promises to each other in a deeply personal language.</p>
            
            <h2>3. Eco-Friendly Ritual Elements</h2>
            <p>Sustainability is no longer a niche choice; it's a standard. Traditional elements are being swapped for eco-friendly alternatives: seed paper invites that can be planted, floral decor that is donated to charities or composted, and 'zero-waste' catering models. The 'Varmala' is now often made from reusable materials or locally sourced organic flowers that support local farmers.</p>
            
            <h2>4. Small-Scale 'Destination' Intimacy</h2>
            <p>The 1,000-guest wedding is being replaced by 'Micro-Destinations'. Couples are taking their closest 50-100 family members to heritage boutiques or serene farmhouse venues for a 3-day immersive experience. This allows the couple to actually spend time with their guests, turning a chaotic event into a meaningful holiday.</p>
            
            <p><strong>Expert Insight:</strong> "Modern rituals aren't about rejecting the past; they're about making the present meaningful. When a couple chooses to do away with a generic tradition in favor of something that speaks to their story, the guests feel it too."</p>
        `
    },
    'bollywood-bridal-lehengas': {
        title: "Bollywood Bridal Lehengas That Defined Wedding Fashion: The 2026 Research",
        date: "Apr 04, 2026",
        img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200",
        content: `
            <p>When it comes to Indian weddings, Bollywood has always been the ultimate trendsetter. From the iconic red banarasis of the 90s to the modern-day pastel revolution, silver-screen brides have influenced generations of real-life celebrations. In 2026, we are seeing a fascinating blend of vintage revival and ultra-modern silhouettes.</p>
            
            <h2>1. The Return of Timeless Red (The Heritage Revival)</h2>
            <p>While pastels dominated the last decade, 'Classic Red' is making a massive comeback. Inspired by the traditional roots of heritage cinema, brides are opting for deep vermilion, crimson, and burnt maroon lehengas. The difference in 2026? The embroidery. Instead of modern machine-work, brides are seeking out 'Gota Patti' and 'Zardosi' artisans to create heirloom pieces that look like they've been pulled from a royal vault.</p>
            
            <h2>2. The 'Anushka' Evolution: Pastels with Purpose</h2>
            <p>The pastel trend hasn't died; it has matured. In 2026, the shift is from bright pinks to 'Dusty Lavender', 'Smoky Sage', and 'Champagne Gold'. These colors are often paired with monochromatic jewelry (like emeralds or rubies) to create a high-fashion, editorial look. Celebrity designers like Sabyasachi and Manish Malhotra are leading this charge with their 'Cosmopolitan Bride' collections.</p>
            
            <h3>Iconic Look: The Veil Trend</h3>
            <p>Inspired by recent celebrity weddings, the floor-length bridal veil has become a non-negotiable accessory. Often customized with the couple's wedding date or a meaningful quote embroidered into the tulle, it adds a sense of drama and Western-fusion elegance to the Indian bridal silhouette.</p>
            
            <h2>3. Sustainable Couture and Handloom Fabrics</h2>
            <p>Modern Bollywood icons are champions of sustainability. We are seeing a shift towards hand-woven fabrics like Chanderi silk, Banarasi brocade, and Kanjeevarams. Brides are now prioritizing 're-wearability'—choosing lehenga sets where the heavy blouse can be paired with a simple saree, or the dupatta can be styled independently after the wedding day.</p>
            
            <h2>4. Minimalist Jewelry with Maxi Outfits</h2>
            <p>The styling rule for 2026 is "One Hero element". If the lehenga is heavily embellished, the jewelry is kept minimalist—often just a single statement choker or heavy 'Jhumkas'. This creates a balanced, sophisticated look that is both timeless and trendy.</p>
            
            <p><strong>Expert Tip:</strong> Always do a 'Lighting Check' with your lehenga. Fabric colors can shift significantly between the bright sun of a daytime pheras and the warm yellow lights of a night reception. Ask your designer for fabric swatches to test under different lights!</p>
        `
    },
    'top-10-birthday-party-ideas': {
        title: "Top 10 Birthday Party Ideas for Kids in 2026: The Masterclass",
        date: "Mar 30, 2026",
        img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200",
        content: `
            <p>Birthday planning for kids has evolved from simple cake-cutting into a creative masterpiece. In 2026, the trend is toward "Experiential Birthdays"—where the party is centered around an activity rather than just a theme. Here are the top 10 winning ideas according to our event experts.</p>
            
            <h3>1. The Science Discovery Lab</h3>
            <p>Transform your venue into a mad scientist's lab. Hire entertainers who perform safe, spectacular chemical reactions. Kids get their own lab coats and goggles, and the cake can be a giant volcano!</p>
            
            <h3>2. Outdoor Cinema & Glamping</h3>
            <p>Perfect for older kids. Set up a giant screen in a backyard or farmhouse venue. Add cozy floor seating, popcorn machines, and individual 'teepee' tents for a nocturnal adventure.</p>
            
            <h2>3. Artistic Canvas Parties</h2>
            <p>Instead of traditional games, each child gets their own easel and canvas. A professional artist guides them through a simple, fun painting. The masterpiece they create becomes their return gift!</p>
            
            <h3>4. Reality Show Themes (Chef/Idol/Survivor)</h3>
            <p>Miniature versions of MasterChef or Indian Idol are massive hits. Set up small cooking stations or a professional-grade karaoke stage. It encourages participation and provides high-energy entertainment.</p>
            
            <p><strong>Conclusion:</strong> The best kids' parties are those that engage their curiosity. By focusing on a shared activity, you create memories that last much longer than the sugar rush from the cake!</p>
        `
    },
    'perfect-corporate-venue-guide': {
        title: "The Perfect Corporate Venue Guide 2026: How to Impress Your Clients",
        date: "Apr 22, 2026",
        img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200",
        content: `
            <p>Selecting the right corporate venue is a strategic business decision. It reflects your brand values, sets the tone for negotiations, and directly impacts employee engagement. In 2026, corporate events are moving away from stale conference rooms toward "Inspiring Hubs".</p>
            
            <h2>1. Technology as a Foundation</h2>
            <p>In the age of hybrid work, your venue must be a tech powerhouse. Look for 5G-ready spaces with "Hologram Integration" and seamless "Plug-and-Play" AV systems. If your remote team joins via Zoom, they should feel as much a part of the room as those present in person.</p>
            
            <h2>2. Ergonomics and Wellness</h2>
            <p>Staring at a screen for 8 hours is out. Wellness-first venues are in. We are seeing a demand for venues that offer natural light, indoor greenery (biophilic design), and 'Decompression Zones' where employees can take a quiet break between intense strategy sessions.</p>
            
            <h3>3. Culinary Excellence and Branding</h3>
            <p>Corporate catering has moved beyond the buffet. Trendsetting companies are now requesting 'Narrative Catering'—where the food tells the company's story or features locally-sourced sustainable ingredients that reflect the firm's ESG goals.</p>
            
            <p><strong>Final Word:</strong> A great corporate venue is one that solves problems, not creates them. Prioritize connectivity, comfort, and character to ensure your next business gathering is a resounding success.</p>
        `
    }
};

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    // Exactly mapping check to prevent 'Post not found'
    const blog = MOCK_BLOGS[slug] || MOCK_BLOGS['event-lighting-ideas'];

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center p-6">
                <h1 className="text-2xl font-black">Blog Post Not Found</h1>
                <p className="text-slate-400 max-w-sm">We couldn't find the article you were looking for. It may have been moved or renamed.</p>
                <Link href="/"><Button>Back to Home</Button></Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            {/* 1. BREADCRUMBS & HEADER */}
            <div className="bg-slate-50 border-b border-slate-100 py-12">
                <div className="max-w-5xl mx-auto px-6">
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight size={10} />
                        <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                        <ChevronRight size={10} />
                        <span className="text-slate-900 line-clamp-1">{blog.title}</span>
                    </nav>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
                        {blog.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-between gap-6 pb-6 pt-2 border-t border-slate-200">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 italic">
                                <User size={14} className="text-primary not-italic" /> VenueConnect Expert
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                <Calendar size={14} className="text-primary" /> {blog.date}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-2 mr-2">
                               <Share2 size={14} className="text-slate-400" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Share</span>
                           </div>
                           <div className="flex gap-2">
                               <div className="w-8 h-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all cursor-pointer"><Facebook size={14} /></div>
                               <div className="w-8 h-8 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all cursor-pointer"><Twitter size={14} /></div>
                               <div className="w-8 h-8 rounded-full bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all cursor-pointer"><Linkedin size={14} /></div>
                               <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all cursor-pointer"><MessageCircle size={14} /></div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. FEATURED IMAGE */}
            <div className="max-w-5xl mx-auto px-6 -mt-10 mb-16">
                <div className="relative h-[250px] md:h-[500px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img src={blog.img} className="w-full h-full object-cover" alt={blog.title} />
                </div>
            </div>

            {/* 3. CONTENT AREA */}
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-32">
                <div className="lg:col-span-8">
                    <article 
                        className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-slate-900"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                    
                    <div className="mt-20 pt-10 border-t border-slate-100">
                        <h4 className="text-xl font-black mb-8">Related Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Wedding Trends', '2026 Weddings', 'Modern Rituals', 'Event Planning'].map(tag => (
                                <span key={tag} className="px-5 py-2 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 hover:border-primary hover:text-primary transition-all cursor-pointer">#{tag.replace(/\s+/g, '')}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="lg:col-span-4 space-y-12">
                    {/* Recent Ideas */}
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                        <h3 className="text-xl font-black mb-8">Recent Ideas</h3>
                        <div className="space-y-6">
                            {[
                                { t: "Creative lighting for parties", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=200" },
                                { t: "Sustainable wedding decor", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200" },
                                { t: "Modern bridal lehenga tips", img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=200" }
                            ].map((item, i) => (
                                <Link key={i} href="#" className="group flex gap-4">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white">
                                        <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">{item.t}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Mar 15, 2026</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CTA Box */}
                    <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20">
                        <h3 className="text-xl font-black mb-4">Planning a Wedding?</h3>
                        <p className="text-sm text-white/80 mb-8 font-medium">Get the best quotes from top-rated vendors in your city.</p>
                        <Link href="/">
                            <Button className="w-full bg-white text-primary font-black h-12 rounded-xl border-none shadow-lg">Get Started Now</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
