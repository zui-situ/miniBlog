import { User } from '@/types/user';

export interface AppState {
    user: User;
    token: string;
}

const appState: AppState = {
    user: {
        userId: '',
        avatar: '',
        openid:'',
        nickName:''
    },
    token: '',
};
  
export default appState;