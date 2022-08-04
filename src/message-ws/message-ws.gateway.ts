import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'
import { MessageWsService } from './message-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wsServer: Server

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected', client.handshake.headers.authorization);
    try {

      const token = client.handshake.headers.authorization.split(' ')[1]
      if (!token) throw new UnauthorizedException('Not jwt token provide')

      const payload: JwtPayload = this.jwtService.verify(token)

      await this.messageWsService.registerConnection(client, payload.id)

      this.wsServer.emit('update-users', this.messageWsService.getConnections())

    } catch (e) {
      client.disconnect()
      return
    }
  }


  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
    this.messageWsService.deleteConnection(client)
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {

    // Send mesage to client emitter
    // client.emit('message-from-server', {
    //   fullName: 'Server',
    //   message: 'Server send message'
    // })

    // Send mesage to all client except client emitter
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Server',
    //   message: 'Server send message'
    // })

    // Send mesage to all client
    this.wsServer.emit('message-from-server', {
      fullName: this.messageWsService.getFullName(client.id),
      message: payload.message || 'Empty message'
    })

  }
}
