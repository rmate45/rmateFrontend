"use client";
import {
  useGetAdminByIdQuery,
  useUpdateAdminMutation,
} from "@/apis/admin/adminApi";
import ProfileCard from "@/components/cards/ProfileCard/ProfileCard";
import RadioGroup from "@/components/form/RadioGroup/RadioGroup";
import StatusDropdown from "@/components/shared/StatusDropdown/StatusDropdown";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminDetailPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const { data, isLoading, isError } = useGetAdminByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const admin = data?.data;

  const [
    updateAdmin,
    { isLoading: updatingAdminLoading, isSuccess, isError: updatingAdminError },
  ] = useUpdateAdminMutation();

  const [status, setStatus] = useState("Active");
  const [external, setExternal] = useState("no");

  // Sync local state with fetched admin data
  useEffect(() => {
    if (admin) {
      setStatus(admin.status === 1 ? "Active" : "Deactive");
      setExternal(admin.external === 1 ? "yes" : "no");
    }
  }, [admin]);

  const triggerUpdate = async (newStatus = status, newExternal = external) => {
    const formData = new FormData();
    formData.append("status", newStatus === "Active" ? "1" : "0");
    formData.append("external", newExternal === "yes" ? "1" : "0");

    try {
      await updateAdmin({ id, data: formData }).unwrap();
      // Optionally show toast or success feedback
    } catch (error) {
      console.error("Failed to update admin", error);
      // Optionally show error feedback
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    await triggerUpdate(newStatus, external);
  };

  const handleExternalChange = async (e) => {
    const newExternal = e;
    setExternal(newExternal);
    await triggerUpdate(status, newExternal);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !admin) return <div>Failed to load admin details</div>;

  return (
    <div className="mx-auto w-full bg-transparent overflow-hidden">
      <div className="flex flex-col md:flex-row gap-4">
        <ProfileCard
          name={`${admin.first_name} ${admin.last_name}`}
          employeeId={`${admin.username}`}
          imageUrl={admin.profile_picture.url}
          phone={admin.phone_number}
          email={admin.email}
          onEdit={() => router.push(`/admin/${admin.id}/edit`)}
          onCopy={() => navigator.clipboard.writeText(`${admin.username}`)}
        />

        <div className="p-4 flex-1 bg-white rounded-lg shadow-sm poppins h-fit">
          <h1 className="text-lg font-medium text-dark mb-4">
            Employee Details
          </h1>

          <div className="grid grid-cols-1 gap-y-2 gap-x-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-dark">Employee status</span> -
                <StatusDropdown
                  value={status}
                  options={["Active", "Deactive"]}
                  onChange={handleStatusChange}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-dark">Joining Date</span> -
                <span className="text-sm text-subheadline">
                  {admin.created_at?.split(" ")[0]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-dark">Job</span> -
                <span className="text-sm text-subheadline">
                  {admin.job_title}
                </span>
              </div>

              <div className="flex flex-col items-start gap-2">
                <span className="text-sm text-dark">External</span>
                <RadioGroup
                  label=""
                  name="externalEmployee"
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  value={external}
                  onChange={handleExternalChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
