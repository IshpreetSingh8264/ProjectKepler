import { NextResponse } from "next/server";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Project Kepler API Documentation</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Detection API</h2>
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">POST /api/detection/process</h3>
              <p className="text-gray-300">Start a new object detection process</p>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Health Check</h2>
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">GET /api/health</h3>
              <p className="text-gray-300">Check API health status</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}