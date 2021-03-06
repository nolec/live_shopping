import { OnSubscriptionDataOptions, useReactiveVar } from '@apollo/client';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
    isAtLeastInVar,
    isBasketModalOnInVar,
    isFullOnInVar,
    isGoodsModalOnInVar,
    isLiveInVar,
    isNewQnaInVar,
    isOpenedInVar,
    isQnaModalOnInVar,
    isSoundOnInVar,
    isWriteOnInVar,
} from '../../apollo';
import { useGetStreamKey } from '../../hooks/useKey';
import { CloseBtn } from './close_btn';
import { Comments } from './comments';
import { CommentWrite } from './comment_write';
import { QnaBox } from './qna/qna_box';
import { QnaBtn } from './qna_btn';
import { ViewHeader } from './view_header';
import { IUser, login, myProfile, updateProfile } from '../../hooks/useTim';
import { Player } from './player/player';
import { Video } from './player/video';
import { SoundOnBtn } from './sound_on_btn';
import { SoundOffBtn } from './sound_off_btn';
import { gql, useMutation } from '@apollo/client';
import { HeartBtn } from './heart_btn/heart_btn';
import { GET_CHAT_QNA, useAnswerdChatQnaSub, useDeletedChatQnaSub, useGetChatQnaList, usePendingChatQnaSub } from '../../hooks/useQna';
import TIM from 'tim-js-sdk';
import { tim } from '../../index';
import { AtLeastBtn } from './at_least_btn';
import { GoodsSlide } from './goods/goods_slide';
import { BasketBox } from './basket/basket_box';
import { GoodsBox } from './goods/goods_box';
import { useHook } from '../../hooks/useHook';

declare global {
    interface Window {
        userKey: string;
        userInfo: IUser;
        openLogin: any;
    }
}

export const GET_LIVE_USER_INFO = gql`
    mutation getOrCreateUserSig($input: LiveUserInput!) {
        getOrCreateUserSig(input: $input) {
            ok
            liveUser {
                userId
                liveId
                userSig
            }
        }
    }
`;

export interface IMessage {
    username: string;
    text: string;
}
export let userInfo: IUser = window?.userInfo ?? {
    userID: '308868',
    nick: '사라센',
    gender: 'F',
    avatar: '',
    level: '0',
};
export const ViewContainer = () => {
    // 서브스크립션
    // -------------------------------------------------------------------------------------------------------------------------
    const pendingUpdate = ({ client, subscriptionData }: OnSubscriptionDataOptions) => {
        const {
            data: {
                pendingChatQna: { adminId, answer, content, id, liveId, title, userId, updated_at },
            },
        } = subscriptionData;
        const queryResult = client.readQuery({
            query: GET_CHAT_QNA,
            variables: { input: { liveId } },
        });
        if (queryResult) {
            isNewQnaInVar(true);
            client.writeQuery({
                query: GET_CHAT_QNA,
                variables: { input: { liveId } },
                data: {
                    ...queryResult,
                    getChatQnaListByLiveId: {
                        chatQnaList: [
                            ...queryResult?.getChatQnaListByLiveId?.chatQnaList,
                            {
                                __typename: `ShopLiveChatQna:${id}`,
                                id,
                                title,
                                content,
                                answer,
                                liveId,
                                adminId,
                                userId,
                                updated_at,
                            },
                        ],
                    },
                },
            });
        }
    };
    const answeredUpdate = ({ client, subscriptionData }: OnSubscriptionDataOptions) => {
        const {
            data: {
                answeredChatQna: { id, liveId, answer, updated_at },
            },
        } = subscriptionData;
        if (liveId) {
            isNewQnaInVar(true);
            client.writeQuery({
                query: GET_CHAT_QNA,
                variables: { input: { liveId } },
                data: {
                    getChatQnaListByLiveId: {
                        chatQnaList: [
                            {
                                __typename: `ShopLiveChatQna:${id}`,
                                answer,
                                updated_at,
                            },
                        ],
                    },
                },
            });
        }
    };
    const deletedUpdate = ({ client, subscriptionData }: OnSubscriptionDataOptions) => {
        const {
            data: {
                deletedChatQna: { id, liveId },
            },
        } = subscriptionData;
        const queryResult = client.readQuery({
            query: GET_CHAT_QNA,
            variables: { input: { liveId } },
        });
        if (queryResult) {
            const newChatQnaList = queryResult.getChatQnaListByLiveId.chatQnaList.filter((item: any) => item.id !== id);
            client.writeQuery({
                query: GET_CHAT_QNA,
                variables: { input: { liveId } },
                data: {
                    ...queryResult,
                    getChatQnaListByLiveId: {
                        chatQnaList: newChatQnaList,
                    },
                },
            });
        }
    };
    const { data: pendingChatQnaSub } = usePendingChatQnaSub(pendingUpdate);
    const { data: answerdChatQnaSub } = useAnswerdChatQnaSub(answeredUpdate);
    const { data: deletedChatQnaSub } = useDeletedChatQnaSub(deletedUpdate);
    // -------------------------------------------------------------------------------------------------------------------------
    // 서브스크립션 끝
    const [message, setMessage] = useState<IMessage[]>([]);
    const setMessageFunc = useCallback((message: any) => {
        if (message.length < 1) {
            return setMessage([]);
        }
        setMessage(message);
    }, []);

    const isWriteOn = useReactiveVar(isWriteOnInVar);
    const isFullOn = useReactiveVar(isFullOnInVar);
    const isQnaModalOn = useReactiveVar(isQnaModalOnInVar);
    const isGoodsModalOn = useReactiveVar(isGoodsModalOnInVar);
    const isBasketModal = useReactiveVar(isBasketModalOnInVar);
    const isSoundOn = useReactiveVar(isSoundOnInVar);
    const isLive = useReactiveVar(isLiveInVar);
    const isAtLeast = useReactiveVar(isAtLeastInVar);
    const isOpened = useReactiveVar(isOpenedInVar);

    const { data } = useGetStreamKey();

    const [count, setCount] = useState(0);
    const countSetter = (memberCount: number) => {
        setCount(memberCount);
    };
    // const { data: userInfoData } = useGetLiveUserInfo(parseInt(userID as string), data?.getStreamKey?.id);
    const onCompleted = useCallback(
        async (data: any) => {
            const {
                getOrCreateUserSig: {
                    liveUser: { userSig },
                    ok,
                },
            } = data;
            if (ok) {
                if (userInfo.userID) {
                    const loginState = await login(userInfo.userID, userSig);
                    //들어오면 내 프로필을 확인하여 프로필이 존재하면 로그인 되어 있는 상태로 판별
                    //아니면 로그인 시켜주기
                    const onReadyStateUpdate = async ({ name }: any) => {
                        const isSDKReady = name === TIM.EVENT.SDK_READY ? true : false;
                        if (isSDKReady && loginState) {
                            const me = await myProfile({
                                userID: userInfo.userID,
                                nick: userInfo.nick,
                            } as IUser);
                            // console.log(me, "me 테스트");
                            if (!me) {
                                const updateResult = await updateProfile(userInfo);
                            }
                            return true;
                        }
                        // if (loginState) {
                        //     await getGroupOnlineMembers(countSetter);
                        //     await logout();
                        // }
                        console.log('SDK_NOT_READY');
                    };
                    const onKickOut = (event: any) => {
                        const reason = kickedOutReason(event.data.type);
                        console.log(reason);
                    };
                    const kickedOutReason = (type: any) => {
                        switch (type) {
                            case TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
                                return '여러 인스턴스로 로그인으로 인해';
                            case TIM.TYPES.KICKED_OUT_MULT_DEVICE:
                                return '다중 장치 로그인으로 인해';
                            case TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
                                return 'userSig 만료로 인해';
                            default:
                                return '';
                        }
                    };
                    tim.on(TIM.EVENT.SDK_READY, onReadyStateUpdate);
                    tim.on(TIM.EVENT.SDK_NOT_READY, onReadyStateUpdate);
                    tim.on(TIM.EVENT.KICKED_OUT, onKickOut);
                }
            }
        },
        [isOpened]
    );
    const [getOrCreateUser] = useMutation(GET_LIVE_USER_INFO, {
        onCompleted,
    });

    // const imKey = userInfoData?.getOrCreateUserSig?.liveUser?.userSig;

    const ContainerClick = (e: any) => {
        e.stopPropagation();
        // 1. 모든 상황이 처음인 경우 all false
        // isAtLeastInVar(false);
        if (!isWriteOn && !isFullOn) {
            isFullOnInVar(true);
        }
        // 2. full 모드가 true 인 경우
        if (isFullOn) {
            isFullOnInVar(false);
        }
        if (isWriteOn && !isFullOn) {
            isWriteOnInVar(false);
        }
    };

    const { data: liveQnaData } = useGetChatQnaList(data?.getStreamKey?.id);
    useEffect(() => {
        if (data?.getStreamKey?.isOnline === 1) {
            getOrCreateUser({
                variables: {
                    input: {
                        userId: parseInt(userInfo.userID),
                        liveId: data?.getStreamKey?.id,
                    },
                },
            });
        }

        if (liveQnaData?.getChatQnaListByLiveId?.chatQnaList.length > 0) {
            isNewQnaInVar(true);
        }
    }, [data, liveQnaData]);

    const wrapperStyles = useMemo(() => 'h-full relative overflow-hidden z-0', []);

    const [mainPlayState, mainPlayStateSetting] = useHook(null);

    return (
        <div onClick={ContainerClick} className={'view_container bg-gray-500'}>
            <div className={wrapperStyles}>
                <ViewHeader count={count} countSetter={countSetter} />
                <CloseBtn playState={mainPlayState} />
                <Player />
                <Video playState={mainPlayState} playStateSetting={mainPlayStateSetting} />
                <div className={'dimmed'} />
                {/* <ShareBtn /> */}
                <SoundOffBtn />
                <Comments message={message} setMessageFunc={setMessageFunc} userInfo={userInfo} />

                {isFullOn ? null : (
                    <>
                        <HeartBtn />
                        <QnaBtn />
                        {/* <CommentBtn /> */}
                        {/* <GoodsBtn /> */}
                        <GoodsSlide />
                        {/* <Notice /> */}
                        <CommentWrite setMessageFunc={setMessageFunc} userID={parseInt(userInfo.userID as string)} />
                        {isSoundOn ? null : isLive ? <SoundOnBtn /> : null}
                    </>
                )}
                {isGoodsModalOn ? <GoodsBox /> : null}
                {isQnaModalOn ? <QnaBox /> : null}
                {isBasketModal ? <BasketBox /> : null}
                {isAtLeast ? <AtLeastBtn /> : null}
            </div>
        </div>
    );
};
