export type ConnectionStatus = 'ONLINE' | 'OFFLINE' | 'NEVER_CONNECTED';

export interface IotMachineStatus {
  id?: string;
  machineId: string;
  machineCode: string;
  machineName?: string;
  franchiseId?: string;
  franchiseName?: string;
  outletName?: string;
  deviceId: string;
  lastSeenAt?: string | null;
  minutesSinceLastSeen?: number | null;
  connectionStatus: ConnectionStatus;
  active?: boolean;
}

export interface IotMachineStatusFilters {
  franchiseId?: string;
  connectionStatus?: ConnectionStatus | 'ALL';
  search?: string;
  page?: number;
  size?: number;
}

export interface IotEventItem {
  id?: string;
  itemType: string; // 'SYRUP' | 'RAW_SODA' | etc.
  itemCode: string;
  itemName: string;
  lineNumber?: number;
  quantityMl: number;
}

export interface IotEvent {
  id: string;
  eventId?: string;
  eventTime: string;
  receivedAt: string;
  franchiseId?: string;
  franchiseName?: string;
  machineId?: string;
  machineCode?: string;
  machineName?: string;
  deviceId: string;
  eventType: string; // 'DRINK_DISPENSED' | 'HEARTBEAT'
  drinkName?: string;
  syrupUsageMl: number;
  rawSodaUsageMl: number;
  status: string; // 'PROCESSED' | 'SUCCESS' | 'ERROR'
  items?: IotEventItem[];
  rawPayload?: Record<string, any> | string;
}

export interface IotEventFilters {
  franchiseId?: string;
  machineId?: string;
  deviceId?: string;
  eventType?: string;
  status?: string;
  productId?: string;
  fromDateTime?: string;
  toDateTime?: string;
  page?: number;
  size?: number;
}

export type ManualSalesQuantityUnit = 'GLASSES' | 'ML';

export interface ManualDailySales {
  id: string;
  salesDate: string; // YYYY-MM-DD
  franchiseId: string;
  franchiseName?: string;
  machineId: string;
  machineCode: string;
  machineName?: string;
  productId: string;
  productName?: string;
  flavourName: string;
  quantity: number;
  quantityUnit: ManualSalesQuantityUnit;
  notes?: string;
  enteredBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ManualDailySalesFormData {
  franchiseId?: string;
  machineId: string;
  productId: string;
  salesDate: string;
  quantity: number | string;
  quantityUnit: ManualSalesQuantityUnit;
  notes?: string;
}

export interface ManualDailySalesFilters {
  franchiseId?: string;
  machineId?: string;
  productId?: string;
  quantityUnit?: ManualSalesQuantityUnit | 'ALL';
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export type ConsumptionSource = 'IOT' | 'MANUAL' | 'ALL';

export interface FlavourUsage {
  productId?: string;
  flavourId?: string;
  flavourName: string;
  productName?: string;
  itemCode?: string;
  iotSyrupUsageMl: number;
  percentage?: number;
  manualGlasses?: number;
  manualGlassesUsage?: number;
  manualMl?: number;
  manualMlUsage?: number;
}

export interface MachineUsage {
  machineId: string;
  machineCode: string;
  machineName?: string;
  franchiseName?: string;
  syrupUsageMl?: number;
  iotSyrupUsageMl?: number;
  rawSodaUsageMl?: number;
  iotRawSodaUsageMl?: number;
  manualGlassesUsage?: number;
  manualMlUsage?: number;
}

export interface ConsumptionSummary {
  totalIotSyrupMl: number;
  totalIotRawSodaMl: number;
  totalManualGlasses: number;
  totalManualMl: number;
  flavourUsages: FlavourUsage[];
  machineUsages: MachineUsage[];
  source: ConsumptionSource;
}

export interface ConsumptionReportFilters {
  franchiseId?: string;
  machineId?: string;
  productId?: string;
  fromDate?: string;
  toDate?: string;
  source?: ConsumptionSource;
}
