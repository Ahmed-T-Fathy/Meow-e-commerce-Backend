import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }
    
    @Get('/sales-analytics')
    async getSalesAnalytics() {
        return this.analyticsService.getSalesAnlytics();
    }

}
