## 🟡 5. FILE UPLOADS & INFRASTRUCTURE

### Presigned URL Workflow

#### File Upload Service
```typescript
// src/services/file-upload.service.ts
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

export class FileUploadService {
  private s3: AWS.S3;
  private prisma: PrismaClient;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.prisma = new PrismaClient();
  }

  async generatePresignedUrl(
    filename: string,
    contentType: string,
    category: string,
    userId: string
  ) {
    const fileId = uuidv4();
    const key = `uploads/${category}/${fileId}/${filename}`;
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Expires: 300, // 5 minutes
      ContentType: contentType,
      Metadata: {
        'uploaded-by': userId,
        'category': category,
        'original-filename': filename,
      },
    };

    const presignedUrl = await this.s3.getSignedUrlPromise('putObject', params);
    
    // Create pending document record
    const document = await this.prisma.document.create({
      data: {
        id: fileId,
        filename: key,
        originalName: filename,
        mimeType: contentType,
        size: 0, // Will be updated after upload
        url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        category: category as any,
        uploadedBy: userId,
        isVerified: false,
      },
    });

    return {
      presignedUrl,
      fileId,
      document,
    };
  }

  async confirmUpload(fileId: string, fileSize: number) {
    // Update document with actual file size
    const document = await this.prisma.document.update({
      where: { id: fileId },
      data: { size: fileSize },
    });

    // Trigger virus scan
    await this.triggerVirusScan(document.url, fileId);
    
    // Trigger verification workflow
    await this.triggerVerification(fileId);

    return document;
  }

  private async triggerVirusScan(fileUrl: string, fileId: string) {
    // Integration with AWS Lambda for virus scanning
    const lambda = new AWS.Lambda({
      region: process.env.AWS_REGION,
    });

    const params = {
      FunctionName: 'edulens-virus-scanner',
      Payload: JSON.stringify({
        fileUrl,
        fileId,
        callbackUrl: `${process.env.API_BASE_URL}/files/scan-callback`,
      }),
    };

    await lambda.invoke(params).promise();
  }

  private async triggerVerification(fileId: string) {
    // Queue document for manual verification
    await this.prisma.verification.create({
      data: {
        schoolId: '', // Will be set when document is associated with school
        field: 'document_upload',
        oldValue: null,
        newValue: { documentId: fileId },
        status: 'PENDING',
      },
    });
  }

  async handleScanCallback(fileId: string, scanResult: any) {
    const isClean = scanResult.status === 'CLEAN';
    
    if (!isClean) {
      // Mark document as infected and delete from S3
      await this.prisma.document.update({
        where: { id: fileId },
        data: { isVerified: false },
      });
      
      // Delete from S3
      const document = await this.prisma.document.findUnique({
        where: { id: fileId },
      });
      
      if (document) {
        await this.s3.deleteObject({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: document.filename,
        }).promise();
      }
      
      throw new Error('File contains malware');
    }

    // Mark as clean and ready for verification
    await this.prisma.document.update({
      where: { id: fileId },
      data: { isVerified: true },
    });
  }
}
```

#### File Upload Controller
```typescript
// src/controllers/file.controller.ts
import { Request, Response } from 'express';
import { FileUploadService } from '../services/file-upload.service';
import { validateSchema } from '../middleware/validation';
import { presignUrlSchema } from '../schemas/file.schema';

export class FileController {
  constructor(private fileUploadService: FileUploadService) {}

  @validateSchema(presignUrlSchema)
  async getPresignedUrl(req: Request, res: Response) {
    try {
      const { filename, contentType, category } = req.body;
      const userId = req.user.id;

      const result = await this.fileUploadService.generatePresignedUrl(
        filename,
        contentType,
        category,
        userId
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async confirmUpload(req: Request, res: Response) {
    try {
      const { fileId } = req.params;
      const { fileSize } = req.body;

      const document = await this.fileUploadService.confirmUpload(fileId, fileSize);

      res.json({
        success: true,
        data: document,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async scanCallback(req: Request, res: Response) {
    try {
      const { fileId, scanResult } = req.body;

      await this.fileUploadService.handleScanCallback(fileId, scanResult);

      res.json({
        success: true,
        message: 'Scan result processed',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}
```

#### S3 Event Handler (Lambda)
```typescript
// lambda/virus-scanner/index.ts
import AWS from 'aws-sdk';
import { S3Event } from 'aws-lambda';

const s3 = new AWS.S3();
const lambda = new AWS.Lambda();

export const handler = async (event: S3Event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;
    
    try {
      // Download file for scanning
      const object = await s3.getObject({ Bucket: bucket, Key: key }).promise();
      
      // Perform virus scan (integrate with ClamAV or similar)
      const scanResult = await performVirusScan(object.Body);
      
      // Extract file ID from metadata
      const headObject = await s3.headObject({ Bucket: bucket, Key: key }).promise();
      const fileId = extractFileIdFromKey(key);
      
      // Call back to API
      await notifyAPI(fileId, scanResult);
      
    } catch (error) {
      console.error('Error processing file:', error);
    }
  }
};

async function performVirusScan(fileBuffer: any): Promise<any> {
  // Implement virus scanning logic
  // This could use ClamAV, VirusTotal API, or AWS GuardDuty
  return {
    status: 'CLEAN', // or 'INFECTED'
    threats: [],
  };
}

function extractFileIdFromKey(key: string): string {
  // Extract file ID from S3 key structure
  const parts = key.split('/');
  return parts[2]; // uploads/category/fileId/filename
}

async function notifyAPI(fileId: string, scanResult: any) {
  const response = await fetch(`${process.env.API_BASE_URL}/files/scan-callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.INTERNAL_API_TOKEN}`,
    },
    body: JSON.stringify({
      fileId,
      scanResult,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to notify API');
  }
}
```

---

## 🟢 6. SEARCH ENGINE (Meilisearch)

### Search Service Integration
```typescript
// src/services/search.service.ts
import { MeiliSearch } from 'meilisearch';
import { School } from '@prisma/client';

export class SearchService {
  private client: MeiliSearch;
  private schoolsIndex: string = 'schools';

  constructor() {
    this.client = new MeiliSearch({
      host: process.env.MEILISEARCH_URL!,
      apiKey: process.env.MEILISEARCH_API_KEY,
    });
    
    this.initializeIndexes();
  }

  private async initializeIndexes() {
    try {
      // Create schools index
      await this.client.createIndex(this.schoolsIndex, { primaryKey: 'id' });
      
      // Configure searchable attributes
      await this.client.index(this.schoolsIndex).updateSearchableAttributes([
        'name',
        'address',
        'city',
        'state',
        'board',
        'type',
        'medium',
      ]);

      // Configure filterable attributes
      await this.client.index(this.schoolsIndex).updateFilterableAttributes([
        'board',
        'type',
        'city',
        'state',
        'etiScore',
        'annualFee',
        'isVerified',
        'isActive',
      ]);

      // Configure sortable attributes
      await this.client.index(this.schoolsIndex).updateSortableAttributes([
        'etiScore',
        'annualFee',
        'name',
        'createdAt',
      ]);

      // Configure ranking rules
      await this.client.index(this.schoolsIndex).updateRankingRules([
        'words',
        'typo',
        'proximity',
        'attribute',
        'sort',
        'exactness',
        'etiScore:desc', // Custom ranking by ETI score
      ]);

      // Configure faceting
      await this.client.index(this.schoolsIndex).updateFaceting({
        maxValuesPerFacet: 100,
      });

    } catch (error) {
      console.error('Error initializing search indexes:', error);
    }
  }

  async indexSchool(school: School) {
    const searchDocument = {
      id: school.id,
      name: school.name,
      address: school.address,
      city: school.city,
      state: school.state,
      board: school.board,
      type: school.type,
      medium: school.medium,
      etiScore: school.etiScore,
      annualFee: school.annualFee,
      latitude: school.latitude,
      longitude: school.longitude,
      isVerified: school.isVerified,
      isActive: school.isActive,
      createdAt: school.createdAt.toISOString(),
    };

    await this.client.index(this.schoolsIndex).addDocuments([searchDocument]);
  }

  async updateSchool(school: School) {
    await this.indexSchool(school); // Meilisearch will update existing document
  }

  async deleteSchool(schoolId: string) {
    await this.client.index(this.schoolsIndex).deleteDocument(schoolId);
  }

  async searchSchools(params: SearchParams) {
    const {
      query,
      location,
      filters,
      pagination,
      sort,
    } = params;

    let searchQuery = query || '';
    let filterArray: string[] = [];
    
    // Build filters
    if (filters.board) {
      filterArray.push(`board = "${filters.board}"`);
    }
    
    if (filters.type) {
      filterArray.push(`type = "${filters.type}"`);
    }
    
    if (filters.minScore) {
      filterArray.push(`etiScore >= ${filters.minScore}`);
    }
    
    if (filters.maxFees) {
      filterArray.push(`annualFee <= ${filters.maxFees}`);
    }

    // Always filter for active and verified schools
    filterArray.push('isVerified = true');
    filterArray.push('isActive = true');

    const searchOptions: any = {
      filter: filterArray,
      limit: pagination.limit,
      offset: (pagination.page - 1) * pagination.limit,
      facets: ['board', 'type', 'city', 'state'],
    };

    // Add sorting
    if (sort) {
      searchOptions.sort = [sort];
    } else {
      searchOptions.sort = ['etiScore:desc'];
    }

    const results = await this.client.index(this.schoolsIndex).search(searchQuery, searchOptions);

    // If location is provided, add distance calculation
    if (location) {
      results.hits = this.addDistanceToResults(results.hits, location);
      
      // Filter by radius if specified
      if (location.radius) {
        results.hits = results.hits.filter((hit: any) => hit.distance <= location.radius);
      }
      
      // Sort by distance if no other sort specified
      if (!sort) {
        results.hits.sort((a: any, b: any) => a.distance - b.distance);
      }
    }

    return {
      schools: results.hits,
      totalHits: results.estimatedTotalHits,
      facets: results.facetDistribution,
      processingTimeMs: results.processingTimeMs,
      page: pagination.page,
      totalPages: Math.ceil(results.estimatedTotalHits / pagination.limit),
    };
  }

  private addDistanceToResults(hits: any[], location: { lat: number; lng: number }) {
    return hits.map(hit => ({
      ...hit,
      distance: this.calculateDistance(
        location.lat,
        location.lng,
        hit.latitude,
        hit.longitude
      ),
    }));
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async getSearchSuggestions(query: string, limit = 5) {
    const results = await this.client.index(this.schoolsIndex).search(query, {
      limit,
      attributesToRetrieve: ['name', 'city', 'state'],
    });

    return results.hits.map(hit => ({
      id: hit.id,
      name: hit.name,
      location: `${hit.city}, ${hit.state}`,
    }));
  }

  // Indexing pipeline for bulk operations
  async reindexAllSchools(schools: School[]) {
    const documents = schools.map(school => ({
      id: school.id,
      name: school.name,
      address: school.address,
      city: school.city,
      state: school.state,
      board: school.board,
      type: school.type,
      medium: school.medium,
      etiScore: school.etiScore,
      annualFee: school.annualFee,
      latitude: school.latitude,
      longitude: school.longitude,
      isVerified: school.isVerified,
      isActive: school.isActive,
      createdAt: school.createdAt.toISOString(),
    }));

    // Clear existing index
    await this.client.index(this.schoolsIndex).deleteAllDocuments();
    
    // Add all documents in batches
    const batchSize = 1000;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      await this.client.index(this.schoolsIndex).addDocuments(batch);
    }
  }
}

interface SearchParams {
  query?: string;
  location?: {
    lat: number;
    lng: number;
    radius?: number;
  };
  filters: {
    board?: string;
    type?: string;
    minScore?: number;
    maxFees?: number;
  };
  pagination: {
    page: number;
    limit: number;
  };
  sort?: string;
}
```

### Search Analytics Service
```typescript
// src/services/search-analytics.service.ts
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

export class SearchAnalyticsService {
  private prisma: PrismaClient;
  private redis: Redis;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = new Redis(process.env.REDIS_URL!);
  }

  async trackSearch(params: {
    query: string;
    filters: any;
    resultsCount: number;
    userId?: string;
    sessionId: string;
  }) {
    // Store in Redis for real-time analytics
    const searchKey = `search:${Date.now()}:${params.sessionId}`;
    await this.redis.setex(searchKey, 3600, JSON.stringify(params)); // Expire in 1 hour

    // Increment search counters
    await this.redis.zincrby('popular_searches', 1, params.query);
    
    // Track search patterns
    if (params.filters.board) {
      await this.redis.zincrby('board_searches', 1, params.filters.board);
    }
    
    if (params.filters.type) {
      await this.redis.zincrby('type_searches', 1, params.filters.type);
    }
  }

  async getPopularSearches(limit = 10) {
    const searches = await this.redis.zrevrange('popular_searches', 0, limit - 1, 'WITHSCORES');
    
    const result = [];
    for (let i = 0; i < searches.length; i += 2) {
      result.push({
        query: searches[i],
        count: parseInt(searches[i + 1]),
      });
    }
    
    return result;
  }

  async getSearchTrends() {
    const [boardTrends, typeTrends] = await Promise.all([
      this.redis.zrevrange('board_searches', 0, -1, 'WITHSCORES'),
      this.redis.zrevrange('type_searches', 0, -1, 'WITHSCORES'),
    ]);

    return {
      boards: this.formatTrends(boardTrends),
      types: this.formatTrends(typeTrends),
    };
  }

  private formatTrends(data: string[]) {
    const result = [];
    for (let i = 0; i < data.length; i += 2) {
      result.push({
        term: data[i],
        count: parseInt(data[i + 1]),
      });
    }
    return result;
  }
}
```
