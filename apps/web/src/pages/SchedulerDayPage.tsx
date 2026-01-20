import { useState } from "react";
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
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);

    if (currentView === "Week" || currentView === "WorkWeek") {
      // Get start of week (Sunday)
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      // Get end of week (Saturday)
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (currentView === "Month") {
      // Get start of month
      start.setDate(1);
      // Get end of month
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
    } else {
      // Day view
      end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  };

  const { start: windowStart, end: windowEnd } = getDateRange();

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments", MOCK_CLINIC.id, windowStart.toISOString(), windowEnd.toISOString()],
    queryFn: () => getAppointments(MOCK_CLINIC.id, windowStart.toISOString(), windowEnd.toISOString()),
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
    onSuccess: () => {
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
      // Find the original appointment
      const appointment = appointments.find((a) => a.id === eventData.Id);
      if (!appointment) {
        throw new Error("Appointment not found");
      }

      const request = syncfusionEventToUpdateRequest(eventData, appointment);
      await updateAppointmentMutation.mutateAsync({
        id: appointment.id,
        data: request,
      });
    } catch (error) {
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
      <div className="bg-white border-b border-gray-200 px-4 py-3">
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
        <div className="flex-1 min-w-0 flex flex-col p-4">
          <SchedulerMain
            clinic={MOCK_CLINIC}
            selectedDate={selectedDate}
            currentView={currentView}
            operatories={activeOperatories}
            appointments={appointments}
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
