"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileSearch, AlertCircle, BrainCircuit, CheckCircle2 } from "lucide-react"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    setResult(null)
    setError("")
    setPreview(URL.createObjectURL(selected))
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an MRI image first.")
      return
    }

    try {
      setLoading(true)
      setError("")
      const formData = new FormData()
      formData.append("file", file)


      const res = await fetch(`${process.env.ENDPOINT_URL}/predict`, {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || data.success === false) throw new Error(data.error || "Prediction failed")
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Connection error to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Background Animation Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <BrainCircuit className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Alzheimer Detection <span className="text-blue-500">AI</span>
          </h1>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
            Advanced MRI analysis using Deep Learning & Grad-CAM visualization for medical decision support.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Side: Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" /> Upload MRI Scan
            </h2>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`group relative border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer text-center
                ${preview ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/50'}`}
            >
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleSelectFile} />

              {preview ? (
                <div className="space-y-4">
                  <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-lg shadow-lg border border-slate-700" />
                  <p className="text-sm text-blue-400 font-medium">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium">Drop MRI image here</p>
                    <p className="text-slate-500 text-sm mt-1">Supports JPG, PNG or DICOM</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`w-full mt-8 py-4 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                ${loading || !file
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:scale-[0.98]'}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                <>Analyze Scan <CheckCircle2 className="w-5 h-5" /></>
              )}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" /> {error}
              </motion.div>
            )}
          </motion.div>

          {/* Right Side: Results Section */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl space-y-6"
                >
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-emerald-400" /> Analysis Report
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                      <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">Diagnosis</p>
                      <p className="text-2xl font-bold text-emerald-400 mt-1">{result.class}</p>
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
                      <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">Confidence</p>
                      <p className="text-2xl font-bold text-blue-400 mt-1">{(result.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      className="bg-blue-500 h-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Grad-CAM Heatmap</h3>
                    <div className="relative group overflow-hidden rounded-2xl border border-slate-700 shadow-inner bg-slate-900">
                      <img
                        src={result.image_url}
                        alt="Heatmap"
                        className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      * The heatmap indicates regions in the MRI that influenced the AI model's decision.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600 p-8 text-center"
                >
                  <div className="w-20 h-20 bg-slate-800/30 rounded-full flex items-center justify-center mb-4">
                    <FileSearch className="w-10 h-10 opacity-20" />
                  </div>
                  <p className="text-lg">Waiting for MRI analysis...</p>
                  <p className="text-sm">Results and heatmap will appear here after processing.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}