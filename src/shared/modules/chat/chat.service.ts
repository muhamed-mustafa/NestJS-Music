import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Message } from './entities/message.entity';
import { UserJoinedRoom } from './entities/user-joined-room.entity';
import { RoomDto } from './dtos/room.dto';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(UserJoinedRoom)
    private userJoinedRoomRepository: Repository<UserJoinedRoom>,
  ) {}

  async getAllRooms(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async getRoomById(id: number): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }

    return room;
  }

  deleteUserMessages(user: User): Promise<DeleteResult>[] {
    return user.messages.map(
      async (message) => await this.messageRepository.delete(message.id),
    );
  }

  deleteUserJoinedRooms(user: User): Promise<DeleteResult>[] {
    return user.userJoinedRooms.map(
      async (room) => await this.userJoinedRoomRepository.delete(room.id),
    );
  }

  async getUserRooms(user: User): Promise<Room[]> {
    const query = this.roomRepository.createQueryBuilder('room');
    return query
      .select()
      .where('room.createdBy LIKE :username', { username: user.username })
      .getMany();
  }

  async createNewRoom(user: User, { name }: RoomDto): Promise<Room> {
    return await this.roomRepository.save(
      this.roomRepository.create({
        name,
        createdBy: user.username,
        messages: [],
        userJoinedRooms: [],
      }),
    );
  }

  async updateRoom(id: number, { name }: RoomDto): Promise<UpdateResult> {
    const room = await this.getRoomById(id);

    if (room) {
      return this.roomRepository.update(id, { name });
    }
  }

  async deleteRoom(id: number): Promise<boolean> {
    const room = await this.getRoomById(id);

    await Promise.all([
      room.messages.map(
        async (message) => await this.messageRepository.delete(message.id),
      ),
      room.userJoinedRooms.map(
        async (room) => await this.userJoinedRoomRepository.delete(room.id),
      ),

      await this.roomRepository.delete(room.id),
    ]);

    return true;
  }
}
