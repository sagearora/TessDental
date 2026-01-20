import { Controller, Get, Query } from "@nestjs/common";
import { OperatoriesService } from "./operatories.service";

@Controller("v1/operatories")
export class OperatoriesController {
  constructor(private readonly operatoriesService: OperatoriesService) {}

  @Get()
  async findAll(@Query("clinic_id") clinicId: string) {
    const id = parseInt(clinicId, 10);
    if (isNaN(id)) {
      throw new Error("Invalid clinic_id");
    }
    return this.operatoriesService.findByClinicId(id);
  }
}
