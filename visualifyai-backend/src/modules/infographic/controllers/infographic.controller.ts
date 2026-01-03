import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GetUserInfo } from 'src/common/decorators/get-user.decorator';
import { ApiResponse } from 'src/common/response/api-response';
import { User } from 'src/modules/auth/entities/user.entity';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GenerateInfographicDto } from '../dto/generate-infographic.dto';
import { InfographicToStorageDto } from '../dto/infographic-to-storage.dto';
import { InfographicService } from '../services/infographic.service';
import { SavedInfographicService } from '../services/saved-infographic.service';

@Controller('infographic')
@UseGuards(JwtAuthGuard)
export class InfographicController {
  constructor(
    private readonly infographicService: InfographicService,
    private readonly savedInfographicService: SavedInfographicService,
  ) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getInfographic(@GetUserInfo() user: User, @Param('id') id: string) {
    const result = await this.infographicService.getInfographic(user.id, id);

    return ApiResponse.success({
      data: result,
      message: 'Get infographic success',
    });
  }

  @Post('ai-generate')
  @UseGuards(JwtAuthGuard)
  async createInfographic(
    @Body() generateInfographicDto: GenerateInfographicDto,
    @GetUserInfo() user: User,
  ) {
    const result = await this.infographicService.createInfographic(user.id, generateInfographicDto);

    return ApiResponse.success({
      data: result,
      message: 'Infographic generated successfully',
    });
  }

  @Post('my-storage/save')
  @UseGuards(JwtAuthGuard)
  async saveInfographicToStorage(
    @Body() infographicToStorageDto: InfographicToStorageDto,
    @GetUserInfo() user: User,
  ) {
    const result = await this.savedInfographicService.saveInfographicToStorage(
      user.id,
      infographicToStorageDto,
    );

    return ApiResponse.success({
      data: result,
      message: 'Infographic saved to personal storage successfully',
    });
  }

  @Get('my-storage/list')
  @UseGuards(JwtAuthGuard)
  async getUserSavedInfographics(
    @GetUserInfo() user: User,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const result = await this.savedInfographicService.getUserSavedInfographics(user.id, {
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
    });

    return ApiResponse.success({
      data: result,
      message: 'Get user saved infographics success',
    });
  }

  @Delete('my-storage/delete/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUserSavedInfographics(@GetUserInfo() user: User, @Param('id') id: string) {
    const result = await this.savedInfographicService.deleteUserSavedInfographics(user.id, id);

    return ApiResponse.success({
      data: result,
      message: 'Delete infographic from storage success',
    });
  }
}
