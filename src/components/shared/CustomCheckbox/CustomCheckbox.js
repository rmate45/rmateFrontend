import Image from "next/image";

export default function CustomCheckbox({
  id,
  label,
  checked,
  onChange,
  labelClassName = "text-sm text-[#4B4B4B]",
}) {
  return (
    <div className="flex items-center">
      <label className="flex items-center cursor-pointer relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-primary checked:border-primary"
        />
        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/checkbox.svg"
            alt="checkbox"
            width={25}
            height={25}
          />
        </span>
      </label>
      <label htmlFor={id} className={`ml-2 cursor-pointer ${labelClassName}`}>
        {label}
      </label>
    </div>
  );
}
