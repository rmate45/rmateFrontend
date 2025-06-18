import Image from "next/image";

export default function PropertyFeature({ icon, label }) {
  const getIcon = () => {
    switch (icon) {
      case "bed":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "bath":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "ruler":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "car":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "sparkles":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "flame":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "pawprint":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "utensils":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "refrigerator":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "microwave":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "droplet":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "waves":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      case "shield":
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
      default:
        return <Image width={16} height={16} alt="label" src="/paint.svg" />;
    }
  };

  return (
    <div className="flex items-center gap-1 py-1 px-2 shadow-xs rounded-2xl bg-gray-50">
      <div className="text-gray-600">{getIcon()}</div>
      <span className="text-xs text-subheadline font-medium">{label}</span>
    </div>
  );
}
