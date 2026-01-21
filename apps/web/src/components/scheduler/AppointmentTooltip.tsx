import React from "react";
import { formatTime } from "@/lib/time";
import type { AppointmentWithRelations, Patient, User } from "@/api/types";

interface AppointmentTooltipProps {
  appointment: AppointmentWithRelations;
  patient: Patient | undefined;
  provider: User | undefined;
  clinic: { name: string };
  x: number;
  y: number;
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

// Format date for display
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function AppointmentTooltip({
  appointment,
  patient,
  provider,
  clinic,
  x,
  y,
}: AppointmentTooltipProps) {
  const age = patient?.dob ? calculateAge(patient.dob) : null;
  const tags = appointment.tags || [];
  const procedures = ""; // TODO: Add procedures when available
  const revenue = ""; // TODO: Add revenue calculation when available

  // Adjust position to keep tooltip within viewport
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x, y });

  React.useEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let adjustedX = x;
      let adjustedY = y;

      // Adjust horizontal position
      if (x + rect.width > viewportWidth) {
        adjustedX = x - rect.width - 10; // Show on left side instead
      }
      if (adjustedX < 10) adjustedX = 10;

      // Adjust vertical position
      if (y + rect.height > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }
      if (adjustedY < 10) adjustedY = 10;

      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [x, y]);

  return (
    <div
      ref={tooltipRef}
      className="appointment-tooltip fixed z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseEnter={(e) => e.stopPropagation()}
    >
      <div className="text-sm font-semibold text-gray-900 mb-4">
        Appointment Summary for {patient ? `${patient.first_name} ${patient.last_name}` : "Unknown Patient"}
      </div>

      {/* Appointment Information */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-700 mb-2">Appointment Information</div>
        <div className="space-y-1 text-xs text-gray-600">
          {provider && (
            <div>
              <span className="font-medium">Provider:</span> {provider.first_name} {provider.last_name}
              {provider.role === "provider" && ", DDS"}
            </div>
          )}
          <div>
            <span className="font-medium">Clinic:</span> {clinic.name}
          </div>
          {appointment.title && (
            <div>
              <span className="font-medium">Description:</span> {appointment.title}
            </div>
          )}
          {tags.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Tags:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {tags.map((tag) => (
                  <span key={tag.id} className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tag.color || "#6b7280" }}
                    />
                    <span>{tag.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {procedures && (
            <div>
              <span className="font-medium">Procedures:</span> {procedures}
            </div>
          )}
          {revenue && (
            <div>
              <span className="font-medium">Revenue:</span> {revenue}
            </div>
          )}
          {appointment.status && (
            <div>
              <span className="font-medium">Status:</span> {appointment.status.name}
            </div>
          )}
          {appointment.confirmation && (
            <div>
              <span className="font-medium">Confirmation:</span> {appointment.confirmation.name}
            </div>
          )}
          <div>
            <span className="font-medium">Scheduled:</span> {formatDate(appointment.booked_at)}
            {appointment.booked_by_id && " by User"}
          </div>
          {appointment.last_modified_at && (
            <div>
              <span className="font-medium">Updated:</span> {formatDate(appointment.last_modified_at)}
              {appointment.last_modified_by_id && " by User"}
            </div>
          )}
        </div>
      </div>

      {/* Patient Information */}
      {patient && (
        <div>
          <div className="text-xs font-semibold text-gray-700 mb-2">Patient Information</div>
          <div className="space-y-1 text-xs text-gray-600">
            <div>
              <span className="font-medium">Head Of Household:</span> {patient.first_name} {patient.last_name}
            </div>
            {patient.responsible_party_id && (
              <div>
                <span className="font-medium">Responsible Party:</span> {patient.first_name} {patient.last_name}
              </div>
            )}
            {age !== null && (
              <div>
                <span className="font-medium">Age:</span> {age}
              </div>
            )}
            {/* TODO: Add phone numbers when available in Patient type */}
            {patient.preferred_contact_method && (
              <div>
                <span className="font-medium">Preferred Contact:</span>{" "}
                {patient.preferred_contact_method === "sms" ? "Cell phone" : patient.preferred_contact_method}
              </div>
            )}
            {patient.default_dentist_id && (
              <div>
                <span className="font-medium">Default Dentist:</span> {/* TODO: Get dentist name */}
              </div>
            )}
            {patient.default_hygienist_id && (
              <div>
                <span className="font-medium">Default Hygienist:</span> {/* TODO: Get hygienist name */}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
