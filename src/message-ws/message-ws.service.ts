import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

export interface IConnections {
    [id: string]: {
        socket: Socket,
        user: User,
    }
}

@Injectable()
export class MessageWsService {
    private connections: IConnections = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async registerConnection(client: Socket, id: string): Promise<void> {
        const user = await this.userRepository.findOneBy({ id })

        if (!user) throw new Error(`UserId ${id} not found`)
        if (!user.isActive) throw new Error(`UserId ${id} not active`)

        this.checkExistentConnection(user.id)

        this.connections[client.id] = {
            socket: client,
            user,
        }
    }

    deleteConnection(client: Socket): void {
        delete this.connections[client.id]

        console.log('connections', Object.keys(this.connections))
    }

    quantityConnectedClients(): number {
        return Object.keys(this.connections).length
    }

    getConnections(): string[] {
        return Object.keys(this.connections)
    }

    getFullName(clientId: string) {
        return this.connections[clientId]?.user.fullName
    }

    checkExistentConnection(userId: string) {
        for (let connKey in this.connections) {
            if (this.connections[connKey].user.id === userId) {
                this.connections[connKey].socket.disconnect()
                delete this.connections[connKey]
            }
        }
    }
}
