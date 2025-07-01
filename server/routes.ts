import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User management routes
  app.get("/api/user/:firebaseUid", async (req, res) => {
    try {
      const { firebaseUid } = req.params;
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid user data", 
          details: validation.error.issues 
        });
      }

      const existingUser = await storage.getUserByEmail(validation.data.email);
      if (existingUser) {
        return res.status(409).json({ error: "User with this email already exists" });
      }

      const user = await storage.createUser(validation.data);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/user/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validation = insertUserSchema.partial().safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid user data", 
          details: validation.error.issues 
        });
      }

      const user = await storage.updateUser(id, validation.data);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
