export interface ChatState {
    socket: any;
    targetId: string;
    dialogList:Array<any>;
    targetMessage:Array<any>;
}

const chatState: ChatState = {
    socket: null,
    targetId:'',
    dialogList:[],
    targetMessage:[]
};

export default chatState;