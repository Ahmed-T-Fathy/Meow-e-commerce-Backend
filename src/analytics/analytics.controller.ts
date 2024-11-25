import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('/product-analytics')
  async getProductAnalytics() {
    return this.analyticsService.getProductAnalytics();
  }

  @Get('/variation-analytics')
  async getVariationAnlytics() {
    return this.analyticsService.getVariationAnalytics();
  }

  @Get('/revenue-analytics')
  async getRevenueAnlytics() {
    return this.analyticsService.getRevenueAnalytics();
  }
}
