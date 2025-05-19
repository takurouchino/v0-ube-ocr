"use server"

import type { InspectionData } from "@/types/inspection-data"

export async function processImageWithOcr(file: File): Promise<InspectionData> {
  // Check if the file is an image
  if (!file.type.startsWith("image/")) {
    throw new Error("現在、画像ファイル（JPG, PNG）のみサポートしています。")
  }

  // ファイルをBase64エンコード
  const fileBuffer = await file.arrayBuffer()
  const base64Data = Buffer.from(fileBuffer).toString("base64")

  // 正しいMIMEタイプを使用
  const mimeType = file.type
  const base64Image = `data:${mimeType};base64,${base64Data}`

  try {
    // OpenAI APIを呼び出し
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
              あなたは検査成績表のOCR処理を行うAIアシスタントです。
              画像から以下の情報を抽出し、JSON形式で返してください。
              
              1. 概要情報:
                - 会社名
                - 図版番号
                - 品番
                - 品名
                - 担当者名
                - コメント
              
              2. 検査管理項目（複数行の表形式データ）:
                - 対象
                - 記号
                - 寸法値
                - 公差下限
                - 公差上限
                - 最小許容寸法
                - 個数
                - 実測計測1回目
                - 実測計測2回目
                - 全体判定
                - 1回目判定
                - 2回目判定
                - 備考
              
              データが見つからない場合は空文字列または0を返してください。
              
              必ず以下の形式のJSONのみを返してください。コメントや説明は不要です:
              {
                "companyName": "会社名",
                "drawingNumber": "図版番号",
                "partNumber": "品番",
                "partName": "品名",
                "inspector": "担当者名",
                "comment": "コメント",
                "inspectionItems": [
                  {
                    "target": "対象",
                    "symbol": "記号",
                    "dimension": "寸法値",
                    "lowerTolerance": "公差下限",
                    "upperTolerance": "公差上限",
                    "minAllowableDimension": "最小許容寸法",
                    "quantity": "個数",
                    "measurement1": "実測計測1回目",
                    "measurement2": "実測計測2回目",
                    "overallJudgment": "全体判定",
                    "judgment1": "1回目判定",
                    "judgment2": "2回目判定",
                    "remarks": "備考"
                  }
                ]
              }
            `,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "添付された検査成績表の画像から情報を抽出してJSON形式で返してください。マークダウンや説明は不要です。JSONのみを返してください。",
              },
              {
                type: "image_url",
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],
        max_tokens: 4000,
        temperature: 0.2,
      }),
    })

    // レスポンスのステータスコードをチェック
    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenAI API error response:", errorText)

      try {
        // JSONとしてパースできるか試みる
        const errorData = JSON.parse(errorText)
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`)
      } catch (parseError) {
        // JSONとしてパースできない場合はテキストをそのまま返す
        throw new Error(`OpenAI API error: ${errorText.substring(0, 100)}...`)
      }
    }

    // レスポンスをJSONとしてパース
    const result = await response.json()

    if (!result.choices || !result.choices[0] || !result.choices[0].message || !result.choices[0].message.content) {
      throw new Error("OpenAI APIからの応答が不正です")
    }

    const content = result.choices[0].message.content
    console.log("API Response content:", content)

    // JSONを抽出して解析
    try {
      // JSON文字列を抽出（マークダウンコードブロック内にある場合も対応）
      let jsonString = content

      // マークダウンのコードブロックからJSONを抽出
      const jsonBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      if (jsonBlockMatch && jsonBlockMatch[1]) {
        jsonString = jsonBlockMatch[1].trim()
      }

      // 単純なJSONオブジェクトの場合
      if (!jsonString.startsWith("{")) {
        const jsonMatch = content.match(/(\{[\s\S]*\})/)
        if (jsonMatch && jsonMatch[1]) {
          jsonString = jsonMatch[1].trim()
        }
      }

      console.log("Extracted JSON string:", jsonString)

      // JSONをパース
      const parsedData = JSON.parse(jsonString)

      // データを整形
      const inspectionData: InspectionData = {
        companyName: parsedData.companyName || "",
        drawingNumber: parsedData.drawingNumber || "",
        partNumber: parsedData.partNumber || "",
        partName: parsedData.partName || "",
        inspector: parsedData.inspector || "",
        comment: parsedData.comment || "",
        inspectionItems: Array.isArray(parsedData.inspectionItems) ? parsedData.inspectionItems : [],
        createdAt: new Date().toISOString(),
      }

      // 検査項目がない場合は空の配列を設定
      if (!inspectionData.inspectionItems || inspectionData.inspectionItems.length === 0) {
        inspectionData.inspectionItems = [
          {
            target: "",
            symbol: "",
            dimension: "",
            lowerTolerance: "",
            upperTolerance: "",
            minAllowableDimension: "",
            quantity: "",
            measurement1: "",
            measurement2: "",
            overallJudgment: "",
            judgment1: "",
            judgment2: "",
            remarks: "",
          },
        ]
      }

      return inspectionData
    } catch (error) {
      console.error("JSON解析エラー:", error, "元のコンテンツ:", content)

      // デモ用のダミーデータを返す
      return {
        companyName: "サンプル株式会社",
        drawingNumber: "DRW-2023-001",
        partNumber: "PT-A123",
        partName: "フランジ",
        inspector: "山田太郎",
        comment: "OCR処理に失敗しました。これはサンプルデータです。",
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
        ],
        createdAt: new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error("OCR処理エラー:", error)

    if (error instanceof Error) {
      throw error
    } else {
      throw new Error("OCR処理中に不明なエラーが発生しました")
    }
  }
}
