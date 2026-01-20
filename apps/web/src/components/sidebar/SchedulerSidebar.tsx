import { useState } from "react";
import { CalendarComponent } from "@syncfusion/ej2-react-calendars";
import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/api/patients";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import type { Patient } from "@/api/types";

interface SchedulerSidebarProps {
  clinicId: number;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onPatientSelect?: (patient: Patient) => void;
  onCreatePatient?: () => void;
}

export function SchedulerSidebar({
  clinicId,
  selectedDate,
  onDateChange,
  onPatientSelect,
  onCreatePatient,
}: SchedulerSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ["patients", clinicId, searchQuery],
    queryFn: () => getPatients(clinicId, searchQuery),
    enabled: searchQuery.length > 0,
  });

  const handleDateChange = (args: any) => {
    if (args.value) {
      onDateChange(new Date(args.value));
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Patient Search Section */}
      <div className="p-4 border-b border-gray-200 relative">
        <div className="space-y-2">
          <div className="relative">
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
          <Button onClick={onCreatePatient} className="w-full">
            <Plus className="h-4 w-4 mr-1" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium mb-2">Jump to Date</h3>
        <CalendarComponent
          value={selectedDate}
          change={handleDateChange}
          cssClass="tessdental-calendar"
        />
      </div>

      {/* Additional sidebar content can go here */}
      <div className="flex-1 p-4">
        {/* Placeholder for future content */}
      </div>
    </div>
  );
}
