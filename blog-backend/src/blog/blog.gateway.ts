import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server , Socket} from 'socket.io';
import { BlogService } from './blog.service';
import { BadRequestException } from '@nestjs/common';

@WebSocketGateway({ cors: true }) // allow React frontend
export class BlogGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly blogService: BlogService) {}

  @SubscribeMessage('like_blog')
  async handleLike(
    @MessageBody() data: { blogId: string; currentUserId: string },
  ) {
    const { blogId, currentUserId } = data;

    const updated = await this.blogService.toggleLike(blogId, currentUserId);
    this.server.emit('update_likes', { blogId, ...updated });
  }
  
  @SubscribeMessage('dislike_blog')
  async handleDislike(
    @MessageBody() data: { blogId: string; currentUserId: string },
  ) {
    const { blogId, currentUserId } = data;
    const updated = await this.blogService.toggleDislike(blogId, currentUserId);
    this.server.emit('update_likes', { blogId, ...updated });
  }

  @SubscribeMessage('join_blog')
  async handleJoinBlog(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(id);
    console.log(`Client ${client.id} joined blog room ${id}`);
    return { event: 'joined_blog', data: id };
  }

  @SubscribeMessage('leave_blog')
  async handleLeaveBlog(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(id);
    console.log(`Client ${client.id} left blog room ${id}`);
    return { event: 'left_blog', data: id };
  }
}
