import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SupabaseImage } from "@/components/ui/supabase-image";
import { useEffect } from "react";
import { blogPosts } from "@/data/blogPosts";

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
              Blog
            </h1>
            <p className="text-xl text-[#1D1F28]/70 max-w-3xl mx-auto">
              Insights, trends, and best practices in AI automation and business intelligence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = `/blog/${post.slug}`}>
                <SupabaseImage 
                  assetId={post.hero_asset_id}
                  alt={`${post.title} hero image`}
                  className="w-full h-48 object-cover"
                  fallbackSrc="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#041122] mb-3">
                    {post.title}
                  </h2>
                  <p className="text-[#1D1F28]/70 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="text-sm text-[#1D1F28]/50">
                    {new Date(post.published_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} • {post.reading_time} read
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;