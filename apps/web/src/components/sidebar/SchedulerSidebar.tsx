import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/api/patients";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ChevronRight, User } from "lucide-react";
import type { Patient } from "@/api/types";
import { SidebarMiniCalendar } from "./SidebarMiniCalendar";

interface SchedulerSidebarProps {
  clinicId: number;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onPatientSelect?: (patient: Patient) => void;
  onCreatePatient?: () => void;
}

// Calculate age from date of birth
function calculateAge(dob: string | null): number | null {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Format date of birth for display
function formatDOB(dob: string | null): string | null {
  if (!dob) return null;
  const date = new Date(dob);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const PATIENT_MODULES = [
  "Profile",
  "Insurance",
  "Claims",
  "Billing",
  "Recare",
  "Charting",
  "Imaging",
  "Appointments",
  "Notes",
];

export function SchedulerSidebar({
  clinicId,
  selectedDate,
  onDateChange,
  onPatientSelect,
  onCreatePatient,
}: SchedulerSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patients", clinicId, searchQuery],
    queryFn: () => getPatients(clinicId, searchQuery),
    enabled: searchQuery.length > 0,
  });

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
    }
  };

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Patient Search Section */}
      <div className="p-3 border-b border-gray-200 relative">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
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
            className="pl-8 pr-10"
          />
          <button
            onClick={onCreatePatient}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors z-10"
            type="button"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {showSearchResults && searchQuery.length > 0 && (
          <div className="absolute z-50 w-[calc(100%-2rem)] mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {isLoadingPatients ? (
              <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
            ) : patients.length > 0 ? (
              patients.map((patient) => (
                <div
                  key={patient.id}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    setSelectedPatient(patient);
                    if (onPatientSelect) {
                      onPatientSelect(patient);
                    }
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

      {/* Patient Card or Empty State */}
      <div className="flex-1 overflow-y-auto">
        {selectedPatient ? (
          <>
            {/* Patient Identity Header Block */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-start gap-3">
                {/* Patient Avatar */}
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                {/* Patient Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {selectedPatient.first_name} {selectedPatient.last_name}
                  </h2>
                  {(selectedPatient.dob || selectedPatient.email) && (
                    <div className="mt-1 text-sm text-gray-600 space-y-0.5">
                      {selectedPatient.dob && (
                        <div>
                          {formatDOB(selectedPatient.dob)}
                          {calculateAge(selectedPatient.dob) !== null && (
                            <span className="ml-1">({calculateAge(selectedPatient.dob)} years old)</span>
                          )}
                        </div>
                      )}
                      {selectedPatient.email && (
                        <div className="truncate">{selectedPatient.email}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Patient Navigation List */}
            <div className="py-2">
              {PATIENT_MODULES.map((module) => (
                <button
                  key={module}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <ChevronRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span>{module}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="p-4 text-sm text-gray-500 text-center">
            Search for a patient to view their information
          </div>
        )}
      </div>

      {/* Calendar Section - positioned at bottom */}
      <div className="border-t border-gray-200">
        <SidebarMiniCalendar
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
}
