import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type {
  AppointmentStatus,
  AppointmentTag,
  AppointmentWithRelations,
  Clinic,
  CreateAppointmentRequest,
  Patient,
  UpdateAppointmentRequest,
  User,
} from "@/api/types";
import { formatTime } from "@/lib/time";

const quickAppointmentSchema = z.object({
  type: z.enum(["appointment", "block"]),
  patient_id: z.number().optional().nullable(),
  provider_id: z.number().optional().nullable(),
  status_id: z.number(),
  title: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type QuickAppointmentFormData = z.infer<typeof quickAppointmentSchema>;

interface QuickCreateAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinic: Clinic;
  operatoryId: number;
  startTime: Date;
  endTime: Date;
  patients: Patient[];
  providers: User[];
  statuses: AppointmentStatus[];
  tags: AppointmentTag[];
  initialPatient?: Patient | null;
  appointment?: AppointmentWithRelations | null;
  onSubmit: (data: CreateAppointmentRequest | UpdateAppointmentRequest) => Promise<void>;
}

type ActiveField = "type" | "patient" | "provider" | "title" | null;

export function QuickCreateAppointmentModal({
  open,
  onOpenChange,
  clinic,
  operatoryId,
  startTime,
  endTime,
  patients,
  providers,
  statuses,
  tags,
  initialPatient,
  appointment,
  onSubmit,
}: QuickCreateAppointmentModalProps) {
  const isEdit = !!appointment;
  const defaultStatusId = statuses[0]?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<QuickAppointmentFormData>({
    resolver: zodResolver(quickAppointmentSchema),
    defaultValues: {
      type: "appointment",
      patient_id: initialPatient?.id ?? null,
      provider_id: null,
      status_id: defaultStatusId,
      title: null,
      notes: null,
    },
  });

  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);

  const type = watch("type");
  const patientId = watch("patient_id");
  const providerId = watch("provider_id");
  const title = watch("title");

  const selectedPatient = useMemo(
    () => (patientId ? patients.find((p) => p.id === patientId) : undefined),
    [patients, patientId],
  );

  const selectedProvider = useMemo(
    () => (providerId ? providers.find((p) => p.id === providerId) : undefined),
    [providers, providerId],
  );

  useEffect(() => {
    if (open) {
      if (appointment) {
        // Edit mode - populate with existing appointment data
        reset({
          type: appointment.type,
          patient_id: appointment.patient_id ?? null,
          provider_id: appointment.provider_id ?? null,
          status_id: appointment.status_id,
          title: appointment.title ?? null,
          notes: appointment.notes ?? null,
        });
        setPatientSearch(
          appointment.patient
            ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
            : ""
        );
        // Initialize selected tags from appointment
        setSelectedTagIds(
          appointment.tags?.map((tag) => tag.id) ?? []
        );
      } else {
        // Create mode
        reset({
          type: "appointment",
          patient_id: initialPatient?.id ?? null,
          provider_id: null,
          status_id: defaultStatusId,
          title: null,
          notes: null,
        });
        setPatientSearch("");
        setSelectedTagIds([]);
      }
      setActiveField(null);
      setShowTagsDropdown(false);
    }
  }, [open, initialPatient, defaultStatusId, reset, appointment]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!activeField && !showTagsDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside any dropdown
      if (!target.closest('.dropdown-container') && !target.closest('.tags-dropdown-container')) {
        setActiveField(null);
        setShowTagsDropdown(false);
      }
    };

    // Small delay to avoid immediate close when opening
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeField, showTagsDropdown]);

  const filteredPatients = useMemo(() => {
    const term = patientSearch.trim().toLowerCase();
    if (!term) return patients.slice(0, 10);
    return patients
      .filter((p) => {
        const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
        const chart = p.chart_no?.toLowerCase() ?? "";
        return fullName.includes(term) || chart.includes(term);
      })
      .slice(0, 10);
  }, [patients, patientSearch]);

  const handleFormSubmit = async (data: QuickAppointmentFormData) => {
    if (isEdit && appointment) {
      const lengthMinutes = Math.round(
        (endTime.getTime() - startTime.getTime()) / (1000 * 60),
      );

      const request: UpdateAppointmentRequest = {
        start_at: startTime.toISOString(),
        length_minutes: lengthMinutes,
        operatory_id: operatoryId,
        provider_id: data.provider_id ?? null,
        patient_id: data.patient_id ?? null,
        status_id: data.status_id,
        title: data.title ?? null,
        notes: data.notes ?? null,
        row_version: appointment.row_version,
        tag_ids: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      };

      await onSubmit(request);
    } else {
      const lengthMinutes = Math.round(
        (endTime.getTime() - startTime.getTime()) / (1000 * 60),
      );

      const request: CreateAppointmentRequest = {
        clinic_id: clinic.id,
        type: data.type,
        start_at: startTime.toISOString(),
        length_minutes: lengthMinutes,
        operatory_id: operatoryId,
        provider_id: data.provider_id ?? null,
        patient_id: data.patient_id ?? null,
        status_id: data.status_id,
        title: data.title ?? null,
        notes: data.notes ?? null,
        source: "front_desk",
        tag_ids: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      };

      await onSubmit(request);
    }
    reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const durationMinutes = Math.round(
    (endTime.getTime() - startTime.getTime()) / (1000 * 60),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] lg:w-[60vw] max-w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="text-sm text-gray-700 space-y-1">
            {/* First line: For appointments: Edit/Make a new [Type] for [Patient] | For blocks: Edit/Make a new block booking for [Description] */}
            {type === "appointment" ? (
              <>
                <div className="flex flex-wrap items-center justify-center gap-1">
                  <span>{isEdit ? "Edit an existing" : "Make a new"}</span>

                  {activeField === "type" ? (
                    <div className="relative inline-block dropdown-container">
                      <button
                        type="button"
                        className="h-7 px-2 text-sm border border-blue-500 rounded bg-white text-blue-600 font-medium min-w-[140px] text-left"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      >
                        Appointment
                      </button>
                      <div className="absolute z-20 mt-1 w-full overflow-y-auto rounded-md border bg-white shadow">
                        <button
                          type="button"
                          className="flex w-full items-center px-2 py-1 text-left text-xs hover:bg-blue-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setValue("type", "appointment");
                            setActiveField(null);
                          }}
                        >
                          Appointment
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center px-2 py-1 text-left text-xs hover:bg-blue-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setValue("type", "block");
                            setActiveField(null);
                          }}
                        >
                          Block booking
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={isEdit ? "font-semibold text-gray-800 hover:underline" : "text-blue-600 hover:underline font-medium"}
                      onClick={() => setActiveField("type")}
                    >
                      Appointment
                    </button>
                  )}

                  <span>for</span>
                  {activeField === "patient" ? (
                    <div className="relative inline-block dropdown-container">
                      <Input
                        autoFocus
                        className="h-7 px-2 pr-8 text-sm w-64"
                        placeholder="Search patient..."
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        onBlur={() => {
                          // Small timeout so clicks on the dropdown can register
                          setTimeout(() => setActiveField(null), 150);
                        }}
                      />
                      <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-white shadow">
                        {filteredPatients.length === 0 ? (
                          <div className="px-2 py-1 text-xs text-gray-500">
                            No patients found
                          </div>
                        ) : (
                          filteredPatients.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              className="flex w-full items-center justify-between px-2 py-1 text-left text-xs hover:bg-blue-50"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setValue("patient_id", p.id);
                                setPatientSearch("");
                                setActiveField(null);
                              }}
                            >
                              <span>
                                {p.first_name} {p.last_name}
                              </span>
                              {p.chart_no && (
                                <span className="ml-2 text-[10px] text-gray-500">
                                  {p.chart_no}
                                </span>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={isEdit ? "font-semibold text-gray-800 hover:underline" : "text-blue-600 hover:underline font-medium"}
                      onClick={() => {
                        setActiveField("patient");
                        setPatientSearch(
                          selectedPatient
                            ? `${selectedPatient.first_name} ${selectedPatient.last_name}`
                            : "",
                        );
                      }}
                    >
                      {selectedPatient
                        ? `${selectedPatient.first_name} ${selectedPatient.last_name}`
                        : "Select patient"}
                    </button>
                  )}
                </div>

                {/* Second line: with [Provider] at [Clinic] for [Description] */}
                <div className="flex flex-wrap items-center justify-center gap-1">
                  <span>with</span>

                  {activeField === "provider" ? (
                    <div className="relative inline-block dropdown-container">
                      <button
                        type="button"
                        className="h-7 px-2 text-sm border border-blue-500 rounded bg-white text-blue-600 font-medium min-w-[160px] text-left"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      >
                        {selectedProvider
                          ? `${selectedProvider.first_name} ${selectedProvider.last_name}`
                          : "No provider"}
                      </button>
                      <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-white shadow">
                        <button
                          type="button"
                          className="flex w-full items-center px-2 py-1 text-left text-xs hover:bg-blue-50"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setValue("provider_id", null);
                            setActiveField(null);
                          }}
                        >
                          No provider
                        </button>
                        {providers
                          .filter((p) => p.role === "provider")
                          .map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              className="flex w-full items-center px-2 py-1 text-left text-xs hover:bg-blue-50"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setValue("provider_id", p.id);
                                setActiveField(null);
                              }}
                            >
                              {p.first_name} {p.last_name}
                            </button>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() => setActiveField("provider")}
                    >
                      {selectedProvider
                        ? `${selectedProvider.first_name} ${selectedProvider.last_name}`
                        : "Choose provider"}
                    </button>
                  )}

                  <span>at</span>
                  <span className="font-semibold">{clinic.name}</span>
                  <span>for</span>

                  {activeField === "title" ? (
                    <Input
                      {...register("title")}
                      autoFocus
                      className="h-7 px-2 text-sm w-64"
                      placeholder="Reason / description"
                      onBlur={() => setActiveField(null)}
                    />
                  ) : (
                    <button
                      type="button"
                      className={`min-w-[6rem] text-left text-blue-600 hover:underline font-medium ${
                        title ? "" : "italic"
                      }`}
                      onClick={() => setActiveField("title")}
                    >
                      {title && title.trim().length > 0
                        ? title
                        : "add description"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Block booking: single line with description */
              <div className="flex flex-wrap items-center justify-center gap-1">
                <span>{isEdit ? "Edit an existing" : "Make a new"}</span>

                {activeField === "type" ? (
                  <div className="relative inline-block dropdown-container">
                    <button
                      type="button"
                      className="h-7 px-2 text-sm border border-blue-500 rounded bg-white text-blue-600 font-medium min-w-[140px] text-left"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    >
                      block booking
                    </button>
                    <div className="absolute z-20 mt-1 w-full overflow-y-auto rounded-md border bg-white shadow">
                      <button
                        type="button"
                        className="flex w-full items-center px-2 py-1 text-left text-xs hover:bg-blue-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setValue("type", "appointment");
                          setActiveField(null);
                        }}
                      >
                        Appointment
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center px-2 py-1 text-left text-xs hover:bg-blue-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setValue("type", "block");
                          setActiveField(null);
                        }}
                      >
                        Block booking
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={isEdit ? "font-semibold text-gray-800 hover:underline" : "text-blue-600 hover:underline font-medium"}
                    onClick={() => setActiveField("type")}
                  >
                    block booking
                  </button>
                )}

                <span>for</span>

                {activeField === "title" ? (
                  <Input
                    {...register("title")}
                    autoFocus
                    className="h-7 px-2 text-sm w-64"
                    placeholder="Description"
                    onBlur={() => setActiveField(null)}
                  />
                ) : (
                  <button
                    type="button"
                    className={`min-w-[6rem] text-left text-blue-600 hover:underline font-medium ${
                      title ? "" : "italic"
                    }`}
                    onClick={() => setActiveField("title")}
                  >
                    {title && title.trim().length > 0
                      ? title
                      : "add description"}
                  </button>
                )}
              </div>
            )}

            <div className="text-xs text-gray-500 text-center">
              {formatTime(startTime, clinic.timezone)} –{" "}
              {formatTime(endTime, clinic.timezone)} · {durationMinutes} min
            </div>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-2 pt-4">
            {/* Tags Section */}
            <div>
              <div className="py-1">
                <span className="text-xs font-medium text-gray-700">Tags</span>
              </div>
              <div className="pt-1 pb-1 pl-4">
                  <div className="relative tags-dropdown-container">
                    {/* Clickable Tag Display / Dropdown Trigger */}
                    <button
                      type="button"
                      onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                      className="text-left text-xs text-blue-600 px-2 py-1 rounded border border-transparent hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    >
                      {selectedTagIds.length > 0 ? (
                        <span className="flex flex-wrap items-center gap-1">
                          {selectedTagIds.map((tagId, index) => {
                            const tag = tags.find((t) => t.id === tagId);
                            if (!tag) return null;
                            return (
                              <span key={tag.id} className="inline-flex items-center gap-1">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor: tag.color || "#6b7280",
                                  }}
                                />
                                <span>{tag.name}</span>
                                {index < selectedTagIds.length - 1 && (
                                  <span className="text-gray-400">,</span>
                                )}
                              </span>
                            );
                          })}
                        </span>
                      ) : (
                        "Add tags"
                      )}
                    </button>

                    {/* Tags Dropdown */}
                    {showTagsDropdown && (
                      <div className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                        {tags
                          .filter((tag) => tag.is_active)
                          .map((tag) => {
                            const isSelected = selectedTagIds.includes(tag.id);
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-blue-50 transition-colors ${
                                  isSelected ? "bg-blue-50 border-l-2 border-blue-500" : ""
                                }`}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedTagIds((prev) =>
                                      prev.filter((id) => id !== tag.id)
                                    );
                                  } else {
                                    setSelectedTagIds((prev) => [...prev, tag.id]);
                                  }
                                }}
                              >
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor: tag.color || "#6b7280",
                                  }}
                                />
                                <span>{tag.name}</span>
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
            </div>

            {/* Procedures Section */}
            <div className="border-t border-gray-200">
              <div className="py-1">
                <span className="text-xs font-medium text-gray-700">Procedures</span>
              </div>
              <div className="pt-1 pb-1">
                <div className="text-sm text-gray-600">
                  Procedures content goes here
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="border-t border-gray-200">
              <div className="py-1">
                <span className="text-xs font-medium text-gray-700">Notes</span>
              </div>
              <div className="pt-1 pb-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  + Add Note
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save Changes"
                  : "Create appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

