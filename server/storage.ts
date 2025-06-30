import { 
  siteContent, 
  contactMessages, 
  newsArticles, 
  services, 
  adminUsers,
  carouselImages,
  type SiteContent, 
  type InsertSiteContent, 
  type ContactMessage, 
  type InsertContactMessage,
  type NewsArticle,
  type InsertNewsArticle,
  type Service,
  type InsertService,
  type AdminUser,
  type InsertAdminUser,
  type CarouselImage,
  type InsertCarouselImage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Site content
  getSiteContent(key: string): Promise<SiteContent | undefined>;
  updateSiteContent(data: InsertSiteContent): Promise<SiteContent>;
  getAllSiteContent(): Promise<SiteContent[]>;
  
  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  markMessageAsRead(id: number): Promise<void>;
  deleteContactMessage(id: number): Promise<void>;
  
  // News articles
  getAllNewsArticles(): Promise<NewsArticle[]>;
  getPublishedNewsArticles(): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  updateNewsArticle(id: number, article: Partial<InsertNewsArticle>): Promise<NewsArticle>;
  deleteNewsArticle(id: number): Promise<void>;
  
  // Services
  getAllServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;
  
  // Admin users
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  
  // Carousel images
  getAllCarouselImages(): Promise<CarouselImage[]>;
  getActiveCarouselImages(): Promise<CarouselImage[]>;
  createCarouselImage(image: InsertCarouselImage): Promise<CarouselImage>;
  updateCarouselImage(id: number, image: Partial<InsertCarouselImage>): Promise<CarouselImage>;
  deleteCarouselImage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Site content methods
  async getSiteContent(key: string): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    return content;
  }

  async updateSiteContent(data: InsertSiteContent): Promise<SiteContent> {
    const [content] = await db
      .insert(siteContent)
      .values(data)
      .onConflictDoUpdate({
        target: siteContent.key,
        set: { content: data.content, updatedAt: new Date() }
      })
      .returning();
    return content;
  }

  async getAllSiteContent(): Promise<SiteContent[]> {
    return await db.select().from(siteContent);
  }

  // Contact message methods
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async markMessageAsRead(id: number): Promise<void> {
    await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  // News article methods
  async getAllNewsArticles(): Promise<NewsArticle[]> {
    return await db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt));
  }

  async getPublishedNewsArticles(): Promise<NewsArticle[]> {
    return await db.select().from(newsArticles)
      .where(eq(newsArticles.isPublished, true))
      .orderBy(desc(newsArticles.publishedAt));
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const [newArticle] = await db.insert(newsArticles).values(article).returning();
    return newArticle;
  }

  async updateNewsArticle(id: number, article: Partial<InsertNewsArticle>): Promise<NewsArticle> {
    const [updatedArticle] = await db
      .update(newsArticles)
      .set(article)
      .where(eq(newsArticles.id, id))
      .returning();
    return updatedArticle;
  }

  async deleteNewsArticle(id: number): Promise<void> {
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
  }

  // Service methods
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getActiveServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true));
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Admin user methods
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin;
  }

  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const [newAdmin] = await db.insert(adminUsers).values(admin).returning();
    return newAdmin;
  }

  // Carousel images
  async getAllCarouselImages(): Promise<CarouselImage[]> {
    return await db.select().from(carouselImages).orderBy(carouselImages.order);
  }

  async getActiveCarouselImages(): Promise<CarouselImage[]> {
    return await db.select()
      .from(carouselImages)
      .where(eq(carouselImages.isActive, true))
      .orderBy(carouselImages.order);
  }

  async createCarouselImage(image: InsertCarouselImage): Promise<CarouselImage> {
    const [newImage] = await db
      .insert(carouselImages)
      .values(image)
      .returning();
    return newImage;
  }

  async updateCarouselImage(id: number, image: Partial<InsertCarouselImage>): Promise<CarouselImage> {
    const [updatedImage] = await db
      .update(carouselImages)
      .set(image)
      .where(eq(carouselImages.id, id))
      .returning();
    return updatedImage;
  }

  async deleteCarouselImage(id: number): Promise<void> {
    await db.delete(carouselImages).where(eq(carouselImages.id, id));
  }
}

export const storage = new DatabaseStorage();
