import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Supabase Setup (Optional fallback to local JSON file if not configured)
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

const LOCAL_DB_PATH = path.join(process.cwd(), "data_registrations.json");

// Ensure local db exists if fallback is used
function getLocalRegistrations(): any[] {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initial = [
        {
          id: "ZTW-0001",
          full_name: "Aarav Sharma",
          phone_number: "9876543210",
          whatsapp_number: "9876543210",
          email: "aarav.sharma@example.com",
          institution_type: "College",
          institution_name: "IIT Madras",
          programming_experience: "Intermediate",
          laptop_available: "Yes",
          workshop_fee: 200,
          transaction_id: "UPI123456789",
          payment_screenshot: "",
          payment_status: "Verified",
          registration_status: "Confirmed",
          created_at: new Date().toISOString()
        }
      ];
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    const data = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveLocalRegistrations(regs: any[]) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(regs, null, 2));
  } catch (e) {
    console.error("Failed to save local db:", e);
  }
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", supabaseConnected: !!supabase });
});

// Get all registrations
app.get("/api/registrations", async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        return res.json(data);
      }
    }
    // Fallback
    const regs = getLocalRegistrations();
    regs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(regs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create registration
app.post("/api/registrations", async (req, res) => {
  try {
    const {
      full_name,
      phone_number,
      whatsapp_number,
      email,
      institution_type,
      institution_name,
      programming_experience,
      laptop_available,
      transaction_id,
      payment_screenshot
    } = req.body;

    if (!full_name || !phone_number || !email) {
      return res.status(400).json({ error: "Missing required fields (full_name, phone_number, email)" });
    }

    // Generate unique Registration ID ZTW-XXXX
    let allRegs: any[] = [];
    if (supabase) {
      const { data } = await supabase.from("registrations").select("id");
      if (data) allRegs = data;
    } else {
      allRegs = getLocalRegistrations();
    }

    const nextNum = allRegs.length + 1;
    const regId = `ZTW-${String(nextNum).padStart(4, "0")}`;

    const hasScreenshot = Boolean(payment_screenshot && payment_screenshot.trim().length > 0);
    const paymentStatus = hasScreenshot ? "Paid" : "Pending";
    const registrationStatus = "registered";

    const newRecord = {
      id: regId,
      full_name,
      phone_number,
      whatsapp_number: whatsapp_number || phone_number,
      email,
      institution_type: institution_type || "College",
      institution_name: institution_name || "N/A",
      programming_experience: programming_experience || "Beginner",
      laptop_available: laptop_available || "Yes",
      workshop_fee: 200,
      transaction_id: transaction_id || "N/A",
      payment_screenshot: payment_screenshot || "",
      payment_status: paymentStatus,
      registration_status: registrationStatus,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from("registrations").insert([newRecord]).select();
      if (error) {
        console.error("Supabase insert error, using local fallback:", error);
        const regs = getLocalRegistrations();
        regs.push(newRecord);
        saveLocalRegistrations(regs);
      } else if (data && data[0]) {
        return res.status(201).json(data[0]);
      }
    }

    // Fallback save
    const regs = getLocalRegistrations();
    regs.push(newRecord);
    saveLocalRegistrations(regs);

    res.status(201).json(newRecord);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Search registration by ID or phone number
app.get("/api/registrations/search", async (req, res) => {
  try {
    const query = (req.query.query as string || "").trim().toLowerCase();
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    let results: any[] = [];
    if (supabase) {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .or(`id.ilike.%${query}%,phone_number.ilike.%${query}%,email.ilike.%${query}%`);
      if (!error && data) {
        results = data;
      }
    }

    if (results.length === 0) {
      const regs = getLocalRegistrations();
      results = regs.filter(
        (r) =>
          r.id.toLowerCase().includes(query) ||
          r.phone_number.toLowerCase().includes(query) ||
          r.email.toLowerCase().includes(query)
      );
    }

    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment
app.patch("/api/registrations/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    if (supabase) {
      const { data, error } = await supabase
        .from("registrations")
        .update({ payment_status: "Verified", registration_status: "Confirmed" })
        .eq("id", id)
        .select();
      if (!error && data && data[0]) {
        return res.json(data[0]);
      }
    }

    const regs = getLocalRegistrations();
    const idx = regs.findIndex((r) => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Registration not found" });
    }
    regs[idx].payment_status = "Verified";
    regs[idx].registration_status = "Confirmed";
    saveLocalRegistrations(regs);
    res.json(regs[idx]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reject payment
app.patch("/api/registrations/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    if (supabase) {
      const { data, error } = await supabase
        .from("registrations")
        .update({ payment_status: "Rejected", registration_status: "Action Required" })
        .eq("id", id)
        .select();
      if (!error && data && data[0]) {
        return res.json(data[0]);
      }
    }

    const regs = getLocalRegistrations();
    const idx = regs.findIndex((r) => r.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Registration not found" });
    }
    regs[idx].payment_status = "Rejected";
    regs[idx].registration_status = "Action Required";
    saveLocalRegistrations(regs);
    res.json(regs[idx]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete registration
app.delete("/api/registrations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (supabase) {
      await supabase.from("registrations").delete().eq("id", id);
    }
    const regs = getLocalRegistrations();
    const filtered = regs.filter((r) => r.id !== id);
    saveLocalRegistrations(filtered);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD || "zentronix2026";
  if (password === adminPass) {
    res.json({ success: true, token: "zentronix-admin-session-token" });
  } else {
    res.status(401).json({ success: false, error: "Invalid admin password" });
  }
});

// Export CSV
app.get("/api/export-csv", async (req, res) => {
  try {
    let regs: any[] = [];
    if (supabase) {
      const { data } = await supabase.from("registrations").select("*").order("created_at", { ascending: false });
      if (data) regs = data;
    }
    if (regs.length === 0) {
      regs = getLocalRegistrations();
    }

    const headers = [
      "Registration ID",
      "Full Name",
      "Phone Number",
      "WhatsApp Number",
      "Email",
      "Institution Type",
      "Institution Name",
      "Programming Experience",
      "Laptop Available",
      "Workshop Fee",
      "Transaction ID",
      "Payment Status",
      "Registration Status",
      "Created At"
    ];

    const rows = regs.map((r) => [
      r.id,
      `"${r.full_name}"`,
      `"${r.phone_number}"`,
      `"${r.whatsapp_number}"`,
      `"${r.email}"`,
      `"${r.institution_type}"`,
      `"${r.institution_name}"`,
      `"${r.programming_experience}"`,
      `"${r.laptop_available}"`,
      r.workshop_fee,
      `"${r.transaction_id}"`,
      `"${r.payment_status}"`,
      `"${r.registration_status}"`,
      `"${r.created_at}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=zentronix_workshop_registrations.csv");
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite middleware for development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Zentronix Workshop Server running on http://localhost:${PORT}`);
  });
}

startServer();
