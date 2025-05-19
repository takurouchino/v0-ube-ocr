"use server"

import type { InspectionData } from "@/types/inspection-data"

// モックデータストレージ（実際の実装ではSupabaseなどを使用）
const mockDataStorage: InspectionData[] = [
  {
    companyName: "サンプル株式会社",
    drawingNumber: "DRW-2023-001",
    partNumber: "PT-A123",
    partName: "フランジ",
    inspector: "山田太郎",
    comment: "初回検査",
    inspectionItems: [
      {
        target: "外径",
        symbol: "φA",
        dimension: "50.0",
        lowerTolerance: "-0.1",
        upperTolerance: "+0.1",
        minAllowableDimension: "49.9",
        quantity: "5",
        measurement1: "50.05",
        measurement2: "50.02",
        overallJudgment: "合格",
        judgment1: "合格",
        judgment2: "合格",
        remarks: "",
      },
      {
        target: "内径",
        symbol: "φB",
        dimension: "30.0",
        lowerTolerance: "-0.05",
        upperTolerance: "+0.05",
        minAllowableDimension: "29.95",
        quantity: "5",
        measurement1: "30.03",
        measurement2: "30.01",
        overallJudgment: "合格",
        judgment1: "合格",
        judgment2: "合格",
        remarks: "",
      },
    ],
    createdAt: "2023-04-15T09:30:00Z",
  },
  {
    companyName: "テスト工業",
    drawingNumber: "DRW-2023-002",
    partNumber: "PT-B456",
    partName: "シャフト",
    inspector: "佐藤次郎",
    comment: "量産検査",
    inspectionItems: [
      {
        target: "長さ",
        symbol: "L",
        dimension: "100.0",
        lowerTolerance: "-0.2",
        upperTolerance: "+0.2",
        minAllowableDimension: "99.8",
        quantity: "10",
        measurement1: "100.1",
        measurement2: "100.0",
        overallJudgment: "合格",
        judgment1: "合格",
        judgment2: "合格",
        remarks: "",
      },
    ],
    createdAt: "2023-04-20T14:15:00Z",
  },
]

export async function saveInspectionData(data: InspectionData): Promise<void> {
  // 実際の実装ではSupabaseなどにデータを保存
  // モックの実装ではメモリに保存
  const newData = {
    ...data,
    createdAt: new Date().toISOString(),
  }

  mockDataStorage.push(newData)

  // 非同期処理をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 500))

  return Promise.resolve()
}

export async function fetchInspectionDataList(): Promise<InspectionData[]> {
  // 実際の実装ではSupabaseなどからデータを取得
  // モックの実装ではメモリから取得

  // 非同期処理をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 500))

  return Promise.resolve([...mockDataStorage])
}
