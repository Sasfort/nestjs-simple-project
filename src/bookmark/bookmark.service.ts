import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}

  async createBookmark(
    userId: number,
    dto: CreateBookmarkDto,
  ) {
    try {
      const bookmark =
        await this.prismaService.bookmark.create({
          data: {
            userId,
            ...dto,
          },
        });

      return bookmark;
    } catch (error) {
      throw error;
    }
  }

  getBookmarks(userId: number) {
    return this.prismaService.bookmark.findMany({
      where: {
        userId: userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    return this.prismaService.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    const bookmark =
      await this.prismaService.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException(
        'Access to resources denied.',
      );
    }

    const result = this.prismaService.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });

    return result;
  }

  async deleteBookmarkById(
    userId: number,
    bookmarkId: number,
  ) {
    const bookmark =
      await this.prismaService.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException(
        'Access to resources denied.',
      );
    }

    return this.prismaService.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
