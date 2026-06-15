interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function LoadingSpinner({
  size = 'md',
  label = 'Loading...',
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col justify-center items-center py-12 gap-3">
      <div
        className={`animate-spin rounded-full border-gray-200 border-t-blue-600 ${sizeMap[size]}`}
        role="status"
        aria-label={label}
      />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
