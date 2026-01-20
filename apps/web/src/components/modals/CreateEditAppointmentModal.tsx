import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type {
  AppointmentWithRelations,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  Patient,
  User,
} from "@/api/types";
import { formatTime } from "@/lib/time";

const appointmentSchema = z.object({
  type: z.enum(["appointment", "block"]),
  patient_id: z.number().optional().nullable(),
  provider_id: z.number().optional().nullable(),
  status_id: z.number(),
  confirmation_id: z.number().optional().nullable(),
  title: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface CreateEditAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicId: number;
  operatoryId: number;
  startTime: Date;
  endTime: Date;
  timezone: string;
  appointment?: AppointmentWithRelations;
  patients: Patient[];
  providers: User[];
  statuses: Array<{ id: number; name: string; color: string | null }>;
  confirmations: Array<{ id: number; name: string }>;
  tags: Array<{ id: number; name: string; color: string | null }>;
  onSubmit: (data: CreateAppointmentRequest | UpdateAppointmentRequest) => Promise<void>;
  onCancel?: () => Promise<void>;
}

export function CreateEditAppointmentModal({
  open,
  onOpenChange,
  clinicId,
  operatoryId,
  startTime,
  endTime,
  timezone,
  appointment,
  patients,
  providers,
  statuses,
  confirmations,
  tags,
  onSubmit,
  onCancel,
}: CreateEditAppointmentModalProps) {
  const isEdit = !!appointment;
  const defaultStatus = statuses[0]?.id;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      type: appointment?.type || "appointment",
      patient_id: appointment?.patient_id || null,
      provider_id: appointment?.provider_id || null,
      status_id: appointment?.status_id || defaultStatus,
      confirmation_id: appointment?.confirmation_id || null,
      title: appointment?.title || null,
      notes: appointment?.notes || null,
    },
  });

  const appointmentType = watch("type");

  const handleFormSubmit = async (data: AppointmentFormData) => {
    if (isEdit && appointment) {
      await onSubmit({
        ...data,
        row_version: appointment.row_version,
      } as UpdateAppointmentRequest);
    } else {
      await onSubmit({
        clinic_id: clinicId,
        operatory_id: operatoryId,
        start_at: startTime.toISOString(),
        length_minutes: Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)),
        ...data,
        source: "front_desk",
      } as CreateAppointmentRequest);
    }
    reset();
    onOpenChange(false);
  };

  const handleCancel = async () => {
    if (onCancel && appointment) {
      await onCancel();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Appointment" : "Create Appointment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="text-sm text-gray-600">
            <div>Time: {formatTime(startTime, timezone)} - {formatTime(endTime, timezone)}</div>
            <div>Duration: {Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))} minutes</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Select {...register("type")}>
              <option value="appointment">Appointment</option>
              <option value="block">Block</option>
            </Select>
          </div>

          {appointmentType === "appointment" && (
            <div>
              <label className="block text-sm font-medium mb-1">Patient</label>
              <Select
                {...register("patient_id", {
                  setValueAs: (v) => (v === "" ? null : parseInt(v)),
                })}
              >
                <option value="">Select patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name}
                    {p.chart_no && ` (${p.chart_no})`}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {appointmentType === "block" && (
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input {...register("title")} placeholder="Block title" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Provider</label>
            <Select
              {...register("provider_id", {
                setValueAs: (v) => (v === "" ? null : parseInt(v)),
              })}
            >
              <option value="">No provider</option>
              {providers
                .filter((p) => p.role === "provider")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name}
                  </option>
                ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <Select
              {...register("status_id", {
                setValueAs: (v) => parseInt(v),
              })}
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirmation</label>
            <Select
              {...register("confirmation_id", {
                setValueAs: (v) => (v === "" ? null : parseInt(v)),
              })}
            >
              <option value="">Unconfirmed</option>
              {confirmations.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Input {...register("notes")} placeholder="Appointment notes" />
          </div>

          {isEdit && appointment && (
            <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
              <div>Booked: {formatTime(appointment.booked_at, timezone)}</div>
              {appointment.last_modified_at && (
                <div>Last modified: {formatTime(appointment.last_modified_at, timezone)}</div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            {isEdit && onCancel && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel Appointment
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Appointment"}
            </Button>
          </div>
        </form>
        <DialogClose onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
