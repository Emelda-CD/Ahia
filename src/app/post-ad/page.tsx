import PostAdForm from '@/components/post-ad/PostAdForm';

export default function PostAdPage() {
  return (
    <div className="bg-secondary/50">
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary">Post a New Ad</h1>
                    <p className="text-muted-foreground mt-2">Follow the steps below to get your ad online in minutes.</p>
                </div>
                <PostAdForm />
            </div>
        </div>
    </div>
  );
}
