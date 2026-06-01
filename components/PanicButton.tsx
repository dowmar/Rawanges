"use client";

import { useEffect, useState } from "react";
import type { LatLng } from "../lib/types";

export function PanicButton({ userLocation }: { userLocation: LatLng | null }) {
  const [armed, setArmed] = useState(false);
  const [count, setCount] = useState(5);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!armed) return;
    if (count === 0) {
      void trigger();
      return;
    }
    const timer = window.setTimeout(() => setCount((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [armed, count]);

  function start() {
    setCount(5);
    setArmed(true);
    setMessage("Panic akan dikirim dalam 5 detik. Tekan batal kalau kepencet.");
  }

  function cancel() {
    setArmed(false);
    setCount(5);
    setMessage("Panic dibatalkan.");
  }

  async function trigger() {
    if (!userLocation) {
      setArmed(false);
      setMessage("Lokasi belum aktif. Izinkan GPS dulu agar panic bisa dikirim.");
      return;
    }
    setSending(true);
    const res = await fetch("/api/panic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userLocation, message: "User menekan panic button Rawanges" }),
    });
    setSending(false);
    setArmed(false);
    setCount(5);
    setMessage(res.ok ? "Panic event tersimpan. Integrasi WhatsApp/SMS bisa ditambah di production." : "Gagal mengirim panic event.");
  }

  return (
    <div className="panicBox">
      <h2>Panic Button</h2>
      <p>Gunakan hanya saat darurat. MVP ini menyimpan event; production bisa kirim live location ke kontak darurat.</p>
      <div className="toolbar">
        {!armed ? <button className="btn danger" onClick={start} disabled={sending}>Tahan / Kirim Panic</button> : <button className="btn secondary" onClick={cancel}>Batal ({count})</button>}
      </div>
      {message && <div className="status danger">{message}</div>}
    </div>
  );
}
