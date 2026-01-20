import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CreatePatientRequest } from "@/api/types";

const patientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  chart_no: z.string().optional().nullable(),
  dob: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  preferred_contact_method: z.enum(["sms", "email", "phone"]).optional().nullable(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface CreatePatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicId: number;
  onSubmit: (data: CreatePatientRequest) => Promise<void>;
}

export function CreatePatientModal({
  open,
  onOpenChange,
  clinicId,
  onSubmit,
}: CreatePatientModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  const handleFormSubmit = async (data: PatientFormData) => {
    await onSubmit({
      clinic_id: clinicId,
      first_name: data.first_name,
      last_name: data.last_name,
      chart_no: data.chart_no || null,
      dob: data.dob || null,
      email: data.email || null,
      preferred_contact_method: data.preferred_contact_method || null,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Patient</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name *</label>
            <Input {...register("first_name")} />
            {errors.first_name && (
              <p className="text-sm text-red-500 mt-1">{errors.first_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name *</label>
            <Input {...register("last_name")} />
            {errors.last_name && (
              <p className="text-sm text-red-500 mt-1">{errors.last_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Chart Number</label>
            <Input {...register("chart_no")} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <Input type="date" {...register("dob")} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preferred Contact</label>
            <Select {...register("preferred_contact_method")}>
              <option value="">None</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Patient"}
            </Button>
          </div>
        </form>
        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
