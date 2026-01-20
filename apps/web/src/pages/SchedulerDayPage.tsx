import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, addDays, subDays } from "date-fns";
import { DayScheduler } from "@/components/scheduler/DayScheduler";
import { CreatePatientModal } from "@/components/modals/CreatePatientModal";
import { CreateEditAppointmentModal } from "@/components/modals/CreateEditAppointmentModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import { getOperatories } from "@/api/operatories";
import { getPatients, createPatient } from "@/api/patients";
import { getAppointments, createAppointment, updateAppointment, cancelAppointment } from "@/api/appointments";
import { getAppointmentStatuses, getAppointmentConfirmations, getAppointmentTags } from "@/api/reference";
import type { AppointmentWithRelations, Clinic, Patient, User } from "@/api/types";
import { getWindowStart, getWindowEnd, formatDate, DEFAULT_DAY_START_HOUR, DEFAULT_DAY_END_HOUR } from "@/lib/time";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showCreatePatient, setShowCreatePatient] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithRelations | null>(null);
  const [selectionData, setSelectionData] = useState<{
    startTime: Date;
    endTime: Date;
    operatoryId: number;
  } | null>(null);

  const queryClient = useQueryClient();

  // Fetch data
  const { data: operatories = [] } = useQuery({
    queryKey: ["operatories", MOCK_CLINIC.id],
    queryFn: () => getOperatories(MOCK_CLINIC.id),
  });

  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patients", MOCK_CLINIC.id, searchQuery],
    queryFn: () => getPatients(MOCK_CLINIC.id, searchQuery),
    enabled: searchQuery.length > 0,
  });

  const windowStart = getWindowStart(selectedDate, MOCK_CLINIC.timezone, DEFAULT_DAY_START_HOUR);
  const windowEnd = getWindowEnd(selectedDate, MOCK_CLINIC.timezone, DEFAULT_DAY_END_HOUR);

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments", MOCK_CLINIC.id, selectedDate.toISOString()],
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

  const handleSelectionComplete = (selection: { startTime: Date; endTime: Date; operatoryId: number }) => {
    setSelectionData(selection);
    setShowAppointmentModal(true);
  };

  const handleAppointmentSubmit = async (data: any) => {
    if (editingAppointment) {
      await updateAppointmentMutation.mutateAsync({
        id: editingAppointment.id,
        data,
      });
    } else if (selectionData) {
      await createAppointmentMutation.mutateAsync({
        ...data,
        start_at: selectionData.startTime.toISOString(),
        length_minutes: Math.round(
          (selectionData.endTime.getTime() - selectionData.startTime.getTime()) / (1000 * 60)
        ),
        operatory_id: selectionData.operatoryId,
      });
    }
    setShowAppointmentModal(false);
    setEditingAppointment(null);
    setSelectionData(null);
  };

  const handleAppointmentMove = async (
    appointmentId: number,
    newStart: Date,
    newOperatoryId: number
  ) => {
    const appointment = appointments.find((a) => a.id === appointmentId);
    if (!appointment) return;

    await updateAppointmentMutation.mutateAsync({
      id: appointmentId,
      data: {
        start_at: newStart.toISOString(),
        operatory_id: newOperatoryId,
        row_version: appointment.row_version,
      },
    });
  };

  const handleEditAppointment = (appointment: AppointmentWithRelations) => {
    setEditingAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const handleCancelAppointment = async () => {
    if (editingAppointment) {
      await cancelAppointmentMutation.mutateAsync(editingAppointment.id);
      setShowAppointmentModal(false);
      setEditingAppointment(null);
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const goToPrevDay = () => {
    setSelectedDate((d) => subDays(d, 1));
  };

  const goToNextDay = () => {
    setSelectedDate((d) => addDays(d, 1));
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-40"
            />
            <div className="text-sm font-medium px-2">
              {formatDate(selectedDate, MOCK_CLINIC.timezone)}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div ref={searchRef} className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => {
                  if (searchQuery.length > 0) {
                    setShowSearchResults(true);
                  }
                }}
                className="pl-8"
              />
              {showSearchResults && searchQuery.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isLoadingPatients ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
                  ) : patients.length > 0 ? (
                    patients.map((patient) => (
                      <div
                        key={patient.id}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          // When clicking a patient, we could open a patient detail view or create an appointment
                          // For now, just clear the search
                          setSearchQuery("");
                          setShowSearchResults(false);
                        }}
                      >
                        <div className="font-medium text-sm">
                          {patient.first_name} {patient.last_name}
                        </div>
                        {patient.chart_no && (
                          <div className="text-xs text-gray-500">Chart: {patient.chart_no}</div>
                        )}
                        {patient.email && (
                          <div className="text-xs text-gray-500">{patient.email}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">No patients found</div>
                  )}
                </div>
              )}
            </div>
            <Button onClick={() => setShowCreatePatient(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Patient
            </Button>
          </div>
        </div>
      </div>

      {/* Scheduler */}
      <div className="flex-1 overflow-auto p-4">
        <DayScheduler
          clinic={MOCK_CLINIC}
          date={selectedDate}
          operatories={activeOperatories}
          appointments={appointments}
          onSelectionComplete={handleSelectionComplete}
          onAppointmentMove={handleAppointmentMove}
          onEditAppointment={handleEditAppointment}
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

      {showAppointmentModal && (
        <CreateEditAppointmentModal
          open={showAppointmentModal}
          onOpenChange={setShowAppointmentModal}
          clinicId={MOCK_CLINIC.id}
          operatoryId={editingAppointment?.operatory_id || selectionData?.operatoryId || activeOperatories[0]?.id || 0}
          startTime={editingAppointment ? new Date(editingAppointment.start_at) : selectionData?.startTime || new Date()}
          endTime={editingAppointment ? new Date(editingAppointment.end_at) : selectionData?.endTime || new Date()}
          timezone={MOCK_CLINIC.timezone}
          appointment={editingAppointment || undefined}
          patients={patients}
          providers={activeProviders}
          statuses={statuses}
          confirmations={confirmations}
          tags={tags}
          onSubmit={handleAppointmentSubmit}
          onCancel={editingAppointment ? handleCancelAppointment : undefined}
        />
      )}
    </div>
  );
}
