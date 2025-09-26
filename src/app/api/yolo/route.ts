import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    const forwardForm = new FormData();
    forwardForm.append("file", file, (file as any).name ?? "upload.jpg");

    const pyUrl = process.env.PYTHON_YOLO_URL ?? "http://127.0.0.1:8000/predict";

    const pyRes = await fetch(pyUrl, {
      method: "POST",
      body: forwardForm,
    });

    if (!pyRes.ok) {
      const txt = await pyRes.text();
      return NextResponse.json({ error: txt }, { status: pyRes.status });
    }

    const result = await pyRes.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "YOLO proxy error", details: String(error) }, { status: 500 });
  }
}
