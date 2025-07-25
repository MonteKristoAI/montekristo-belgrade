
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { SupabaseImage } from "@/components/ui/supabase-image";
import { blogPosts } from "@/data/blogPosts";

export const BlogTeaser = () => {
  const navigate = useNavigate();

  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
            Latest Insights
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Card 
              key={post.id} 
              className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <CardContent className="p-8">
                <SupabaseImage 
                  assetId={post.hero_asset_id}
                  alt={`${post.title} hero image`}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                  fallbackSrc="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
                />
                <h3 className="text-xl font-bold text-[#041122] mb-4 leading-tight">
                  {post.title}
                </h3>
                <p className="text-[#1D1F28]/70 leading-relaxed">
                  {post.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg" className="border-[#041122] text-[#041122] hover:bg-[#041122]/5" onClick={() => window.location.href = '/blog'}>
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};
