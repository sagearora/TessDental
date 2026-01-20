import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { DatabaseService } from "./database.service";
import { OperatoriesController } from "./operatories/operatories.controller";
import { OperatoriesService } from "./operatories/operatories.service";
import { PatientsController } from "./patients/patients.controller";
import { PatientsService } from "./patients/patients.service";
import { AppointmentsController } from "./appointments/appointments.controller";
import { AppointmentsService } from "./appointments/appointments.service";
import { ReferenceController } from "./reference/reference.controller";
import { ReferenceService } from "./reference/reference.service";

@Module({
  controllers: [
    HealthController,
    OperatoriesController,
    PatientsController,
    AppointmentsController,
    ReferenceController,
  ],
  providers: [
    DatabaseService,
    OperatoriesService,
    PatientsService,
    AppointmentsService,
    ReferenceService,
  ],
})
export class AppModule {}
