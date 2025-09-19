import React, { useState, useMemo } from "react";

export default function DobLivePredictionApp() {
  const [dob, setDob] = useState("");
  const [name, setName] = useState("");

  // Generate a long descriptive prediction (100+ words)
  function generateBigPrediction(lp) {
    if (!lp) return null;
    return `Based on your life path number ${lp}, this prediction reveals a journey filled with insights, guidance, and reflection. You may find yourself stepping into new opportunities that test both your patience and creativity. Relationships will play an important role in shaping your direction, offering lessons of compassion, trust, and mutual support. Career paths may open with surprising clarity, giving you the courage to pursue ideas you once thought impossible. Challenges could appear in the form of self-doubt or delays, but each obstacle is designed to strengthen your determination. Health and balance remain essential, reminding you to care for your body as you nurture your spirit. Financial growth is possible if you remain disciplined and trust the gradual process. A sense of purpose emerges when you align your daily choices with your inner values, creating harmony between what you do and who you truly are. Friendships and connections may deepen, providing inspiration and encouragement in times of uncertainty. Overall, this period calls for steady focus, gratitude, and openness to new experiences, guiding you to create a more meaningful and joyful life.`;
  }

  // Helper: calculate life path number from yyyy-mm-dd string
  function lifePathFromDob(dobString) {
    if (!dobString) return null;
    const digits = dobString.replace(/[^0-9]/g, "");
    if (digits.length !== 8) return null;
    let sum = digits.split("").reduce((acc, d) => acc + Number(d), 0);
    while (sum > 9) {
      sum = String(sum)
        .split("")
        .reduce((a, b) => a + Number(b), 0);
    }
    return sum; // 1..9
  }

  const liveResult = useMemo(() => {
    const lp = lifePathFromDob(dob);
    if (!lp) return { ready: false };
    const now = new Date();
    const bigPrediction = generateBigPrediction(lp);
    return {
      ready: true,
      message: bigPrediction,
      meta: {
        lifePath: lp,
        generatedAt: now.toISOString(),
      },
    };
  }, [dob]);

  function handleCopy() {
    const text = name
      ? `${name}, your prediction: ${liveResult.message}`
      : `Prediction: ${liveResult.message}`;
    navigator.clipboard?.writeText(text).then(
      () => alert("Copied to clipboard!"),
      () => alert("Copy failed — try selecting and copying manually.")
    );
  }

  function handleDownload() {
    const blob = new Blob([liveResult.message], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prediction.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-100">
        <header className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 rounded-lg bg-indigo-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold">✨</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Live DOB Prediction</h1>
            <p className="text-sm text-gray-500">Enter a date of birth to get a detailed personalised insight.</p>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Your name (optional)</label>
            <input
              type="text"
              placeholder="e.g., Akshay"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
            />

            <label className="block text-sm font-medium text-gray-700">Date of birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-200 outline-none"
            />

            <p className="text-xs text-gray-500 mt-1">We only compute the prediction locally in your browser — nothing is sent to a server.</p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-medium"
              >
                Copy
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow-sm hover:opacity-95"
              >
                Download
              </button>
            </div>
          </section>

          <aside className="rounded-xl p-4 border bg-gradient-to-br from-white to-slate-50 shadow-inner max-h-[400px] overflow-y-auto">
            <h2 className="text-lg font-semibold">Your detailed prediction</h2>

            {!liveResult.ready ? (
              <div className="mt-4 text-sm text-gray-500">Pick a valid date to see your prediction.</div>
            ) : (
              <div className="mt-4 space-y-3">
                <div className="rounded-lg p-4 bg-white border shadow-sm whitespace-pre-line text-sm leading-relaxed">
                  {name ? `${name},` : ""} {liveResult.message}
                </div>

                <div className="text-xs text-gray-500">
                  <div>Life path number: <span className="font-medium">{liveResult.meta.lifePath}</span></div>
                  <div>Generated at: <span className="font-medium">{new Date(liveResult.meta.generatedAt).toLocaleString()}</span></div>
                </div>
              </div>
            )}
          </aside>
        </main>

        <footer className="mt-6 text-center text-xs text-gray-400">
          Made by Akshay Koushik with love ❤️
        </footer>
      </div>
    </div>
  );
}
