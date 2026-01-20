import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SchedulerMain } from "@/components/scheduler/SchedulerMain";
import { SchedulerSidebar } from "@/components/sidebar/SchedulerSidebar";
import { CreatePatientModal } from "@/components/modals/CreatePatientModal";
import { CreateEditAppointmentModal } from "@/components/modals/CreateEditAppointmentModal";
import { Select } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import { getOperatories } from "@/api/operatories";
import { getPatients, createPatient } from "@/api/patients";
import { getAppointments, createAppointment, updateAppointment, cancelAppointment } from "@/api/appointments";
import { getAppointmentStatuses, getAppointmentConfirmations, getAppointmentTags } from "@/api/reference";
import type { AppointmentWithRelations, Clinic, Patient, User } from "@/api/types";
import { syncfusionEventToCreateRequest, syncfusionEventToUpdateRequest } from "@/components/scheduler/syncfusionAdapters";
import { getDayStart } from "@/lib/time";

// Mock clinic - in real app, this would come from auth/context
const MOCK_CLINIC: Clinic = {
  id: 1,
  name: "Demo Clinic",
  timezone: "America/Toronto",
  unit_length_minutes: 15,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  row_version: 1,
};

export function SchedulerDayPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"Day" | "Week" | "WorkWeek" | "Month">("Day");
  const [showCreatePatient, setShowCreatePatient] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithRelations | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const queryClient = useQueryClient();

  // Fetch data
  const { data: operatories = [] } = useQuery({
    queryKey: ["operatories", MOCK_CLINIC.id],
    queryFn: () => getOperatories(MOCK_CLINIC.id),
  });

  // Calculate date range based on current view
  const getDateRange = () => {
    // Use timezone-aware date calculations
    const clinicTimezone = MOCK_CLINIC.timezone;
    
    if (currentView === "Week" || currentView === "WorkWeek") {
      // Get start of week (Sunday) in clinic timezone
      const startOfWeek = new Date(selectedDate);
      const day = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - day);
      const start = getDayStart(startOfWeek, clinicTimezone);
      
      // Get end of week (Saturday) in clinic timezone
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      const end = new Date(getDayStart(endOfWeek, clinicTimezone));
      end.setHours(23, 59, 59, 999);
      
      return { start, end };
    } else if (currentView === "Month") {
      // Get start of month in clinic timezone
      const startOfMonth = new Date(selectedDate);
      startOfMonth.setDate(1);
      const start = getDayStart(startOfMonth, clinicTimezone);
      
      // Get end of month in clinic timezone
      const endOfMonth = new Date(selectedDate);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      const end = new Date(getDayStart(endOfMonth, clinicTimezone));
      end.setHours(23, 59, 59, 999);
      
      return { start, end };
    } else {
      // Day view - get full day in clinic timezone
      const start = getDayStart(selectedDate, clinicTimezone);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      
      return { start, end };
    }
  };

  const { start: windowStart, end: windowEnd } = getDateRange();

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments", MOCK_CLINIC.id, windowStart.toISOString(), windowEnd.toISOString()],
    queryFn: async () => {
      const result = await getAppointments(MOCK_CLINIC.id, windowStart.toISOString(), windowEnd.toISOString());
      console.log("SchedulerDayPage - Fetched appointments:", result);
      return result;
    },
  });

  const { data: patients = [] } = useQuery({
    queryKey: ["patients", MOCK_CLINIC.id],
    queryFn: () => getPatients(MOCK_CLINIC.id),
  });

  const { data: statuses = [] } = useQuery({
    queryKey: ["appointment-statuses", MOCK_CLINIC.id],
    queryFn: () => getAppointmentStatuses(MOCK_CLINIC.id),
  });

  const { data: confirmations = [] } = useQuery({
    queryKey: ["appointment-confirmations", MOCK_CLINIC.id],
    queryFn: () => getAppointmentConfirmations(MOCK_CLINIC.id),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["appointment-tags", MOCK_CLINIC.id],
    queryFn: () => getAppointmentTags(MOCK_CLINIC.id),
  });

  // Enrich appointments with relations
  const appointmentsWithRelations = useMemo(() => {
    const enriched = appointments.map((apt) => ({
      ...apt,
      patient: apt.patient_id ? patients.find((p) => p.id === apt.patient_id) : undefined,
      status: statuses.find((s) => s.id === apt.status_id),
      confirmation: apt.confirmation_id ? confirmations.find((c) => c.id === apt.confirmation_id) : undefined,
    }));
    console.log("SchedulerDayPage - Enriched appointments:", enriched);
    return enriched;
  }, [appointments, patients, statuses, confirmations]);

  // Mutations
  const createPatientMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create patient: ${error.message}`);
    },
  });

  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create appointment: ${error.message}`);
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateAppointment(id, data),
    onSuccess: (result) => {
      console.log("Update mutation success, result:", result);
      // Invalidate and refetch appointments to show the updated data
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment updated successfully");
    },
    onError: (error: any) => {
      if (error.status === 409) {
        toast.error("Appointment was updated elsewhere. Please refresh.");
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
      } else {
        toast.error(`Failed to update appointment: ${error.message}`);
      }
    },
  });

  const cancelAppointmentMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Appointment cancelled");
    },
    onError: (error) => {
      toast.error(`Failed to cancel appointment: ${error.message}`);
    },
  });

  // Syncfusion event handlers
  const handleEventCreate = async (eventData: any) => {
    try {
      const request = syncfusionEventToCreateRequest(eventData, MOCK_CLINIC.id);
      await createAppointmentMutation.mutateAsync(request);
    } catch (error) {
      toast.error("Failed to create appointment");
      throw error;
    }
  };

  const handleEventChange = async (eventData: any) => {
    try {
      console.log("=== Handle Event Change ===");
      console.log("Event data from Syncfusion:", eventData);
      
      // Find the original appointment
      const appointment = appointmentsWithRelations.find((a) => a.id === eventData.Id);
      if (!appointment) {
        console.error("Appointment not found for ID:", eventData.Id);
        throw new Error("Appointment not found");
      }

      console.log("Original appointment:", appointment);
      const request = syncfusionEventToUpdateRequest(eventData, appointment);
      console.log("Update request:", request);
      
      const result = await updateAppointmentMutation.mutateAsync({
        id: appointment.id,
        data: request,
      });
      
      console.log("Update result:", result);
      console.log("=== End Event Change ===");
    } catch (error) {
      console.error("Event change error:", error);
      toast.error("Failed to update appointment");
      throw error;
    }
  };

  const handleEventRemove = async (eventId: number) => {
    try {
      await cancelAppointmentMutation.mutateAsync(eventId);
    } catch (error) {
      toast.error("Failed to cancel appointment");
      throw error;
    }
  };

  const handleEventClick = (appointment: AppointmentWithRelations) => {
    setEditingAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const handleAppointmentSubmit = async (data: any) => {
    if (editingAppointment) {
      await updateAppointmentMutation.mutateAsync({
        id: editingAppointment.id,
        data,
      });
    }
    setShowAppointmentModal(false);
    setEditingAppointment(null);
  };

  const handleCancelAppointment = async () => {
    if (editingAppointment) {
      await cancelAppointmentMutation.mutateAsync(editingAppointment.id);
      setShowAppointmentModal(false);
      setEditingAppointment(null);
    }
  };

  const activeOperatories = operatories.filter((o) => o.is_active && o.is_bookable);
  const activeProviders: User[] = []; // Would fetch from users API

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Select value={MOCK_CLINIC.id.toString()} className="w-48">
              <option value={MOCK_CLINIC.id.toString()}>{MOCK_CLINIC.name}</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Main content: Scheduler + Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Scheduler */}
        <div className="flex-1 min-w-0 flex flex-col" style={{ overflow: 'hidden', height: '100%' }}>
          <SchedulerMain
            clinic={MOCK_CLINIC}
            selectedDate={selectedDate}
            currentView={currentView}
            operatories={activeOperatories}
            appointments={appointmentsWithRelations}
            onEventCreate={handleEventCreate}
            onEventChange={handleEventChange}
            onEventRemove={handleEventRemove}
            onEventClick={handleEventClick}
            onDateChange={setSelectedDate}
            onViewChange={setCurrentView}
          />
        </div>

        {/* Sidebar */}
        <SchedulerSidebar
          clinicId={MOCK_CLINIC.id}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onPatientSelect={(patient) => {
            setSelectedPatient(patient);
            // Could open appointment modal with patient pre-selected
          }}
          onCreatePatient={() => setShowCreatePatient(true)}
        />
      </div>

      {/* Modals */}
      <CreatePatientModal
        open={showCreatePatient}
        onOpenChange={setShowCreatePatient}
        clinicId={MOCK_CLINIC.id}
        onSubmit={async (data) => {
          await createPatientMutation.mutateAsync(data);
        }}
      />

      {showAppointmentModal && editingAppointment && (
        <CreateEditAppointmentModal
          open={showAppointmentModal}
          onOpenChange={setShowAppointmentModal}
          clinicId={MOCK_CLINIC.id}
          operatoryId={editingAppointment.operatory_id}
          startTime={new Date(editingAppointment.start_at)}
          endTime={new Date(editingAppointment.end_at)}
          timezone={MOCK_CLINIC.timezone}
          appointment={editingAppointment}
          patients={[]} // Would fetch if needed
          providers={activeProviders}
          statuses={statuses}
          confirmations={confirmations}
          tags={tags}
          onSubmit={handleAppointmentSubmit}
          onCancel={handleCancelAppointment}
        />
      )}
    </div>
  );
}
