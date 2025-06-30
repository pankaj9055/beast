import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertSiteContentSchema, insertNewsArticleSchema, insertServiceSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize default content
  await initializeDefaultContent();

  // Public API routes
  app.get("/api/content/:key", async (req, res) => {
    try {
      const content = await storage.getSiteContent(req.params.key);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getActiveServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getPublishedNewsArticles();
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || !await bcrypt.compare(password, admin.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd use JWT or sessions
      res.json({ success: true, adminId: admin.id });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin API routes
  app.get("/api/admin/content", async (req, res) => {
    try {
      const content = await storage.getAllSiteContent();
      res.json(content);
    } catch (error) {
      console.error("Error fetching admin content:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Carousel images admin routes
  app.get('/api/admin/carousel', async (req, res) => {
    try {
      const images = await storage.getAllCarouselImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
      res.status(500).json({ message: "Failed to fetch carousel images" });
    }
  });

  app.post('/api/admin/carousel', async (req, res) => {
    try {
      const image = await storage.createCarouselImage(req.body);
      res.json(image);
    } catch (error) {
      console.error("Error creating carousel image:", error);
      res.status(500).json({ message: "Failed to create carousel image" });
    }
  });

  app.put('/api/admin/carousel/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const image = await storage.updateCarouselImage(id, req.body);
      res.json(image);
    } catch (error) {
      console.error("Error updating carousel image:", error);
      res.status(500).json({ message: "Failed to update carousel image" });
    }
  });

  app.delete('/api/admin/carousel/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCarouselImage(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting carousel image:", error);
      res.status(500).json({ message: "Failed to delete carousel image" });
    }
  });

  // Public carousel images endpoint
  app.get('/api/carousel', async (req, res) => {
    try {
      const images = await storage.getActiveCarouselImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching carousel images:", error);
      res.status(500).json({ message: "Failed to fetch carousel images" });
    }
  });

  app.put("/api/admin/content", async (req, res) => {
    try {
      const validatedData = insertSiteContentSchema.parse(req.body);
      const content = await storage.updateSiteContent(validatedData);
      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.get("/api/admin/messages", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/messages/:id/read", async (req, res) => {
    try {
      await storage.markMessageAsRead(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/admin/messages/:id", async (req, res) => {
    try {
      await storage.deleteContactMessage(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/news", async (req, res) => {
    try {
      const news = await storage.getAllNewsArticles();
      res.json(news);
    } catch (error) {
      console.error("Error fetching admin news:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/news", async (req, res) => {
    try {
      const validatedData = insertNewsArticleSchema.parse(req.body);
      const article = await storage.createNewsArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating news article:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/admin/news/:id", async (req, res) => {
    try {
      const validatedData = insertNewsArticleSchema.parse(req.body);
      const article = await storage.updateNewsArticle(parseInt(req.params.id), validatedData);
      res.json(article);
    } catch (error) {
      console.error("Error updating news article:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/admin/news/:id", async (req, res) => {
    try {
      await storage.deleteNewsArticle(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting news article:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching admin services:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/services", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/admin/services/:id", async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.updateService(parseInt(req.params.id), validatedData);
      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Initialize default content on startup
  await initializeDefaultContent();

  const httpServer = createServer(app);
  return httpServer;
}

async function initializeDefaultContent() {
  try {
    // Initialize hero content
    const heroContent = await storage.getSiteContent("hero");
    if (!heroContent) {
      await storage.updateSiteContent({
        key: "hero",
        content: {
          title: "VoipFit",
          subtitle: "National High-Tech Enterprise",
          description: "Excellent products, sincere service, and mutual win with customers"
        }
      });
    }

    // Initialize company stats
    const statsContent = await storage.getSiteContent("stats");
    if (!statsContent) {
      await storage.updateSiteContent({
        key: "stats",
        content: {
          establishedYear: "2018",
          countries: "150+",
          dailyCalls: "5M+",
          uptime: "99.9%"
        }
      });
    }

    // Initialize about content
    const aboutContent = await storage.getSiteContent("about");
    if (!aboutContent) {
      await storage.updateSiteContent({
        key: "about",
        content: {
          title: "About VoipFit",
          description: "Since 2018, VoipFit has been at the forefront of telecommunications innovation, providing reliable and cutting-edge communication solutions to businesses and individuals across 150+ countries worldwide.",
          mission: "Our mission is to deliver excellent products with sincere service, creating mutual win opportunities with our customers through advanced technology and unwavering commitment to quality.",
          vision: "Leading global telecom transformation",
          values: "Innovation, Quality, Trust"
        }
      });
    }

    // Initialize default services
    const existingServices = await storage.getAllServices();
    if (existingServices.length === 0) {
      await storage.createService({
        name: "SMS Service",
        description: "Reliable and fast SMS delivery with global reach and advanced features",
        features: ["Global SMS delivery", "99.9% delivery rate", "API integration"],
        icon: "MessageSquare",
        color: "emerald",
        isActive: true
      });

      await storage.createService({
        name: "Voice Service",
        description: "Crystal-clear voice calls with advanced routing and quality optimization",
        features: ["HD voice quality", "Smart routing", "Call analytics"],
        icon: "Phone",
        color: "amber",
        isActive: true
      });

      await storage.createService({
        name: "Data Service",
        description: "High-speed data connectivity with secure transmission and monitoring",
        features: ["High-speed connectivity", "Secure transmission", "Real-time monitoring"],
        icon: "Database",
        color: "blue",
        isActive: true
      });
    }

    // Initialize default news articles
    const existingNews = await storage.getAllNewsArticles();
    if (existingNews.length === 0) {
      await storage.createNewsArticle({
        title: "VoipFit Expands 5G Network Coverage",
        excerpt: "Enhanced connectivity reaching 20 new countries with ultra-fast 5G infrastructure.",
        content: "VoipFit continues to expand its global 5G network coverage, bringing ultra-fast connectivity to 20 new countries. This expansion represents our commitment to providing cutting-edge telecommunications infrastructure worldwide.",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        isPublished: true
      });

      await storage.createNewsArticle({
        title: "Industry Excellence Award 2024",
        excerpt: "VoipFit recognized for outstanding innovation in telecommunications services.",
        content: "We are proud to announce that VoipFit has been awarded the Industry Excellence Award 2024 for our innovative telecommunications solutions and exceptional customer service.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        isPublished: true
      });

      await storage.createNewsArticle({
        title: "Strategic Partnership Announcement",
        excerpt: "New alliance strengthening our global telecommunications network.",
        content: "VoipFit announces a strategic partnership that will significantly strengthen our global telecommunications network and enhance service delivery to our customers worldwide.",
        imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
        isPublished: true
      });
    }

    // Create default admin user if none exists
    const adminExists = await storage.getAdminByUsername("admin");
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await storage.createAdmin({
        username: "admin",
        password: hashedPassword
      });
    }

  } catch (error) {
    console.error("Error initializing default content:", error);
  }
}
