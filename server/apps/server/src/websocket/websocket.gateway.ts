import { Message } from '@app/db/models/message.model';
import { User } from '@app/db/models/user.model';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket
} from '@nestjs/websockets';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Server, Socket } from 'socket.io';
import { FriendMessageDto,joinFriendDto } from './dto/websocket.dto';


@WebSocketGateway()

export class EventsGateway{
    constructor(
        @InjectModel(User) readonly userModel:ReturnModelType<typeof User>,
        @InjectModel(Message) readonly messageModel:ReturnModelType<typeof Message>
    ){}

    @WebSocketServer() server: Server
    async handleConnection(socket: Socket):Promise<any> {
        const userId = socket.handshake.query.userId
        socket.join(userId)
        this.server.emit('连接成功');
    }
    // 进入私聊房间
    @SubscribeMessage('joinFriendSocket')
    async joinFriend(@ConnectedSocket() socket: Socket, @MessageBody() data:joinFriendDto):Promise<any> {
        try {
            if(data.friendId && data.userId) {
                const roomId = data.userId > data.friendId ?  data.userId + data.friendId : data.friendId + data.userId
                socket.join(roomId)
                this.server.to(data.userId).emit('joinFriendSocket',{ code:'OK', msg:'进入私聊socket成功'})
            }
        } catch(e) {
            this.server.to(data.userId).emit('joinFriendSocket',{ code:'ERROR', msg:'进入私聊socket失败', data: e })
        }
    }
    // 发送私聊消息
    @SubscribeMessage('sendMessage')
    async sendMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: FriendMessageDto):Promise<any> {
        const userId = data.senderId.toString();
        const friendId = data.receiverId.toString();
        try {
            const isUser = await this.userModel.findById(userId);
            if(isUser) {
                if(userId && friendId) {
                    const roomId = userId > friendId ? userId + friendId : friendId + userId
                    const messageData = Object.assign({
                        userId:data.senderId,
                        friendId:data.receiverId,
                        status:1
                    },data)
                    const _messageData = Object.assign({
                        friendId:data.senderId,
                        userId:data.receiverId,
                        status:1
                    },data)
                    const messageInfo = await this.messageModel.create(messageData)
                    console.log(messageInfo);
                    await this.messageModel.create(_messageData)
                    this.server.to(roomId).emit('messageFromFriend', {code: 'OK', msg:'', messageInfo})
                }
            } else {
                this.server.to(userId).emit('sendMessage', {code: 'FAIL', msg:'你没资格发消息', data})
            }
        } catch(e) {
            this.server.to(userId).emit('sendMessage', {code: 'ERROR', msg:'消息发送失败', data})
        }
    }
}