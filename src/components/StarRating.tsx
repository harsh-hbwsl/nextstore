interface StarRatingProps {
  rating: number;
  count: number;
}

export default function StarRating({ rating, count }: StarRatingProps) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.4;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex" aria-label={`Rating: ${rating} out of 5`}>
        {Array.from({ length: full }).map((_, i) => (
          <span key={`f${i}`} className="text-yellow-400 text-sm leading-none">
            ★
          </span>
        ))}
        {half && (
          <span className="text-yellow-300 text-sm leading-none">★</span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={`e${i}`} className="text-gray-300 text-sm leading-none">
            ★
          </span>
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {rating.toFixed(1)} ({count.toLocaleString()})
      </span>
    </div>
  );
}
