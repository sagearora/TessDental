import { Controller, Get, Post, Patch, Body, Param, Query } from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";

@Controller("v1/appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAll(
    @Query("clinic_id") clinicId: string,
    @Query("start") start: string,
    @Query("end") end: string
  ) {
    const id = parseInt(clinicId, 10);
    if (isNaN(id)) {
      throw new Error("Invalid clinic_id");
    }
    return this.appointmentsService.findByClinicAndDateRange(id, start, end);
  }

  @Post()
  async create(@Body() createAppointmentDto: any) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateAppointmentDto: any) {
    return this.appointmentsService.update(parseInt(id, 10), updateAppointmentDto);
  }

  @Post(":id/cancel")
  async cancel(@Param("id") id: string) {
    return this.appointmentsService.cancel(parseInt(id, 10));
  }
}
