import { Sparkles } from "lucide-react";

export default function AIPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground">Your AI-powered workspace assistant</p>
      </div>
    </div>
  );
}
