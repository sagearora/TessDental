import { Controller, Get, Query } from "@nestjs/common";
import { ReferenceService } from "./reference.service";

@Controller("v1")
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get("appointment-statuses")
  async getStatuses(@Query("clinic_id") clinicId: string) {
    const id = parseInt(clinicId, 10);
    if (isNaN(id)) {
      throw new Error("Invalid clinic_id");
    }
    return this.referenceService.getStatuses(id);
  }

  @Get("appointment-confirmations")
  async getConfirmations(@Query("clinic_id") clinicId: string) {
    const id = parseInt(clinicId, 10);
    if (isNaN(id)) {
      throw new Error("Invalid clinic_id");
    }
    return this.referenceService.getConfirmations(id);
  }

  @Get("appointment-tags")
  async getTags(@Query("clinic_id") clinicId: string) {
    const id = parseInt(clinicId, 10);
    if (isNaN(id)) {
      throw new Error("Invalid clinic_id");
    }
    return this.referenceService.getTags(id);
  }
}
