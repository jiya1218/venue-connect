"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Review {
    id: string;
    created_at: string;
    author_name: string;
    rating: number;
    body: string;
}

interface ReviewsListProps {
    listingId: string;
    listingType: 'venue' | 'vendor';
}

const ReviewsList = ({ listingId, listingType }: ReviewsListProps) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const supabase = createClient();

    // Form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        checkUser();
        fetchReviews();
    }, [listingId]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setCurrentUser(user);
        }
    };

    const fetchReviews = async () => {
        try {
            console.log(`Fetching reviews for ${listingType}: ${listingId}`);
            const { data, error } = await supabase
                .from('reviews')
                .select(`
                    id, 
                    created_at, 
                    rating, 
                    body,
                    author_name
                `)
                .eq('entity_id', listingId)
                .eq('entity_type', listingType)
                .order('created_at', { ascending: false });

            if (error) {
                // If the table doesn't exist (PGRST205), we handle it gracefully by just returning an empty array
                // and logging a helpful reminder for the developer instead of a scary console error.
                if (error.code === 'PGRST205') {
                    console.warn("Reviews table not found in Supabase. Please ensure you have executed the SQL in 'supabase/schema.sql'.");
                    setReviews([]);
                    setLoading(false);
                    return;
                }
                
                console.error("Supabase fetch error:", error.message || error);
                throw error;
            }
            
            const mappedReviews = (data || []).map((r: any) => ({
                id: r.id,
                created_at: r.created_at,
                rating: r.rating,
                body: r.body || '',
                author_name: r.author_name || 'Guest User'
            }));

            setReviews(mappedReviews);
        } catch (error: any) {
            // Only log if it's not the 'Table not found' error we already handled
            if (error?.code !== 'PGRST205') {
                console.error("Reviews fetch failed:", error.message || error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error("Please login to leave a review");
            return;
        }

        if (!comment.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.from('reviews').insert([
                {
                    entity_id: listingId,
                    entity_type: listingType,
                    author_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
                    rating,
                    body: comment,
                    is_approved: false // Reviews need approval based on schema RLS
                }
            ]);

            if (error) throw error;

            toast.success("Review posted successfully!");
            setComment("");
            setRating(5);
            fetchReviews(); // Refresh the list
        } catch (error: any) {
            toast.error("Failed to post review", {
                description: error.message
            });
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviews.filter(r => r.rating === star).length,
        percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
    }));

    return (
        <div id="reviews" className="mt-12 pt-8 border-t border-slate-100">
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-10 text-slate-900 border-l-4 border-primary pl-6 py-1">Ratings & Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Summary & Form Column */}
                <div className="md:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                        <div className="text-6xl font-display font-bold text-slate-900 mb-2">{averageRating}</div>
                        <div className="flex justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 ${star <= parseFloat(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                                />
                            ))}
                        </div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">{reviews.length} Verified Reviews</p>
                        
                        {/* Rating Bars */}
                        <div className="space-y-3">
                            {ratingCounts.map(({ star, percentage }) => (
                                <div key={star} className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-500 w-4">{star}</span>
                                    <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-yellow-400 rounded-full transition-all duration-1000" 
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 w-8">{Math.round(percentage)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="font-semibold mb-4">Write a Review</h3>
                        {currentUser ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Your Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-6 h-6 transition-colors ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted hover:text-yellow-200'}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Your Experience</label>
                                    <Textarea
                                        placeholder="Tell others what you thought about this venue..."
                                        className="min-h-[100px] resize-none"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={submitting}>
                                    {submitting ? "Posting..." : "Post Review"}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-6">
                                <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <p className="text-sm text-muted-foreground mb-4">Please log in to share your experience and write a review.</p>
                                <Button className="w-full" variant="outline" onClick={() => window.location.href = '/login'}>
                                    Login to Review
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews List Column */}
                <div className="md:col-span-2 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-4 md:py-6">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white p-5 rounded-xl border border-border flex gap-4">
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 font-bold">
                                        {(review.author_name || 'G').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-medium text-foreground">{review.author_name}</h4>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {review.body}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-muted/10 border border-dashed border-border rounded-xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                            <Star className="w-12 h-12 text-muted-foreground mb-4 opacity-30" />
                            <h3 className="text-lg font-medium text-foreground mb-1">No reviews yet</h3>
                            <p className="text-sm text-muted-foreground">Be the first to share your experience at this venue!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewsList;
