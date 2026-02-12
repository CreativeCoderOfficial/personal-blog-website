export default function DonateBox() {
  return (
    <div className="
      p-6 rounded-2xl
      bg-gradient-to-br from-secondary to-main
      border border-border-subtle
    ">
        {/* Title & little prompt*/}
      <h4 className="font-bold text-text-primary mb-2">
        Find this useful?
      </h4>
      <p className="text-xs text-text-secondary mb-4">
        Support the blog or follow me for more daily tips.
      </p>
      {/* Donate and Follow button */}
      <div className="flex gap-3">
          <button className="flex-1 py-2 rounded-lg bg-accent-orange text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-lg shadow-accent-orange/20">
            Donate
          </button>
          <button className="flex-1 py-2 rounded-lg bg-white/5 border border-border-subtle text-text-primary text-xs font-bold hover:bg-white/10 transition-colors">
            Follow
          </button>
      </div>
    </div>
  );
}