import Image from "next/image";

const UserCard = ({ name, userId, imageUrl }) => {
  return (
    <div className="flex items-center bg-white p-6 rounded-lg shadow-sm">
      <img
        src={imageUrl}
        alt={name}
        className="w-12 h-12 rounded-full object-cover mr-4"
      />
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-dark poppins">{name}</span>
        <div className="flex gap-1 items-center text-sm font-medium text-subheadline mt-1">
          <span>{userId}</span>
          <Image src="/copy.svg" alt="copy" width={16} height={16} />
        </div>
      </div>
    </div>
  );
};

export default UserCard;
