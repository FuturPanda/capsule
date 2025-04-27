export class OrganizationModel {
  id: number;
  name?: string;
  zip_code?: string;
  vat_number?: string;
  client_id?: number;
}

export class EmployeeOrganizationModel {
  employee_id: number;
  organization_id: number;
}
