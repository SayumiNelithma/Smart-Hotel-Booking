import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Sparkles, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useAiSearchMutation } from "@/lib/api";
import { setQuery } from "@/lib/features/searchSlice";

export default function AISearch() {
  const dispatch = useDispatch();

  const [value, setValue] = useState("");
  const [responseText, setResponseText] = useState("");
  const [aiSearch, { isLoading }] = useAiSearchMutation();

  async function handleSearch() {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    setResponseText("");
    dispatch(setQuery(trimmed));
    try {
      const res = await aiSearch(trimmed).unwrap();
      setResponseText(res.response || "");
    } catch (e) {
      setResponseText("Could not get AI response. Try again.");
    }
  }

  return (
    <div className="z-10 w-full max-w-lg">
      <div className="relative flex items-center">
        <div className="relative flex-grow">
          <Input
            placeholder="Search for the experience you want" // Short placeholder for mobile
            name="query"
            value={value}
            className="bg-[#1a1a1a] text-sm sm:text-base text-white placeholder:text-white/70 placeholder:text-sm sm:placeholder:text-base sm:placeholder:content-['Describe_your_destination...'] border-0 rounded-full py-6 pl-4 pr-12 sm:pr-32 w-full transition-all"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
        </div>

        <Button
          type="button"
          className="absolute right-2 h-[80%] my-auto bg-black text-white rounded-full px-2 sm:px-4 flex items-center gap-x-2 border-white border-2 hover:bg-black/80 hover:ring-2 hover:ring-white/50 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/60 transition-colors"
          onClick={handleSearch}
          disabled={isLoading || !value.trim()}
          aria-busy={isLoading}
          title={!value.trim() ? "Type what you want to experience" : "Ask AI to find a hotel"}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Searching…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-white" />
              <span className="text-sm">AI Search</span>
            </>
          )}
        </Button>
      </div>
      {responseText && (
        <div className="mt-3 text-sm text-white/90 bg-black/40 rounded-lg p-3 whitespace-pre-wrap">
          {responseText}
        </div>
      )}
    </div>
  );
}