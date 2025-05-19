export interface InspectionItem {
  target: string
  symbol: string
  dimension: string
  lowerTolerance: string
  upperTolerance: string
  minAllowableDimension: string
  quantity: string
  measurement1: string
  measurement2: string
  overallJudgment: string
  judgment1: string
  judgment2: string
  remarks: string
}

export interface InspectionData {
  companyName: string
  drawingNumber: string
  partNumber: string
  partName: string
  inspector: string
  comment: string
  inspectionItems: InspectionItem[]
  createdAt: string
}
