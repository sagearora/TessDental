import { Controller, Get, Post, Body, Query } from "@nestjs/common";
import { PatientsService } from "./patients.service";

@Controller("v1/patients")
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async findAll(
    @Query("clinic_id") clinicId: string,
    @Query("query") query?: string
  ) {
    const id = parseInt(clinicId, 10);
    if (isNaN(id)) {
      throw new Error("Invalid clinic_id");
    }
    return this.patientsService.findByClinicId(id, query);
  }

  @Post()
  async create(@Body() createPatientDto: any) {
    return this.patientsService.create(createPatientDto);
  }
}
